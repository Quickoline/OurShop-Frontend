function resolveApiBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return "http://localhost:5000";
}

const API_BASE = resolveApiBase();
const PAYMENT_BASE = `${API_BASE}/api/payments`;

export { API_BASE, PAYMENT_BASE };

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, ...fetchInit } = options;
  const token = skipAuth ? null : getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchInit.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchInit,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const base = data.message || `Request failed with status ${res.status}`;
    const extra =
      data.details && String(data.details) !== String(data.message)
        ? ` — ${data.details}`
        : '';
    throw new Error(base + extra);
  }

  return data;
}

/** Unwrap `{ success, data }` from backend JSON. */
export function unwrapApiData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in res) {
    return (res as { data: T }).data;
  }
  return res as T;
}

// ── Product API ──────────────────────────────────────────
export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/api/product${query}`);
  },
  getById: (id: string) => request<any>(`/api/product/${id}`),
  getBySlug: (slug: string) => request<any>(`/api/product/slug/${slug}`),
  getBestSellers: (limit = 8) =>
    request<any>(`/api/product/bestsellers?limit=${limit}`),
  getNewlyLaunched: (limit = 8) =>
    request<any>(`/api/product/newlylaunched?limit=${limit}`),
  getMegaOffers: (limit = 8) =>
    request<any>(`/api/product/megaoffers?limit=${limit}`),
  getByCategory: (categoryId: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/api/product/category/${categoryId}${query}`);
  },
  getRelated: (id: string, limit = 4) =>
    request<any>(`/api/product/${id}/related?limit=${limit}`),
  search: (q: string, limit = 10) =>
    request<any>(`/api/product/search?q=${encodeURIComponent(q)}&limit=${limit}`),
};

// ── Service API (mirrors product) ────────────────────────
export const serviceApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/api/service${query}`);
  },
  getById: (id: string) => request<any>(`/api/service/${id}`),
  getBySlug: (slug: string) => request<any>(`/api/service/slug/${slug}`),
  getFeatured: (limit = 8) =>
    request<any>(`/api/service/featured?limit=${limit}`),
  getBestSellers: (limit = 8) =>
    request<any>(`/api/service/bestsellers?limit=${limit}`),
  getNewlyLaunched: (limit = 8) =>
    request<any>(`/api/service/newlylaunched?limit=${limit}`),
  getMegaOffers: (limit = 8) =>
    request<any>(`/api/service/megaoffers?limit=${limit}`),
  getByCategory: (categoryId: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/api/service/category/${categoryId}${query}`);
  },
  getRelated: (id: string, limit = 4) =>
    request<any>(`/api/service/${id}/related?limit=${limit}`),
  search: (q: string, limit = 10) =>
    request<any>(`/api/service/search?q=${encodeURIComponent(q)}&limit=${limit}`),
};

// ── Category API ─────────────────────────────────────────
export const categoryApi = {
  getAll: () => request<any>('/api/category'),
  getActive: () => request<any>('/api/category/active'),
  getById: (id: string) => request<any>(`/api/category/${id}`),
  getBySlug: (slug: string) => request<any>(`/api/category/slug/${slug}`),
};

// ── User / Auth API ──────────────────────────────────────
export const userApi = {
  login: (email: string, password: string) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),
  register: async (
    name: string,
    email: string,
    password: string,
    referralCode?: string
  ) => {
    return await request<any>('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        ...(referralCode?.trim() ? { referralCode: referralCode.trim() } : {}),
      }),
      skipAuth: true,
    });
  },
  getMe: () => request<any>('/auth/me'),
  getProfile: (id: string) => request<any>(`/api/user/${id}`),
  updateProfile: (id: string, data: { name?: string; email?: string; phone?: string }) =>
    request<any>(`/api/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (id: string, newPassword: string) =>
    request<any>(`/api/user/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    }),
  // Address management
  addAddress: (id: string, data: any) =>
    request<any>(`/api/user/${id}/addressess`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAddress: (id: string, addressId: string, data: any) =>
    request<any>(`/api/user/${id}/addressess/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAddress: (id: string, addressId: string) =>
    request<any>(`/api/user/${id}/addressess/${addressId}`, { method: 'DELETE' }),
};

// ── Wallet / MLM API ─────────────────────────────────────
export const walletApi = {
  getConfig: () => request<any>('/api/wallet/config', { skipAuth: true }),
  getMyWallet: () => request<any>('/api/wallet/me'),
  getMyTransactions: (page = 1, limit = 20) =>
    request<any>(`/api/wallet/me/transactions?page=${page}&limit=${limit}`),
  getMyTeam: () => request<any>('/api/wallet/me/team'),
};

// ── Cart API ─────────────────────────────────────────────
export const cartApi = {
  get: () => request<any>('/api/cart'),
  add: (
    itemId: string,
    quantity = 1,
    itemType: 'product' | 'service' = 'product'
  ) =>
    request<any>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify(
        itemType === 'service'
          ? { serviceId: itemId, itemType: 'service', quantity }
          : { productId: itemId, itemType: 'product', quantity }
      ),
    }),
  remove: (productId: string) =>
    request<any>(`/api/cart/remove/${productId}`, { method: 'DELETE' }),
  clear: () => request<any>('/api/cart/clear', { method: 'DELETE' }),
};

// ── Wishlist API ─────────────────────────────────────────
export const wishlistApi = {
  get: () => request<any>('/api/wishlist'),
  add: (productId: string) =>
    request<any>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  remove: (productId: string) =>
    request<any>(`/api/wishlist/${productId}`, { method: 'DELETE' }),
  clear: () => request<any>('/api/wishlist', { method: 'DELETE' }),
};

// ── Order API ────────────────────────────────────────────
export const orderApi = {
  create: (orderData: any) =>
    request<any>('/api/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getAll: () => request<any>('/api/order'),
  getMyOrders: () => request<any>('/api/order/my-orders'),
  getById: (id: string) => request<any>(`/api/order/${id}`),
  cancel: (id: string) =>
    request<any>(`/api/order/${id}/cancel`, { method: 'PATCH' }),
  markPaid: (id: string) =>
    request<any>(`/api/order/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        isPaid: true,
        paymentResult: { status: 'success', paidAt: new Date().toISOString() },
      }),
    }),
};

// ── Review API ───────────────────────────────────────────
export const reviewApi = {
  getByProduct: (productId: string) =>
    request<any>(`/api/review/product/${productId}`),
  create: (data: { productId: string; rate: number; text: string; title?: string }) =>
    request<any>('/api/review', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { rate?: number; text?: string; title?: string }) =>
    request<any>(`/api/review/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<any>(`/api/review/${id}`, { method: 'DELETE' }),
};

// ── Payment API (Razorpay — lives under /api/payments, not /api/v1) ──
async function paymentRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${PAYMENT_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json();

  if (!res.ok) {
    const base = data.message || `Request failed with status ${res.status}`;
    const extra =
      data.details && String(data.details) !== String(data.message)
        ? ` — ${data.details}`
        : '';
    throw new Error(base + extra);
  }

  return data;
}

export const paymentApi = {
  createOrder: (amount: number, currency = 'INR', receipt?: string) =>
    paymentRequest<any>('/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, receipt }),
    }),
  verify: (data: {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    paymentRequest<any>('/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Newsletter API ────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    request<any>('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

