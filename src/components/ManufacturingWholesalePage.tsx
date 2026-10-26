import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Scissors,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calculator,
  ArrowRight,
  Send,
  Building2,
  Globe,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ManufacturingWholesalePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'custom-mfg' | 'private-label' | 'teamwear' | 'wholesale'>('custom-mfg');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: 'United States',
    productType: 'Apex Heavyweight Fleece Hoodie (480 GSM)',
    quantity: 100,
    sizeRange: 'XS - 2XL',
    fabricPreference: '100% Combed Heavy French Terry (480 GSM)',
    decorationMethod: '3D High-Density Silicone + Embroidery',
    targetBudget: '',
    targetDeliveryDate: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await api.submitCustomInquiry({
        type: activeTab === 'wholesale' ? 'wholesale' : 'manufacturing_quote',
        clientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.company,
        country: formData.country,
        garmentType: formData.productType,
        quantity: formData.quantity,
        specifications: {
          sizeRange: formData.sizeRange,
          fabric: formData.fabricPreference,
          decoration: formData.decorationMethod,
        },
        targetBudget: formData.targetBudget,
        targetDeliveryDate: formData.targetDeliveryDate,
        internalNotes: formData.notes,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#18181B', '#F4F4F5'],
      });

      setSubmittedInquiry(res.inquiry);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white min-h-screen py-12 sm:py-20 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-[2px] bg-red-600" />
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              INDUSTRIAL ATELIER SERVICES
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 uppercase tracking-tight mb-4">
            FROM YOUR IDEA TO YOUR COLLECTION.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            End-to-end bespoke sportswear manufacturing, private label development, and bulk teamwear production. Custom textile milling, computerized pattern grading, and international dispatch.
          </p>
        </div>

        {/* Manufacturing Service Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { id: 'custom-mfg', label: 'Custom Manufacturing', sub: 'From 25 Pieces MOQ' },
            { id: 'private-label', label: 'Private Label Production', sub: 'Custom Tags & Packaging' },
            { id: 'teamwear', label: 'Team & Club Uniforms', sub: 'Sublimated & Embroidered' },
            { id: 'wholesale', label: 'Wholesale & Bulk Production', sub: 'Tiered Bulk Pricing' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-4 border text-left rounded-sm transition-all cursor-pointer ${
                  active
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-md'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-800'
                }`}
              >
                <h4 className="font-display text-sm font-bold uppercase tracking-tight mb-1">
                  {tab.label}
                </h4>
                <span className={`text-[11px] font-mono ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Service Details & Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
              <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Atelier Technical Capabilities</span>
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Our facilities operate computerized multi-ply cutting beds, 15-color Japanese Tajima embroidery systems, and certified eco-reactive dye sublimation units.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-white border border-zinc-200 rounded">
                  <span className="text-zinc-400 block text-[10px]">MINIMUM RUN</span>
                  <span className="font-bold text-zinc-900">25 Pieces / Style</span>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded">
                  <span className="text-zinc-400 block text-[10px]">SAMPLE LEAD TIME</span>
                  <span className="font-bold text-zinc-900">7 - 10 Days</span>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded">
                  <span className="text-zinc-400 block text-[10px]">PRODUCTION LEAD</span>
                  <span className="font-bold text-zinc-900">18 - 25 Days</span>
                </div>
                <div className="p-2.5 bg-white border border-zinc-200 rounded">
                  <span className="text-zinc-400 block text-[10px]">QUALITY BENCHMARK</span>
                  <span className="font-bold text-red-600">AQL 1.5 Inspection</span>
                </div>
              </div>
            </div>

            {/* Fabric Library Overview */}
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
              <h3 className="font-display text-xl font-black text-zinc-950 uppercase tracking-tight mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                <span>Proprietary Textile Library</span>
              </h3>
              <ul className="space-y-2 text-xs text-zinc-700">
                <li className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="font-bold">Heavy French Terry</span>
                  <span className="font-mono text-zinc-500">420 - 520 GSM · 100% Cotton</span>
                </li>
                <li className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="font-bold">AeroStretch Double-Weave</span>
                  <span className="font-mono text-zinc-500">280 - 340 GSM · Poly-Elastane</span>
                </li>
                <li className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="font-bold">Diamond Vent Mesh</span>
                  <span className="font-mono text-zinc-500">160 - 190 GSM · Micro-Cell Poly</span>
                </li>
                <li className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="font-bold">HydroShield 3-Layer Ripstop</span>
                  <span className="font-mono text-zinc-500">10,000mm Hydrostatic Membrane</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Comprehensive Inquiry Form */}
          <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200 rounded-sm p-6 sm:p-8">
            {submittedInquiry ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">
                  MANUFACTURING INQUIRY REGISTERED
                </h3>
                <p className="font-mono text-xs text-red-600 font-bold mb-3">
                  INQUIRY REFERENCE: {submittedInquiry.inquiryNumber}
                </p>
                <p className="text-xs text-zinc-600 max-w-sm mb-6">
                  Thank you, {submittedInquiry.clientName}. Your custom manufacturing inquiry for {submittedInquiry.quantity} pieces has been stored in the MK Production Console. An atelier engineer will review your specs within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmittedInquiry(null)}
                  className="px-6 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Submit Another Specification
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-[2px] bg-red-600" />
                  <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                    OFFICIAL QUOTATION
                  </span>
                </div>
                <h3 className="font-display text-2xl font-black text-zinc-950 uppercase tracking-tight mb-4">
                  REQUEST A CUSTOM QUOTE
                </h3>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Marcus Vance"
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="marcus@apexclub.com"
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Brand / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Apex Athletic FC"
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Garment Silhouette *
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    >
                      <option>Apex Heavyweight Fleece Hoodie (480 GSM)</option>
                      <option>Aero-Speed Pro Tracksuit (2-Piece)</option>
                      <option>HyperVent Matchday Pro Jersey</option>
                      <option>WeatherShield Technical Anorak</option>
                      <option>Core Kinetic Training Tee (240 GSM)</option>
                      <option>AeroMotion 7" Training Shorts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Quantity (MOQ: 25) *
                    </label>
                    <input
                      type="number"
                      min="25"
                      max="10000"
                      step="5"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 25 })}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Decoration Technique
                    </label>
                    <select
                      value={formData.decorationMethod}
                      onChange={(e) => setFormData({ ...formData, decorationMethod: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    >
                      <option>3D High-Density Silicone + Embroidery</option>
                      <option>Tactile 15-Thread Japanese Tajima</option>
                      <option>Zero-Hand All-Over Dye Sublimation</option>
                      <option>Ultra-Matte Heat Transfer Seal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                      Target Delivery Window
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. November 2026"
                      value={formData.targetDeliveryDate}
                      onChange={(e) => setFormData({ ...formData, targetDeliveryDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                    Design Notes & Tech Pack Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Pantone codes, custom dimensions, silicone badge elevation, woven label requirements..."
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="font-mono">TRANSMITTING TECH SPEC...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-red-500" />
                      <span>SUBMIT TO ATELIER PRODUCTION CONSOLE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
