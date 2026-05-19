import type { NavigateFunction } from 'react-router-dom';
import type { Product } from '../data/products';

const BUY_NOW_KEY = 'checkout_buyNow';

export function hasAuthToken(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function loginRedirectPath(returnPath: string): string {
  return `/login?redirect=${encodeURIComponent(returnPath)}`;
}

export function stashBuyNowProduct(product: Product): void {
  try {
    sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(product));
  } catch {
    // ignore quota errors
  }
}

export function consumeBuyNowProduct(stateProduct?: Product | null): Product | null {
  if (stateProduct) return stateProduct;
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(BUY_NOW_KEY);
    return JSON.parse(raw) as Product;
  } catch {
    sessionStorage.removeItem(BUY_NOW_KEY);
    return null;
  }
}

export function goToCheckout(
  navigate: NavigateFunction,
  options?: { buyNowProduct?: Product }
): void {
  if (!hasAuthToken()) {
    if (options?.buyNowProduct) {
      stashBuyNowProduct(options.buyNowProduct);
    }
    navigate(loginRedirectPath('/checkout'));
    return;
  }

  if (options?.buyNowProduct) {
    navigate('/checkout', { state: { buyNowProduct: options.buyNowProduct } });
    return;
  }

  navigate('/checkout');
}
