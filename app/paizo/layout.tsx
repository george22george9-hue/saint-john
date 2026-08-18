import type { Metadata } from 'next';
import PaizoNavbar from '@/components/paizo/PaizoNavbar';
import PaizoFooter from '@/components/paizo/PaizoFooter';

export const metadata: Metadata = {
  title: 'PAIZO — ألعاب ودراسات اجتماع القديس يوحنا الحبيب للشباب',
  description:
    'قسم PAIZO التفاعلي الخاص بالألعاب الروحية، الدراسات الكتابية، ورش العمل، والإنفوجرافيك، وطلبات التصميم والتنفيذ.',
};

export default function PaizoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 dir-rtl">
      <PaizoNavbar />
      <main className="flex-grow pt-24 pb-16">{children}</main>
      <PaizoFooter />
    </div>
  );
}
