import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { normalizeProduct, Product } from '../data/products';
import { getCatalogType } from '../data/catalogHelpers';
import { orderApi, userApi } from '../services/api';
import { consumeBuyNowProduct } from '../utils/checkoutAuth';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

const QR_IMAGE_URL = '/qr%20shop.jpeg';

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useShop();
  const { isAuthenticated, user } = useAuth();
  const stateBuyNow = (location.state as { buyNowProduct?: Product } | null)?.buyNowProduct;
  const [buyNowProduct] = useState<Product | null>(() =>
    consumeBuyNowProduct(stateBuyNow)
  );

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(false);

  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!isAuthenticated || !user) return;
      try {
        const userId = (user as any).id || (user as any)._id;
        if (!userId) return;
        const res = await userApi.getProfile(userId);
        const addresses = res?.data?.addresses || [];
        setSavedAddresses(addresses);
      } catch {
        setSavedAddresses([]);
      }
    };
    loadSavedAddresses();
  }, [isAuthenticated, user]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const checkoutItems = buyNowProduct ? [buyNowProduct] : cart;

  const total = checkoutItems.reduce((sum, item) => {
    const np = normalizeProduct(item);
    return sum + np.displayPrice;
  }, 0);
  const payableTotal = total;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applySavedAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = savedAddresses.find((item: any) => item._id === addressId);
    if (!selected) return;
    setFormData((prev) => ({
      ...prev,
      name: selected.fullName || prev.name,
      phone: selected.phone || '',
      street: selected.street || selected.addressLine || '',
      city: selected.city || '',
      state: selected.state || '',
      pincode: selected.pincode || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authUser = user as any;
      const orderItems = checkoutItems.map((item) => {
        const np = normalizeProduct(item);
        const refId = np._id || np.displayId;
        if (!/^[a-f\d]{24}$/i.test(String(refId))) {
          throw new Error(
            'One or more selected items are invalid. Please refresh and try again.'
          );
        }
        const itemType = getCatalogType(item);
        const line: Record<string, unknown> = {
          itemType,
          title: np.displayName,
          image: np.displayImage || undefined,
          quantity: 1,
          price: np.displayPrice,
        };
        if (itemType === 'service') {
          line.service = refId;
        } else {
          line.product = refId;
        }
        return line;
      });

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: formData.name,
          addressLine: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          country: 'India',
        },
        itemsPrice: total,
        taxPrice: 0,
        shippingPrice: 0,
        discountPrice: 0,
        totalPrice: payableTotal,
        paymentMethod: 'UPI',
        isPaid: false,
      };

      if (saveAddressForFuture) {
        const userId = authUser?.id || authUser?._id;
        const addressPayload = {
          fullName: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        };
        const alreadyExists = savedAddresses.some((address: any) => {
          return (
            String(address?.street || address?.addressLine || '').trim().toLowerCase() === addressPayload.street.trim().toLowerCase() &&
            String(address?.city || '').trim().toLowerCase() === addressPayload.city.trim().toLowerCase() &&
            String(address?.state || '').trim().toLowerCase() === addressPayload.state.trim().toLowerCase() &&
            String(address?.pincode || '').trim() === addressPayload.pincode.trim()
          );
        });
        if (userId && !alreadyExists) {
          try {
            await userApi.addAddress(userId, addressPayload);
          } catch {
            toast.error('Could not save address, but your order can still continue.');
          }
        }
      }

      const created = await orderApi.create(orderData);
      const createdOrder = created?.data ?? created;
      const shopOrderId = createdOrder?._id || createdOrder?.id;

      toast.success('Order placed. Complete UPI payment using the QR code.');
      if (shopOrderId) {
        navigate(`/order-success/${shopOrderId}`);
      } else {
        navigate('/account/orders');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/shop')}
          className="text-primary hover:underline"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <h1 className="text-4xl font-bold text-foreground mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Use saved address
                </label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => applySavedAddress(e.target.value)}
                  className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select saved address</option>
                  {savedAddresses.map((address: any) => (
                    <option key={address._id} value={address._id}>
                      {(address.fullName || 'Address')} - {(address.city || '')} {(address.pincode || '')}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {savedAddresses.slice(0, 3).map((address: any) => (
                    <button
                      type="button"
                      key={address._id}
                      onClick={() => applySavedAddress(address._id)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-white text-xs hover:bg-gray-50"
                    >
                      {address.fullName || 'Address'} - {address.city || ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={saveAddressForFuture}
                  onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Save this address for future checkouts
              </label>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-primary/20 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="text-primary" size={22} />
              <h2 className="text-xl font-bold text-foreground">Pay with UPI (PhonePe)</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Scan the QR code and pay <strong className="text-foreground">Rs. {payableTotal.toFixed(2)}</strong> before
              placing your order. Use the same amount shown below.
            </p>
            <div className="flex flex-col items-center bg-secondary/20 rounded-2xl p-4 border border-border">
              <img
                src={QR_IMAGE_URL}
                alt="PhonePe QR code — scan to pay"
                className="w-full max-w-[280px] rounded-xl shadow-md bg-white"
              />
              <p className="mt-4 text-center text-sm font-semibold text-foreground">
                Amount to pay: <span className="text-primary text-lg">Rs. {payableTotal.toFixed(2)}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-center">
                Scan &amp; pay using PhonePe or any UPI app, then tap Place Order.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Placing Order...' : `Place Order — Rs. ${payableTotal.toFixed(2)}`}
          </button>
          <p className="text-xs text-center text-muted-foreground">
            By placing the order you confirm that you have completed the UPI payment for the total amount.
          </p>
        </form>

        <div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {checkoutItems.map((item) => {
                const np = normalizeProduct(item);
                return (
                  <div key={np.displayId} className="flex items-center gap-4">
                    <img
                      src={np.displayImage}
                      alt={np.displayName}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{np.displayName}</p>
                      <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <span className="font-bold">Rs. {np.displayPrice}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-xl pt-2 border-t border-border">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">Rs. {payableTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border hidden lg:block">
              <p className="text-xs text-muted-foreground text-center">
                Payment via UPI QR only — no card gateway
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
