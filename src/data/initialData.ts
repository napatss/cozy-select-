import { Product, Coupon, ShippingCarrier, Order, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'cs-prod-001',
    titleTh: 'Blush Camo Hoodie',
    titleEn: 'Blush Camo Cropped Hoodie',
    descriptionTh: 'เสื้อฮู้ดดี้แขนยาวลายพรางสีชมพูสุดชิค ทรงครอป ผ้าวอร์มนุ่มใส่สบาย ดีไซน์ Y2K Street style',
    descriptionEn: 'Chic blush pink camo cropped hoodie. Ultra soft cotton fleece with relaxed streetwear silhouette.',
    category: 'hoodie',
    price: 690,
    compareAtPrice: 890,
    discountPercent: 18,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูพราง', nameEn: 'Blush Camo', hex: '#f472b6' },
      { nameTh: 'ขาวมุก', nameEn: 'Pearl White', hex: '#ffffff' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '36"', length: '16.5"', shoulder: '18"' },
      { size: 'M', bust: '38"', length: '17.0"', shoulder: '19"' },
      { size: 'L', bust: '40"', length: '17.5"', shoulder: '20"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 48
  },
  {
    id: 'cs-prod-002',
    titleTh: 'Candy Halter Top',
    titleEn: 'Candy Halter Top',
    descriptionTh: 'เสื้อสายเดี่ยวคล้องคอสไตล์เกาหลี สกรีนลาย Candy สุดหวาน ทรงครอปเข้ารูป ผ้าคอตตอนยืดกระชับสัดส่วน',
    descriptionEn: 'Sweet Y2K halter neck top with iconic Candy typography and black contrast piping.',
    category: 'tee_top',
    price: 590,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ขาวตัดดำ', nameEn: 'White/Black', hex: '#ffffff' },
      { nameTh: 'ชมพูพาสเทล', nameEn: 'Baby Pink', hex: '#fbcfe8' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '14.0"' },
      { size: 'M', bust: '33-35"', length: '14.5"' },
      { size: 'L', bust: '35-37"', length: '15.0"' }
    ],
    isNew: true,
    isSale: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 35
  },
  {
    id: 'cs-prod-003',
    titleTh: 'Butterfly in the Mirror Cami',
    titleEn: 'Butterfly in the Mirror Cami',
    descriptionTh: 'เสื้อสายเดี่ยวลูกไม้หวานละมุน ลายผีเสื้อวินเทจในกระจก ดีเทลชายระบาย ชวนฝัน สไตล์ Fairycore Y2K',
    descriptionEn: 'Vintage fairycore butterfly mirror print camisole with delicate lace trim and flutter hem.',
    category: 'tee_top',
    price: 450,
    compareAtPrice: 590,
    discountPercent: 24,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูวินเทจ', nameEn: 'Dusty Pink', hex: '#f472b6' },
      { nameTh: 'ครีมงาช้าง', nameEn: 'Ivory', hex: '#fdfbf7' }
    ],
    sizes: ['XS', 'S', 'M'],
    sizeChart: [
      { size: 'XS', bust: '30-32"', length: '15.0"' },
      { size: 'S', bust: '32-34"', length: '15.5"' },
      { size: 'M', bust: '34-36"', length: '16.0"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 42
  },
  {
    id: 'cs-prod-004',
    titleTh: 'Rockstar Off-Shoulder Tee',
    titleEn: 'Rockstar Off-Shoulder Tee',
    descriptionTh: 'เสื้อยืดปาดไหล่สไตล์ Rockstar Grunge ผ้านุ่มทิ้งตัว สกรีนลายกราฟิก Y2K เก๋ไก๋สะดุดตา',
    descriptionEn: 'Asymmetrical off-shoulder punk rock aesthetic tee with edgy graphic print and contrast stripes.',
    category: 'tee_top',
    price: 520,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ขาว-ดำ', nameEn: 'White/Black', hex: '#18181b' },
      { nameTh: 'ชมพูเข้ม', nameEn: 'Hot Pink', hex: '#ec4899' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '32-35"', length: '19.0"' },
      { size: 'M', bust: '35-38"', length: '19.5"' },
      { size: 'L', bust: '38-41"', length: '20.0"' }
    ],
    isNew: false,
    isSale: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 39
  },
  {
    id: 'cs-prod-005',
    titleTh: 'Pink Blossom Cami',
    titleEn: 'Pink Blossom Cami',
    descriptionTh: 'เสื้อสายเดี่ยวแต่งระบายลายดอกซากุระหวานแหวว ผ้าริบบิ้นผูกไหล่ สดใสสไตล์สาวเกาหลี',
    descriptionEn: 'Delicate floral pattern cami with adjustable ribbon tie shoulders and tiered ruffles.',
    category: 'tee_top',
    price: 490,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูบลอสซัม', nameEn: 'Blossom Pink', hex: '#fda4af' }
    ],
    sizes: ['S', 'M'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '16.0"' },
      { size: 'M', bust: '33-35"', length: '16.5"' }
    ],
    isNew: true,
    isSale: false,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 27
  },
  {
    id: 'cs-prod-006',
    titleTh: 'Ribbon French Sweetheart Crop (เสื้อครอปแต่งโบว์ริบบิ้น)',
    titleEn: 'French Sweetheart Ribbon Tie Crop Blouse',
    descriptionTh: 'เสื้อครอปคอเหลี่ยมสวีทฮาร์ท แต่งดีเทลริบบิ้นชมพูผูกไขว้ด้านหน้า แขนตุ๊กตาน่ารัก ให้ลุคคุณหนูเกาหลีสุดหวาน',
    descriptionEn: 'Victorian sweetheart neckline cropped blouse with dainty ribbon lace-up corset accent and soft puff sleeves.',
    category: 'crop_top',
    price: 490,
    compareAtPrice: 690,
    discountPercent: 29,
    stock: 4, // LOW STOCK TEST
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูกลีบบัว', nameEn: 'Lotus Pink', hex: '#f472b6' },
      { nameTh: 'ขาวบริสุทธิ์', nameEn: 'Pure White', hex: '#ffffff' }
    ],
    sizes: ['S', 'M'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '14.0"', waist: '24-26"' },
      { size: 'M', bust: '33-35"', length: '14.5"', waist: '26-28"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 19
  },
  {
    id: 'cs-prod-007',
    titleTh: 'Cherry Glitter Cute Baby Tee (เบบี้ทีเชอร์รี่กลิตเตอร์)',
    titleEn: 'Glitter Cherry Icon Y2K Fitted Baby Tee',
    descriptionTh: 'เสื้อเบบี้ทียอดฮิตสกรีนลายผลเชอร์รี่คู่เคลือบกลิตเตอร์ประกายเพชร สวยหวานซ่อนเปรี้ยว สไตล์ไอดอลเกาหลี',
    descriptionEn: 'Playful Y2K baby tee with sparkling dual cherry motif in textured crystal glitter. Slim fitted cut.',
    category: 'baby_tees',
    price: 420,
    compareAtPrice: 490,
    discountPercent: 14,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ขาวตัดขอบแดง', nameEn: 'White/Cherry Red', hex: '#ffe4e6' },
      { nameTh: 'ชมพูพาสเทล', nameEn: 'Baby Pink', hex: '#fbcfe8' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    sizeChart: [
      { size: 'XS', bust: '30-32"', length: '16.5"' },
      { size: 'S', bust: '32-34"', length: '17.0"' },
      { size: 'M', bust: '34-36"', length: '17.5"' },
      { size: 'L', bust: '36-38"', length: '18.0"' }
    ],
    isNew: true,
    isSale: false,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 52
  },
  {
    id: 'cs-prod-008',
    titleTh: 'Basic Ribbed Square-Neck Tank (เสื้อกล้ามคอเหลี่ยมผ้าผ่อง)',
    titleEn: 'Seamless Square-Neck Ribbed Tank Top',
    descriptionTh: 'เสื้อกล้ามคอเหลี่ยมรุ่นขายดี ตัดเย็บไร้รอยต่อ ผ้าเรยอนผสมคอตตอนกระชับทรงสวย ใส่เป็นซับในหรือใส่เดี่ยวก็หรูดูแพง',
    descriptionEn: 'Essential square neck seamless tank with sculpting double-layer contouring. Silky soft ribbed finish.',
    category: 'tank_tops',
    price: 320,
    compareAtPrice: 420,
    discountPercent: 24,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ดำนัวร์', nameEn: 'Onyx Black', hex: '#0f172a' },
      { nameTh: 'ขาวครีม', nameEn: 'Cream', hex: '#fefce8' },
      { nameTh: 'ชมพูกุหลาบ', nameEn: 'Rose', hex: '#fda4af' },
      { nameTh: 'เทาอ่อน', nameEn: 'Heather Grey', hex: '#e2e8f0' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '30-33"', length: '18.0"' },
      { size: 'M', bust: '33-36"', length: '18.5"' },
      { size: 'L', bust: '36-39"', length: '19.0"' }
    ],
    isNew: false,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 88
  },
  {
    id: 'cs-prod-009',
    titleTh: 'High-Waist Washed Denim Jeans (กางเกงยีนส์ฟอกทรงกระบอกตรง)',
    titleEn: 'Vintage Washed High-Waist Straight Leg Jeans',
    descriptionTh: 'กางเกงยีนส์เอวสูงฟอกสีวินเทจ ทรงกระบอกตรงเก็บทรงเอวและสะโพก ขาเรียวยาวสไตล์สตรีทเกาหลี ผ้ายีนส์พรีเมียมไม่แข็งกระด้าง',
    descriptionEn: 'High rise vintage blue wash rigid denim with straight leg cut. Elongating silhouette tailored for everyday elegance.',
    category: 'pants',
    price: 890,
    compareAtPrice: 1190,
    discountPercent: 25,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ยีนส์ฟอกอ่อน', nameEn: 'Light Vintage Blue', hex: '#93c5fd' },
      { nameTh: 'ยีนส์ฟอกเข้ม', nameEn: 'Classic Dark Denim', hex: '#1e3a8a' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'S', waist: '24-25"', hip: '34-36"', length: '39.5"' },
      { size: 'M', waist: '26-27"', hip: '36-38"', length: '40.0"' },
      { size: 'L', waist: '28-29"', hip: '38-40"', length: '40.5"' },
      { size: 'XL', waist: '30-31"', hip: '40-42"', length: '41.0"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: 'cs-prod-010',
    titleTh: 'Pleated Mini Skort Pants (กางเกงกระโปรงพลีทมินิ)',
    titleEn: 'Korean Y2K Pleated Tennis Mini Skort',
    descriptionTh: 'กางเกงกระโปรงพลีทสั้น มีซับในกางเกงกันโป๊ในตัว ดีเทลเข็มขัดคู่สไตล์ Y2K น่ารัก ปลอดภัยคล่องตัวทุกการเคลื่อนไหว',
    descriptionEn: 'High waist knife-pleated skirt with built-in safety inner shorts. Dual silver buckle belt detail for cute preppy aesthetic.',
    category: 'pants',
    price: 590,
    compareAtPrice: 790,
    discountPercent: 25,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูคอตตอนแคนดี้', nameEn: 'Cotton Pink', hex: '#fbcfe8' },
      { nameTh: 'ดำมิดไนท์', nameEn: 'Midnight Black', hex: '#0f172a' },
      { nameTh: 'เทานักเรียน', nameEn: 'Preppy Grey', hex: '#64748b' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', waist: '24-26"', hip: '34-36"', length: '14.0"' },
      { size: 'M', waist: '26-28"', hip: '36-38"', length: '14.5"' },
      { size: 'L', waist: '28-30"', hip: '38-40"', length: '15.0"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.7,
    reviewCount: 23
  },
  {
    id: 'cs-prod-011',
    titleTh: 'Crossed Halter Neck Crop Top (เสื้อครอปคล้องคอผูกหลัง)',
    titleEn: 'Cross-Front Halter Neck Knit Crop Top',
    descriptionTh: 'เสื้อครอปคล้องคอไขว้หน้า โชว์หลังเซ็กซี่เบาๆ สไตล์สาวเกาหลี ผ้าไหมพรมทอแน่น กระชับรอบตัว ใส่เที่ยวคาเฟ่หรือปาร์ตี้ก็เด่น',
    descriptionEn: 'Chic crisscross front halter neck with open back tie. Soft ribbed stretchy knit designed to contour effortlessly.',
    category: 'crop_top',
    price: 360,
    compareAtPrice: 480,
    discountPercent: 25,
    stock: 0, // SOLD OUT TEST
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูโรสโกลด์', nameEn: 'Rose Gold', hex: '#fb7185' },
      { nameTh: 'ขาวไอซ์', nameEn: 'Ice White', hex: '#f8fafc' }
    ],
    sizes: ['S', 'M'],
    sizeChart: [
      { size: 'S', bust: '30-34"', length: '13.5"' },
      { size: 'M', bust: '34-37"', length: '14.0"' }
    ],
    isNew: false,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.6,
    reviewCount: 14
  },
  {
    id: 'cs-prod-012',
    titleTh: 'Butterflies in Tokyo Baby Tee (เบบี้ทีผีเสื้อโตเกียว)',
    titleEn: 'Tokyo Butterfly Nostalgia Contrast Baby Tee',
    descriptionTh: 'เสื้อเบบี้ทีสกรีนลายผีเสื้อและตัวอักษรภาษาญี่ปุ่น แต่งคอและแขนสลับสีสไตล์สาวฮาราจุกุ ผ้านุ่มระบายอากาศดี ไม่ร้อน',
    descriptionEn: 'Harajuku-inspired graphic baby tee with metallic iridescent butterfly print and contrast ringer trim.',
    category: 'baby_tees',
    price: 390,
    compareAtPrice: 490,
    discountPercent: 20,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ขาวขอบชมพู', nameEn: 'White/Pink', hex: '#fce7f3' },
      { nameTh: 'ดำขอบขาว', nameEn: 'Black/White', hex: '#0f172a' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '17.0"' },
      { size: 'M', bust: '33-35"', length: '17.5"' },
      { size: 'L', bust: '35-37"', length: '18.0"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 38
  },
  {
    id: 'cs-prod-013',
    titleTh: 'Sweet Asymmetrical Ruched Tank (เสื้อสายเดี่ยวดึงรั้งข้าง)',
    titleEn: 'Asymmetrical Ruched Side Draped Camisole',
    descriptionTh: 'เสื้อสายเดี่ยวดีเทลรูดเชือกข้าง ปรับความยาวได้ตามชอบ เนื้อผ้าเรยอนเกรดพรีเมียม ทิ้งตัวสวย หรูหราและเซ็กซี่ในลุคเดียว',
    descriptionEn: 'Flattering side-drawstring ruched cami with asymmetric hemline. Drapes gracefully on all body shapes.',
    category: 'tank_tops',
    price: 380,
    compareAtPrice: 450,
    discountPercent: 15,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูบลัช', nameEn: 'Blush Pink', hex: '#f43f5e' },
      { nameTh: 'ขาวมุก', nameEn: 'Pearl White', hex: '#ffffff' },
      { nameTh: 'ดำชาโคล', nameEn: 'Charcoal', hex: '#1e293b' }
    ],
    sizes: ['Free Size'],
    sizeChart: [
      { size: 'Free Size', bust: '30-36"', length: '17-21" (Adjustable)' }
    ],
    isNew: false,
    isSale: false,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 16
  },
  {
    id: 'cs-prod-014',
    titleTh: 'Seoul Art Club Oversized Tee (เสื้อยืดสกรีน Seoul Art)',
    titleEn: 'Seoul Art Club Oversized Washed Vintage Tee',
    descriptionTh: 'เสื้อยืดโอเวอร์ไซส์ลายกราฟิก Seoul Art Club ดีไซน์แนวสตรีทเกาหลี ผ้ายีนส์ฟอกวินเทจนิดๆ ใส่สบายแมตช์ได้กับทุกชุด',
    descriptionEn: 'Vintage acid washed oversized graphic tee commemorating Seoul indie art gallery aesthetics.',
    category: 't_shirts',
    price: 520,
    compareAtPrice: 650,
    discountPercent: 20,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'เทาฟอกวินเทจ', nameEn: 'Washed Grey', hex: '#475569' },
      { nameTh: 'ขาวหม่น', nameEn: 'Vintage White', hex: '#f1f5f9' }
    ],
    sizes: ['Free Size', 'Oversize XL'],
    sizeChart: [
      { size: 'Free Size', bust: '44-46"', length: '28.5"', shoulder: '21"' },
      { size: 'Oversize XL', bust: '48-50"', length: '30.0"', shoulder: '22.5"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 30
  },
  {
    id: 'cs-prod-015',
    titleTh: 'Drawstring Parachute Pants (กางเกงพาราชูตขายาว)',
    titleEn: 'Korean Parachute Balloon Drawstring Pants',
    descriptionTh: 'กางเกงพาราชูตผ้าร่มเนื้อแมตต์พรีเมียม สไตล์เกาหลี เอวและปลายขามีเชือกรูดปรับทรงบอลลูนหรือขากระบอกได้ตามใจชอบ',
    descriptionEn: 'Matte technical parachute pants with bungee cord cinch cords at waist and hems for customizable volume.',
    category: 'pants',
    price: 750,
    compareAtPrice: 950,
    discountPercent: 21,
    stock: 2, // LOW STOCK TEST
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูพาสเทล', nameEn: 'Pastel Rose', hex: '#fbcfe8' },
      { nameTh: 'ขาวสโนว์', nameEn: 'Snow White', hex: '#ffffff' },
      { nameTh: 'ดำสนิท', nameEn: 'Jet Black', hex: '#09090b' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', waist: '24-28"', hip: '38-40"', length: '40.0"' },
      { size: 'M', waist: '27-31"', hip: '40-42"', length: '40.5"' },
      { size: 'L', waist: '30-34"', hip: '42-44"', length: '41.0"' }
    ],
    isNew: false,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 27
  },
  {
    id: 'cs-prod-016',
    titleTh: 'Corset Lace-Up Knit Crop (เสื้อครอปคอร์เซ็ทไหมพรม)',
    titleEn: 'Corset Boned Detail Rib Knit Cropped Top',
    descriptionTh: 'เสื้อครอปไหมพรมดีเทลคอร์เซ็ทเก็บทรงเอว S-Line สวยเป๊ะ ผ้าไหมพรมยืดหยุ่นสูง สวมใส่สบายไม่อึดอัด',
    descriptionEn: 'Sculpted waist corset stitch detail crop top made of luxurious ultra-fine stretch ribbing.',
    category: 'crop_top',
    price: 450,
    compareAtPrice: 590,
    discountPercent: 24,
    stock: 13,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูหวาน', nameEn: 'Sweet Pink', hex: '#f472b6' },
      { nameTh: 'ขาวครีม', nameEn: 'Cream', hex: '#fefce8' },
      { nameTh: 'ดำคลาสสิก', nameEn: 'Black', hex: '#0f172a' }
    ],
    sizes: ['XS', 'S', 'M'],
    sizeChart: [
      { size: 'XS', bust: '30-32"', length: '14.0"', waist: '23-25"' },
      { size: 'S', bust: '32-34"', length: '14.5"', waist: '25-27"' },
      { size: 'M', bust: '34-36"', length: '15.0"', waist: '27-29"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.9,
    reviewCount: 21
  },
  {
    id: 'cs-prod-017',
    titleTh: 'Bows & Hearts Sparkle Baby Tee (เบบี้ทีโบว์และหัวใจ)',
    titleEn: 'Bows & Hearts Sparkle Rhinestone Baby Tee',
    descriptionTh: 'เสื้อเบบี้ทีลายโบว์และหัวใจประดับเพชรคริสตัลเงาวับ น่ารักระดับพรีเมียม สไตล์ Y2K Romance ยอดฮิตใน TikTok',
    descriptionEn: 'Viral TikTok Y2K baby tee embellished with glimmering silver heart and ribbon bow crystals.',
    category: 'baby_tees',
    price: 430,
    compareAtPrice: 520,
    discountPercent: 17,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูคอตตอน', nameEn: 'Cotton Pink', hex: '#fbcfe8' },
      { nameTh: 'ขาวไวท์', nameEn: 'Bright White', hex: '#ffffff' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '17.0"' },
      { size: 'M', bust: '33-35"', length: '17.5"' },
      { size: 'L', bust: '35-37"', length: '18.0"' }
    ],
    isNew: true,
    isSale: false,
    isBestSeller: true,
    isActive: true,
    rating: 5.0,
    reviewCount: 47
  },
  {
    id: 'cs-prod-018',
    titleTh: 'Sweet Bow Spaghetti Tank (เสื้อสายเดี่ยวเส้นสปาเก็ตตี้ผูกโบว์)',
    titleEn: 'Dainty Spaghetti Bow Tie Sweet Camisole',
    descriptionTh: 'เสื้อสายเดี่ยวเส้นสปาเก็ตตี้เส้นเล็ก แต่งโบว์น่ารักที่สายไหล่ ปรับระดับได้ ผ้าชีฟอง 2 ชั้นนุ่มนวล พลิ้วไหวรับลม',
    descriptionEn: 'Double-layered chiffon camisole with adjustable self-tie ribbon shoulder straps. Ultra feminine silhouette.',
    category: 'tank_tops',
    price: 350,
    compareAtPrice: 420,
    discountPercent: 16,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ชมพูพีช', nameEn: 'Peach Pink', hex: '#fed7aa' },
      { nameTh: 'ขาวงาช้าง', nameEn: 'Ivory', hex: '#fefce8' },
      { nameTh: 'ดำนัวร์', nameEn: 'Noir', hex: '#0f172a' }
    ],
    sizes: ['S', 'M'],
    sizeChart: [
      { size: 'S', bust: '31-33"', length: '15.5"' },
      { size: 'M', bust: '33-35"', length: '16.0"' }
    ],
    isNew: false,
    isSale: false,
    isBestSeller: false,
    isActive: true,
    rating: 4.7,
    reviewCount: 15
  },
  {
    id: 'cs-prod-019',
    titleTh: 'Minimalist Tokyo Aesthetic Tee (เสื้อยืดมินิมอลโตเกียว)',
    titleEn: 'Tokyo Minimalist Typography Cotton Tee',
    descriptionTh: 'เสื้อยืดพิมพ์ลายตัวอักษรเรียบหรูสไตล์โตเกียวมินิมอล ใส่ได้ทั้งหญิงและชาย แมตช์กับลุคเรียบเท่ได้อย่างลงตัว',
    descriptionEn: 'Clean minimalist Tokyo typography graphic tee. Heavyweight organic cotton for structured drape.',
    category: 't_shirts',
    price: 460,
    compareAtPrice: 550,
    discountPercent: 16,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ขาวคลีน', nameEn: 'Clean White', hex: '#ffffff' },
      { nameTh: 'เทาเฮเธอร์', nameEn: 'Heather Grey', hex: '#cbd5e1' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: [
      { size: 'S', bust: '38-40"', length: '26.5"', shoulder: '18"' },
      { size: 'M', bust: '41-43"', length: '27.5"', shoulder: '19"' },
      { size: 'L', bust: '44-46"', length: '28.5"', shoulder: '20"' },
      { size: 'XL', bust: '47-49"', length: '29.5"', shoulder: '21"' }
    ],
    isNew: false,
    isSale: true,
    isBestSeller: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 32
  },
  {
    id: 'cs-prod-020',
    titleTh: 'Flared Slit Leggings (กางเกงเลกกิ้งขาม้าผ่าหน้าสไตล์เกาหลี)',
    titleEn: 'Korean High-Waisted Front Slit Flare Leggings',
    descriptionTh: 'กางเกงเลกกิ้งเอวสูงทรงขาม้า ดีเทลผ่าหน้าปลายขา ช่วยให้ขาดูยาวเรียว 5 ซม. ทันที ผ้ายืดหยุ่นกระชับเก็บหน้าท้อง',
    descriptionEn: 'High waist sculpting flare leggings featuring a front ankle slit. Visually elongates legs with ultra-stretch contour.',
    category: 'pants',
    price: 590,
    compareAtPrice: 790,
    discountPercent: 25,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { nameTh: 'ดำสนิท', nameEn: 'Deep Black', hex: '#0f172a' },
      { nameTh: 'เทาชาร์โคล', nameEn: 'Charcoal Grey', hex: '#475569' }
    ],
    sizes: ['S', 'M', 'L'],
    sizeChart: [
      { size: 'S', waist: '23-26"', hip: '32-35"', length: '39.5"' },
      { size: 'M', waist: '26-29"', hip: '35-38"', length: '40.0"' },
      { size: 'L', waist: '29-32"', hip: '38-41"', length: '40.5"' }
    ],
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 56
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp-000',
    code: 'MEMBER10',
    discountType: 'percent',
    discountValue: 10,
    minPurchase: 0,
    maxDiscount: 500,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageCount: 15,
    maxUsage: 1000,
    isActive: true,
    descriptionTh: 'ส่วนลดสมาชิก Cozy Club 10%',
    descriptionEn: 'Cozy Club Member 10% Discount'
  },
  {
    id: 'cp-001',
    code: 'COZY10',
    discountType: 'percent',
    discountValue: 10,
    minPurchase: 500,
    maxDiscount: 200,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageCount: 142,
    maxUsage: 1000,
    isActive: true,
    descriptionTh: 'ลด 10% เมื่อช้อปครบ ฿500 (ลดสูงสุด ฿200)',
    descriptionEn: '10% OFF on orders over ฿500 (Max ฿200)'
  },
  {
    id: 'cp-002',
    code: 'WELCOME5',
    discountType: 'percent',
    discountValue: 5,
    minPurchase: 0,
    maxDiscount: 100,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageCount: 28,
    maxUsage: 500,
    isActive: true,
    descriptionTh: 'โค้ดต้อนรับ ลด 5%',
    descriptionEn: 'Welcome discount 5% OFF'
  },
  {
    id: 'cp-003',
    code: 'NEWUSER',
    discountType: 'amount',
    discountValue: 100,
    minPurchase: 700,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageCount: 65,
    maxUsage: 300,
    isActive: true,
    descriptionTh: 'ส่วนลดเงินสด ฿100 เมื่อช้อปครบ ฿700',
    descriptionEn: 'Flat ฿100 OFF on orders over ฿700'
  },
  {
    id: 'cp-004',
    code: 'COZYVIP',
    discountType: 'percent',
    discountValue: 25,
    minPurchase: 1500,
    maxDiscount: 500,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageCount: 34,
    maxUsage: 200,
    isActive: true,
    descriptionTh: 'VIP Exclusive ลด 25% เมื่อช้อปครบ ฿1,500',
    descriptionEn: 'VIP Exclusive 25% OFF on orders over ฿1,500'
  }
];

export const SHIPPING_CARRIERS: ShippingCarrier[] = [
  {
    id: 'flash',
    name: 'Flash Express',
    nameTh: 'Flash Express (แฟลช เอ็กซ์เพรส)',
    nameEn: 'Flash Express (1-2 days)',
    price: 35,
    fee: 35,
    estimatedDaysTh: '1-2 วันทำการ',
    estimatedDaysEn: '1-2 business days',
    icon: 'Zap'
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    nameTh: 'J&T Express (เจแอนด์ที)',
    nameEn: 'J&T Express (1-2 days)',
    price: 40,
    fee: 40,
    estimatedDaysTh: '1-2 วันทำการ',
    estimatedDaysEn: '1-2 business days',
    icon: 'Truck'
  },
  {
    id: 'kerry',
    name: 'Kerry Express',
    nameTh: 'Kerry Express (เคอรี่ เอ็กซ์เพรส)',
    nameEn: 'Kerry Express (1-2 days)',
    price: 45,
    fee: 45,
    estimatedDaysTh: '1-2 วันทำการ',
    estimatedDaysEn: '1-2 business days',
    icon: 'Package'
  },
  {
    id: 'thailand_post',
    name: 'Thailand Post EMS',
    nameTh: 'ไปรษณีย์ไทย EMS ด่วนพิเศษ',
    nameEn: 'Thailand Post EMS (1-3 days)',
    price: 50,
    fee: 50,
    estimatedDaysTh: '1-3 วันทำการ',
    estimatedDaysEn: '1-3 business days',
    icon: 'Mail'
  }
];

export const INITIAL_SHIPPING_METHODS = SHIPPING_CARRIERS;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CZ-260726143530',
    createdAt: '2026-07-26T14:35:00.000Z',
    customer: {
      name: 'นภัสสร อัครคุณากร',
      phone: '0614532235',
      email: 'mind24649@gmail.com'
    },
    shippingAddress: {
      houseNo: '115/5',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: 'เชียงใหม่',
      postalCode: '26989'
    },
    shippingCarrier: {
      id: 'express',
      name: 'จัดส่งด่วน (1-2 วัน)',
      nameTh: 'จัดส่งด่วน (1-2 วัน)',
      nameEn: 'Express Shipping (1-2 days)',
      price: 120,
      fee: 120,
      estimatedDaysTh: '1-2 วัน',
      estimatedDaysEn: '1-2 days',
      icon: 'Zap'
    },
    paymentMethod: 'promptpay',
    paymentDetails: {
      promptpayRef: 'PP260726-CZ-REF',
      paidAt: '2026-07-26T14:35:00.000Z'
    },
    items: [
      {
        productId: 'cs-prod-001',
        titleTh: 'Blush Camo Hoodie',
        titleEn: 'Blush Camo Cropped Hoodie',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        color: { nameTh: 'ชมพูพราง', nameEn: 'Blush Camo', hex: '#f472b6' },
        size: 'S',
        quantity: 1,
        unitPrice: 890,
        totalPrice: 890
      },
      {
        productId: 'cs-prod-002',
        titleTh: 'Candy Halter Top',
        titleEn: 'Candy Halter Top',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
        color: { nameTh: 'ขาวตัดดำ', nameEn: 'White/Black', hex: '#ffffff' },
        size: 'M',
        quantity: 1,
        unitPrice: 590,
        totalPrice: 590
      }
    ],
    subtotal: 1480,
    discount: 0,
    shippingFee: 120,
    grandTotal: 1600,
    total: 1600,
    status: 'Delivered',
    trackingNumber: 'CZ-260726143530',
    carrierName: 'จัดส่งด่วน (1-2 วัน)',
    statusHistory: [
      { status: 'Pending', timestamp: '2026-07-26T14:35:00.000Z', noteTh: 'สั่งซื้อสำเร็จ', noteEn: 'Order placed' },
      { status: 'Processing', timestamp: '2026-07-26T14:40:00.000Z', noteTh: 'กำลังจัดเตรียมสินค้า', noteEn: 'Preparing items' },
      { status: 'Shipped', timestamp: '2026-07-26T15:00:00.000Z', noteTh: 'จัดส่งแล้ว', noteEn: 'Shipped' },
      { status: 'Delivered', timestamp: '2026-07-26T17:00:00.000Z', noteTh: 'จัดส่งสำเร็จ', noteEn: 'Delivered' }
    ]
  },
  {
    id: 'CZ-260726083307',
    createdAt: '2026-07-26T08:33:00.000Z',
    customer: {
      name: 'xvsdscv scscs',
      phone: '0812345678',
      email: 'customer@example.com'
    },
    shippingAddress: {
      houseNo: 'scsc, scsc scsc',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: 'กรุงเทพมหานคร',
      postalCode: '10110'
    },
    shippingCarrier: {
      id: 'express',
      name: 'จัดส่งด่วน (1-2 วัน)',
      nameTh: 'จัดส่งด่วน (1-2 วัน)',
      nameEn: 'Express Shipping',
      price: 120,
      fee: 120,
      estimatedDaysTh: '1-2 วัน',
      estimatedDaysEn: '1-2 days',
      icon: 'Zap'
    },
    paymentMethod: 'credit_card',
    paymentDetails: {
      cardLast4: '4242',
      cardHolder: 'CUSTOMER',
      paidAt: '2026-07-26T08:33:00.000Z'
    },
    items: [
      {
        productId: 'cs-prod-001',
        titleTh: 'Blush Camo Hoodie',
        titleEn: 'Blush Camo Cropped Hoodie',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        color: { nameTh: 'ชมพูพราง', nameEn: 'Blush Camo', hex: '#f472b6' },
        size: 'S',
        quantity: 1,
        unitPrice: 890,
        totalPrice: 890
      }
    ],
    subtotal: 1602,
    discount: 0,
    shippingFee: 120,
    grandTotal: 1722,
    total: 1722,
    status: 'Shipped',
    trackingNumber: 'CZ-260726083307',
    carrierName: 'จัดส่งด่วน (1-2 วัน)',
    statusHistory: [
      { status: 'Pending', timestamp: '2026-07-26T08:33:00.000Z', noteTh: 'สั่งซื้อสำเร็จ', noteEn: 'Order placed' },
      { status: 'Shipped', timestamp: '2026-07-26T10:00:00.000Z', noteTh: 'จัดส่งแล้ว', noteEn: 'Shipped' }
    ]
  },
  {
    id: 'CS-20260827-4102',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customer: {
      name: 'ศิรดา มณีรัตน์',
      phone: '0929988776',
      email: 'sirada.m@example.com'
    },
    shippingAddress: {
      houseNo: '55/9',
      moo: 'หมู่ 2',
      road: 'ถนนนิมมานเหมินท์',
      subdistrict: 'สุเทพ',
      district: 'เมืองเชียงใหม่',
      province: 'เชียงใหม่',
      postalCode: '50200'
    },
    shippingCarrier: SHIPPING_CARRIERS[2],
    paymentMethod: 'credit_card',
    paymentDetails: {
      cardLast4: '4242',
      cardHolder: 'SIRADA MANEERAT',
      paidAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    items: [
      {
        productId: 'cs-prod-009',
        titleTh: 'High-Waist Washed Denim Jeans (กางเกงยีนส์ฟอกทรงกระบอกตรง)',
        titleEn: 'Vintage Washed High-Waist Straight Leg Jeans',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
        color: { nameTh: 'ยีนส์ฟอกอ่อน', nameEn: 'Light Vintage Blue', hex: '#93c5fd' },
        size: 'M',
        quantity: 1,
        unitPrice: 890,
        totalPrice: 890
      }
    ],
    subtotal: 890,
    discount: 100,
    couponCode: 'NEWUSER',
    shippingFee: 45,
    grandTotal: 835,
    total: 835,
    status: 'Shipped',
    trackingNumber: 'KERRY-99882211TH',
    carrierName: 'Kerry Express',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), noteTh: 'สั่งซื้อสำเร็จ', noteEn: 'Order placed' },
      { status: 'Paid', timestamp: new Date(Date.now() - 3600000 * 3.9).toISOString(), noteTh: 'ชำระเงินผ่านบัตรเครดิตสำเร็จ', noteEn: 'Paid with Credit Card' },
      { status: 'Processing', timestamp: new Date(Date.now() - 3600000 * 3.2).toISOString(), noteTh: 'คลังสินค้าตรวจสอบและจัดเตรียมสินค้า', noteEn: 'Processing at fulfillment center' },
      { status: 'Packed', timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), noteTh: 'แพ็กสินค้าแล้ว บรรจุกล่องสีชมพูพาสเทล', noteEn: 'Packed in pastel gift box' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 1.1).toISOString(), noteTh: 'สินค้าอยู่ระหว่างการจัดส่งโดย Kerry Express', noteEn: 'In transit with Kerry Express' }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    name: 'Cozy Admin',
    email: 'admin@cozyselect.com',
    phone: '0812345678',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-demo-01',
    name: 'Mind K. (Customer Demo)',
    email: 'mind@cozyselect.com',
    phone: '0898765432',
    role: 'customer',
    address: {
      houseNo: '99/12',
      moo: 'หมู่ 5',
      road: 'ถนนพหลโยธิน',
      subdistrict: 'จตุจักร',
      district: 'จตุจักร',
      province: 'กรุงเทพมหานคร',
      postalCode: '10900'
    },
    createdAt: '2026-02-15T00:00:00.000Z'
  }
];
