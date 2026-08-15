'use client';

import Image from 'next/image';
import CountdownTimer from './CountdownTimer';

interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section id="hero" className="hero-section">
      <div className="container relative-z">
        <div className="row justify-content-center">
          <div className="col-lg-10 gsap-hero-content">
            {/* Church Leadership Portraits Group */}
            <a
              href="#pastors"
              className="hero-pastors-wrapper d-inline-flex align-items-center justify-content-center w-100 mb-4 gsap-fade-up"
              title="رعاة الكنيسة والاجتماع - انقر للتفاصيل"
              aria-label="رعاة الكنيسة والاجتماع"
            >
              <div className="hero-portrait-item priest-item">
                <Image
                  src="/abona_bevnoty.jpeg"
                  alt="القمص بفنوتي"
                  width={56}
                  height={56}
                  className="rounded-circle shadow-md hero-portrait-img"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '2px solid var(--accent)',
                  }}
                />
              </div>
              <div className="hero-portrait-item bishop-item">
                <Image
                  src="/anba-morcos.jpg"
                  alt="نيافة الأنبا مرقس"
                  width={72}
                  height={72}
                  className="rounded-circle shadow-lg hero-portrait-img-lg"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '3px solid var(--accent)',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                />
              </div>
              <div className="hero-portrait-item priest-item">
                <Image
                  src="/abona_wessa.jpeg"
                  alt="القس وسا"
                  width={56}
                  height={56}
                  className="rounded-circle shadow-md hero-portrait-img"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '2px solid var(--accent)',
                  }}
                />
              </div>
            </a>

            <div>
              <span className="hashtag-badge mb-3 gsap-fade-up">
                <i className="fas fa-cross me-1"></i> #عيلة_واحدة
              </span>
            </div>
            <h1 className="hero-title mt-2 gsap-title">
              اجتماع القديس يوحنا الحبيب للشباب
            </h1>
            <h2 className="hero-subtitle gsap-subtitle">
              كنيسة الشهيد العظيم مارجرجس بسندبيس
            </h2>
            <p className="lead text-muted dark:text-gray-300 mb-4 fw-bold gsap-fade-up">
              بنمو روحي، معرفي، ومهاري في محبة المسيح وكنيسته الأرثوذكسية.
              <br />
              <span className="text-accent fw-extrabold">#متتأخرش_وهات_صاحبك_في_إيدك!</span>
            </p>

            <CountdownTimer />

            <div className="text-muted dark:text-gray-400 small mb-4 mt-n2 gsap-fade-up fw-semibold">
              باقي على اجتماع الجمعة (الساعة 7:00 مساءً)
            </div>

            <div className="hero-buttons gsap-fade-up">
              <a
                href="#programs"
                className="btn btn-primary-custom me-2 mb-2 hover-magnet"
              >
                <i className="far fa-calendar-alt me-2"></i>جدول المواعيد
              </a>
              <button
                className="btn btn-accent-custom mb-2 hover-magnet"
                onClick={onOpenModal}
              >
                <i className="far fa-envelope me-2"></i>شاركونا أسئلتكم
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
