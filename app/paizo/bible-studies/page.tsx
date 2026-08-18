'use client';

import Image from 'next/image';
import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import PaizoOrderCTA from '@/components/paizo/PaizoOrderCTA';
import { PAIZO_STUDIES } from '@/lib/paizoData';

export default function BibleStudiesPage() {
  return (
    <div className="container space-y-12 relative-z">
      <PaizoSectionHeader
        badge="الدراسات الكتابية"
        title="دراسات الأسفار والمحطات الروحية"
        subtitle="سلاسل دراسية مبتكرة للأسفار الكتابية تُدرس عبر محطات تفاعلية شيقة للمخدومين مع كروت ومسابقات مرافقة."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PAIZO_STUDIES.map((study) => (
          <div
            key={study.id}
            className="group rounded-3xl overflow-hidden border border-amber-400/20 bg-slate-900/70 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Study Cover */}
              <div className="relative aspect-[4/3] bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  style={{ objectFit: 'contain' }}
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  study.status === 'available'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {study.status === 'available' ? 'متاحة للطلب' : 'تحت الإنشاء ... قريباً'}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-1">
                  {study.title}
                </h3>
                <h4 className="text-xs font-bold text-amber-400/90 mb-3">
                  {study.subtitle}
                </h4>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {study.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">المحطة الأولى:</span>
                <span className="font-extrabold text-amber-400">{study.firstStation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Ordering & Shipping for Bible Studies */}
      <PaizoOrderCTA itemName="الدراسات الكتابية" itemType="دراسة" />
    </div>
  );
}
