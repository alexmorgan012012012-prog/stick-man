import React, { useState } from 'react';
import { CartItem } from '../types';
import { api, authStorage } from '../services/api';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const customer = authStorage.getCustomer();

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoMsg, setPromoMsg] = useState<string>('');

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string>('');

  const [shippingForm, setShippingForm] = useState({
    name: customer?.name || 'Marcus Vance',
    email: customer?.email || 'marcus@apexclub.com',
    phone: '+1 (555) 019-2834',
    address: '420 Olympic Boulevard, Suite 800',
    city: 'New York',
    postalCode: '10001',
    country: 'United States',
    orderNotes: '',
    paymentMethod: 'Credit Card (Stripe Verified)',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = promoDiscountAmount;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await api.validateDiscount(promoCode, subtotal);
      if (res.valid) {
        setPromoDiscountAmount(res.discountAmount);
        setPromoApplied(true);
        setPromoMsg(`✓ Promotional code applied (-$${res.discountAmount.toFixed(2)})`);
      } else {
        setPromoApplied(false);
        setPromoDiscountAmount(0);
        setPromoMsg(res.message || 'Invalid promotion code.');
      }
    } catch {
      setPromoMsg('Validation error. Try MK2026.');
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerId: customer?.id,
        guestEmail: shippingForm.email,
        customerName: shippingForm.name,
        phone: shippingForm.phone,
        shippingAddress: {
          address: shippingForm.address,
          city: shippingForm.city,
          postalCode: shippingForm.postalCode,
          country: shippingForm.country,
          notes: shippingForm.orderNotes,
        },
        items,
        subtotal,
        discountAmount,
        discountCode: promoApplied ? promoCode : undefined,
        shippingCost: shipping,
        total,
        paymentMethod: shippingForm.paymentMethod,
        internalNotes: shippingForm.orderNotes,
      };

      const result = await api.placeOrder(orderPayload);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#DC2626', '#18181B', '#F4F4F5'],
      });

      setConfirmedOrderId(result.order.orderNumber);
      setOrderComplete(true);
      onClearCart();
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to complete order. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-zinc-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h3 className="font-display text-lg font-black text-zinc-950 uppercase tracking-tight">
              SHOPPING BAG ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[11px] text-zinc-600">
              {subtotal >= 150 ? (
                <span className="text-emerald-700 font-bold">✓ FREE EXPRESS DISPATCH UNLOCKED</span>
              ) : (
                `Add $${Math.max(0, 150 - subtotal)} more for Free Express Dispatch`
              )}
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              {Math.min(100, Math.round((subtotal / 150) * 100))}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / 150) * 100)}%` }}
            />
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderComplete ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                ORDER CONFIRMED & PERSISTED
              </h4>
              <p className="font-mono text-xs text-red-600 font-bold mb-1">
                CONFIRMATION #{confirmedOrderId}
              </p>
              <p className="text-xs text-zinc-600 max-w-xs mb-6">
                Receipt and dispatch tracking registered with MK Atelier Production. Inventory has been updated in the database.
              </p>
              <button
                onClick={() => {
                  setOrderComplete(false);
                  setIsCheckingOut(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleCompleteOrder} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="text-xs font-bold text-zinc-900 uppercase">
                  Shipping & Dispatch Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-red-600 underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded">
                  {checkoutError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.name}
                  onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 uppercase mb-1">
                  Delivery Instructions & Order Notes
                </label>
                <textarea
                  rows={2}
                  value={shippingForm.orderNotes}
                  onChange={(e) => setShippingForm({ ...shippingForm, orderNotes: e.target.value })}
                  placeholder="Gate code, team drop instructions, sizing notes..."
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-zinc-100 rounded-sm border border-zinc-200 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-700" />
                <span className="text-[11px] text-zinc-600">
                  Payment Verification: 256-Bit SSL Encrypted
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md mt-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Order in Database...' : `Place Confirmed Order · $${total.toFixed(2)}`}
              </button>
            </form>
          ) : items.length > 0 ? (
            /* Items list */
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-sm border border-zinc-200 bg-white shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display text-xs font-bold text-zinc-950 uppercase truncate">
                      {item.name}
                    </h5>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-mono text-[11px] text-zinc-500">
                    {item.selectedColor} · Size {item.selectedSize}
                  </p>

                  {item.isCustom && item.customDetails && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-mono uppercase rounded">
                      Custom Tech Spec
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-300 rounded-sm bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-zinc-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-zinc-600 hover:bg-zinc-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-display font-bold text-sm text-zinc-950 tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-zinc-300 mb-3" />
              <p className="font-display text-base font-bold text-zinc-900 uppercase">
                Your Bag Is Empty
              </p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Explore our commercial collection or customize a bespoke silhouette in the design studio.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout Trigger */}
        {!orderComplete && items.length > 0 && !isCheckingOut && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-3">
            {/* Promo Code Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code (use MK2026)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-sm uppercase focus:outline-none focus:border-zinc-950 font-mono"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                className="px-3 py-1.5 text-xs font-bold uppercase bg-zinc-950 text-white rounded-sm hover:bg-zinc-800 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {promoMsg && (
              <span
                className={`text-[11px] font-mono block ${
                  promoApplied ? 'text-emerald-600 font-bold' : 'text-red-600'
                }`}
              >
                {promoMsg}
              </span>
            )}

            {/* Price Calculations */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {promoDiscountAmount > 0 && (
                <div className="flex items-center justify-between text-red-600 font-mono">
                  <span>Promotion Discount</span>
                  <span>-${promoDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-zinc-600">
                <span>Express Shipping</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-950 font-bold text-base pt-2 border-t border-zinc-200">
                <span className="font-display uppercase">Total</span>
                <span className="font-display tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
