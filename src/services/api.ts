import { Product, Order, CustomInquiry, CustomerUser, SiteContent } from '../types';

const ADMIN_TOKEN_KEY = 'mk_admin_session_token';
const CUSTOMER_SESSION_KEY = 'mk_customer_session';

export const authStorage = {
  getAdminToken: (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken: (token: string): void => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  clearAdminToken: (): void => localStorage.removeItem(ADMIN_TOKEN_KEY),

  getCustomer: (): CustomerUser | null => {
    try {
      const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setCustomer: (cust: CustomerUser): void => localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(cust)),
  clearCustomer: (): void => localStorage.removeItem(CUSTOMER_SESSION_KEY),
};

export const api = {
  // Public Data
  async getSiteContent(): Promise<SiteContent> {
    const res = await fetch('/api/site-content');
    if (!res.ok) throw new Error('Failed to load site content');
    return res.json();
  },

  async getProducts(params?: Record<string, string>): Promise<Product[]> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`/api/products${query}`);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async validateDiscount(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; message?: string }> {
    const res = await fetch('/api/discounts/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  async placeOrder(orderData: any): Promise<{ success: boolean; order: Order }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async trackOrder(idOrNumber: string): Promise<Order> {
    const res = await fetch(`/api/orders/${encodeURIComponent(idOrNumber)}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async submitCustomInquiry(inquiryData: any): Promise<{ success: boolean; inquiry: CustomInquiry }> {
    const res = await fetch('/api/custom-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit inquiry');
    }
    return res.json();
  },

  async submitContact(name: string, email: string, subject: string, message: string): Promise<{ success: boolean; messageId: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },

  // Customer Auth
  async register(name: string, email: string, password: string): Promise<CustomerUser> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    authStorage.setCustomer(data.customer);
    return data.customer;
  },

  async login(email: string, password: string): Promise<CustomerUser> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    authStorage.setCustomer(data.customer);
    return data.customer;
  },

  async toggleWishlist(customerId: string, productId: string): Promise<string[]> {
    const res = await fetch(`/api/customers/${customerId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    return data.wishlist || [];
  },

  // Admin APIs
  async checkAdminStatus(): Promise<{ isConfigured: boolean }> {
    const res = await fetch('/api/admin/status');
    return res.json();
  },

  async setupAdmin(password: string): Promise<string> {
    const res = await fetch('/api/admin/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Setup failed');
    authStorage.setAdminToken(data.token);
    return data.token;
  },

  async adminLogin(password: string): Promise<string> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    authStorage.setAdminToken(data.token);
    return data.token;
  },

  async adminLogout(): Promise<void> {
    const token = authStorage.getAdminToken();
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    authStorage.clearAdminToken();
  },

  async getAdminDashboard(): Promise<any> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getAdminOrders(): Promise<Order[]> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string, internalNotes?: string, trackingNumber?: string): Promise<Order> {
    const token = authStorage.getAdminToken();
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, internalNotes, trackingNumber }),
    });
    if (!res.ok) throw new Error('Failed to update order');
    const data = await res.json();
    return data.order;
  },

  async getAdminInquiries(): Promise<CustomInquiry[]> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/custom-inquiries', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async updateAdminInquiry(id: string, updates: Partial<CustomInquiry>): Promise<CustomInquiry> {
    const token = authStorage.getAdminToken();
    const res = await fetch(`/api/admin/custom-inquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update inquiry');
    const data = await res.json();
    return data.inquiry;
  },

  async getAdminCustomers(): Promise<any[]> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/customers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async addAdminProduct(product: Partial<Product>): Promise<Product> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return data.product;
  },

  async updateAdminProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const token = authStorage.getAdminToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    const data = await res.json();
    return data.product;
  },

  async deleteAdminProduct(id: string): Promise<boolean> {
    const token = authStorage.getAdminToken();
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  async getAdminDiscounts(): Promise<any[]> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/discounts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async createAdminDiscount(discount: any): Promise<any> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(discount),
    });
    if (!res.ok) throw new Error('Failed to save discount');
    return res.json();
  },

  async updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
    const token = authStorage.getAdminToken();
    const res = await fetch('/api/admin/site-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update content');
    const data = await res.json();
    return data.siteContent;
  },
};
