'use client';

import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import DesignRequestForm from '@/components/paizo/DesignRequestForm';

export default function DesignsPage() {
  return (
    <div className="container space-y-12 relative-z">
      <PaizoSectionHeader
        badge="ديزاينات وتنفيذ"
        title="اطلب تصميمك وتجهيز فعالياتك من PAIZO"
        subtitle="يتولى فريق PAIZO الإبداعي تصميم وتنفيذ الشهادات، البوسترات، مواد السوشيال ميديا، وملصقات الأنشطة الكنسية حسب طلب اجتماعك."
      />

      <div className="max-w-4xl mx-auto">
        <DesignRequestForm />
      </div>
    </div>
  );
}
