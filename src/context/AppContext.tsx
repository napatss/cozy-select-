import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon, Order, User, Language, ThemeMode, ProductCategory, ProductColor } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_USERS } from '../data/initialData';
import { translations } from '../data/translations';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ActiveView = 
  | 'home'
  | 'products'
  | 'product_detail'
  | 'cart'
  | 'checkout'
  | 'order_success'
  | 'track'
  | 'profile'
  | 'wishlist'
  | 'admin';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  t: typeof translations.th;
  
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  viewProductDetail: (productId: string) => void;

  // Products
  products: Product[];
  isLoadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  updateProductInState: (product: Product) => void;
  addProductToState: (product: Product) => void;
  deleteProductFromState: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color: ProductColor, size: string, quantity?: number) => boolean;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: { coupon: Coupon; discountAmount: number } | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeAppliedCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  trackOrderId: string;
  setTrackOrderId: (id: string) => void;

  // User Auth
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  loginUser: (email: string) => Promise<boolean>;
  logoutUser: () => void;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme & Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cozy_lang');
    return (saved as Language) || 'th';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('cozy_theme');
    return (saved as ThemeMode) || 'light';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cozy_lang', lang);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('cozy_theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Views & Navigation
  const [activeView, setActiveViewState] = useState<ActiveView>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product_detail');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      }
    } catch (err) {
      console.warn('API fallback to local data', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductInState = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const addProductToState = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProductFromState = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cozy_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cozy_cart', JSON.stringify(cart));
  }, [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState<{ coupon: Coupon; discountAmount: number } | null>(() => {
    try {
      const saved = localStorage.getItem('cozy_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cozy_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cozy_coupon');
    }
  }, [appliedCoupon]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Re-calculate coupon discount if subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const coupon = appliedCoupon.coupon;
      if (cartSubtotal < coupon.minPurchase) {
        setAppliedCoupon(null);
        showToast(
          language === 'th' 
            ? `คูปองถูกยกเลิกเนื่องจากยอดซื้อต่ำกว่า ฿${coupon.minPurchase}` 
            : `Coupon removed as subtotal is below ฿${coupon.minPurchase}`,
          'info'
        );
      } else {
        let discount = 0;
        if (coupon.discountType === 'percent') {
          discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        setAppliedCoupon({ coupon, discountAmount: discount });
      }
    }
  }, [cartSubtotal]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cozy_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cozy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(
        exists 
          ? (language === 'th' ? 'ลบสินค้าออกจาก Wishlist แล้ว' : 'Removed from Wishlist') 
          : (language === 'th' ? 'เพิ่มสินค้าใน Wishlist แล้ว ❤️' : 'Added to Wishlist ❤️'),
        'success'
      );
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add to Cart
  const addToCart = (product: Product, color: ProductColor, size: string, quantity = 1): boolean => {
    if (product.stock <= 0) {
      showToast(
        language === 'th' ? 'ขออภัย สินค้านี้หมด Stock (SOLD OUT) แล้ว' : 'Sorry, this item is SOLD OUT',
        'error'
      );
      return false;
    }

    const cartItemId = `${product.id}-${color.nameEn}-${size}`;
    const existingIndex = cart.findIndex(it => it.id === cartItemId);
    const currentQtyInCart = existingIndex !== -1 ? cart[existingIndex].quantity : 0;
    const nextTotalQty = currentQtyInCart + quantity;

    if (nextTotalQty > product.stock) {
      showToast(
        language === 'th' 
          ? `ไม่สามารถเพิ่มได้ สต็อกมีจำกัดเพียง ${product.stock} ชิ้น (ในตะกร้ามีแล้ว ${currentQtyInCart} ชิ้น)`
          : `Cannot add more. Only ${product.stock} left in stock (You already have ${currentQtyInCart} in cart)`,
        'error'
      );
      return false;
    }

    if (existingIndex !== -1) {
      setCart(prev => {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      });
    } else {
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedColor: color,
        selectedSize: size,
        quantity,
        unitPrice: product.price
      };
      setCart(prev => [...prev, newItem]);
    }

    showToast(
      language === 'th' 
        ? `เพิ่ม "${product.titleTh}" ลงตะกร้าแล้ว (+${quantity})` 
        : `Added "${product.titleEn}" to cart (+${quantity})`,
      'success'
    );
    return true;
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const item = cart.find(it => it.id === cartItemId);
    if (!item) return;

    const currentProduct = products.find(p => p.id === item.productId) || item.product;

    if (newQty > currentProduct.stock) {
      showToast(
        language === 'th'
          ? `สต็อกมีจำกัดเพียง ${currentProduct.stock} ชิ้น`
          : `Stock limited to ${currentProduct.stock} units`,
        'error'
      );
      return;
    }

    setCart(prev => prev.map(it => it.id === cartItemId ? { ...it, quantity: newQty } : it));
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find(it => it.id === cartItemId);
    setCart(prev => prev.filter(it => it.id !== cartItemId));
    if (item) {
      showToast(
        language === 'th' ? 'ลบสินค้าออกจากตะกร้าแล้ว' : 'Removed item from cart',
        'info'
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${cartSubtotal}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon({
          coupon: data.data.coupon,
          discountAmount: data.data.discountAmount
        });
        showToast(
          language === 'th' 
            ? `ใช้โค้ด ${data.data.coupon.code} สำเร็จ! ลดทันที ฿${data.data.discountAmount.toLocaleString()}`
            : `Coupon ${data.data.coupon.code} applied! Saved ฿${data.data.discountAmount.toLocaleString()}`,
          'success'
        );
        return { success: true, message: 'Applied successfully' };
      } else {
        showToast(data.message || 'รหัสคูปองไม่ถูกต้อง', 'error');
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Fallback local coupon check
      const localCoupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (localCoupon && localCoupon.isActive) {
        if (cartSubtotal < localCoupon.minPurchase) {
          const msg = language === 'th' 
            ? `ยอดสั่งซื้อขั้นต่ำ ฿${localCoupon.minPurchase}` 
            : `Minimum order ฿${localCoupon.minPurchase}`;
          showToast(msg, 'error');
          return { success: false, message: msg };
        }
        let discount = 0;
        if (localCoupon.discountType === 'percent') {
          discount = Math.round((cartSubtotal * localCoupon.discountValue) / 100);
          if (localCoupon.maxDiscount && discount > localCoupon.maxDiscount) {
            discount = localCoupon.maxDiscount;
          }
        } else {
          discount = localCoupon.discountValue;
        }
        setAppliedCoupon({ coupon: localCoupon, discountAmount: discount });
        showToast(
          language === 'th' ? `ใช้โค้ด ${localCoupon.code} สำเร็จ!` : `Coupon ${localCoupon.code} applied!`,
          'success'
        );
        return { success: true, message: 'Success' };
      }
      showToast(language === 'th' ? 'ไม่พบคูปองส่วนลดนี้' : 'Coupon code not found', 'error');
      return { success: false, message: 'Not found' };
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    showToast(language === 'th' ? 'ยกเลิกการใช้คูปองแล้ว' : 'Coupon removed', 'info');
  };

  // User Auth
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cozy_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Default demo user
    } catch {
      return INITIAL_USERS[1];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cozy_admin_auth') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginUser = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.data);
        localStorage.setItem('cozy_user', JSON.stringify(data.data));
        showToast(
          language === 'th' ? `ยินดีต้อนรับคุณ ${data.data.name}` : `Welcome back, ${data.data.name}!`,
          'success'
        );
        return true;
      }
    } catch {
      // Local fallback
      const user: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: '0898765432',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(user);
      localStorage.setItem('cozy_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('cozy_user');
    showToast(language === 'th' ? 'ออกจากระบบเรียบร้อย' : 'Signed out successfully', 'info');
  };

  const adminLogin = async (password: string): Promise<boolean> => {
    if (password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('cozy_admin_auth', 'true');
      showToast(language === 'th' ? 'เข้าสู่ระบบ Admin สำเร็จ' : 'Admin logged in successfully', 'success');
      return true;
    } else {
      showToast(language === 'th' ? 'รหัสผ่าน Admin ไม่ถูกต้อง (admin123)' : 'Incorrect admin password (admin123)', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cozy_admin_auth');
    setActiveView('home');
    showToast(language === 'th' ? 'ออกจากระบบ Admin แล้ว' : 'Exited Admin panel', 'info');
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        activeView,
        setActiveView,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedProductId,
        setSelectedProductId,
        viewProductDetail,
        products,
        isLoadingProducts,
        fetchProducts,
        updateProductInState,
        addProductToState,
        deleteProductFromState,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCouponCode,
        removeAppliedCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        lastPlacedOrder,
        setLastPlacedOrder,
        trackOrderId,
        setTrackOrderId,
        currentUser,
        isAdminLoggedIn,
        loginUser,
        logoutUser,
        adminLogin,
        adminLogout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toasts,
        showToast,
        removeToast,
        quickViewProduct,
        setQuickViewProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
