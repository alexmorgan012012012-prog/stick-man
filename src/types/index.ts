export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  price: number;
  salePrice?: number;
  originalPrice?: number;
  stockQuantity: number;
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | '2XL')[];
  colorways: {
    name: string;
    hex: string;
    secondaryHex: string;
  }[];
  images: {
    front: string;
    back: string;
    detail: string;
  };
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

export interface CustomDesignState {
  garmentType: 'hoodie' | 'tracksuit' | 'jersey' | 'windbreaker' | 'tee' | 'shorts';
  baseColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  logoPosition: 'chest-left' | 'chest-center' | 'back' | 'sleeve';
  logoScale: number;
  logoRotation: number;
  customText: string;
  customNumber: string;
  fontFamily: string;
  textColor: string;
  printMethod: '3D High-Density Silicone' | 'Tactile Precision Embroidery' | 'Digital Breathable Sublimation' | 'Ultra-Matte Heat Seal';
  quantity: number;
  deliverySpeed: 'standard' | 'express';
  notes: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  color?: string;
  size?: string;
  quantity: number;
  isCustom?: boolean;
  customDetails?: {
    garment: string;
    colors: string;
    printMethod: string;
    customText?: string;
  };
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
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

export interface Order {
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
  items: CartItem[];
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

export interface CustomInquiry {
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

export interface SiteContent {
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

export interface ManufacturingOrder {
  id: string;
  clientName: string;
  organization: string;
  garment: string;
  units: number;
  stage: 'Design Spec' | 'Pattern Grading' | 'Fabric Cutting' | 'Printing & Embroidery' | 'Precision Stitching' | 'Quality Control' | 'Dispatched';
  progressPercent: number;
  estimatedDelivery: string;
  dateCreated: string;
}
