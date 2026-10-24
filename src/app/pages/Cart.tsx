import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { normalizeProduct } from '../data/products';
import { isService } from '../data/catalogHelpers';
import { shop } from '../config/shop';
import { goToCheckout } from '../utils/checkoutAuth';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty } = useShop();

  const total = cart.reduce((sum, item) => {
    const np = normalizeProduct(item);
    const qty = item.cartQuantity === '' ? 0 : Number(item.cartQuantity ?? 1);
    const itemPrice = isService(item) ? 0 : np.displayPrice;
    return sum + itemPrice * qty;
  }, 0);

  const hasInvalidQty = cart.some(
    (item) => item.cartQuantity === '' || item.cartQuantity === undefined || Number(item.cartQuantity) <= 0
  );

  if (cart.length === 0) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen text-center flex flex-col items-center justify-center">
        <div className="bg-secondary/30 p-8 rounded-full mb-6 text-primary">
          <ShoppingBag size={64} />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added anything yet. Discover {shop.catalog.plural} from {shop.name}.
        </p>
        <Link
          to="/shop"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-32 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
          <ShoppingBag className="text-primary fill-primary/20" /> Your Cart
        </h1>
        <p className="text-muted-foreground text-lg">
          You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map((product) => {
            const np = normalizeProduct(product);
            const pid = np.displayId;
            const productSlug = np.slug || np.displayId;
            return (
              <div
                key={pid}
                className="flex gap-6 items-center bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border"
              >
                <Link
                  to={`/product/${productSlug}`}
                  className="block h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-secondary/50 shrink-0"
                >
                  <img
                    src={np.displayImage}
                    alt={np.displayName}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${productSlug}`}
                    className="font-bold text-lg sm:text-xl text-foreground hover:text-primary transition-colors block mb-1 truncate"
                  >
                    {np.displayName}
                  </Link>
                  <div className="text-sm text-primary font-medium mb-2">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category?.name || ''}
                  </div>
                  <div className="text-xl font-bold">
                    {isService(product) ? (
                      <span className="text-sm font-semibold text-primary">Contact for pricing</span>
                    ) : (
                      `Rs. ${(np.displayPrice * (product.cartQuantity === '' ? 0 : Number(product.cartQuantity ?? 1))).toFixed(2)}`
                    )}
                  </div>
                  {!isService(product) && (product.cartQuantity === '' || Number(product.cartQuantity) !== 1) && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Rs. {np.displayPrice.toFixed(2)} each
                    </div>
                  )}
 
                  {/* Quantity Controls */}
                  {product.unit === 'kg' ? (
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="text-xs font-medium text-muted-foreground">Qty (kg):</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={product.cartQuantity === 0 ? 0 : (product.cartQuantity || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            updateCartQty(pid, '');
                          } else {
                            const parsed = parseFloat(val);
                            updateCartQty(pid, isNaN(parsed) ? '' : Number(Math.max(0, parsed).toFixed(3)));
                          }
                        }}
                        className="w-18 px-2 py-1 text-xs border border-border rounded-lg outline-none focus:border-primary text-center font-semibold"
                      />
                      <span className="text-[10px] text-muted-foreground ml-1">
                        ({product.cartQuantity === '' ? 0 : Math.round(Number(product.cartQuantity) * 1000)}g)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs font-medium text-muted-foreground">Qty:</span>
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => {
                            const current = product.cartQuantity === '' ? 0 : Number(product.cartQuantity ?? 1);
                            updateCartQty(pid, Math.max(0, current - 1));
                          }}
                          className="px-2 py-1 bg-secondary/35 hover:bg-secondary text-[10px] font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={product.cartQuantity === 0 ? 0 : (product.cartQuantity || '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              updateCartQty(pid, '');
                            } else {
                              const parsed = parseInt(val, 10);
                              updateCartQty(pid, isNaN(parsed) ? '' : Math.max(0, parsed));
                            }
                          }}
                          className="w-12 text-center outline-none text-xs font-semibold border-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const current = product.cartQuantity === '' ? 0 : Number(product.cartQuantity ?? 1);
                            updateCartQty(pid, current + 1);
                          }}
                          className="px-2 py-1 bg-secondary/35 hover:bg-secondary text-[10px] font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(pid)}
                  className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:ml-4"
                  title="Remove from cart"
                >
                  <X size={24} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {hasInvalidQty && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium">
                Some items in your cart have invalid quantities. Please set a quantity greater than 0 to proceed to checkout.
              </div>
            )}

            <div className="space-y-4 mb-6 text-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-foreground">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-xl mt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => goToCheckout(navigate)}
              disabled={hasInvalidQty}
              className="block w-full text-center bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
