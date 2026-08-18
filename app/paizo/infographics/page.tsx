'use client';

import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import InfographicCard from '@/components/paizo/InfographicCard';
import PaizoOrderCTA from '@/components/paizo/PaizoOrderCTA';
import { PAIZO_INFOGRAPHICS } from '@/lib/paizoData';

export default function InfographicsPage() {
  return (
    <div className="container space-y-12 relative-z">
      <PaizoSectionHeader
        badge="إنفو جرافيك PAIZO"
        title="معرض الإنفوجرافيك والرسوم البصرية"
        subtitle="ملخصات جرافيكية مبتكرة تشرح أسفار الكتاب المقدس، ضربات مصر، الذبائح الكنسية، وسير القديسين بأسلوب بصري ممتع وسهل التذكر."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PAIZO_INFOGRAPHICS.map((info) => (
          <InfographicCard key={info.id} infographic={info} />
        ))}
      </div>

      {/* WhatsApp Order & Inquiry CTA for Infographics */}
      <PaizoOrderCTA itemName="الإنفوجرافيك والتصاميم البصرية" itemType="إنفوجرافيك" />
    </div>
  );
}
