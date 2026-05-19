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
}

export function ProductCard({ product }: ProductCardProps) {
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
      <motion.div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={np.displayImage}
          alt={np.displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {service && (
          <span className="absolute top-3 left-3 badge-pill bg-indigo-600 text-white">
            Service
          </span>
        )}
        {!service && np.displayDiscount > 0 && (
          <span className="absolute top-3 left-3 badge-pill bg-destructive text-destructive-foreground">
            -{np.displayDiscount}%
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

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
      </motion.div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {typeof product.category === 'string'
            ? product.category
            : product.category?.name || 'Catalog'}
        </p>

        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.75rem] group-hover:text-primary transition-colors">
          {np.displayName}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(np.displayRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted'
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({np.displayReviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold text-foreground">₹{np.displayPrice}</span>
          {np.displayOriginalPrice && np.displayOriginalPrice > np.displayPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{np.displayOriginalPrice}
            </span>
          )}
        </div>

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
      </div>
    </motion.article>
  );
}
