import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, normalizeProduct } from '../data/products';
import { isService } from '../data/catalogHelpers';
import { useShop } from '../context/ShopContext';
import { toast } from 'sonner';
import { goToCheckout } from '../utils/checkoutAuth';

interface ProductCardProps {
  product: Product;
  size?: 'default' | 'medium';
}

export function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const medium = size === 'medium';
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const np = normalizeProduct(product);
  const pid = np.displayId;
  const productSlug = np.slug || np.displayId;
  const isWishlisted = isInWishlist(pid);
  const quantity = Number(product.quantity || 0);
  const service = isService(product);
  const isOutOfStock = !service && quantity <= 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToCheckout(navigate, { buyNowProduct: product });
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/product/${productSlug}`)}
      className="group card-surface-hover cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <motion.div
        className={`relative overflow-hidden bg-secondary ${medium ? 'aspect-square' : 'aspect-[4/5]'}`}
      >
        <img
          src={np.displayImage}
          alt={np.displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {service && (
          <span
            className={`absolute top-2 left-2 badge-pill bg-indigo-600 text-white ${medium ? 'text-[10px] px-2 py-0.5' : ''}`}
          >
            Service
          </span>
        )}
        {!service && np.displayDiscount != null && np.displayDiscount > 0 && (
          <span
            className={`absolute top-2 left-2 badge-pill bg-destructive text-destructive-foreground ${medium ? 'text-[10px] px-2 py-0.5' : ''}`}
          >
            -{np.displayDiscount}%
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-2 right-2 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            medium ? 'w-8 h-8' : 'w-10 h-10'
          } ${
            isWishlisted
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={medium ? 14 : 18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {!medium && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              {service ? 'Book' : 'Quick add'}
            </button>
          </div>
        )}
      </motion.div>

      <div className={`flex flex-col flex-1 ${medium ? 'p-3' : 'p-4 sm:p-5'}`}>
        <p
          className={`font-bold uppercase tracking-wider text-muted-foreground mb-1 ${
            medium ? 'text-[10px]' : 'text-[11px]'
          }`}
        >
          {typeof product.category === 'string'
            ? product.category
            : product.category?.name || 'Catalog'}
        </p>

        <h3
          className={`font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors ${
            medium ? 'text-sm min-h-[2.5rem]' : 'min-h-[2.75rem]'
          }`}
        >
          {np.displayName}
        </h3>

        <div className={`flex items-center gap-1.5 ${medium ? 'mt-1.5' : 'mt-2'}`}>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={medium ? 10 : 12}
                className={
                  i < Math.floor(np.displayRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted'
                }
              />
            ))}
          </div>
          <span className={`text-muted-foreground ${medium ? 'text-[10px]' : 'text-xs'}`}>
            ({np.displayReviews})
          </span>
        </div>

        <div className={`flex items-baseline gap-2 ${medium ? 'mt-2' : 'mt-3'}`}>
          {service ? (
            <span className="text-xs font-semibold text-primary">Contact for pricing</span>
          ) : (
            <>
              <span className={`font-bold text-foreground ${medium ? 'text-base' : 'text-xl'}`}>
                ₹{np.displayPrice}
              </span>
              {np.displayOriginalPrice && np.displayOriginalPrice > np.displayPrice && (
                <span className={`text-muted-foreground line-through ${medium ? 'text-xs' : 'text-sm'}`}>
                  ₹{np.displayOriginalPrice}
                </span>
              )}
            </>
          )}
        </div>

        {!medium && (
          <>
            <span
              className={`mt-2 self-start badge-pill ${
                isOutOfStock
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-accent text-accent-foreground'
              }`}
            >
              {service ? 'Available' : isOutOfStock ? 'Out of stock' : 'In stock'}
            </span>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="mt-4 w-full btn-primary py-2.5 text-sm disabled:opacity-50"
            >
              {service ? 'Book now' : 'Buy now'}
            </button>
          </>
        )}
      </div>
    </motion.article>
  );
}
