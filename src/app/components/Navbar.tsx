import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, LogOut, ChevronDown, Package, MapPin, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { normalizeProduct } from '../data/products';
import { orderApi } from '../services/api';
import { shop, buildNavLinks } from '../config/shop';

export function Navbar() {
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { cart, wishlist, products, categories } = useShop();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (!isAuthenticated || !showAccountDropdown) return;
      try {
        const res = await orderApi.getMyOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrderCount(res.data.length);
        } else {
          setOrderCount(null);
        }
      } catch {
        setOrderCount(null);
      }
    };
    fetchOrderCount();
  }, [isAuthenticated, showAccountDropdown]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setNavHidden(false);
        lastScrollY.current = window.scrollY;
        return;
      }
      const y = window.scrollY;
      const prev = lastScrollY.current;
      const delta = y - prev;
      lastScrollY.current = y;

      if (y < 56) {
        setNavHidden(false);
        return;
      }
      if (delta > 10) setNavHidden(true);
      else if (delta < -10) setNavHidden(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  const bottomLinks = buildNavLinks(categories);

  const filteredProducts = searchQuery.trim() 
    ? products.filter(p => {
        const np = normalizeProduct(p);
        const catName = typeof p.category === 'string' ? p.category : p.category?.name || '';
        return np.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          catName.toLowerCase().includes(searchQuery.toLowerCase());
      }).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop?q=' + encodeURIComponent(searchQuery));
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col nav-glass transition-transform duration-300 ease-out will-change-transform ${
        navHidden && !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >

      {/* Main Middle Bar */}
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex-none">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-secondary rounded-xl transition-colors text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Brand */}
          <Link
            to="/"
            className="flex-none inline-flex flex-col leading-tight hover:opacity-90 transition-opacity"
          >
              <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-foreground tracking-tight">
                {shop.name}
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-muted-foreground tracking-[0.16em] uppercase">
                {shop.tagline}
              </span>
          </Link>

          {/* Center Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-3xl items-center relative">
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2 rounded-2xl border border-border bg-input-background pl-4 pr-1.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder={
                  shop.isDualCatalog
                    ? 'Search products & services...'
                    : `Search ${shop.catalog.plural}...`
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button type="submit" className="btn-primary !py-2 !px-4 text-sm shrink-0">
                Search
              </button>
            </form>

            {/* Desktop Search Dropdown */}
            <AnimatePresence>
              {showSearchDropdown && searchQuery.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[60]"
                >
                  {filteredProducts.length > 0 ? (
                    <div className="py-2">
                      {filteredProducts.map(product => {
                        const np = normalizeProduct(product);
                        const catName = typeof product.category === 'string' ? product.category : product.category?.name || '';
                        return (
                          <Link 
                            key={np.displayId} 
                            to={`/product/${np.slug || np.displayId}`}
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchDropdown(false);
                            }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <img src={np.displayImage} alt={np.displayName} className="w-12 h-12 object-cover rounded-md" />
                            <div className="flex-1">
                              <h4 className="text-[15px] font-semibold text-gray-800 line-clamp-1">{np.displayName}</h4>
                              <p className="text-xs text-gray-500 font-medium">{catName}</p>
                            </div>
                            <span className="text-sm font-bold text-primary">Rs. {np.displayPrice}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm font-medium text-gray-500">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-5 flex-none">
            
            {/* ─── When Logged In: Profile Dropdown ─── */}
            {isAuthenticated ? (
              <div 
                className="relative hidden sm:block"
                onMouseEnter={() => setShowAccountDropdown(true)}
                onMouseLeave={() => setShowAccountDropdown(false)}
              >
                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                  {/* Avatar */}
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-[11px] text-gray-500 leading-tight block">Hello, {user?.name?.split(' ')[0]}</span>
                    <span className="text-[13px] font-bold text-gray-800 flex items-center gap-0.5 leading-tight">
                      My Account
                      <ChevronDown size={12} className="mt-0.5 text-gray-500" />
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {showAccountDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70]"
                    >
                      {/* Invisible bridge for hover gap */}
                      <div className="absolute -top-2 left-0 right-0 h-2" />

                      {/* User Info Header */}
                      <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-[15px]">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Account Links */}
                      <div className="py-2">
                        <Link to="/account" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                          <User size={17} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">Your Profile</span>
                        </Link>
                        <Link to="/orders" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                          <Package size={17} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">Your Orders</span>
                          {typeof orderCount === 'number' && orderCount > 0 && (
                            <span className="ml-auto bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                              {orderCount}
                            </span>
                          )}
                        </Link>
                        <Link to="/wishlist" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                          <Heart size={17} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">Your Wishlist</span>
                          {wishlist.length > 0 && (
                            <span className="ml-auto bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>
                          )}
                        </Link>
                        <Link to="/account#addresses" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                          <MapPin size={17} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">Your Addresses</span>
                        </Link>
                        <Link to="/account#settings" onClick={() => setShowAccountDropdown(false)} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                          <Settings size={17} className="text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-700">Account Settings</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 px-5 py-3">
                        <button 
                          onClick={() => { logout(); navigate('/'); setShowAccountDropdown(false); }}
                          className="flex items-center gap-3 text-red-500 hover:text-red-600 font-medium text-[13px] w-full transition-colors"
                        >
                          <LogOut size={17} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ─── When Not Logged In: Login Dropdown (like screenshot) ─── */
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-primary shadow-sm">
                    <User size={20} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-[11px] text-gray-500 leading-tight block">Hello</span>
                    <span className="text-[13px] font-bold text-gray-800 flex items-center gap-0.5 leading-tight">
                      Login
                      <ChevronDown size={12} className="mt-0.5 text-gray-500" />
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {showLoginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70]"
                    >
                      <div className="absolute -top-2 left-0 right-0 h-2" />

                      <div className="py-2">
                        <Link
                          to="/login?redirect=/account"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <User size={18} className="text-primary" />
                          <span className="text-[14px] font-medium text-gray-700">Your Profile</span>
                        </Link>
                        <Link
                          to="/login?redirect=/orders"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <Package size={18} className="text-primary" />
                          <span className="text-[14px] font-medium text-gray-700">Your Orders</span>
                        </Link>
                        <Link
                          to="/login?redirect=/account/payment-methods"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <div className="w-[18px] h-[18px] rounded-sm border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary rounded-[2px]" />
                          </div>
                          <span className="text-[14px] font-medium text-gray-700">Saved Cards</span>
                        </Link>
                        <Link
                          to="/login?redirect=/account/addresses"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <MapPin size={18} className="text-primary" />
                          <span className="text-[14px] font-medium text-gray-700">Manage Address</span>
                        </Link>
                        <Link
                          to="/contact"
                          onClick={() => setShowLoginDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-primary flex items-center justify-center text-primary text-[11px] font-bold">
                            ?
                          </div>
                          <span className="text-[14px] font-medium text-gray-700">Contact Us</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 px-5 py-4">
                        <Link
                          to="/login"
                          onClick={() => setShowLoginDropdown(false)}
                          className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-extrabold tracking-wide hover:bg-primary/90 transition-colors"
                        >
                          LOGIN
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setShowLoginDropdown(false)}
                          className="block w-full text-center mt-3 text-sm font-semibold text-primary hover:underline"
                        >
                          New here? Create account
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors relative hidden lg:flex">
              <Heart size={22} className="text-gray-600" />
              <span className="hidden sm:inline font-medium text-[14px]">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 left-4 w-5 h-5 bg-[#e33535] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors relative">
              <div className="relative">
                <ShoppingCart size={22} className="text-primary" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-[#e33535] text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-medium text-[14px]">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile/Tablet Search */}
        <div className="mt-2 lg:hidden relative w-full">
          <form onSubmit={handleSearch} className="flex w-full border border-gray-300 rounded-md overflow-hidden focus-within:border-primary transition-all">
            <div className="px-2.5 py-1.5 flex items-center justify-center bg-white text-gray-400">
              <Search size={17} />
            </div>
            <input 
              type="text" 
              placeholder={
                shop.isDualCatalog
                  ? 'Search products & services...'
                  : `Search ${shop.catalog.plural}...`
              } 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              className="w-full py-1.5 px-2 outline-none text-sm text-gray-700 font-medium" 
            />
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-1.5 flex items-center justify-center text-sm font-medium">
              Search
            </button>
          </form>

          {/* Mobile Search Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchQuery.trim() && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[60]"
              >
                {filteredProducts.length > 0 ? (
                  <div className="py-2">
                    {filteredProducts.map(product => {
                      const np = normalizeProduct(product);
                      const catName = typeof product.category === 'string' ? product.category : product.category?.name || '';
                      return (
                        <Link 
                          key={np.displayId} 
                          to={`/product/${np.slug || np.displayId}`}
                          onClick={() => {
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <img src={np.displayImage} alt={np.displayName} className="w-12 h-12 object-cover rounded-md" />
                          <div className="flex-1">
                            <h4 className="text-[15px] font-semibold text-gray-800 line-clamp-1">{np.displayName}</h4>
                            <p className="text-xs text-gray-500 font-medium">{catName}</p>
                          </div>
                          <span className="text-sm font-bold text-primary">Rs. {np.displayPrice}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm font-medium text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Link Bar (Desktop) */}
      <div className="hidden lg:block border-t border-border/50 bg-foreground">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-center flex-wrap gap-x-6 gap-y-1 py-2.5 text-xs font-semibold text-slate-300 tracking-wide">
          {bottomLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-white transition-colors whitespace-nowrap ${
                location.pathname === link.path ? 'text-primary' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="py-2 flex flex-col">
              {/* Mobile User Profile Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Hello, {user?.name?.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Hello, Sign in</p>
                      <p className="text-xs text-primary font-medium">Tap to get started</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* Mobile Account Links (only when logged in) */}
              {isAuthenticated && (
                <div className="border-b border-gray-100">
                  <Link to="/account" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Profile</span>
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Package size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Orders</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Wishlist</span>
                    {wishlist.length > 0 && (
                      <span className="ml-auto bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>
                    )}
                  </Link>
                  <Link to="/account#addresses" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Addresses</span>
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              {bottomLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-primary hover:bg-gray-50 border-b border-gray-50 uppercase tracking-wide transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 mt-2 flex items-center gap-6">
                {isAuthenticated ? (
                  <button onClick={() => { logout(); navigate('/'); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} className="text-primary" /> Login
                  </Link>
                )}
                <Link to="/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart size={20} className="text-gray-500" /> Wishlist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


    </header>
  );
}
