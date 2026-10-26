import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  price: number;
  salePrice?: number;
  stockQuantity: number;
  sizes: string[];
  colorways: { name: string; hex: string; secondaryHex: string }[];
  images: { front: string; back: string; detail: string };
  fabric: string;
  gsm: number;
  description: string;
  features: string[];
  specs: {
    cut: string;
    breathability: string;
    treatment: string;
    origin: string;
  };
  inStock: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  rating: number;
  reviewsCount: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestEmail?: string;
  customerName: string;
  phone?: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
    image: string;
    isCustom?: boolean;
    customDetails?: any;
  }[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending_verification' | 'confirmed' | 'failed' | 'refunded';
  status:
    | 'Pending'
    | 'Confirmed'
    | 'Processing'
    | 'Production'
    | 'Ready to Ship'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Refunded';
  trackingNumber?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  salt: string;
  hash: string;
  addresses: {
    id: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: string[];
  createdAt: string;
}

export interface CustomInquiryRecord {
  id: string;
  inquiryNumber: string;
  type: 'design_studio' | 'manufacturing_quote' | 'wholesale';
  clientName: string;
  email: string;
  phone?: string;
  organization?: string;
  country?: string;
  garmentType: string;
  quantity: number;
  specifications: any;
  targetBudget?: string;
  targetDeliveryDate?: string;
  status:
    | 'New'
    | 'Reviewing'
    | 'Quote Prepared'
    | 'Awaiting Customer'
    | 'Sample Approved'
    | 'Production'
    | 'Completed'
    | 'Declined';
  quotationAmount?: number;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCodeRecord {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  active: boolean;
  usageCount: number;
}

export interface SiteContentRecord {
  announcementBar: string;
  heroHeadline: string;
  heroSubtitle: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  currency: string;
  socialInstagram: string;
  socialWhatsApp: string;
}

export interface AdminConfigRecord {
  isConfigured: boolean;
  salt?: string;
  hash?: string;
  sessionToken?: string;
  sessionExpiry?: number;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface DatabaseSchema {
  products: ProductRecord[];
  orders: OrderRecord[];
  customers: CustomerRecord[];
  customInquiries: CustomInquiryRecord[];
  discountCodes: DiscountCodeRecord[];
  siteContent: SiteContentRecord;
  adminConfig: AdminConfigRecord;
  contactMessages: ContactMessageRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    id: 'mk-01-hoodie',
    name: 'Apex Heavyweight Fleece Hoodie',
    sku: 'MK-HD-480-WHT',
    category: 'Hoodies',
    subcategory: 'Fleece',
    gender: 'Unisex',
    price: 165,
    salePrice: 145,
    stockQuantity: 42,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colorways: [
      { name: 'Chalk White / Charcoal', hex: '#F4F4F5', secondaryHex: '#27272A' },
      { name: 'Onyx Black / Crimson', hex: '#18181B', secondaryHex: '#DC2626' },
      { name: 'Graphite Grey / White', hex: '#52525B', secondaryHex: '#FFFFFF' },
    ],
    images: {
      front: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      back: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: '100% Combed Organic Heavy French Terry',
    gsm: 480,
    description: 'Custom engineered 480 GSM double-faced French terry with ergonomic side paneling, silicone cord tips, and minimal chest typography.',
    features: ['Double-layer articulated hood', 'Reverse flatlock comfort stitching', 'Laser-cut kangaroo pocket with media zip', 'Pre-shrunk cold washed'],
    specs: {
      cut: 'Boxy athletic silhouette',
      breathability: 'High thermal retention with micro ventilation',
      treatment: 'Silicone garment soften wash',
      origin: 'MK Industrial Atelier, Facility 02',
    },
    inStock: true,
    featured: true,
    newArrival: false,
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 38,
  },
  {
    id: 'mk-02-tracksuit',
    name: 'Aero-Speed Pro Tracksuit (2-Piece)',
    sku: 'MK-TS-320-WHT',
    category: 'Tracksuits',
    subcategory: 'Full Suits',
    gender: 'Men',
    price: 240,
    salePrice: 220,
    stockQuantity: 28,
    sizes: ['S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Pure White / Shadow', hex: '#FFFFFF', secondaryHex: '#3F3F46' },
      { name: 'Pitch Black / Racing Red', hex: '#09090B', secondaryHex: '#DC2626' },
      { name: 'Midnight Charcoal / Silver', hex: '#27272A', secondaryHex: '#E4E4E7' },
    ],
    images: {
      front: '/src/assets/images/hero_model_tracksuit_1793036217077.jpg',
      back: '/src/assets/images/hero_model_tracksuit_1793036217077.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: 'AeroStretch Poly-Elastane Matrix (88/12)',
    gsm: 320,
    description: 'Two-piece performance warm-up suit engineered from dual-weave technical stretch fabric. Articulated knees and streamlined racing seam architecture.',
    features: ['2-way YKK waterproof zip', 'Ankle expansion gusset', 'Bonded tape ergonomic seams', 'Reflective micro-monogram'],
    specs: {
      cut: 'Aerodynamic tapered performance',
      breathability: 'Active moisture transport',
      treatment: 'DWR hydrophobic coating',
      origin: 'MK Performance Lab',
    },
    inStock: true,
    featured: true,
    newArrival: true,
    bestSeller: true,
    rating: 4.8,
    reviewsCount: 24,
  },
  {
    id: 'mk-03-jersey',
    name: 'HyperVent Matchday Pro Jersey',
    sku: 'MK-JS-180-RED',
    category: 'Sports Jerseys',
    subcategory: 'Competition',
    gender: 'Unisex',
    price: 110,
    stockQuantity: 65,
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colorways: [
      { name: 'Speed Red / Chalk', hex: '#DC2626', secondaryHex: '#F4F4F5' },
      { name: 'Crisp White / Onyx', hex: '#FFFFFF', secondaryHex: '#18181B' },
      { name: 'Phantom Charcoal / Red', hex: '#3F3F46', secondaryHex: '#EF4444' },
    ],
    images: {
      front: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      back: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: 'Micro-Cell Diamond Mesh',
    gsm: 175,
    description: 'Pro-tier competition jersey constructed with mapped honeycomb ventilation zones. Featherweight, zero-cling performance yarn.',
    features: ['Raglan motion sleeves', 'Laser perforated armpit vents', 'High-definition 3D silicone crest', 'Anti-odor ion thread integration'],
    specs: {
      cut: 'Athletic match fit',
      breathability: 'Ultra-high air permeability',
      treatment: 'Quick-dry hydro-wicking',
      origin: 'MK Custom Sportswear Division',
    },
    inStock: true,
    featured: true,
    newArrival: false,
    bestSeller: false,
    rating: 4.7,
    reviewsCount: 19,
  },
  {
    id: 'mk-04-jacket',
    name: 'WeatherShield Technical Anorak',
    sku: 'MK-JK-210-GLC',
    category: 'Jackets',
    subcategory: 'Outerwear',
    gender: 'Unisex',
    price: 215,
    salePrice: 190,
    stockQuantity: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Glacier White / Graphite', hex: '#F8FAFC', secondaryHex: '#334155' },
      { name: 'Stealth Black / Crimson', hex: '#0F172A', secondaryHex: '#DC2626' },
    ],
    images: {
      front: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      back: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: '3-Layer Ripstop Nylon with Membrane',
    gsm: 210,
    description: 'All-weather half-zip windbreaker with taped internal seams, drop-tail hem, and magnetic storm flap closure.',
    features: ['10,000mm hydrostatic rating', 'Packable into internal kangaroo pouch', 'Reinforced elbow articulation', 'Adjustable bungee toggles'],
    specs: {
      cut: 'Modern layered technical',
      breathability: '8,000 g/m²/24h MVTR',
      treatment: 'PFC-free DWR weather shield',
      origin: 'MK Technical Outerwear Facility',
    },
    inStock: true,
    featured: false,
    newArrival: true,
    bestSeller: false,
    rating: 4.9,
    reviewsCount: 15,
  },
  {
    id: 'mk-05-tee',
    name: 'Core Kinetic Training Tee',
    sku: 'MK-TE-240-WHT',
    category: 'T-Shirts',
    subcategory: 'Training',
    gender: 'Men',
    price: 78,
    stockQuantity: 55,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colorways: [
      { name: 'Bright Chalk White', hex: '#FFFFFF', secondaryHex: '#27272A' },
      { name: 'Carbon Black', hex: '#18181B', secondaryHex: '#DC2626' },
      { name: 'Heather Smoke', hex: '#71717A', secondaryHex: '#FFFFFF' },
    ],
    images: {
      front: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      back: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: 'Cotton-Modal Performance Weave (60/40)',
    gsm: 240,
    description: 'Essential everyday training tee engineered with micro-modal cotton blend. Retains crisp drape and zero-pilling wash after wash.',
    features: ['Non-ribbed clean collar fold', 'Split side vents with bar-tack reinforcement', 'Printed interior neck tag', 'Four-way mechanical stretch'],
    specs: {
      cut: 'Regular tailored athletic',
      breathability: 'High natural airflow',
      treatment: 'Enzyme bio-polish',
      origin: 'MK Base Layer Unit',
    },
    inStock: true,
    featured: true,
    newArrival: false,
    bestSeller: true,
    rating: 4.9,
    reviewsCount: 41,
  },
  {
    id: 'mk-06-shorts',
    name: 'AeroMotion 7" Training Shorts',
    sku: 'MK-SH-190-BLK',
    category: 'Shorts',
    subcategory: 'Training',
    gender: 'Men',
    price: 85,
    stockQuantity: 34,
    sizes: ['S', 'M', 'L', 'XL'],
    colorways: [
      { name: 'Pitch Black', hex: '#09090B', secondaryHex: '#DC2626' },
      { name: 'Graphite Grey', hex: '#3F3F46', secondaryHex: '#FFFFFF' },
    ],
    images: {
      front: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      back: '/src/assets/images/custom_apparel_collection_1793036220147.jpg',
      detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
    },
    fabric: 'Lightweight Stretch Dobby (86/14)',
    gsm: 190,
    description: 'Ergonomic athletic shorts featuring breathable liner, zip media pockets, and laser-cut heat dissipation slits.',
    features: ['Concealed sweat-resistant zip pocket', 'Laser-cut ventilation flanks', 'Flat bonded drawcord waist', 'Anti-chafe inner brief option'],
    specs: {
      cut: '7-inch inseam athletic cut',
      breathability: 'Maximum airflow design',
      treatment: 'Hydrophobic quick-dry',
      origin: 'MK Performance Lab',
    },
    inStock: true,
    featured: false,
    newArrival: true,
    bestSeller: false,
    rating: 4.8,
    reviewsCount: 17,
  },
];

const INITIAL_DISCOUNT_CODES: DiscountCodeRecord[] = [
  { code: 'MK2026', type: 'percentage', value: 15, minOrderValue: 50, active: true, usageCount: 42 },
  { code: 'PERFORM20', type: 'percentage', value: 20, minOrderValue: 120, active: true, usageCount: 18 },
  { code: 'WELCOME10', type: 'fixed', value: 10, minOrderValue: 80, active: true, usageCount: 65 },
];

const INITIAL_SITE_CONTENT: SiteContentRecord = {
  announcementBar: 'COMPLIMENTARY INTERNATIONAL EXPRESS DISPATCH OVER $150 · BESPOKE PRODUCTION MOQS FROM 25 PIECES',
  heroHeadline: 'BUILT TO PERFORM. DESIGNED TO STAND OUT.',
  heroSubtitle: 'Premium sportswear. Custom designs. Manufacturing built around your vision.',
  businessEmail: 'atelier@mksports.com',
  businessPhone: '+1 (800) 482-0192',
  businessAddress: 'MK Sports International Atelier, 420 Olympic Boulevard, Suite 800, New York, NY 10001',
  businessHours: 'Monday – Friday: 08:00 – 18:00 EST',
  freeShippingThreshold: 150,
  standardShippingFee: 15,
  currency: 'USD',
  socialInstagram: '@mksports.atelier',
  socialWhatsApp: '+18004820192',
};

// Seed initial orders
const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-8491',
    orderNumber: 'MK-849102',
    customerName: 'Marcus Vance',
    guestEmail: 'marcus.vance@apexclub.com',
    phone: '+1 (555) 234-5678',
    shippingAddress: {
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
    },
    items: [
      {
        productId: 'mk-02-tracksuit',
        name: 'Aero-Speed Pro Tracksuit (2-Piece)',
        price: 240,
        color: 'Pure White / Shadow',
        size: 'L',
        quantity: 1,
        image: '/src/assets/images/hero_model_tracksuit_1793036217077.jpg',
      },
      {
        productId: 'mk-05-tee',
        name: 'Core Kinetic Training Tee',
        price: 78,
        color: 'Bright Chalk White',
        size: 'L',
        quantity: 2,
        image: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      },
    ],
    subtotal: 396,
    discountAmount: 0,
    shippingCost: 0,
    total: 396,
    paymentMethod: 'Credit Card (Stripe)',
    paymentStatus: 'confirmed',
    status: 'Processing',
    trackingNumber: '1Z9999999999999999',
    internalNotes: 'Client requested rush dispatch before team camp.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ord-8488',
    orderNumber: 'MK-848820',
    customerName: 'Elena Rostova',
    guestEmail: 'elena@londonkinetics.co.uk',
    phone: '+44 20 7946 0991',
    shippingAddress: {
      address: '14 Kensington High Street',
      city: 'London',
      postalCode: 'W8 4PT',
      country: 'United Kingdom',
    },
    items: [
      {
        productId: 'mk-01-hoodie',
        name: 'Apex Heavyweight Fleece Hoodie',
        price: 165,
        color: 'Chalk White / Charcoal',
        size: 'M',
        quantity: 2,
        image: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
      },
    ],
    subtotal: 330,
    discountAmount: 49.5,
    discountCode: 'MK2026',
    shippingCost: 0,
    total: 280.5,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'confirmed',
    status: 'Production',
    trackingNumber: 'GB489100234',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const INITIAL_CUSTOM_INQUIRIES: CustomInquiryRecord[] = [
  {
    id: 'inq-101',
    inquiryNumber: 'MK-CUST-9101',
    type: 'design_studio',
    clientName: 'Coach Thomas Reed',
    email: 'treed@cascadeleague.org',
    phone: '+1 503 555 0199',
    organization: 'Cascade Athletic League',
    country: 'United States',
    garmentType: 'Apex Heavyweight Fleece Hoodie',
    quantity: 85,
    specifications: {
      baseColor: '#FFFFFF',
      secondaryColor: '#18181B',
      accentColor: '#DC2626',
      logoPosition: 'chest-left',
      printMethod: '3D High-Density Silicone',
      customText: 'CASCADE',
      customNumber: '26',
    },
    targetDeliveryDate: '2026-11-20',
    status: 'Quote Prepared',
    quotationAmount: 5780,
    internalNotes: 'Sample CAD pattern generated. Waiting on crest vector high-res.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'inq-102',
    inquiryNumber: 'MK-CUST-9102',
    type: 'wholesale',
    clientName: 'Liam Chen',
    email: 'lchen@velocityracing.com',
    phone: '+65 6789 0123',
    organization: 'Apex Velocity Racing Club',
    country: 'Singapore',
    garmentType: 'Aero-Speed Pro Tracksuit & Windbreaker',
    quantity: 120,
    specifications: {
      fabric: 'AeroStretch Poly-Elastane Matrix',
      colors: 'Pitch Black & Racing Crimson',
      embroidery: '15-thread Japanese Tajima chest + back crest',
    },
    targetBudget: '$12,000 USD',
    targetDeliveryDate: '2026-12-05',
    status: 'Reviewing',
    internalNotes: 'Special custom zipper pull requested with laser engraved logo.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load store.json, reinitializing default:', e);
    }

    const defaultData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      customers: [],
      customInquiries: INITIAL_CUSTOM_INQUIRIES,
      discountCodes: INITIAL_DISCOUNT_CODES,
      siteContent: INITIAL_SITE_CONTENT,
      adminConfig: {
        isConfigured: false, // Allows the user to configure their secure password on first setup!
      },
      contactMessages: [],
    };

    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write store.json:', e);
    }
  }

  // Admin Config & Auth
  getAdminConfig() {
    return {
      isConfigured: this.data.adminConfig.isConfigured,
    };
  }

  setupAdminPassword(password: string) {
    const { salt, hash } = hashPassword(password);
    this.data.adminConfig = {
      isConfigured: true,
      salt,
      hash,
    };
    this.save();
    return true;
  }

  verifyAdminLogin(password: string): { success: boolean; token?: string } {
    if (!this.data.adminConfig.isConfigured || !this.data.adminConfig.salt || !this.data.adminConfig.hash) {
      return { success: false };
    }

    const isValid = verifyPassword(password, this.data.adminConfig.salt, this.data.adminConfig.hash);
    if (!isValid) return { success: false };

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.data.adminConfig.sessionToken = token;
    this.data.adminConfig.sessionExpiry = expiry;
    this.save();

    return { success: true, token };
  }

  verifyAdminToken(token: string): boolean {
    if (
      !token ||
      !this.data.adminConfig.sessionToken ||
      this.data.adminConfig.sessionToken !== token
    ) {
      return false;
    }
    if (this.data.adminConfig.sessionExpiry && this.data.adminConfig.sessionExpiry < Date.now()) {
      return false;
    }
    return true;
  }

  adminLogout() {
    this.data.adminConfig.sessionToken = undefined;
    this.data.adminConfig.sessionExpiry = undefined;
    this.save();
    return true;
  }

  // Products
  getProducts(): ProductRecord[] {
    return this.data.products;
  }

  getProductById(id: string): ProductRecord | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  addProduct(product: Partial<ProductRecord>): ProductRecord {
    const newProduct: ProductRecord = {
      id: product.id || `mk-${Date.now()}`,
      name: product.name || 'Untitled Sportswear',
      sku: product.sku || `MK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: product.category || 'Sportswear',
      subcategory: product.subcategory || 'General',
      gender: product.gender || 'Unisex',
      price: Number(product.price) || 99,
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      stockQuantity: Number(product.stockQuantity) || 20,
      sizes: product.sizes && product.sizes.length ? product.sizes : ['S', 'M', 'L', 'XL'],
      colorways: product.colorways && product.colorways.length ? product.colorways : [{ name: 'Chalk White', hex: '#FFFFFF', secondaryHex: '#18181B' }],
      images: product.images || {
        front: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
        back: '/src/assets/images/hoodie_product_editorial_1793036217712.jpg',
        detail: '/src/assets/images/tracksuit_fabric_macro_1793036218655.jpg',
      },
      fabric: product.fabric || 'Heavyweight Performance Terry',
      gsm: Number(product.gsm) || 320,
      description: product.description || 'Engineered luxury sportswear piece.',
      features: product.features || ['Ergonomic cut', 'Breathable performance', 'Reinforced seams'],
      specs: product.specs || {
        cut: 'Athletic tailored',
        breathability: 'High',
        treatment: 'Silicone wash',
        origin: 'MK Industrial Atelier',
      },
      inStock: product.stockQuantity !== undefined ? product.stockQuantity > 0 : true,
      featured: !!product.featured,
      newArrival: !!product.newArrival,
      bestSeller: !!product.bestSeller,
      rating: 5.0,
      reviewsCount: 1,
    };

    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductRecord>): ProductRecord | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const existing = this.data.products[idx];
    const updated = {
      ...existing,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : existing.price,
      salePrice: updates.salePrice !== undefined ? (updates.salePrice ? Number(updates.salePrice) : undefined) : existing.salePrice,
      stockQuantity: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : existing.stockQuantity,
      gsm: updates.gsm !== undefined ? Number(updates.gsm) : existing.gsm,
      inStock: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) > 0 : existing.inStock,
    };

    this.data.products[idx] = updated;
    this.save();
    return updated;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): OrderRecord[] {
    return this.data.orders;
  }

  getOrderById(idOrNumber: string): OrderRecord | undefined {
    return this.data.orders.find(
      (o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
    );
  }

  createOrder(orderData: Partial<OrderRecord>): OrderRecord {
    const orderNumber = `MK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: orderData.customerId,
      guestEmail: orderData.guestEmail || '',
      customerName: orderData.customerName || 'Anonymous Athlete',
      phone: orderData.phone || '',
      shippingAddress: orderData.shippingAddress || {
        address: '',
        city: '',
        postalCode: '',
        country: 'United States',
      },
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discountAmount: Number(orderData.discountAmount) || 0,
      discountCode: orderData.discountCode,
      shippingCost: Number(orderData.shippingCost) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      paymentStatus: 'confirmed',
      status: 'Confirmed',
      internalNotes: orderData.internalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Decrement inventory stock
    for (const item of newOrder.items) {
      if (!item.isCustom) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          prod.inStock = prod.stockQuantity > 0;
        }
      }
    }

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(
    id: string,
    status: OrderRecord['status'],
    internalNotes?: string,
    trackingNumber?: string
  ): OrderRecord | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;

    order.status = status;
    if (internalNotes !== undefined) order.internalNotes = internalNotes;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    this.save();
    return order;
  }

  // Customer Accounts & Auth
  createCustomer(name: string, email: string, password: string): { customer?: Omit<CustomerRecord, 'salt' | 'hash'>; error?: string } {
    const normalized = email.toLowerCase().trim();
    if (this.data.customers.some((c) => c.email === normalized)) {
      return { error: 'An account with this email address already exists.' };
    }

    const { salt, hash } = hashPassword(password);
    const newCust: CustomerRecord = {
      id: `cust-${Date.now()}`,
      email: normalized,
      name,
      salt,
      hash,
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };

    this.data.customers.push(newCust);
    this.save();

    const { salt: _, hash: __, ...safeCust } = newCust;
    return { customer: safeCust };
  }

  verifyCustomerLogin(email: string, password: string): { customer?: Omit<CustomerRecord, 'salt' | 'hash'>; error?: string } {
    const normalized = email.toLowerCase().trim();
    const cust = this.data.customers.find((c) => c.email === normalized);
    if (!cust) {
      return { error: 'Invalid email or password.' };
    }

    const valid = verifyPassword(password, cust.salt, cust.hash);
    if (!valid) {
      return { error: 'Invalid email or password.' };
    }

    const { salt: _, hash: __, ...safeCust } = cust;
    return { customer: safeCust };
  }

  getCustomers(): Omit<CustomerRecord, 'salt' | 'hash'>[] {
    return this.data.customers.map(({ salt, hash, ...c }) => c);
  }

  updateCustomerWishlist(customerId: string, productId: string): string[] {
    const cust = this.data.customers.find((c) => c.id === customerId);
    if (!cust) return [];

    if (cust.wishlist.includes(productId)) {
      cust.wishlist = cust.wishlist.filter((id) => id !== productId);
    } else {
      cust.wishlist.push(productId);
    }
    this.save();
    return cust.wishlist;
  }

  // Custom & Manufacturing Inquiries
  getCustomInquiries(): CustomInquiryRecord[] {
    return this.data.customInquiries;
  }

  createCustomInquiry(inquiry: Partial<CustomInquiryRecord>): CustomInquiryRecord {
    const inquiryNumber = `MK-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: CustomInquiryRecord = {
      id: `inq-${Date.now()}`,
      inquiryNumber,
      type: inquiry.type || 'design_studio',
      clientName: inquiry.clientName || 'Anonymous',
      email: inquiry.email || '',
      phone: inquiry.phone,
      organization: inquiry.organization,
      country: inquiry.country,
      garmentType: inquiry.garmentType || 'Custom Sportswear',
      quantity: Number(inquiry.quantity) || 50,
      specifications: inquiry.specifications || {},
      targetBudget: inquiry.targetBudget,
      targetDeliveryDate: inquiry.targetDeliveryDate,
      status: 'New',
      quotationAmount: inquiry.quotationAmount,
      internalNotes: inquiry.internalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.customInquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  updateCustomInquiry(
    id: string,
    updates: Partial<CustomInquiryRecord>
  ): CustomInquiryRecord | null {
    const inq = this.data.customInquiries.find((i) => i.id === id);
    if (!inq) return null;

    Object.assign(inq, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return inq;
  }

  // Discounts
  getDiscountCodes(): DiscountCodeRecord[] {
    return this.data.discountCodes;
  }

  validateDiscount(code: string, subtotal: number): { valid: boolean; discountAmount: number; message?: string } {
    const record = this.data.discountCodes.find(
      (d) => d.code.toUpperCase() === code.trim().toUpperCase() && d.active
    );

    if (!record) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive promotional code.' };
    }

    if (subtotal < record.minOrderValue) {
      return {
        valid: false,
        discountAmount: 0,
        message: `This code requires a minimum subtotal of $${record.minOrderValue}.`,
      };
    }

    const discountAmount =
      record.type === 'percentage'
        ? Math.round(subtotal * (record.value / 100) * 100) / 100
        : Math.min(record.value, subtotal);

    return { valid: true, discountAmount };
  }

  addDiscountCode(discount: DiscountCodeRecord): DiscountCodeRecord {
    const idx = this.data.discountCodes.findIndex((d) => d.code.toUpperCase() === discount.code.toUpperCase());
    if (idx > -1) {
      this.data.discountCodes[idx] = discount;
    } else {
      this.data.discountCodes.push(discount);
    }
    this.save();
    return discount;
  }

  // Site Content
  getSiteContent(): SiteContentRecord {
    return this.data.siteContent;
  }

  updateSiteContent(updates: Partial<SiteContentRecord>): SiteContentRecord {
    this.data.siteContent = { ...this.data.siteContent, ...updates };
    this.save();
    return this.data.siteContent;
  }

  // Contact Messages
  addContactMessage(name: string, email: string, subject: string, message: string): ContactMessageRecord {
    const newMsg: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  getContactMessages(): ContactMessageRecord[] {
    return this.data.contactMessages;
  }
}

export const db = new Database();
