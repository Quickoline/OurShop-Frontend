import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Shield, Package, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, normalizeProduct } from '../data/products';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { reviewApi } from '../services/api';
import { productApi, serviceApi } from '../services/api';
import { getCatalogType, isService } from '../data/catalogHelpers';
import { toast } from 'sonner';
import { shop } from '../config/shop';
import { goToCheckout } from '../utils/checkoutAuth';

const TAG_LABELS: Record<string, string> = {
  bestseller: 'Best Seller',
  newly_launched: 'Newly Launched',
  mega_offer: 'Mega Offer',
  combo: 'Combo',
  gift: 'Gift',
};

const UNIT_LABELS: Record<string, string> = {
  kg: 'Kilogram',
  g: 'Gram',
  l: 'Litre',
  ml: 'Millilitre',
  pcs: 'Pieces',
  box: 'Box',
  bag: 'Bag',
  bottle: 'Bottle',
  pack: 'Pack',
  set: 'Set',
  other: 'Other',
};

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, products: contextProducts } = useShop();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ title: '', text: '', rate: 5 });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const fromContext = contextProducts.find(
        (p) => p.slug === slug || p._id === slug || String(p.id) === slug
      );

      const tryServiceFirst = fromContext ? isService(fromContext) : false;

      try {
        const primary = tryServiceFirst ? serviceApi : productApi;
        const res = await primary.getBySlug(slug || '');
        if (res.success && res.data) {
          setProduct({
            ...res.data,
            catalogType: tryServiceFirst ? 'service' : getCatalogType(res.data),
          });
          setLoading(false);
          return;
        }
      } catch {
        // fall through
      }

      try {
        const secondary = tryServiceFirst ? productApi : serviceApi;
        const res = await secondary.getBySlug(slug || '');
        if (res.success && res.data) {
          setProduct({
            ...res.data,
            catalogType: tryServiceFirst ? 'product' : 'service',
          });
          setLoading(false);
          return;
        }
      } catch {
        // fall through
      }

      setProduct(fromContext || null);
      setLoading(false);
    };

    fetchProduct();
  }, [slug, contextProducts]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!product) return;
      try {
        const np = normalizeProduct(product);
        const res = await reviewApi.getByProduct(np.displayId);
        if (res.success && Array.isArray(res.data)) {
          setReviews(res.data);
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    };
    loadReviews();
  }, [product]);

  useEffect(() => {
    const options = Array.isArray(product?.sizeOptions) ? product.sizeOptions : [];
    if (options.length === 0) {
      setSelectedSizeLabel('');
      return;
    }
    const initial = options.find((option: any) => option.isDefault)?.label || options[0]?.label || '';
    setSelectedSizeLabel(initial);
  }, [product?._id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-screen">
        <h1 className="text-2xl text-muted-foreground">Loading product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const np = normalizeProduct(product);
  const pid = np.displayId;
  const isWishlisted = isInWishlist(pid);
  const displayDiscount = Number(np.displayDiscount || 0);
  const galleryImages = [np.displayImage, ...(Array.isArray(product.images) ? product.images : [])]
    .filter(Boolean)
    .filter((img, idx, arr) => arr.indexOf(img) === idx);

  const handleAddToCart = () => {
    const payload = selectedSize
      ? {
          ...product,
          price: displayOriginalPrice > 0 ? displayOriginalPrice : displayPrice,
          priceAfterDiscount: displayPrice,
          selectedSizeLabel: selectedSize.label,
          unit: selectedSize.label,
        }
      : product;
    addToCart(payload as Product);
    toast.success(`${np.displayName} added to cart`);
  };

  const handleBuyNow = () => {
    const payload = selectedSize
      ? {
          ...product,
          price: displayOriginalPrice > 0 ? displayOriginalPrice : displayPrice,
          priceAfterDiscount: displayPrice,
          selectedSizeLabel: selectedSize.label,
          unit: selectedSize.label,
        }
      : product;
    goToCheckout(navigate, { buyNowProduct: payload as Product });
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`${np.displayName} added to wishlist`);
    } else {
      toast.info(`${np.displayName} removed from wishlist`);
    }
  };

  const currentUserId = String((user as any)?.id || (user as any)?._id || '');
  const startEditReview = (review: any) => {
    const rid = String(review?._id || review?.id || '');
    setEditingReviewId(rid);
    setReviewForm({
      title: review.title || '',
      text: review.text || '',
      rate: Number(review.rate || 5),
    });
  };

  const resetReviewForm = () => {
    setEditingReviewId(null);
    setReviewForm({ title: '', text: '', rate: 5 });
  };

  const submitReview = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    if (!reviewForm.text.trim()) {
      toast.error('Review text is required');
      return;
    }
    setReviewLoading(true);
    try {
      const np = normalizeProduct(product);
      if (editingReviewId) {
        await reviewApi.update(editingReviewId, reviewForm);
        toast.success('Review updated');
      } else {
        await reviewApi.create({
          productId: np.displayId,
          title: reviewForm.title,
          text: reviewForm.text,
          rate: reviewForm.rate,
        });
        toast.success('Review added');
      }
      const res = await reviewApi.getByProduct(np.displayId);
      if (res.success && Array.isArray(res.data)) setReviews(res.data);
      resetReviewForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewApi.delete(id);
      setReviews((prev) => prev.filter((r) => String(r._id || r.id) !== id));
      toast.success('Review deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const catName = typeof product.category === 'string' ? product.category : product.category?.name || '';
  const quantity = Number(product.quantity || 0);
  const isOutOfStock = quantity <= 0;
  const aboutItems = Array.isArray(product.aboutItems) ? product.aboutItems : [];
  const groupedSpecs = Array.isArray(product.specifications)
    ? product.specifications.reduce((acc: Record<string, Array<{ key: string; value: string }>>, item: any) => {
        const group = item?.group || 'Product details';
        if (!acc[group]) acc[group] = [];
        acc[group].push({ key: item?.key || '', value: item?.value || '' });
        return acc;
      }, {})
    : {};
  const specGroups = Object.entries(groupedSpecs);
  const sizeOptions = Array.isArray(product.sizeOptions) ? product.sizeOptions : [];
  const selectedSize =
    sizeOptions.find((option: any) => option.label === selectedSizeLabel) ||
    sizeOptions.find((option: any) => option.isDefault) ||
    sizeOptions[0] ||
    null;
  const displayPrice = selectedSize?.price != null ? Number(selectedSize.price) : Number(np.displayPrice);
  const displayOriginalPrice = selectedSize?.mrp != null ? Number(selectedSize.mrp) : Number(np.displayOriginalPrice || 0);
  const displaySizeSavings =
    selectedSize?.savingsPercent != null
      ? Number(selectedSize.savingsPercent)
      : displayOriginalPrice > displayPrice && displayOriginalPrice > 0
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : 0;

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-8">
        <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border">
        {/* Left: Product Image */}
        <div className="relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 group">
          {product.badge && (
            <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {product.badge}
            </div>
          )}
          {displayDiscount > 0 && (
            <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 flex flex-col items-center justify-center rounded-lg shadow-md">
              <span className="font-bold leading-none">{displayDiscount}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">OFF</span>
            </div>
          )}
          <img
            src={galleryImages[activeImageIndex] || np.displayImage}
            alt={np.displayName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 text-white rounded-full p-2"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 text-white rounded-full p-2"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border ${idx === activeImageIndex ? 'border-primary' : 'border-border'}`}
                >
                  <img src={img} alt={`${np.displayName}-${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-primary font-medium tracking-wide text-sm uppercase">
            {catName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {np.displayName}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star size={20} fill="currentColor" />
              <span className="ml-1 text-foreground font-medium">{np.displayRating}</span>
            </div>
            <span className="text-muted-foreground text-sm">({np.displayReviews} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-bold text-foreground">₹{displayPrice.toFixed(2)}</span>
            {displayOriginalPrice > displayPrice && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                ₹{displayOriginalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className={`mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
            {isOutOfStock ? 'Out of Stock' : `In Stock (${quantity})`}
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            {product.description || `Discover ${np.displayName} from ${shop.name}. Quality you can trust — browse details, reviews, and order with secure checkout.`}
          </p>

          <div className="mb-6 rounded-xl border border-border p-4 bg-secondary/20">
            <p className="text-sm"><span className="font-semibold">Unit:</span> {UNIT_LABELS[product.unit || 'pcs'] || product.unit || 'pcs'}</p>
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="inline-flex px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                    {TAG_LABELS[tag] || tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-[2] bg-secondary text-foreground py-4 rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart size={22} />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-[3] bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
            <button 
              onClick={handleWishlist}
              className={`p-4 border-2 ${isWishlisted ? 'border-red-500' : 'border-border'} text-foreground hover:text-red-500 hover:border-red-500 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center bg-white group hover:shadow-md`}
            >
              <Heart className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500 text-foreground'}`} size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border mt-auto">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <Shield size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <Package size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <RotateCcw size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border">
        {(product.soldBy || product.useBy) && (
          <div className="mb-6 rounded-xl border border-border p-4 bg-secondary/20">
            {product.soldBy && <p className="text-sm"><span className="font-semibold">Sold by:</span> {product.soldBy}</p>}
            {product.useBy && <p className="text-sm mt-1"><span className="font-semibold">Use by:</span> {new Date(product.useBy).toLocaleDateString()}</p>}
          </div>
        )}

      {sizeOptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Size Options</h2>
            <div className="max-w-md space-y-3">
              <select
                value={selectedSizeLabel}
                onChange={(e) => setSelectedSizeLabel(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2"
              >
                {sizeOptions.map((option: any, idx: number) => (
                  <option key={`${option.label}-${idx}`} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedSize && (
                <div className="rounded-xl border border-border p-4 bg-secondary/20">
                  <p className="font-semibold">{selectedSize.label}</p>
                  <p className="text-lg font-bold mt-1">₹{displayPrice.toFixed(2)}</p>
                  {displayOriginalPrice > displayPrice && (
                    <p className="text-sm text-muted-foreground line-through">₹{displayOriginalPrice.toFixed(2)}</p>
                  )}
                  {selectedSize.perUnitPrice != null && (
                    <p className="text-xs text-muted-foreground">{selectedSize.perUnitPrice}</p>
                  )}
                  {displaySizeSavings > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-1">Save {displaySizeSavings}%</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {aboutItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About this item</h2>
            <ul className="list-disc pl-5 space-y-2">
              {aboutItems.map((item, idx) => (
                <li key={`${item}-${idx}`} className="text-sm leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {specGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Product information</h2>
            <div className="space-y-6">
              {specGroups.map(([group, rows]) => (
                <div key={group}>
                  <h3 className="font-semibold mb-2">{group}</h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    {rows.map((row, idx) => (
                      <div key={`${row.key}-${idx}`} className="grid grid-cols-2 text-sm border-b border-border last:border-b-0">
                        <div className="bg-secondary/20 px-3 py-2 font-medium">{row.key}</div>
                        <div className="px-3 py-2">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="space-y-3 mb-6">
          {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
          {reviews.map((review) => {
            const rid = String(review?._id || review?.id || '');
            const ownerId = String(review?.userId?._id || review?.userId || '');
            const canManage = currentUserId && ownerId && currentUserId === ownerId;
            return (
              <div key={rid} className="border border-border rounded-xl p-4">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-medium">{review.title || 'Review'}</p>
                    <p className="text-sm text-muted-foreground">Rating: {review.rate}/5</p>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <button onClick={() => startEditReview(review)} className="text-sm text-primary">Edit</button>
                      <button onClick={() => deleteReview(rid)} className="text-sm text-red-500">Delete</button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm">{review.text}</p>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">{editingReviewId ? 'Update your review' : 'Write a review'}</h3>
          <input
            value={reviewForm.title}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-border rounded-xl px-3 py-2"
            placeholder="Title (optional)"
          />
          <textarea
            value={reviewForm.text}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
            className="w-full border border-border rounded-xl px-3 py-2 min-h-24"
            placeholder="Write your review"
          />
          <select
            value={reviewForm.rate}
            onChange={(e) => setReviewForm((prev) => ({ ...prev, rate: Number(e.target.value) }))}
            className="border border-border rounded-xl px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star</option>)}
          </select>
          <div className="flex gap-2">
            <button
              onClick={submitReview}
              disabled={reviewLoading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl"
            >
              {reviewLoading ? 'Saving...' : editingReviewId ? 'Update Review' : 'Submit Review'}
            </button>
            {editingReviewId && (
              <button onClick={resetReviewForm} className="px-4 py-2 rounded-xl border border-border">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
