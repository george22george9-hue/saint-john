'use client';

import React from 'react';
import { buildPaizoWhatsAppUrl } from '@/lib/paizoWhatsApp';

interface PaizoOrderCTAProps {
  itemName?: string;
  itemType?: 'لعبة' | 'دراسة' | 'ورشة' | 'إنفوجرافيك' | 'تصميم' | 'عام';
  customMessage?: string;
  compact?: boolean;
}

export default function PaizoOrderCTA({
  itemName,
  itemType = 'عام',
  customMessage,
  compact = false,
}: PaizoOrderCTAProps) {
  let whatsappUrl = '';

  if (customMessage) {
    whatsappUrl = `https://wa.me/201202074649?text=${encodeURIComponent(customMessage)}`;
  } else {
    let typeKey: 'game' | 'study' | 'workshop' | 'infographic' | 'design' | 'custom' = 'custom';
    switch (itemType) {
      case 'لعبة':
        typeKey = 'game';
        break;
      case 'دراسة':
        typeKey = 'study';
        break;
      case 'ورشة':
        typeKey = 'workshop';
        break;
      case 'إنفوجرافيك':
        typeKey = 'infographic';
        break;
      case 'تصميم':
        typeKey = 'design';
        break;
      default:
        typeKey = 'custom';
    }
    whatsappUrl = buildPaizoWhatsAppUrl(typeKey, itemName);
  }

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-amber-400/30">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-400/15 text-amber-300 border border-amber-400/40">
          <span>🚚 متاح الشحن</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="paizo-whatsapp-btn no-underline"
          style={{ textDecoration: 'none' }}
        >
          <i className="fab fa-whatsapp text-xl"></i>
          <span>اطلب الآن عبر واتساب</span>
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-400/40 shadow-2xl relative overflow-hidden text-center md:text-start my-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="row align-items-center g-4 relative-z">
        <div className="col-lg-7">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
            {itemName ? `عجبتك ${itemType === 'لعبة' ? 'اللعبة' : 'الفكرة'}؟ اطلبها الآن من PAIZO` : 'طلب مباشر وتنفيذ من PAIZO'}
          </h3>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-0">
            تواصل معنا مباشرة عبر واتساب لطلب الألعاب، كروت الكنيسة، الدراسات، أو حجز الورش وتصاميم الفعاليات مع خدمة الشحن والتوصيل.
          </p>
        </div>

        <div className="col-lg-5 text-center flex flex-col items-center justify-center gap-3">
          {/* Shipping Badge directly above WhatsApp Button */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-gold">
            <span>🚚 متاح الشحن</span>
          </div>

          {/* High-Contrast WhatsApp CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="paizo-whatsapp-btn w-full sm:w-auto no-underline"
            style={{ textDecoration: 'none' }}
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>اطلب الآن عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
