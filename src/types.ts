export type Language = 'th' | 'en';
export type ThemeMode = 'light' | 'dark';

export type ProductCategory = 
  | 'all'
  | 'new'
  | 'sale'
  | 'hoodie'
  | 'tee_top'
  | 'accessories'
  | 'crop_top'
  | 'baby_tees'
  | 'tank_tops'
  | 't_shirts'
  | 'pants';

export type ProductSortOption = 
  | 'recommended'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'best_seller';

export interface ProductColor {
  nameTh: string;
  nameEn: string;
  hex: string;
}

export interface SizeChartEntry {
  size: string;
  bust?: string;
  length: string;
  shoulder?: string;
  waist?: string;
  hip?: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  category: ProductCategory | string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  stock: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  sizeChart: SizeChartEntry[];
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  materialTh?: string;
  materialEn?: string;
  careInstructionsTh?: string;
  careInstructionsEn?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountValue: number; // e.g. 10 for 10% or 100 for 100 THB
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
  descriptionTh: string;
  descriptionEn: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'pending'
  | 'paid'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ShippingMethod {
  id: string;
  name: string;
  nameTh: string;
  nameEn: string;
  price: number;
  fee?: number;
  estimatedDaysTh: string;
  estimatedDaysEn: string;
  icon?: string;
}

export type ShippingCarrier = ShippingMethod;

export type PaymentMethod = 
  | 'promptpay'
  | 'promptpay_qr'
  | 'credit_card'
  | 'mobile_banking'
  | 'cod';

export interface ShippingAddress {
  fullName?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  houseNo?: string;
  moo?: string;
  road?: string;
  subdistrict?: string;
  subDistrict?: string;
  district: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  productId: string;
  titleTh: string;
  titleEn: string;
  image: string;
  color: ProductColor;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  noteTh: string;
  noteEn: string;
}

export interface Order {
  id: string;
  trackingNumber?: string;
  carrierName?: string;
  customerName?: string;
  customer?: CustomerInfo;
  email?: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  shippingCarrier?: ShippingCarrier;
  shippingMethod?: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardLast4?: string;
    cardHolder?: string;
    bankName?: string;
    promptpayRef?: string;
    paidAt?: string;
  };
  paymentStatus?: 'pending' | 'paid' | 'failed';
  orderStatus?: OrderStatus;
  status?: OrderStatus;
  items: CartItem[] | OrderItem[] | any[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  grandTotal?: number;
  total: number;
  appliedCoupon?: Coupon;
  createdAt: string;
  statusHistory?: StatusHistoryEntry[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: ShippingAddress;
  createdAt: string;
}

export interface AdminStats {
  todaySales: number;
  monthSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  soldOutCount: number;
  salesHistory: {
    date: string;
    sales: number;
    orders: number;
  }[];
  topProducts: {
    id: string;
    title: string;
    image: string;
    salesCount: number;
    revenue: number;
  }[];
}
