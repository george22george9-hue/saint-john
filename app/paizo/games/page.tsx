'use client';

import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import GameCard from '@/components/paizo/GameCard';
import ScrollReveal from '@/components/paizo/ScrollReveal';
import { PAIZO_GAMES } from '@/lib/paizoData';

export default function GamesPage() {
  return (
    <div className="container space-y-12 relative-z">
      <PaizoSectionHeader
        badge="ألعاب PAIZO التفاعلية"
        title="مكتبة الألعاب الروحية والجماعية"
        subtitle="ألعاب تفاعلية صُممت خصيصاً لاجتماعات الشباب والخدمات للتعرف على شخصيات الكتاب المقدس وقديسي السنكسار والكتب الطقسية بأسلوب مليء بالحماس والمرح."
      />

      {/* Premium Staggered Reveal Games Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PAIZO_GAMES.map((game, idx) => (
          <ScrollReveal key={game.id} delay={idx * 130} yOffset={70} scale={0.96} duration={650}>
            <GameCard game={game} index={idx} />
          </ScrollReveal>
        ))}
      </div>

      {/* Info Notice Box */}
      <ScrollReveal yOffset={40} duration={500}>
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-amber-400/30 text-center max-w-3xl mx-auto shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl font-bold mx-auto mb-3">
            <i className="fas fa-lightbulb"></i>
          </div>
          <h4 className="text-xl font-black text-white mb-2">هل ترغب في طلب أو استعارة كروت الألعاب للاجتماع؟</h4>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            كافة ألعاب PAIZO مجهزة بكروت وتصاميم عالية الجودة للطباعة والاستخدام المباشر في الفعاليات والأنشطة الروحية.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
