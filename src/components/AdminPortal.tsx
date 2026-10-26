import React, { useState, useEffect } from 'react';
import { api, authStorage } from '../services/api';
import { Product, Order, CustomInquiry, SiteContent } from '../types';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Package,
  ShoppingBag,
  Layers,
  Users,
  Settings,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Search,
  ArrowRight,
  RefreshCw,
  Mail,
  DollarSign,
  X,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onStorefrontRefresh?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose, onStorefrontRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  // Login & Setup State
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Dashboard Active Tab
  const [adminTab, setAdminTab] = useState<
    'overview' | 'products' | 'orders' | 'inquiries' | 'inventory' | 'customers' | 'discounts' | 'content' | 'messages'
  >('overview');

  // Real Database Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Modals inside Admin
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage', value: 15, minOrderValue: 50 });
  const [showNewDiscountModal, setShowNewDiscountModal] = useState(false);

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      checkSetupStatus();
    }
  }, [isOpen]);

  const checkSetupStatus = async () => {
    setCheckingStatus(true);
    try {
      const status = await api.checkAdminStatus();
      setIsConfigured(status.isConfigured);
      const token = authStorage.getAdminToken();
      if (token) {
        // Verify token with dashboard call
        try {
          await loadAllAdminData();
          setIsAuthenticated(true);
        } catch {
          authStorage.clearAdminToken();
          setIsAuthenticated(false);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [dash, ords, inqs, custs, prods, disc, content] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminOrders(),
        api.getAdminInquiries(),
        api.getAdminCustomers(),
        api.getProducts(),
        api.getAdminDiscounts(),
        api.getSiteContent(),
      ]);

      setDashboardData(dash);
      setOrders(ords);
      setInquiries(inqs);
      setCustomers(custs);
      setProducts(prods);
      setDiscounts(disc);
      setSiteContent(content);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await api.setupAdmin(password);
      setIsConfigured(true);
      setIsAuthenticated(true);
      await loadAllAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Setup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await api.adminLogin(password);
      setIsAuthenticated(true);
      await loadAllAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid administrator credentials');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
    setPassword('');
  };

  // Product CRUD Handlers
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isAddingProduct) {
        await api.addAdminProduct(editingProduct);
      } else if (editingProduct.id) {
        await api.updateAdminProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      await loadAllAdminData();
      if (onStorefrontRefresh) onStorefrontRefresh();
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      try {
        await api.deleteAdminProduct(id);
        await loadAllAdminData();
        if (onStorefrontRefresh) onStorefrontRefresh();
      } catch (err: any) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (id: string, status: string, notes?: string, tracking?: string) => {
    try {
      await api.updateOrderStatus(id, status, notes, tracking);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Failed to update order: ' + err.message);
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiryStatus = async (id: string, status: any, quotation?: number) => {
    try {
      await api.updateAdminInquiry(id, { status, quotationAmount: quotation });
      await loadAllAdminData();
    } catch (err: any) {
      alert('Failed to update inquiry: ' + err.message);
    }
  };

  // Discount Code Creation
  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminDiscount({
        code: newDiscount.code.toUpperCase().trim(),
        type: newDiscount.type,
        value: Number(newDiscount.value),
        minOrderValue: Number(newDiscount.minOrderValue),
        active: true,
        usageCount: 0,
      });
      setShowNewDiscountModal(false);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Failed to add discount: ' + err.message);
    }
  };

  // Content Save
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;
    try {
      await api.updateSiteContent(siteContent);
      alert('Storefront announcement and settings successfully updated!');
      if (onStorefrontRefresh) onStorefrontRefresh();
    } catch (err: any) {
      alert('Failed to update content: ' + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white h-[92vh] rounded-sm border border-zinc-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar of Admin Portal */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 text-white rounded-sm flex items-center justify-center font-bold font-mono text-xs">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-zinc-950 uppercase tracking-tight">
                  ATELIER MANAGEMENT PORTAL
                </span>
                <span className="font-mono text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">
                  CONFIDENTIAL
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                MK SPORTS PRIVATE ADMINISTRATOR SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-red-600 border border-zinc-200 hover:border-red-300 rounded-sm bg-white cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Area */}
        <div className="flex-1 overflow-y-auto">
          {checkingStatus ? (
            <div className="py-24 text-center font-mono text-xs text-zinc-400">
              VERIFYING SECURE PORTAL CREDENTIALS...
            </div>
          ) : !isConfigured ? (
            /* First-Time Setup Screen */
            <div className="max-w-md mx-auto py-16 px-6">
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm text-center mb-6">
                <Shield className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight">
                  FIRST-TIME ADMINISTRATOR SETUP
                </h3>
                <p className="text-xs text-zinc-600 mt-2">
                  No default password is set. Please establish your private administrator credentials. This password will be securely salted and hashed on the server.
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-medium rounded-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleSetup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                    Set Private Admin Password (Min 8 Chars) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                    Confirm Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {authLoading ? 'Locking In Credentials...' : 'Lock In Private Admin Password'}
                </button>
              </form>
            </div>
          ) : !isAuthenticated ? (
            /* Secure Login Screen */
            <div className="max-w-md mx-auto py-20 px-6">
              <div className="text-center mb-6">
                <Lock className="w-8 h-8 text-zinc-950 mx-auto mb-2" />
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight">
                  ADMINISTRATOR SIGN IN
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  MK SPORTS SECURITY DIRECTIVE
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-medium rounded-sm">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {authLoading ? 'Verifying...' : 'Access Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard Layout */
            <div className="p-6">
              {/* Tab Navigation Strip */}
              <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 border-b border-zinc-200 scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'products', label: `Products (${products.length})` },
                  { id: 'orders', label: `Orders (${orders.length})` },
                  { id: 'inquiries', label: `Custom Requests (${inquiries.length})` },
                  { id: 'inventory', label: 'Inventory' },
                  { id: 'customers', label: `Customers (${customers.length})` },
                  { id: 'discounts', label: 'Discounts' },
                  { id: 'content', label: 'Site Content' },
                ].map((tab) => {
                  const active = adminTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminTab(tab.id as any)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-zinc-950 text-white shadow-sm'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}

                <button
                  onClick={loadAllAdminData}
                  className="ml-auto p-1.5 text-zinc-500 hover:text-zinc-950 rounded cursor-pointer"
                  title="Reload Live Database"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* OVERVIEW TAB */}
              {adminTab === 'overview' && dashboardData && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase">
                        CONFIRMED PAID REVENUE
                      </span>
                      <span className="block font-display text-2xl font-black text-zinc-950 mt-1 tabular-nums">
                        ${dashboardData.confirmedRevenue.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600">
                        From paid orders only
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase">
                        TOTAL ORDERS
                      </span>
                      <span className="block font-display text-2xl font-black text-zinc-950 mt-1 tabular-nums">
                        {dashboardData.totalOrders}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {dashboardData.pendingOrders} Active in production
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase">
                        CUSTOM SPEC INQUIRIES
                      </span>
                      <span className="block font-display text-2xl font-black text-red-600 mt-1 tabular-nums">
                        {dashboardData.customInquiriesCount + dashboardData.wholesaleInquiriesCount}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Awaiting review
                      </span>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase">
                        LOW STOCK ALERTS
                      </span>
                      <span className="block font-display text-2xl font-black text-zinc-950 mt-1 tabular-nums">
                        {dashboardData.lowStockCount}
                      </span>
                      <span className="text-[10px] font-mono text-amber-600">
                        Under 10 units
                      </span>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="border border-zinc-200 rounded-sm overflow-hidden">
                    <div className="p-3 bg-zinc-100 border-b border-zinc-200 font-mono text-xs font-bold text-zinc-800 uppercase flex justify-between">
                      <span>RECENT ORDERS ACTIVITY</span>
                      <button
                        onClick={() => setAdminTab('orders')}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        View All Orders →
                      </button>
                    </div>
                    <div className="divide-y divide-zinc-200 text-xs">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="p-3 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-red-600 mr-2">{o.orderNumber}</span>
                            <span className="font-semibold text-zinc-900">{o.customerName}</span>
                            <span className="text-zinc-500 text-[11px] ml-2">
                              ({o.items.length} items)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded text-[11px] font-bold">
                              {o.status}
                            </span>
                            <span className="font-display font-bold text-zinc-950 tabular-nums">
                              ${o.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS MANAGEMENT TAB */}
              {adminTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product name, SKU..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingProduct(true);
                        setEditingProduct({
                          name: '',
                          sku: `MK-${Math.floor(1000 + Math.random() * 9000)}`,
                          category: 'Hoodies',
                          gender: 'Unisex',
                          price: 150,
                          stockQuantity: 25,
                          gsm: 480,
                          fabric: '100% Combed Heavy French Terry',
                          description: 'Luxury sportswear piece.',
                          featured: false,
                          inStock: true,
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase border-b border-zinc-200">
                        <tr>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">GSM</th>
                          <th className="p-3">Flags</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-medium">
                        {products
                          .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-zinc-50">
                              <td className="p-3 font-mono font-bold text-red-600">{p.sku}</td>
                              <td className="p-3 font-semibold text-zinc-900">{p.name}</td>
                              <td className="p-3 font-mono text-zinc-600">{p.category}</td>
                              <td className="p-3 font-display font-bold tabular-nums">
                                ${p.price}
                                {p.salePrice && (
                                  <span className="text-red-600 ml-1 text-[11px]">(${p.salePrice})</span>
                                )}
                              </td>
                              <td className="p-3 font-mono">
                                <span
                                  className={
                                    p.stockQuantity <= 10
                                      ? 'text-red-600 font-bold'
                                      : 'text-zinc-900'
                                  }
                                >
                                  {p.stockQuantity} units
                                </span>
                              </td>
                              <td className="p-3 font-mono text-zinc-500">{p.gsm}</td>
                              <td className="p-3">
                                {p.featured && (
                                  <span className="px-1.5 py-0.2 bg-zinc-200 text-zinc-800 text-[10px] font-mono rounded mr-1">
                                    Featured
                                  </span>
                                )}
                                {p.bestSeller && (
                                  <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] font-mono rounded">
                                    Best
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setIsAddingProduct(false);
                                    setEditingProduct(p);
                                  }}
                                  className="p-1 text-zinc-600 hover:text-zinc-950 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ORDERS MANAGEMENT TAB */}
              {adminTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-700 uppercase">Filter by Status:</span>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="text-xs font-mono bg-white border border-zinc-200 rounded px-2.5 py-1.5"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Production">Production</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase border-b border-zinc-200">
                        <tr>
                          <th className="p-3">Order #</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Tracking</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-medium">
                        {orders
                          .filter((o) => orderFilter === 'All' || o.status === orderFilter)
                          .map((o) => (
                            <tr key={o.id} className="hover:bg-zinc-50">
                              <td className="p-3 font-mono font-bold text-red-600">{o.orderNumber}</td>
                              <td className="p-3">
                                <p className="font-semibold text-zinc-900">{o.customerName}</p>
                                <p className="text-zinc-500 text-[11px]">{o.guestEmail}</p>
                              </td>
                              <td className="p-3">{o.items.length} items</td>
                              <td className="p-3 font-display font-bold tabular-nums">
                                ${o.total.toFixed(2)}
                              </td>
                              <td className="p-3">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                  className="text-xs font-mono bg-white border border-zinc-300 rounded px-2 py-0.5 font-bold cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Production">Production</option>
                                  <option value="Ready to Ship">Ready to Ship</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-3 font-mono text-zinc-500">
                                {o.trackingNumber || 'Unassigned'}
                              </td>
                              <td className="p-3 font-mono text-zinc-500">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setSelectedOrder(o)}
                                  className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                                >
                                  View Spec
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CUSTOM INQUIRIES TAB */}
              {adminTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase border-b border-zinc-200">
                        <tr>
                          <th className="p-3">Inquiry #</th>
                          <th className="p-3">Client & Squad</th>
                          <th className="p-3">Garment & Units</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Quotation</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-medium">
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-zinc-50">
                            <td className="p-3 font-mono font-bold text-red-600">{inq.inquiryNumber}</td>
                            <td className="p-3">
                              <p className="font-semibold text-zinc-900">{inq.clientName}</p>
                              <p className="text-zinc-500 text-[11px]">{inq.organization || inq.email}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-zinc-900">{inq.garmentType}</p>
                              <span className="font-mono text-zinc-500">{inq.quantity} pieces</span>
                            </td>
                            <td className="p-3">
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                className="text-xs font-mono bg-white border border-zinc-300 rounded px-2 py-0.5 font-bold cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Reviewing">Reviewing</option>
                                <option value="Quote Prepared">Quote Prepared</option>
                                <option value="Awaiting Customer">Awaiting Customer</option>
                                <option value="Sample Approved">Sample Approved</option>
                                <option value="Production">Production</option>
                                <option value="Completed">Completed</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </td>
                            <td className="p-3 font-display font-bold tabular-nums">
                              {inq.quotationAmount ? `$${inq.quotationAmount.toLocaleString()}` : 'Pending Calc'}
                            </td>
                            <td className="p-3 font-mono text-zinc-500">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* INVENTORY MANAGEMENT */}
              {adminTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                    <h4 className="font-display text-sm font-bold uppercase mb-2">
                      Live Warehouse Inventory Tracker
                    </h4>
                    <p className="text-xs text-zinc-600">
                      Stock decrements automatically when customer orders are placed and confirmed.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase border-b border-zinc-200">
                        <tr>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Item</th>
                          <th className="p-3">Available Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Quick Adjust</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-mono">
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td className="p-3 font-bold text-red-600">{p.sku}</td>
                            <td className="p-3 font-sans font-semibold text-zinc-900">{p.name}</td>
                            <td className="p-3 font-bold text-base tabular-nums">{p.stockQuantity}</td>
                            <td className="p-3">
                              {p.stockQuantity <= 10 ? (
                                <span className="text-red-600 font-bold">Low Stock Warning</span>
                              ) : (
                                <span className="text-emerald-700">Healthy</span>
                              )}
                            </td>
                            <td className="p-3 space-x-1">
                              <button
                                onClick={async () => {
                                  await api.updateAdminProduct(p.id, {
                                    stockQuantity: p.stockQuantity + 10,
                                  });
                                  await loadAllAdminData();
                                }}
                                className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded font-bold cursor-pointer"
                              >
                                +10
                              </button>
                              <button
                                onClick={async () => {
                                  await api.updateAdminProduct(p.id, {
                                    stockQuantity: Math.max(0, p.stockQuantity - 10),
                                  });
                                  await loadAllAdminData();
                                }}
                                className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded font-bold cursor-pointer"
                              >
                                -10
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CUSTOMERS TAB */}
              {adminTab === 'customers' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase border-b border-zinc-200">
                        <tr>
                          <th className="p-3">Customer ID</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 font-medium">
                        {customers.map((c) => (
                          <tr key={c.id}>
                            <td className="p-3 font-mono text-zinc-400">{c.id}</td>
                            <td className="p-3 font-bold text-zinc-900">{c.name}</td>
                            <td className="p-3 font-mono text-zinc-600">{c.email}</td>
                            <td className="p-3 font-mono text-zinc-500">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DISCOUNTS TAB */}
              {adminTab === 'discounts' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display text-sm font-bold uppercase">
                      Promotional Codes & Rules
                    </h4>
                    <button
                      onClick={() => setShowNewDiscountModal(true)}
                      className="px-3 py-1.5 bg-zinc-950 text-white font-bold text-xs uppercase rounded-sm cursor-pointer"
                    >
                      + Create Promo Code
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {discounts.map((d) => (
                      <div key={d.code} className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                        <span className="font-mono text-base font-black text-red-600 block">
                          {d.code}
                        </span>
                        <p className="text-xs text-zinc-600 mt-1 font-medium">
                          {d.type === 'percentage' ? `${d.value}% Off` : `$${d.value} Off`} (Min $
                          {d.minOrderValue})
                        </p>
                        <span className="font-mono text-[10px] text-zinc-400 block mt-2">
                          Redeemed: {d.usageCount} times
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SITE CONTENT MANAGEMENT */}
              {adminTab === 'content' && siteContent && (
                <form onSubmit={handleSaveContent} className="max-w-2xl space-y-4">
                  <h4 className="font-display text-sm font-bold uppercase border-b border-zinc-200 pb-2">
                    Live Storefront Content & Announcement Bar
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Top Announcement Bar
                    </label>
                    <input
                      type="text"
                      value={siteContent.announcementBar}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, announcementBar: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Homepage Hero Headline
                    </label>
                    <input
                      type="text"
                      value={siteContent.heroHeadline}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroHeadline: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Hero Supporting Text
                    </label>
                    <textarea
                      rows={2}
                      value={siteContent.heroSubtitle}
                      onChange={(e) =>
                        setSiteContent({ ...siteContent, heroSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Business Concierge Phone
                      </label>
                      <input
                        type="text"
                        value={siteContent.businessPhone}
                        onChange={(e) =>
                          setSiteContent({ ...siteContent, businessPhone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Free Shipping Threshold ($)
                      </label>
                      <input
                        type="number"
                        value={siteContent.freeShippingThreshold}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            freeShippingThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Save & Update Storefront
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Product Add / Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950"
              >
                ×
              </button>
              <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight mb-4">
                {isAddingProduct ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT SPEC'}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-800 uppercase mb-1">SKU</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 uppercase mb-1">Category</label>
                    <select
                      value={editingProduct.category || 'Hoodies'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded"
                    >
                      <option value="Hoodies">Hoodies</option>
                      <option value="Tracksuits">Tracksuits</option>
                      <option value="Sports Jerseys">Sports Jerseys</option>
                      <option value="Jackets">Jackets</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Shorts">Shorts</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-800 uppercase mb-1">Regular Price ($)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 uppercase mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      value={editingProduct.salePrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) || undefined })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-800 uppercase mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stockQuantity || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Fabric & GSM</label>
                  <input
                    type="text"
                    value={editingProduct.fabric || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    />
                    <span>Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={editingProduct.bestSeller || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bestSeller: e.target.checked })}
                    />
                    <span>Best Seller</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border rounded text-xs font-bold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-zinc-950 text-white rounded text-xs font-bold uppercase hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-sm border border-zinc-200 shadow-2xl p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950"
              >
                ×
              </button>
              <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                ORDER SPEC: {selectedOrder.orderNumber}
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-zinc-50 rounded border">
                  <span className="font-bold block uppercase mb-1">Customer & Delivery:</span>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p>{selectedOrder.guestEmail}</p>
                  <p className="text-zinc-600 mt-1">
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.postalCode},{' '}
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded border">
                  <span className="font-bold block uppercase mb-2">Items:</span>
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-zinc-200 last:border-0">
                      <span>{i.name} ({i.selectedColor || i.color} · Size {i.selectedSize || i.size})</span>
                      <span className="font-mono font-bold">Qty {i.quantity} · ${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 text-sm">
                    <span>TOTAL:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Tracking Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={selectedOrder.trackingNumber || ''}
                      id="orderTrackingInput"
                      placeholder="e.g. 1Z9999999999"
                      className="flex-1 px-3 py-1.5 border rounded font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('orderTrackingInput') as HTMLInputElement;
                        handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status, undefined, input?.value);
                        alert('Tracking number updated!');
                      }}
                      className="px-3 py-1.5 bg-zinc-950 text-white font-bold rounded uppercase text-[11px]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Discount Modal */}
        {showNewDiscountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-sm bg-white rounded-sm border border-zinc-200 shadow-2xl p-6">
              <button
                onClick={() => setShowNewDiscountModal(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950"
              >
                ×
              </button>
              <h3 className="font-display text-lg font-black uppercase mb-3">CREATE DISCOUNT CODE</h3>
              <form onSubmit={handleAddDiscount} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                    placeholder="e.g. VIP25"
                    className="w-full px-3 py-2 border rounded font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Type</label>
                  <select
                    value={newDiscount.type}
                    onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newDiscount.value}
                    onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-zinc-950 text-white font-bold uppercase rounded hover:bg-red-600 transition-colors mt-2"
                >
                  Create Code
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
