import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_USERS, SHIPPING_CARRIERS } from './src/data/initialData';
import { Product, Coupon, Order, User, OrderStatus } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-Memory persistent store for runtime
let products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let coupons: Coupon[] = JSON.parse(JSON.stringify(INITIAL_COUPONS));
let orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));

// -------------------------------------------------------------
// Products API
// -------------------------------------------------------------
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, isNew, isSale, isBestSeller, minPrice, maxPrice, inStockOnly } = req.query;

  let filtered = [...products].filter(p => p.isActive !== false);

  if (category && category !== 'all' && category !== 'new') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (category === 'new' || isNew === 'true') {
    filtered = filtered.filter(p => p.isNew);
  }

  if (isSale === 'true') {
    filtered = filtered.filter(p => p.isSale);
  }

  if (isBestSeller === 'true') {
    filtered = filtered.filter(p => p.isBestSeller);
  }

  if (inStockOnly === 'true') {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.titleTh.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.descriptionTh.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sort === 'best_seller') {
    filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Admin add product
app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: `cs-prod-${Date.now().toString().slice(-4)}`,
    titleTh: req.body.titleTh || 'สินค้าใหม่',
    titleEn: req.body.titleEn || 'New Product',
    descriptionTh: req.body.descriptionTh || '',
    descriptionEn: req.body.descriptionEn || '',
    category: req.body.category || 'crop_top',
    price: Number(req.body.price) || 390,
    compareAtPrice: req.body.compareAtPrice ? Number(req.body.compareAtPrice) : undefined,
    discountPercent: req.body.discountPercent ? Number(req.body.discountPercent) : 0,
    stock: Number(req.body.stock) || 0,
    images: req.body.images && req.body.images.length ? req.body.images : ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'],
    colors: req.body.colors || [{ nameTh: 'ชมพูพาสเทล', nameEn: 'Baby Pink', hex: '#f9a8d4' }],
    sizes: req.body.sizes || ['S', 'M', 'L'],
    sizeChart: req.body.sizeChart || [
      { size: 'S', bust: '32-34"', length: '15.0"' },
      { size: 'M', bust: '34-36"', length: '15.5"' }
    ],
    isNew: req.body.isNew !== undefined ? req.body.isNew : true,
    isSale: req.body.isSale || false,
    isBestSeller: req.body.isBestSeller || false,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    rating: 5.0,
    reviewCount: 1,
    materialTh: req.body.materialTh || 'Premium Cotton',
    materialEn: req.body.materialEn || 'Premium Cotton',
  };

  products.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// Admin update product
app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: Number(req.body.price ?? products[index].price),
    stock: Number(req.body.stock ?? products[index].stock),
    compareAtPrice: req.body.compareAtPrice !== undefined ? Number(req.body.compareAtPrice) : products[index].compareAtPrice,
    discountPercent: req.body.discountPercent !== undefined ? Number(req.body.discountPercent) : products[index].discountPercent,
  };

  res.json({ success: true, data: products[index] });
});

// Admin delete product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const deleted = products.splice(index, 1);
  res.json({ success: true, data: deleted[0] });
});

// -------------------------------------------------------------
// Coupons API
// -------------------------------------------------------------
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json({ success: true, data: coupons });
});

app.get('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.query;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const sub = Number(subtotal) || 0;
  const coupon = coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'ไม่พบคูปองส่วนลดนี้ (Coupon not found)' });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ success: false, message: 'คูปองนี้หมดอายุหรือไม่สามารถใช้งานได้แล้ว' });
  }

  if (coupon.usageCount >= coupon.maxUsage) {
    return res.status(400).json({ success: false, message: 'คูปองนี้ถูกใช้สิทธิ์ครบตามจำนวนที่กำหนดแล้ว' });
  }

  if (sub < coupon.minPurchase) {
    return res.status(400).json({ 
      success: false, 
      message: `ยอดสั่งซื้อขั้นต่ำสำหรับคูปองนี้คือ ฿${coupon.minPurchase.toLocaleString()} (Min order ฿${coupon.minPurchase})` 
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percent') {
    discountAmount = Math.round((sub * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    success: true,
    data: {
      coupon,
      discountAmount,
      finalTotal: Math.max(0, sub - discountAmount)
    }
  });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const newCoupon: Coupon = {
    id: `cp-${Date.now().toString().slice(-4)}`,
    code: req.body.code.toUpperCase().trim(),
    discountType: req.body.discountType || 'percent',
    discountValue: Number(req.body.discountValue) || 10,
    minPurchase: Number(req.body.minPurchase) || 0,
    maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined,
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    endDate: req.body.endDate || '2026-12-31',
    usageCount: 0,
    maxUsage: Number(req.body.maxUsage) || 100,
    isActive: true,
    descriptionTh: req.body.descriptionTh || `ส่วนลด ${req.body.code}`,
    descriptionEn: req.body.descriptionEn || `Discount ${req.body.code}`
  };

  coupons.push(newCoupon);
  res.status(201).json({ success: true, data: newCoupon });
});

// -------------------------------------------------------------
// Orders & Stock Management API
// -------------------------------------------------------------
app.get('/api/orders', (req: Request, res: Response) => {
  const { email, status } = req.query;
  let filtered = [...orders];

  if (email) {
    filtered = filtered.filter(o => 
      (o.customer?.email?.toLowerCase() === String(email).toLowerCase()) ||
      (o.email?.toLowerCase() === String(email).toLowerCase())
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(o => (o.orderStatus === status || o.status === status));
  }

  // Newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id || o.trackingNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.get('/api/orders/track/:id', (req: Request, res: Response) => {
  const query = req.params.id.trim().toLowerCase();
  const order = orders.find(o => 
    o.id.toLowerCase() === query || 
    (o.trackingNumber && o.trackingNumber.toLowerCase() === query)
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'ไม่พบหมายเลขคำสั่งซื้อหรือ Tracking Number นี้' });
  }

  res.json({ success: true, data: order });
});

// Real checkout order placement with strict stock deduction
app.post('/api/orders', (req: Request, res: Response) => {
  const { 
    customer, 
    customerName,
    shippingAddress, 
    shippingCarrier, 
    shippingMethod,
    paymentMethod, 
    paymentDetails, 
    items, 
    couponCode,
    appliedCoupon,
    subtotal: clientSubtotal,
    discount: clientDiscount,
    shippingFee: clientShippingFee,
    total: clientTotal
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'ไม่มีสินค้าในตะกร้า (Cart is empty)' });
  }

  // 1. Stock Check
  for (const item of items) {
    const prodId = item.productId || item.product?.id;
    const product = products.find(p => p.id === prodId);
    if (!product) {
      return res.status(400).json({ success: false, message: `ไม่พบสินค้า ${item.titleTh || prodId}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `สินค้า "${product.titleTh}" มีสต็อกเหลือเพียง ${product.stock} ชิ้น ไม่เพียงพอกับจำนวนที่สั่ง (${item.quantity} ชิ้น)` 
      });
    }
  }

  // 2. Deduct Stock
  for (const item of items) {
    const prodId = item.productId || item.product?.id;
    const productIndex = products.findIndex(p => p.id === prodId);
    if (productIndex !== -1) {
      products[productIndex].stock = Math.max(0, products[productIndex].stock - item.quantity);
    }
  }

  // 3. Calculate Totals
  const subtotal = clientSubtotal ?? items.reduce((sum: number, it: any) => sum + (it.unitPrice * it.quantity), 0);
  let discount = clientDiscount ?? 0;

  if (couponCode && !clientDiscount) {
    const coupon = coupons.find(c => c.code.toUpperCase() === String(couponCode).toUpperCase());
    if (coupon && coupon.isActive && subtotal >= coupon.minPurchase) {
      if (coupon.discountType === 'percent') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
      coupon.usageCount += 1;
    }
  }

  const shipping = shippingMethod || shippingCarrier || SHIPPING_CARRIERS[0];
  const shippingFee = clientShippingFee ?? (subtotal >= 990 ? 0 : (shipping?.price || 35));
  const grandTotal = clientTotal ?? Math.max(0, subtotal - discount + shippingFee);

  // Generate unique Order ID
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `CS-${todayStr}-${randomSuffix}`;
  const trackingNumber = `TH-${shipping?.id?.toUpperCase() || 'FLASH'}-${Date.now().toString().slice(-8)}`;

  const newOrder: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customerName: customerName || customer?.name || shippingAddress?.fullName || 'Customer',
    email: customer?.email || shippingAddress?.email || 'customer@example.com',
    phone: customer?.phone || shippingAddress?.phone || '0891234567',
    customer: customer || {
      name: customerName || shippingAddress?.fullName || 'Customer',
      phone: shippingAddress?.phone || '0891234567',
      email: shippingAddress?.email || 'customer@example.com'
    },
    shippingAddress: shippingAddress || {
      addressLine1: '99/123 ซอย 5',
      district: 'วัฒนา',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110'
    },
    shippingCarrier: shipping,
    shippingMethod: shipping,
    paymentMethod: paymentMethod || 'promptpay_qr',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'paid',
    status: 'paid',
    paymentDetails: paymentDetails || { promptpayRef: `PP-${randomSuffix}` },
    items,
    subtotal,
    discount,
    appliedCoupon: appliedCoupon || undefined,
    couponCode: discount > 0 ? (couponCode || appliedCoupon?.code) : undefined,
    shippingFee,
    grandTotal,
    total: grandTotal,
    trackingNumber,
    carrierName: shipping?.nameTh || shipping?.name || 'Flash Express',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        noteTh: 'ระบบได้รับคำสั่งซื้อแล้ว',
        noteEn: 'Order received by Cozy Select system'
      },
      {
        status: paymentMethod === 'cod' ? 'processing' : 'paid',
        timestamp: new Date().toISOString(),
        noteTh: paymentMethod === 'cod' ? 'คำสั่งซื้อชำระเงินปลายทาง กำลังเตรียมจัดส่ง' : 'ชำระเงินสำเร็จแล้ว ระบบกำลังส่งต่อให้ฝ่ายแพ็กสินค้า',
        noteEn: paymentMethod === 'cod' ? 'Cash on Delivery confirmed, preparing for shipment' : 'Payment confirmed, preparing for fulfillment'
      }
    ]
  };

  orders.unshift(newOrder);

  // If user doesn't exist in customer list, add them
  if (newOrder.email) {
    const existing = users.find(u => u.email.toLowerCase() === newOrder.email?.toLowerCase());
    if (!existing) {
      users.push({
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: newOrder.customerName || 'Customer',
        email: newOrder.email,
        phone: newOrder.phone || '',
        role: 'customer',
        address: shippingAddress,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.status(201).json({ success: true, data: newOrder });
});

// Update order status (Admin)
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, noteTh, noteEn } = req.body;
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const prevStatus = orders[index].orderStatus || orders[index].status;
  const nextStatus = (status as string).toLowerCase() as OrderStatus;

  // Auto-replenish stock if order is cancelled
  if (nextStatus === 'cancelled' && prevStatus !== 'cancelled') {
    for (const item of orders[index].items) {
      const prodId = item.productId || item.product?.id;
      const pIdx = products.findIndex(p => p.id === prodId);
      if (pIdx !== -1) {
        products[pIdx].stock += item.quantity;
      }
    }
  }

  orders[index].orderStatus = nextStatus;
  orders[index].status = nextStatus;
  if (!orders[index].statusHistory) orders[index].statusHistory = [];
  orders[index].statusHistory.push({
    status: nextStatus,
    timestamp: new Date().toISOString(),
    noteTh: noteTh || `เปลี่ยนสถานะเป็น ${nextStatus}`,
    noteEn: noteEn || `Status updated to ${nextStatus}`
  });

  res.json({ success: true, data: orders[index] });
});

// Admin Stats
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const today = new Date().toISOString().slice(0, 10);
  
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today) && o.orderStatus !== 'cancelled');
  const todaySales = todayOrders.reduce((sum, o) => sum + (o.total || o.grandTotal || 0), 0);

  const monthSales = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || o.grandTotal || 0), 0);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const soldOutCount = products.filter(p => p.stock === 0).length;

  const salesHistory = [
    { date: '21 ส.ค.', sales: 12400, orders: 15 },
    { date: '22 ส.ค.', sales: 18900, orders: 22 },
    { date: '23 ส.ค.', sales: 24500, orders: 28 },
    { date: '24 ส.ค.', sales: 19800, orders: 21 },
    { date: '25 ส.ค.', sales: 28400, orders: 34 },
    { date: '26 ส.ค.', sales: 32900, orders: 39 },
    { date: '27 ส.ค.', sales: 21500 + todaySales, orders: 24 + todayOrders.length },
  ];

  const topProducts = products.slice(0, 5).map(p => ({
    id: p.id,
    title: p.titleTh,
    image: p.images[0],
    salesCount: Math.floor(p.price * 0.12) + (p.isBestSeller ? 25 : 5),
    revenue: (Math.floor(p.price * 0.12) + (p.isBestSeller ? 25 : 5)) * p.price
  }));

  res.json({
    success: true,
    data: {
      todaySales,
      monthSales,
      totalOrders: orders.length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      totalProducts: products.length,
      lowStockCount,
      soldOutCount,
      salesHistory,
      topProducts
    }
  });
});

// Product Reviews
app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, userName, rating, comment } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    userName: userName || 'Customer',
    rating: Number(rating) || 5,
    comment: comment || 'เนื้อผ้าดีมาก สวยตรงปก ชอบมากๆ ค่ะ',
    date: new Date().toISOString().slice(0, 10),
    verifiedPurchase: true
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);
  product.reviewCount += 1;
  const avg = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  product.rating = Number(avg.toFixed(1));

  res.status(201).json({ success: true, data: product });
});

// -------------------------------------------------------------
// Vite Middleware / Production Static Fallback
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cozy Select Server running on http://localhost:${PORT}`);
  });
}

startServer();
