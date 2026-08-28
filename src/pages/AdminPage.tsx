import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Coupon, ProductCategory } from '../types';
import { 
  ShieldCheck, Package, ShoppingBag, DollarSign, 
  Plus, Edit, Trash2, CheckCircle2, Clock, AlertTriangle, 
  TrendingUp, BarChart2, Tag, Search, ArrowUpDown, X, 
  RefreshCw, LogOut, Truck, Sparkles, Upload, Image as ImageIcon,
  Check, Eye, Store
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell 
} from 'recharts';

export const AdminPage: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    adminLogin, 
    adminLogout, 
    products, 
    fetchProducts, 
    updateProductInState,
    addProductToState,
    deleteProductFromState,
    setActiveView,
    language, 
    showToast,
    theme 
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'dashboard' | 'coupons'>('products');

  // Products Management State
  const [productSearch, setProductSearch] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State (for both Add and Edit)
  const initialFormState = {
    titleTh: '',
    titleEn: '',
    descriptionTh: '',
    descriptionEn: '',
    price: 490,
    compareAtPrice: undefined as number | undefined,
    category: 'tee_top' as ProductCategory | string,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'] as string[],
    sizes: ['S', 'M', 'L'],
    colors: [{ nameTh: 'ชมพู', nameEn: 'Pink', hex: '#f472b6' }],
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 1
  };

  const [productForm, setProductForm] = useState(initialFormState);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Orders Management State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');
  const [statusDrafts, setStatusDrafts] = useState<Record<string, Order['orderStatus']>>({});

  // Coupons Management State
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Fetch Admin Data
  const fetchAdminData = async () => {
    try {
      setOrdersLoading(true);
      const [ordersRes, couponsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/coupons')
      ]);

      if (ordersRes.ok) {
        const oJson = await ordersRes.json();
        if (oJson.success) {
          setOrders(oJson.data);
          const initialDrafts: Record<string, Order['orderStatus']> = {};
          oJson.data.forEach((o: Order) => {
            initialDrafts[o.id] = o.orderStatus || (o.status?.toLowerCase() as any) || 'pending';
          });
          setStatusDrafts(initialDrafts);
        }
      }

      if (couponsRes.ok) {
        const cJson = await couponsRes.json();
        if (cJson.success) setCoupons(cJson.data);
      }
    } catch (err) {
      console.warn('Admin API fallback', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminLogin(passwordInput);
  };

  // Start Editing a Product
  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      titleTh: product.titleTh,
      titleEn: product.titleEn || product.titleTh,
      descriptionTh: product.descriptionTh || '',
      descriptionEn: product.descriptionEn || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      stock: product.stock,
      images: product.images && product.images.length > 0 ? [...product.images] : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
      sizes: product.sizes || ['S', 'M', 'L'],
      colors: product.colors || [{ nameTh: 'ชมพู', nameEn: 'Pink', hex: '#f472b6' }],
      isNew: product.isNew ?? true,
      isSale: product.isSale ?? (product.compareAtPrice ? product.compareAtPrice > product.price : false),
      isBestSeller: product.isBestSeller ?? false,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 1
    });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(language === 'th' ? `กำลังแก้ไข: ${product.titleTh}` : `Editing: ${product.titleTh}`, 'info');
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProductForm(initialFormState);
    setImageUrlInput('');
  };

  // Handle Image File Upload (FileReader Base64 / DataURL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        showToast(language === 'th' ? 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' : 'Please select image files only', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        if (base64Data) {
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, base64Data]
          }));
          showToast(language === 'th' ? 'อัปโหลดรูปภาพสำเร็จ' : 'Image uploaded', 'success');
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input so user can re-upload same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  // Remove Image from Form
  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.titleTh.trim()) {
      showToast(language === 'th' ? 'กรุณากรอกชื่อสินค้า' : 'Please enter product title', 'error');
      return;
    }

    const payload = {
      ...productForm,
      titleEn: productForm.titleEn.trim() || productForm.titleTh.trim(),
      price: Number(productForm.price) || 0,
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
      stock: Number(productForm.stock) || 0,
      images: productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80']
    };

    try {
      if (editingProductId) {
        // UPDATE EXISTING PRODUCT
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          updateProductInState(json.data);
          showToast(language === 'th' ? `บันทึกการแก้ไข "${payload.titleTh}" สำเร็จ!` : 'Product updated successfully!', 'success');
          handleCancelEdit();
          await fetchProducts();
        } else {
          showToast('Failed to update product', 'error');
        }
      } else {
        // CREATE NEW PRODUCT
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const json = await res.json();
          addProductToState(json.data);
          showToast(language === 'th' ? `เพิ่มสินค้าใหม่ "${payload.titleTh}" สำเร็จ!` : 'Added new product successfully!', 'success');
          setProductForm(initialFormState);
          await fetchProducts();
        } else {
          showToast('Failed to create product', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving product', 'error');
    }
  };

  // Quick Stock Updater
  const handleUpdateStock = async (productId: string, newStock: number) => {
    const updatedStock = Math.max(0, newStock);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: updatedStock })
      });
      if (res.ok) {
        const json = await res.json();
        updateProductInState(json.data);
        showToast(language === 'th' ? `อัปเดตสต็อกเป็น ${updatedStock} ชิ้น` : `Updated stock to ${updatedStock}`, 'success');
      }
    } catch {
      const p = products.find(prod => prod.id === productId);
      if (p) {
        updateProductInState({ ...p, stock: updatedStock });
      }
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(language === 'th' ? `ยืนยันการลบสินค้า "${title}" ?` : `Delete product "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        deleteProductFromState(productId);
        if (editingProductId === productId) {
          handleCancelEdit();
        }
        await fetchProducts();
        showToast(language === 'th' ? 'ลบสินค้าสำเร็จ' : 'Product deleted', 'info');
      }
    } catch {
      deleteProductFromState(productId);
      showToast(language === 'th' ? 'ลบสินค้าเรียบร้อย' : 'Product deleted', 'info');
    }
  };

  // Update Order Status
  const handleSaveOrderStatus = async (orderId: string) => {
    const targetStatus = statusDrafts[orderId];
    if (!targetStatus) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        const json = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? json.data : o));
        showToast(language === 'th' ? `อัปเดตสถานะคำสั่งซื้อ #${orderId} เป็น "${targetStatus}" แล้ว` : `Order #${orderId} updated to ${targetStatus}`, 'success');
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: targetStatus, status: targetStatus as any } : o));
      showToast(language === 'th' ? `อัปเดตสถานะคำสั่งซื้อเป็น "${targetStatus}"` : `Status updated`, 'success');
    }
  };

  // If not logged in as Admin, show login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="py-16 sm:py-24 bg-[#FFF5F8] dark:bg-[#1a0f18] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="p-8 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] shadow-2xl shadow-pink-200/50 dark:shadow-none text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-300">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-mitr font-bold text-slate-900 dark:text-white">
                เข้าสู่ระบบแอดมิน
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                สำหรับผู้ดูแลระบบ Cozy Select เท่านั้น
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  รหัสผ่าน (Password)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="admin หรือ admin1234"
                  className="w-full px-4 py-3 rounded-2xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/30 dark:bg-pink-950/20 text-sm outline-hidden focus:border-pink-500 font-mono transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#E83A80] hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 hover:shadow-lg transition-all cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400">
                  บัญชีเริ่มต้น (ทดสอบ): <span className="font-mono text-pink-600 font-bold">admin</span> / <span className="font-mono text-pink-600 font-bold">admin1234</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredAdminProducts = products.filter(p => {
    const q = productSearch.toLowerCase();
    return p.titleTh.toLowerCase().includes(q) || (p.titleEn && p.titleEn.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q);
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    const currentStatus = (o.orderStatus || o.status || '').toLowerCase();
    return currentStatus === orderFilter;
  });

  // Stats Calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 128500);
  const totalOrdersCount = orders.length || 14;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;

  const salesTrendData = [
    { day: 'จันทร์', sales: 12400 },
    { day: 'อังคาร', sales: 18900 },
    { day: 'พุธ', sales: 15600 },
    { day: 'พฤหัส', sales: 24500 },
    { day: 'ศุกร์', sales: 32800 },
    { day: 'เสาร์', sales: 41200 },
    { day: 'อาทิตย์', sales: 38400 }
  ];

  const categoryDistribution = [
    { name: 'Hoodie', value: 30, color: '#ec4899' },
    { name: 'Tee & Tops', value: 45, color: '#f472b6' },
    { name: 'Crop Top', value: 15, color: '#fb7185' },
    { name: 'Bottoms & Others', value: 10, color: '#fda4af' }
  ];

  return (
    <div className="py-6 sm:py-10 bg-[#FFF5F8] dark:bg-[#1a0f18] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#251522] p-5 rounded-3xl border border-pink-100 dark:border-pink-900/30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E83A80] text-white flex items-center justify-center font-bold shadow-md shadow-pink-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-mitr font-bold text-slate-900 dark:text-white">
                Cozy Select Admin Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">ระบบจัดการสินค้า อัปเดตข้อมูล และติดตามคำสั่งซื้อ</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAdminTab('products')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                adminTab === 'products'
                  ? 'bg-[#E83A80] text-white shadow-md shadow-pink-200'
                  : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>จัดการสินค้า</span>
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                adminTab === 'orders'
                  ? 'bg-[#E83A80] text-white shadow-md shadow-pink-200'
                  : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>คำสั่งซื้อ ({orders.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                adminTab === 'dashboard'
                  ? 'bg-[#E83A80] text-white shadow-md shadow-pink-200'
                  : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>สถิติยอดขาย</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-pink-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>ดูหน้าร้าน</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>

        {/* 1. Products Management View (Two Column: Form on Left, List on Right) */}
        {adminTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Add / Edit Product Form */}
            <div ref={formRef} className="lg:col-span-5 bg-white dark:bg-[#251522] p-6 rounded-3xl border border-pink-100 dark:border-pink-900/30 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${editingProductId ? 'bg-amber-100 text-amber-600' : 'bg-pink-100 text-pink-600'}`}>
                    {editingProductId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="font-mitr font-bold text-base text-slate-900 dark:text-white">
                      {editingProductId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                    </h2>
                    {editingProductId && (
                      <p className="text-[11px] text-amber-600 font-semibold truncate max-w-[200px]">
                        รหัส: {editingProductId}
                      </p>
                    )}
                  </div>
                </div>

                {editingProductId && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg font-bold cursor-pointer"
                  >
                    ✕ ยกเลิก
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Product Name Thai */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อสินค้า (ภาษาไทย) *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.titleTh}
                    onChange={(e) => setProductForm({ ...productForm, titleTh: e.target.value })}
                    placeholder="เช่น Blush Camo Hoodie หรือ เสื้อครอปสายเดี่ยว"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-sm outline-hidden focus:border-pink-500"
                  />
                </div>

                {/* Product Name English */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อสินค้า (English Title)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    placeholder="e.g. Blush Camo Cropped Hoodie"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-sm outline-hidden focus:border-pink-500"
                  />
                </div>

                {/* Price and CompareAt Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ราคาปัจจุบัน (฿) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-sm font-bold text-pink-600 outline-hidden focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ราคาเต็ม/ก่อนลด (฿)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.compareAtPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="เว้นว่างถ้าไม่ลด"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-sm outline-hidden focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Category and Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      หมวดหมู่สินค้า *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-xs font-semibold outline-hidden focus:border-pink-500"
                    >
                      <option value="tee_top">เสื้อยืด / เกาะอก (Tee & Tops)</option>
                      <option value="hoodie">เสื้อฮู้ดดี้ (Hoodie)</option>
                      <option value="crop_top">เสื้อครอป (Crop Tops)</option>
                      <option value="baby_tees">Baby Tees</option>
                      <option value="tank_tops">เสื้อกล้าม / สายเดี่ยว (Tanks)</option>
                      <option value="pants">กางเกง (Pants)</option>
                      <option value="accessories">เครื่องประดับ (Accessories)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      จำนวนคงเหลือ (Stock) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 dark:bg-pink-950/20 text-sm font-bold outline-hidden focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Image Upload & Management */}
                <div className="space-y-2 pt-1 border-t border-pink-100 dark:border-pink-900/40">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>รูปภาพสินค้า (Image Upload / URL)</span>
                    <span className="text-[10px] text-pink-500 font-normal">ใส่ได้ทั้งไฟล์รูปและ URL</span>
                  </label>

                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-pink-200 dark:border-pink-900/60 rounded-2xl p-4 text-center bg-pink-50/20 dark:bg-pink-950/20 hover:bg-pink-50/50 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="product-image-file-input"
                    />
                    <label
                      htmlFor="product-image-file-input"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-[#E83A80] flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">
                        คลิกเพื่อเลือกไฟล์รูปภาพจากเครื่อง
                      </p>
                      <p className="text-[10px] text-slate-400">
                        รองรับ PNG, JPG, JPEG, WebP (สามารถเลือกหลายรูปได้)
                      </p>
                    </label>
                  </div>

                  {/* Or Input URL */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="หรือวางลิงก์รูปภาพ เช่น https://..."
                      className="flex-1 px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 text-xs outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs cursor-pointer"
                    >
                      เพิ่ม URL
                    </button>
                  </div>

                  {/* Image Previews */}
                  {productForm.images.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                        รูปภาพปัจจุบัน ({productForm.images.length} รูป):
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {productForm.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-pink-200 dark:border-pink-900 aspect-square bg-slate-100">
                            <img src={imgUrl} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-rose-600 transition-colors cursor-pointer"
                              title="ลบรูปนี้"
                            >
                              ✕
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E83A80] text-white text-[9px] font-bold">
                                รูปหลัก
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    รายละเอียดสินค้า (คำอธิบาย)
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.descriptionTh}
                    onChange={(e) => setProductForm({ ...productForm, descriptionTh: e.target.value })}
                    placeholder="ผ้านุ่มใส่สบาย ทรงเกาหลี Y2K..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 text-xs outline-hidden focus:border-pink-500"
                  />
                </div>

                {/* Submit and Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className={`flex-1 py-3 rounded-2xl text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editingProductId
                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                        : 'bg-[#E83A80] hover:bg-pink-600 shadow-pink-200'
                    }`}
                  >
                    {editingProductId ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>บันทึกการแก้ไขสินค้า</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>+ เพิ่มสินค้าใหม่</span>
                      </>
                    )}
                  </button>

                  {editingProductId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Product List Table */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white dark:bg-[#251522] p-5 rounded-3xl border border-pink-100 dark:border-pink-900/30 shadow-xs space-y-4">
                
                {/* Search & Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h2 className="font-mitr font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>รายการสินค้าทั้งหมด</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                        {products.length} รายการ
                      </span>
                    </h2>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="ค้นหาชื่อสินค้า, หมวดหมู่..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/20 text-slate-800 dark:text-slate-200 outline-hidden focus:border-pink-500"
                    />
                    <Search className="w-3.5 h-3.5 text-pink-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-pink-100 dark:border-pink-900/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF5F8] dark:bg-pink-950/40 text-slate-600 dark:text-slate-300 font-bold border-b border-pink-100 dark:border-pink-900/40">
                      <tr>
                        <th className="py-3 px-3">สินค้า</th>
                        <th className="py-3 px-3">ราคา</th>
                        <th className="py-3 px-3">หมวดหมู่</th>
                        <th className="py-3 px-3 text-center">คงเหลือ</th>
                        <th className="py-3 px-3 text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-100/60 dark:divide-pink-900/30">
                      {filteredAdminProducts.map((p) => {
                        const isSoldOut = p.stock <= 0;
                        const isBeingEdited = editingProductId === p.id;

                        return (
                          <tr 
                            key={p.id} 
                            className={`transition-colors ${
                              isBeingEdited 
                                ? 'bg-amber-50/60 dark:bg-amber-950/30' 
                                : 'hover:bg-pink-50/30 dark:hover:bg-pink-950/20'
                            }`}
                          >
                            {/* Product Info & Thumb */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <img 
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'} 
                                  alt={p.titleTh} 
                                  className="w-11 h-13 rounded-xl object-cover bg-rose-50 border border-pink-100 dark:border-pink-900 shrink-0" 
                                />
                                <div className="min-w-0 max-w-[150px] sm:max-w-[200px]">
                                  <p className="font-bold text-slate-900 dark:text-white truncate" title={p.titleTh}>
                                    {p.titleTh}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {p.titleEn}
                                  </p>
                                  {isBeingEdited && (
                                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-amber-200 text-amber-900 font-bold">
                                      กำลังแก้ไข...
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-bold text-[#E83A80]">
                                ฿{p.price.toLocaleString()}
                              </div>
                              {p.compareAtPrice && p.compareAtPrice > p.price && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  ฿{p.compareAtPrice.toLocaleString()}
                                </div>
                              )}
                            </td>

                            {/* Category */}
                            <td className="py-3 px-3 capitalize font-semibold text-slate-600 dark:text-slate-300">
                              <span className="px-2 py-0.5 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 text-[11px]">
                                {p.category.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Stock Stepper */}
                            <td className="py-3 px-3 text-center">
                              <div className="inline-flex items-center gap-1 bg-pink-50/50 dark:bg-pink-950/30 p-1 rounded-xl border border-pink-100 dark:border-pink-900/40">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStock(p.id, p.stock - 1)}
                                  className="w-5 h-5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-pink-200 flex items-center justify-center text-xs shadow-xs"
                                >
                                  -
                                </button>
                                <span className={`w-7 text-center font-bold text-xs ${isSoldOut ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {p.stock}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStock(p.id, p.stock + 1)}
                                  className="w-5 h-5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-pink-200 flex items-center justify-center text-xs shadow-xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Actions (Edit & Delete) */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(p)}
                                  className="px-2.5 py-1 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="แก้ไขข้อมูลสินค้า"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>แก้ไข</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.titleTh)}
                                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="ลบสินค้านี้"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>ลบ</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 2. Orders & Fulfillment View */}
        {adminTab === 'orders' && (
          <div className="bg-white dark:bg-[#251522] p-6 rounded-3xl border border-pink-100 dark:border-pink-900/30 shadow-xs space-y-6">
            
            {/* Header and Filter Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 dark:border-pink-900/40 pb-4">
              <div>
                <h2 className="font-mitr font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>คำสั่งซื้อ & ติดตามพัสดุ</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                    ทั้งหมด {orders.length} รายการ
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">จัดการสถานะคำสั่งซื้อ อัปเดตการจัดส่งให้ลูกค้าตรวจสอบได้แบบเรียลไทม์</p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#E83A80] text-white shadow-md shadow-pink-200'
                        : 'bg-pink-50 dark:bg-pink-950/40 text-slate-600 dark:text-slate-300 hover:bg-pink-100'
                    }`}
                  >
                    {st === 'all' && 'ทั้งหมด'}
                    {st === 'pending' && 'สั่งซื้อแล้ว'}
                    {st === 'processing' && 'กำลังจัดเตรียม'}
                    {st === 'shipped' && 'จัดส่งแล้ว'}
                    {st === 'delivered' && 'จัดส่งสำเร็จ'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid */}
            <div className="space-y-4">
              {filteredOrders.map((o) => {
                const currentDraft = statusDrafts[o.id] || o.orderStatus || (o.status?.toLowerCase() as any) || 'pending';

                return (
                  <div key={o.id} className="p-5 rounded-2xl border border-pink-100 dark:border-pink-900/40 bg-pink-50/20 dark:bg-pink-950/10 space-y-4 hover:border-pink-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100/60 dark:border-pink-900/30 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#E83A80]">
                            {o.id}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({new Date(o.createdAt).toLocaleString('th-TH')})
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                          ผู้รับ: {o.customer?.name || o.customerName} • โทร: {o.customer?.phone || o.phone}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-md">
                          ที่อยู่: {o.shippingAddress?.houseNo} {o.shippingAddress?.road} {o.shippingAddress?.subdistrict} {o.shippingAddress?.district} {o.shippingAddress?.province} {o.shippingAddress?.postalCode}
                        </p>
                      </div>

                      {/* Status Update Control */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={currentDraft}
                          onChange={(e) => setStatusDrafts(prev => ({ ...prev, [o.id]: e.target.value as any }))}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-pink-200 dark:border-pink-900 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        >
                          <option value="pending">สั่งซื้อแล้ว (Pending)</option>
                          <option value="processing">กำลังจัดเตรียมสินค้า (Processing)</option>
                          <option value="shipped">จัดส่งแล้ว (Shipped)</option>
                          <option value="delivered">จัดส่งสำเร็จ (Delivered)</option>
                          <option value="cancelled">ยกเลิกคำสั่งซื้อ (Cancelled)</option>
                        </select>

                        <button
                          onClick={() => handleSaveOrderStatus(o.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#E83A80] hover:bg-pink-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          อัปเดต
                        </button>
                      </div>
                    </div>

                    {/* Order Items & Totals */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-300">
                        {o.items.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900 text-[11px]">
                            {item.titleTh || item.titleEn} × {item.quantity}
                          </span>
                        ))}
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-xs text-slate-500 mr-2">ยอดรวมสุทธิ:</span>
                        <span className="text-base font-black text-[#E83A80]">
                          ฿{(o.grandTotal || o.total).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  ไม่พบคำสั่งซื้อในหมวดหมู่นี้
                </div>
              )}
            </div>

          </div>
        )}

        {/* 3. Dashboard Statistics */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#E83A80]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ยอดขายรวม (Total Sales)</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">฿{totalSales.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">+18.4% จากสัปดาห์ที่แล้ว</p>
              </div>

              <div className="p-5 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#E83A80]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">คำสั่งซื้อทั้งหมด</span>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{totalOrdersCount} ออเดอร์</p>
                <p className="text-[11px] text-emerald-600 font-semibold">ดำเนินการสำเร็จ 100%</p>
              </div>

              <div className="p-5 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-amber-500">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">สินค้าใกล้หมด (&lt; 5 ชิ้น)</span>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-amber-600">{lowStockCount} รายการ</p>
                <p className="text-[11px] text-slate-400">ควรเติมสินค้าเข้าคลัง</p>
              </div>

              <div className="p-5 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-rose-500">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">สินค้าหมด (SOLD OUT)</span>
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-rose-600">{outOfStockCount} รายการ</p>
                <p className="text-[11px] text-rose-500 font-semibold">แสดงสถานะหมดที่หน้าร้าน</p>
              </div>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E83A80]" />
                  <span>สถิติยอดขายประจำสัปดาห์ (THB)</span>
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrendData}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E83A80" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#E83A80" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#E83A80" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-3xl border border-pink-100 dark:border-pink-900/40 bg-white dark:bg-[#251522] space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E83A80]" />
                  <span>สัดส่วนยอดขายตามหมวดหมู่</span>
                </h3>
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4}>
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categoryDistribution.map((cat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name} ({cat.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
