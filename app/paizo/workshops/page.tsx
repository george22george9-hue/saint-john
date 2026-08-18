'use client';

import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import PaizoOrderCTA from '@/components/paizo/PaizoOrderCTA';
import { PAIZO_WORKSHOPS } from '@/lib/paizoData';

export default function WorkshopsPage() {
  return (
    <div className="container space-y-12 relative-z">
      <PaizoSectionHeader
        badge="ورش عمل PAIZO"
        title="ورش عمل وتدريبات عملية للخدام والشباب"
        subtitle="برامج ورش تفاعلية تهدف لنقل مهارات ابتكار وسائل الإيضاح، الألعاب الروحية، وتبسيط الطقس والسنكسار بأسلوب حديث."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PAIZO_WORKSHOPS.map((ws) => (
          <div
            key={ws.id}
            className="group p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-2 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-gold">
                  <i className={ws.icon}></i>
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {ws.status}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-3">
                {ws.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {ws.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <i className="far fa-clock text-amber-400"></i>
                  <span className="font-bold text-slate-400">المدة الزمنية:</span>
                  <span className="font-black text-white">{ws.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <i className="fas fa-users text-amber-400"></i>
                  <span className="font-bold text-slate-400">الفئة المستهدفة:</span>
                  <span className="font-black text-white">{ws.targetAudience}</span>
                </div>
              </div>

              {/* Requirements List */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-amber-400 block mb-2">
                  <i className="fas fa-check-circle me-1"></i> متطلبات الورشة:
                </span>
                <ul className="space-y-1 mb-0 pr-0 list-none text-xs text-slate-300">
                  {ws.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Order & Inquiry CTA for Workshops */}
      <PaizoOrderCTA itemName="ورش العمل والتدريبات" itemType="ورشة" />
    </div>
  );
}
