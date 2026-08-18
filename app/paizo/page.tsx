'use client';

import Link from 'next/link';
import Image from 'next/image';
import PaizoSectionHeader from '@/components/paizo/PaizoSectionHeader';
import GameCard from '@/components/paizo/GameCard';
import ScrollReveal from '@/components/paizo/ScrollReveal';
import { PAIZO_GAMES } from '@/lib/paizoData';

export default function PaizoLandingPage() {
  const categories = [
    {
      id: 'bible-studies',
      title: 'دراسات كتابية',
      titleEnglish: 'Bible Studies',
      assetIcon: '/paizo/assets/زر الدراسات.png',
      badgeIcon: '/paizo/assets/5.png',
      description: 'سلاسل تفاعلية لدراسة الأسفار المقدسة (سفر الخروج "أكسودوس"، سفر اللاويين "ليفيت"، ورعاة الكنيسة) على محطات كنسية.',
      link: '/paizo/bible-studies',
      badge: 'سلاسل دراسية',
    },
    {
      id: 'games',
      title: 'ألعاب',
      titleEnglish: 'Games',
      assetIcon: '/paizo/assets/زر اللعاب.png',
      badgeIcon: '/paizo/assets/6.png',
      description: 'ألعاب كروت وتحديات تمثيل ومشاركة (BIBLE MIME, S.T MIME, TAKO) تعزز المعرفة الروحية بأسلوب ممتع وشيق.',
      link: '/paizo/games',
      badge: 'ألعاب جماعية',
    },
    {
      id: 'workshops',
      title: 'ورش عمل',
      titleEnglish: 'Workshops',
      assetIcon: '/paizo/assets/5.png',
      description: 'ورش عمل تطبيقية مخصصة للخدام والشباب لتطوير المهارات، ابتكار الألعاب، وتبسيط المفاهيم اللاهوتية.',
      link: '/paizo/workshops',
      badge: 'تطبيقات عملية',
    },
    {
      id: 'infographics',
      title: 'إنفو جرافيك',
      titleEnglish: 'Infographics',
      assetIcon: '/paizo/assets/7.png',
      description: 'معرض بصري جرافيكي يلخص الأحداث الكتابية والرموز الطقسية وسير القديسين بأسلوب مبسط وممتع للعين.',
      link: '/paizo/infographics',
      badge: 'معرض بصري',
    },
    {
      id: 'designs',
      title: 'ديزاينات وتنفيذ ++',
      titleEnglish: 'Designs & Execution ++',
      assetIcon: '/paizo/assets/logo.png',
      description: 'قسم خاص لطلب التصاميم المخصصة (شهادات تقدير، بوسترات، تصاميم اجتماعات وفعاليات) ليقوم فريق PAIZO بتنفيذها.',
      link: '/paizo/designs',
      badge: 'اطلب تصميمك',
    },
  ];

  return (
    <div className="space-y-20 relative-z">
      {/* 1. Hero / Header Section */}
      <section className="relative pt-6 pb-8 md:py-12 overflow-hidden">
        {/* Ambient Glow Spheres */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative-z text-center">
          <div className="inline-block relative mb-6 group">
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="relative p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-amber-400/50 shadow-2xl backdrop-blur-xl">
              <Image
                src="/paizo/assets/logo.png"
                alt="Official PAIZO Logo"
                width={220}
                height={220}
                className="object-contain hover:scale-105 transition-transform duration-500 mx-auto drop-shadow-2xl"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-400/10 text-amber-400 border border-amber-400/30 mb-3 shadow-gold">
            <i className="fas fa-sparkles text-amber-400"></i> PAIZO παίζω — BRAND & CREATIVITY
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
            عالم <span className="text-gradient-gold">PAIZO</span> التفاعلي
          </h1>
          <p className="text-amber-400/90 text-sm md:text-base font-bold">
            مقدمة من كنيسة الشهيد العظيم مارجرجس بسندبيس
          </p>
        </div>
      </section>

      {/* 2. "من نحن" Section - Original PDF Text & Original "زر من نحن" Asset */}
      <section className="container">
        <ScrollReveal yOffset={50} duration={600}>
          <div className="p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-amber-400/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="row align-items-center g-5 relative-z">
              <div className="col-lg-4 text-center">
                <div className="relative inline-block p-4 rounded-2xl bg-slate-950 border border-amber-400/30 shadow-gold">
                  <Image
                    src="/paizo/assets/زر من نحن.png"
                    alt="زر من نحن PAIZO"
                    width={180}
                    height={180}
                    className="object-contain mx-auto"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className="col-lg-8 text-center text-lg-start">
                <div className="d-inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                  <Image src="/paizo/assets/logo.png" alt="PAIZO" width={20} height={20} className="object-contain" />
                  <span>مين إحنا / من نحن</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  شباب كنيسة مارجرجس بسندبيس
                </h2>

                <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-6">
                  أحنا شباب كنيسة مارجرجس بسندبيس حبينا نخلي التعليم اسهل من خلال الألعاب بشكل روحي والنوتات الروحية والكتيبات والإنفو جرافيك بنحاول توصيل المعلومة بشكل مبسط وسهل هدفنا نخلي المعلومة موجودة باسلوب جديد وممتع وشيق ويخلي المخدوم او الشخص الي هيستعمل اي حاجه من منتجات paizo يوصل للهدف بطريقة ممتعة.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-400/20 text-amber-300 font-bold text-sm">
                  <i className="fas fa-bullhorn text-amber-400 me-2"></i>
                  أنتظروا الفترة اللي جاية شغل جبار لسه فيه جديد هينزل.. صلوا من أجلنا.
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3 & 4. "الألعاب" Section with Original "زر الألعاب" Asset & Bottom-to-Top Staggered Entrance */}
      <section className="container">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3 shadow-gold">
            <Image src="/paizo/assets/6.png" alt="Games Icon" width={22} height={22} className="object-contain" />
            <span>ألعاب PAIZO</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image src="/paizo/assets/زر اللعاب.png" alt="زر الألعاب" width={55} height={55} className="object-contain" />
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              الألعاب الروحية الجماعية
            </h2>
          </div>

          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            ألعاب تفاعلية صُممت خصيصاً للتعرف على شخصيات الكتاب المقدس وقديسي السنكسار والكتب الطقسية
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full mt-4 mx-auto" />
        </div>

        {/* 3 Game Cards with Scroll Entrance Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PAIZO_GAMES.map((game, idx) => (
            <ScrollReveal key={game.id} delay={idx * 130} yOffset={70} scale={0.96} duration={650}>
              <GameCard game={game} index={idx} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. Existing PAIZO Categories (Staggered Scroll Reveal) */}
      <section className="container">
        <PaizoSectionHeader
          badge="اقسام PAIZO الرئيسية"
          title="عالم من الإبداع والتعلم التفاعلي"
          subtitle="اختر القسم الذي ترغب في استكشافه لبدء رحلة الألعاب، الدراسات، والأنشطة الروحية"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <ScrollReveal key={cat.id} delay={idx * 100} yOffset={45} scale={0.97} duration={550}>
              <Link
                href={cat.link}
                className="group relative p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-gold/20 flex flex-col justify-between no-underline"
                style={{ textDecoration: 'none' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-2 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shadow-gold">
                      <Image src={cat.assetIcon} alt={cat.title} width={48} height={48} className="object-contain" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-amber-400 border border-amber-500/20">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-amber-400/80 font-bold mb-3 tracking-wide">
                    {cat.titleEnglish}
                  </p>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm group-hover:translate-x-[-4px] transition-transform">
                  <span>استعرض القسم</span>
                  <i className="fas fa-arrow-left text-xs"></i>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
