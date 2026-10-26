import React from 'react';
import { RotateCcw, ShieldCheck, Mail, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onReplayIntro: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onReplayIntro,
  onOpenTracking,
  onOpenAdmin,
}) => {
  return (
    <footer className="w-full bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('campaign')}
              className="flex items-center gap-1.5 text-2xl font-black tracking-tighter text-zinc-950 uppercase font-display cursor-pointer text-left"
            >
              <span>MK</span>
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
              <span>SPORTS</span>
            </button>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              International premium sportswear manufacturer and luxury apparel brand. Custom fabric milling, computerized laser cutting, high-density 3D silicone application, and global dispatch.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onReplayIntro}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-900 rounded-sm transition-colors cursor-pointer bg-zinc-50"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                <span>REPLAY INTRO</span>
              </button>

              <button
                onClick={onOpenTracking}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-900 rounded-sm transition-colors cursor-pointer bg-zinc-50"
              >
                <span>TRACK MY ORDER</span>
              </button>
            </div>
          </div>

          {/* Catalog & Silhouettes */}
          <div>
            <h4 className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-600">
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Shop All Garments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Hoodies (480 GSM Terry)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Aero-Speed Pro Tracksuits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  HyperVent Matchday Jerseys
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Technical Jackets & Anoraks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collection')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Training Tees & Shorts
                </button>
              </li>
            </ul>
          </div>

          {/* Manufacturing & Wholesale */}
          <div>
            <h4 className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
              MANUFACTURING
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-600">
              <li>
                <button
                  onClick={() => onNavigate('custom-lab')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Custom Design Studio Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manufacturing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Private Label Production
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manufacturing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Wholesale & Bulk Production
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manufacturing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Team Uniforms & Club Kits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manufacturing')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Fabric Milling & 3D Silicone
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Heritage & Support */}
          <div>
            <h4 className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
              ATELIER & SUPPORT
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-600">
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Our Story & Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('process')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  6-Stage Manufacturing Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('size-guide')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Size Guide (CM / IN)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Contact Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policies')}
                  className="hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  Store Policies & Shipping
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with subtle and discreet "Admin" link */}
        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} MK SPORTS INTERNATIONAL LTD. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>BUILT TO PERFORM.</span>
            <span>DESIGNED TO STAND OUT.</span>
            <span className="text-red-600 font-bold">MADE TO MOVE.</span>
            {/* Discreet Admin link required by prompt */}
            <span className="text-zinc-300">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
              title="MK Sports Atelier Administration"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
