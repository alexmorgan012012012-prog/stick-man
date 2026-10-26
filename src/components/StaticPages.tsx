import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ChevronDown, ChevronUp, Send, ShieldCheck, Ruler } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StaticPagesProps {
  page: 'story' | 'process' | 'size-guide' | 'faqs' | 'contact' | 'policies';
  onNavigateTab: (tab: string) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onNavigateTab }) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Product Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Size chart unit toggle
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactLoading(true);
    try {
      await api.submitContact(contactName, contactEmail, contactSubject, contactMessage);
      setContactSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setContactError(err.message || 'Failed to send message.');
    } finally {
      setContactLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for custom manufacturing?',
      a: 'Our bespoke manufacturing run starts at an accessible MOQ of only 25 pieces per silhouette. This includes full custom colorway dyeing, custom pattern grading, and your team/brand 3D silicone or embroidery branding.',
    },
    {
      q: 'Can I order a physical sample before committing to full production?',
      a: 'Yes. In our Custom Design Lab you can order a one-off physical prototype tailored to your exact tech pack specifications. Samples typically dispatch within 7 to 10 business days.',
    },
    {
      q: 'How long does production and international dispatch take?',
      a: 'Standard bespoke production runs take 18 to 25 business days depending on quantity and graphic complexity. Finished orders are dispatched via tracked DHL/FedEx Express international courier.',
    },
    {
      q: 'What graphic application techniques do you support?',
      a: 'We specialize in high-density 3D silicone badges (up to 2.5mm relief), Japanese Tajima 15-thread direct embroidery, zero-hand dye sublimation, and durable matte heat seal transfers.',
    },
    {
      q: 'What is your return policy for ready-to-wear collection items?',
      a: 'Ready-to-wear items from our catalog can be returned or exchanged within 30 days of delivery provided they are unworn, unwashed, and in their original packaging with all security tags intact.',
    },
  ];

  return (
    <div className="w-full bg-white min-h-screen py-12 sm:py-20 border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story Page */}
        {page === 'story' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                ATELIER HERITAGE
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
                OUR STORY & TEXTILE PHILOSOPHY
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
              MK SPORTS was founded on a singular conviction: athletic apparel should merge the tactile weight of European luxury tailoring with the uncompromising performance demands of international athletes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="font-mono text-xs font-bold text-red-600 uppercase block mb-1">
                  01 // HEAVYWEIGHT FRENCH TERRY
                </span>
                <h4 className="font-display text-lg font-bold text-zinc-950 uppercase mb-2">
                  Double-Faced 480 GSM
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  We custom-knit our fleece from combed long-staple organic cotton yarns, achieving substantial drape, zero pilling, and enduring shape retention.
                </p>
              </div>

              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-sm">
                <span className="font-mono text-xs font-bold text-red-600 uppercase block mb-1">
                  02 // AEROMOTION ARCHITECTURE
                </span>
                <h4 className="font-display text-lg font-bold text-zinc-950 uppercase mb-2">
                  Bonded Seam Engineering
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Every racing seam is positioned to follow the athlete's natural kinetic muscular line, eliminating friction points and enabling full explosive articulation.
                </p>
              </div>
            </div>

            <div className="p-6 border border-zinc-200 rounded-sm bg-zinc-50 flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold uppercase text-zinc-900">
                  Ready to engineer your squad collection?
                </h4>
                <p className="text-xs text-zinc-500">
                  Collaborate directly with our master pattern makers.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('custom-lab')}
                className="px-4 py-2 bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-red-600 transition-colors cursor-pointer"
              >
                Launch Studio
              </button>
            </div>
          </div>
        )}

        {/* Manufacturing Process Page */}
        {page === 'process' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                ATELIER PROTOCOL
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
                THE 6-STAGE MANUFACTURING PROTOCOL
              </h1>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              From raw fiber spinning through millimeter-precise laser cutting and Japanese multi-head embroidery, every garment is tracked through our digital atelier console.
            </p>

            <div className="space-y-4">
              {[
                { step: '01', title: 'Yarn Spinning & Textile Milling', desc: 'Custom knitting of certified organic cottons and poly-elastane blends with strict dye fastness calibration.' },
                { step: '02', title: 'Ergonomic Pattern Drafting', desc: 'Computer-aided 3D CAD modeling with graded European and American athletic size charts.' },
                { step: '03', title: 'Automated Laser Cutting', desc: 'Vacuum-sealed automated cutting tables slicing multi-ply textiles with ±0.5mm edge-seal accuracy.' },
                { step: '04', title: '3D Silicone & Embroidery Execution', desc: 'Tactile silicone crests, high-density embroidery, or breathable Italian ink digital sublimation.' },
                { step: '05', title: 'Industrial Assembly & Seam Sealing', desc: '4-needle 6-thread flatlock stitching and internal heat-welded waterproof taped seams.' },
                { step: '06', title: 'Individual QC & Global Dispatch', desc: '8-point measurement inspection, commercial steam pressing, and bespoke barcoded packaging.' },
              ].map((s) => (
                <div key={s.step} className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm flex items-start gap-4">
                  <span className="font-mono text-base font-black text-red-600">{s.step}</span>
                  <div>
                    <h4 className="font-display text-sm font-bold uppercase text-zinc-950">{s.title}</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Size Guide Page */}
        {page === 'size-guide' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
              <div>
                <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                  FIT & DIMENSIONS
                </span>
                <h1 className="font-display text-4xl font-black text-zinc-950 uppercase tracking-tight">
                  INTERNATIONAL ATHLETIC SIZE GUIDE
                </h1>
              </div>

              {/* Unit Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-sm border border-zinc-200">
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-sm cursor-pointer ${
                    unit === 'cm' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Metric (CM)
                </button>
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-sm cursor-pointer ${
                    unit === 'in' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Imperial (IN)
                </button>
              </div>
            </div>

            {/* Tops Table */}
            <div>
              <h3 className="font-display text-lg font-bold text-zinc-950 uppercase mb-3">
                Hoodies, Track Jackets & Jerseys
              </h3>
              <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-100 font-mono text-[11px] text-zinc-700 uppercase">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">Chest Width</th>
                      <th className="p-3">Body Length</th>
                      <th className="p-3">Sleeve Length</th>
                      <th className="p-3">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono font-medium">
                    <tr>
                      <td className="p-3 font-bold text-red-600">XS</td>
                      <td className="p-3">{unit === 'cm' ? '92 cm' : '36.2 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '68 cm' : '26.8 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '62 cm' : '24.4 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '43 cm' : '16.9 in'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">S</td>
                      <td className="p-3">{unit === 'cm' ? '98 cm' : '38.6 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '70 cm' : '27.5 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '45 cm' : '17.7 in'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">M</td>
                      <td className="p-3">{unit === 'cm' ? '104 cm' : '40.9 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '66 cm' : '26.0 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '47 cm' : '18.5 in'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">L</td>
                      <td className="p-3">{unit === 'cm' ? '110 cm' : '43.3 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '74 cm' : '29.1 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '68 cm' : '26.8 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '49 cm' : '19.3 in'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">XL</td>
                      <td className="p-3">{unit === 'cm' ? '118 cm' : '46.5 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '76 cm' : '29.9 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '70 cm' : '27.5 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '51 cm' : '20.1 in'}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">2XL</td>
                      <td className="p-3">{unit === 'cm' ? '126 cm' : '49.6 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '78 cm' : '30.7 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                      <td className="p-3">{unit === 'cm' ? '53 cm' : '20.9 in'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FAQs Page */}
        {page === 'faqs' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                SUPPORT & INQUIRIES
              </span>
              <h1 className="font-display text-4xl font-black text-zinc-950 uppercase tracking-tight">
                FREQUENTLY ASKED QUESTIONS
              </h1>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-zinc-200 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-display text-sm font-bold uppercase tracking-tight flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-950"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-red-600" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Page */}
        {page === 'contact' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                DIRECT INQUIRY
              </span>
              <h1 className="font-display text-4xl font-black text-zinc-950 uppercase tracking-tight">
                CONTACT MK SPORTS ATELIER
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Atelier Location</span>
                      <p className="text-zinc-600">420 Olympic Boulevard, Suite 800, New York, NY 10001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Atelier Dispatch Email</span>
                      <p className="text-zinc-600 font-mono">atelier@mksports.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Direct Concierge</span>
                      <p className="text-zinc-600 font-mono">+1 (800) 482-0192</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Operational Hours</span>
                      <p className="text-zinc-600">Mon – Fri: 08:00 – 18:00 EST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                {contactSuccess ? (
                  <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-sm text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-display text-xl font-black text-zinc-950 uppercase">
                      MESSAGE TRANSMITTED
                    </h3>
                    <p className="text-xs text-zinc-600 mt-2">
                      Thank you. Your message has been routed to our atelier production concierge. We will respond within 4 hours.
                    </p>
                    <button
                      onClick={() => setContactSuccess(false)}
                      className="mt-4 px-4 py-2 bg-zinc-950 text-white font-bold text-xs uppercase rounded-sm cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {contactError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded">
                        {contactError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="marcus@apexclub.com"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Inquiry Subject
                      </label>
                      <select
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      >
                        <option>Product & Sizing Inquiry</option>
                        <option>Custom Manufacturing Tech Pack</option>
                        <option>Wholesale & Distribution</option>
                        <option>Order Tracking & Dispatch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 uppercase mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can our atelier assist your brand or squad?"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-sm focus:border-zinc-950 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full py-3 bg-zinc-950 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{contactLoading ? 'Transmitting...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Store Policies Page */}
        {page === 'policies' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-200 pb-6">
              <span className="font-mono text-xs text-red-600 uppercase tracking-widest block mb-2">
                TRANSPARENCY & TERMS
              </span>
              <h1 className="font-display text-4xl font-black text-zinc-950 uppercase tracking-tight">
                STORE POLICIES & TERMS
              </h1>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <div>
                <h3 className="font-display text-base font-bold text-zinc-950 uppercase mb-1">
                  1. Shipping & Global Dispatch
                </h3>
                <p>
                  Orders over $150 qualify for complimentary international tracked express courier. Standard orders are packed and shipped within 24 to 48 business hours with signature delivery confirmation.
                </p>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-zinc-950 uppercase mb-1">
                  2. 30-Day Return & Exchange Policy
                </h3>
                <p>
                  Unworn ready-to-wear items with original tags and security ribbons may be returned for a full refund or size exchange within 30 days of delivery. Custom-tailored squad uniforms and bespoke tech pack pieces are custom manufactured to client specifications and are non-refundable once production cutting begins.
                </p>
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-zinc-950 uppercase mb-1">
                  3. Privacy & Data Protection
                </h3>
                <p>
                  MK SPORTS complies with international data privacy standards. Customer passwords are never stored in plaintext and are salted and hashed on protected servers. We never sell or distribute athlete or brand information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
