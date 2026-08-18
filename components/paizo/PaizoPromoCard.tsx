'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PaizoPromoCard() {
  return (
    <section id="paizo-promo" className="section-padding relative-z overflow-hidden py-16">
      <div className="container">
        <Link
          href="/paizo"
          className="group block relative rounded-3xl p-6 md:p-12 overflow-hidden border border-amber-400/40 shadow-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 no-underline hover:border-amber-400/80 transition-all duration-300"
          style={{ textDecoration: 'none' }}
        >
          {/* Ambient Lighting Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="row align-items-center g-5 relative-z">
            {/* Logo & Art Showcase */}
            <div className="col-lg-5 text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 rounded-3xl bg-slate-950 border border-amber-400/50 shadow-gold">
                  <Image
                    src="/paizo/assets/logo.png"
                    alt="Official PAIZO Logo"
                    width={240}
                    height={240}
                    className="object-contain group-hover:scale-105 transition-transform duration-500 mx-auto"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                  <div className="mt-4 pt-3 border-t border-amber-400/20">
                    <span className="badge bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                      PAIZO BRAND — παίζω
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Call To Action */}
            <div className="col-lg-7 text-center text-lg-start">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-3">
                <i className="fas fa-star text-amber-400"></i> جديد اجتماع الشباب
              </span>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-amber-300 transition-colors">
                عالم <span className="text-gradient-gold">PAIZO</span> التفاعلي
              </h2>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                براند ألعاب ودراسات اجتماع القديس يوحنا الحبيب للشباب. تجمع بين{' '}
                <strong className="text-amber-400">التعلم + الألعاب + الإبداع + الأنشطة + التصميم</strong>{' '}
                لتقديم المعرفة الروحية والطقسية بأسلوب مبتكر وممتع يخدم كل اجتماع وخادم.
              </p>

              {/* PAIZO Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-400/20 text-center">
                  <Image src="/paizo/assets/6.png" alt="ألعاب" width={32} height={32} className="object-contain mx-auto mb-1" />
                  <span className="text-xs font-bold text-white">ألعاب جماعية</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-400/20 text-center">
                  <Image src="/paizo/assets/5.png" alt="دراسات" width={32} height={32} className="object-contain mx-auto mb-1" />
                  <span className="text-xs font-bold text-white">دراسات كتابية</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-400/20 text-center">
                  <Image src="/paizo/assets/زر من نحن.png" alt="من نحن" width={32} height={32} className="object-contain mx-auto mb-1" />
                  <span className="text-xs font-bold text-white">ورش عمل</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-400/20 text-center">
                  <Image src="/paizo/assets/7.png" alt="إنفوجرافيك" width={32} height={32} className="object-contain mx-auto mb-1" />
                  <span className="text-xs font-bold text-white">تصاميم وتنفيذ</span>
                </div>
              </div>

              <div
                className="btn bg-gradient-gold hover:opacity-95 text-slate-950 font-black px-8 py-3.5 rounded-2xl shadow-gold hover:shadow-glow transition-all text-base inline-flex items-center gap-3 group-hover:shadow-glow"
                style={{ textDecoration: 'none' }}
              >
                <span>دخول عالم PAIZO</span>
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
