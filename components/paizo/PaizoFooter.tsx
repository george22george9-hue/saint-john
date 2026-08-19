'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PaizoFooter() {
  return (
    <footer
      className="relative-z border-t border-amber-400/20 pt-5 pb-4 mt-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(7, 14, 36, 0.85) 0%, rgba(15, 28, 63, 0.98) 100%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container">
        <div className="row g-4 justify-content-between align-items-center pb-4 border-b border-white/10">
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-3 mb-2">
              <Image
                src="/paizo/assets/logo.png"
                alt="PAIZO Logo"
                width={50}
                height={50}
                className="object-contain rounded-xl border border-amber-400/40 p-1 bg-slate-900/80 shadow-gold"
                style={{ objectFit: 'contain' }}
              />
              <div>
                <h4 className="fw-black text-gradient-gold mb-0 fs-3">PAIZO</h4>
                <p className="small text-slate-300 mb-0">
                  إلهام + ألعاب + دراسات + ابتكار | اجتماع يوحنا الحبيب
                </p>
              </div>
            </div>
            <p className="text-slate-400 small mt-2">
              براند تفاعلي روحي مخصص لتسهيل وتوصيل المعرفة الروحية والطقسية والكتابية بأسلوب ممتع، مبتكر وشيق لشباب وخدام الكنيسة.
            </p>
          </div>

          <div className="col-lg-6">
            <div className="d-flex flex-wrap justify-content-lg-end gap-3 text-nowrap">
              <Link href="/paizo/games" className="text-slate-300 hover:text-accent font-semibold transition-colors">
                <i className="fas fa-gamepad me-1 text-accent"></i> الألعاب
              </Link>
              <Link href="/paizo/bible-studies" className="text-slate-300 hover:text-accent font-semibold transition-colors">
                <i className="fas fa-book-bible me-1 text-accent"></i> الدراسات
              </Link>
              <Link href="/paizo/workshops" className="text-slate-300 hover:text-accent font-semibold transition-colors">
                <i className="fas fa-tools me-1 text-accent"></i> ورش العمل
              </Link>
              <Link href="/paizo/infographics" className="text-slate-300 hover:text-accent font-semibold transition-colors">
                <i className="fas fa-chart-pie me-1 text-accent"></i> الإنفو جرافيك
              </Link>
              <Link href="/paizo/designs" className="text-slate-300 hover:text-accent font-semibold transition-colors">
                <i className="fas fa-magic me-1 text-accent"></i> الطلبات
              </Link>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 gap-2 text-center text-md-start">
          <p className="small text-slate-400 mb-0">
            جميع الحقوق محفوظة © {new Date().getFullYear()} — PAIZO | اجتماع القديس يوحنا الحبيب للشباب بكنيسة مارجرجس بسندبيس.
          </p>
          <Link href="/" className="small text-amber-400 hover:underline">
            العودة للموقع الرئيسي للاجتماع <i className="fas fa-arrow-left ms-1"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
