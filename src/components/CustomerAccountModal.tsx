import React, { useState, useEffect } from 'react';
import { CustomerUser, Order, Product } from '../types';
import { api, authStorage } from '../services/api';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Package,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(authStorage.getCustomer());
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Customer orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const current = authStorage.getCustomer();
    setCustomer(current);
    if (current && isOpen) {
      loadCustomerOrders(current.email);
    }
  }, [isOpen]);

  const loadCustomerOrders = async (custEmail: string) => {
    setLoadingOrders(true);
    try {
      // Look up orders matching customer email or ID
      const allOrders = await api.getAdminOrders().catch(() => []);
      const myOrders = allOrders.filter(
        (o) => o.guestEmail?.toLowerCase() === custEmail.toLowerCase() || o.customerId === customer?.id
      );
      setOrders(myOrders);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const cust = await api.login(email, password);
      setCustomer(cust);
      loadCustomerOrders(cust.email);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const cust = await api.register(name, email, password);
      setCustomer(cust);
      loadCustomerOrders(cust.email);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clearCustomer();
    setCustomer(null);
    setOrders([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-sm border border-zinc-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!customer ? (
          /* Authentication Form */
          <div className="max-w-md mx-auto py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-red-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                MK SPORTS MEMBERSHIP
              </span>
            </div>

            <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-6">
              {mode === 'login' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE YOUR MK PROFILE'}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@apexclub.com"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                />
                {mode === 'register' && (
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Must be at least 6 characters.
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoading
                  ? 'Verifying...'
                  : mode === 'login'
                  ? 'Sign In to Profile'
                  : 'Register Account'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
              {mode === 'login' ? (
                <p className="text-xs text-zinc-600">
                  New to MK SPORTS?{' '}
                  <button
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className="font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-zinc-600">
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Customer Portal View */
          <div>
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 mb-6">
              <div>
                <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-1">
                  MK ATHLETE PORTAL
                </span>
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight">
                  WELCOME, {customer.name}
                </h3>
                <p className="text-xs text-zinc-500 font-mono">{customer.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 hover:border-zinc-950 text-xs font-semibold uppercase text-zinc-700 hover:text-zinc-950 rounded-sm transition-colors cursor-pointer self-start sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 mb-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                Order History ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                Profile Details
              </button>
            </div>

            {/* Content view */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {loadingOrders ? (
                  <p className="text-xs font-mono text-zinc-400 py-6 text-center">
                    LOADING ATHLETE ORDERS...
                  </p>
                ) : orders.length > 0 ? (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-red-600 uppercase mr-2">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-zinc-950 text-white px-2 py-0.5 rounded uppercase font-bold">
                            {ord.status}
                          </span>
                          <span className="font-display font-bold text-sm text-zinc-950 tabular-nums">
                            ${ord.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-zinc-900">
                              {item.name} ({item.selectedColor || item.color} · Size {item.selectedSize || item.size})
                            </span>
                            <span className="font-mono text-zinc-500">
                              Qty {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {ord.trackingNumber && (
                        <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-600">
                          <span>DISPATCH TRACKING:</span>
                          <span className="text-red-600 font-bold">{ord.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-zinc-50 border border-zinc-200 rounded-sm">
                    <Package className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="font-display text-sm font-bold text-zinc-800 uppercase">
                      No Past Orders Found
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Your confirmed orders and custom tech packs will appear here automatically.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm space-y-4 text-xs">
                <div>
                  <span className="font-bold text-zinc-500 uppercase block mb-1">
                    Athlete Name:
                  </span>
                  <p className="font-semibold text-zinc-900 text-sm">{customer.name}</p>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 uppercase block mb-1">
                    Registered Email:
                  </span>
                  <p className="font-semibold text-zinc-900 text-sm">{customer.email}</p>
                </div>
                <div>
                  <span className="font-bold text-zinc-500 uppercase block mb-1">
                    Account Created:
                  </span>
                  <p className="font-mono text-zinc-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
