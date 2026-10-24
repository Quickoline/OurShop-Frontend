import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category } from '../data/products';
import { getCatalogType } from '../data/catalogHelpers';
import { productApi, serviceApi, categoryApi, cartApi, wishlistApi } from '../services/api';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: Product[];
  wishlist: Product[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number | '') => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  refreshProducts: () => void;
  refreshCategories: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

function resolveId(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && typeof value.$oid === 'string') return value.$oid;
  if (typeof value === 'object' && value._id) return resolveId(value._id);
  return String(value);
}

function getProductId(p: Product): string {
  return resolveId((p as any)._id || (p as any).id);
}

function mapCartLineItem(item: any): Product | null {
  if (!item) return null;
  if (item.itemType === 'service' || item.serviceId) {
    const service = item.serviceId;
    if (!service || typeof service !== 'object') return null;
    return { ...service, catalogType: 'service' as const, cartQuantity: item.quantity };
  }
  const product = item.productId;
  if (!product || typeof product !== 'object') return null;
  return { ...product, catalogType: 'product' as const, cartQuantity: item.quantity };
}

function tagCatalogItems(
  items: any[],
  catalogType: 'product' | 'service'
): Product[] {
  return items.map((item) => ({
    ...item,
    catalogType: item.catalogType || catalogType,
  }));
}

function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    const listParams = { limit: '200', isActive: 'true' };
    let merged: Product[] = [];

    try {
      const [productRes, serviceRes] = await Promise.all([
        productApi.getAll(listParams),
        serviceApi.getAll(listParams).catch(() => ({ success: false, data: [] })),
      ]);

      if (productRes.success && Array.isArray(productRes.data)) {
        merged = [...merged, ...tagCatalogItems(productRes.data, 'product')];
      }
      if (serviceRes.success && Array.isArray(serviceRes.data) && serviceRes.data.length > 0) {
        merged = [...merged, ...tagCatalogItems(serviceRes.data, 'service')];
      }

      const sorted = merged.sort((a: Product, b: Product) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return da - db;
      });
      setProducts(sorted);
    } catch {
      setProducts([]);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getActive();
      if (res.success && Array.isArray(res.data)) {
        const sorted = res.data.sort((a: Category, b: Category) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return da - db;
        });
        setCategories(sorted);
      }
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([refreshProducts(), refreshCategories()]);
      } catch {
        // keep fallback if API unavailable
      }

      if (isAuthenticated()) {
        try {
          const cartRes = await cartApi.get();
          if (cartRes.success && cartRes.data?.cartItems) {
            const cartProducts = cartRes.data.cartItems
              .map(mapCartLineItem)
              .filter(Boolean) as Product[];
            setCart(cartProducts);
          }
        } catch {
          // Use local cart
        }

        try {
          const wishRes = await wishlistApi.get();
          if (wishRes.success && wishRes.data?.products) {
            const wishProducts = wishRes.data.products
              .map((item: any) => item.productId)
              .filter(Boolean);
            setWishlist(wishProducts);
          }
        } catch {
          // Use local wishlist
        }
      }

      setLoading(false);
    };

    loadData();
  }, [refreshProducts, refreshCategories]);

  const addToCart = (product: Product, quantity = 1) => {
    const pid = getProductId(product);
    const itemType = getCatalogType(product);
    setCart((prev) => {
      const exists = prev.find((p) => getProductId(p) === pid);
      if (exists) {
        return prev.map((p) =>
          getProductId(p) === pid
            ? { ...p, cartQuantity: (p.cartQuantity || 1) + quantity }
            : p
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });

    if (isAuthenticated()) {
      cartApi
        .add(pid, quantity, itemType)
        .then((res) => {
          const items = res?.data?.cartItems || [];
          const cartProducts = items.map(mapCartLineItem).filter(Boolean) as Product[];
          setCart(cartProducts);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const updateCartQty = (productId: string, quantity: number | '') => {
    const normalizedId = resolveId(productId);
    setCart((prev) =>
      prev.map((p) =>
        getProductId(p) === normalizedId ? { ...p, cartQuantity: quantity } : p
      )
    );

    if (isAuthenticated()) {
      if (quantity !== '' && quantity > 0) {
        // Find the item in state to get itemType
        const item = cart.find((p) => getProductId(p) === normalizedId);
        const itemType = item ? getCatalogType(item) : 'product';
        cartApi
          .update(normalizedId, quantity, itemType)
          .then((res) => {
            const items = res?.data?.cartItems || [];
            const cartProducts = items.map(mapCartLineItem).filter(Boolean) as Product[];
            setCart(cartProducts);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const removeFromCart = (productId: string) => {
    const normalizedId = resolveId(productId);
    if (isAuthenticated()) {
      cartApi
        .remove(normalizedId)
        .then((res) => {
          const items = res?.data?.cartItems || [];
          const cartProducts = items.map(mapCartLineItem).filter(Boolean) as Product[];
          setCart(cartProducts);
        })
        .catch((error) => {
          console.error(error);
        });
      return;
    }
    setCart((prev) => prev.filter((p) => getProductId(p) !== normalizedId));
  };

  const toggleWishlist = (product: Product) => {
    const pid = getProductId(product);
    const itemType = getCatalogType(product);
    if (itemType === 'service') {
      setWishlist((prev) => {
        const exists = prev.some((p) => getProductId(p) === pid);
        return exists ? prev.filter((p) => getProductId(p) !== pid) : [...prev, product];
      });
      return;
    }

    setWishlist((prev) => {
      const exists = prev.some((p) => getProductId(p) === pid);
      if (exists) {
        if (isAuthenticated()) {
          wishlistApi.remove(pid).catch(() => {});
        }
        return prev.filter((p) => getProductId(p) !== pid);
      }
      if (isAuthenticated()) {
        wishlistApi.add(pid).catch(() => {});
      }
      return [...prev, product];
    });
  };

  const isInCart = (productId: string) =>
    cart.some((p) => getProductId(p) === productId);

  const isInWishlist = (productId: string) =>
    wishlist.some((p) => getProductId(p) === productId);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        loading,
        addToCart,
        updateCartQty,
        removeFromCart,
        toggleWishlist,
        isInCart,
        isInWishlist,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
