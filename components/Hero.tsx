'use client';

import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import { PASTORS_DATA } from '@/lib/pastorsData';

interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const [bishop, frWessa, frBevnoty] = PASTORS_DATA;

  return (
    <section id="hero" className="hero-section">
      <div className="container relative-z">
        <div className="row justify-content-center">
          <div className="col-lg-10 gsap-hero-content">
            {/* Hero Metropolitan Profile Header */}
            <a
              href="#pastors"
              className="hero-bishop-header d-inline-block text-center mb-4 gsap-fade-up hover-magnet"
              title="رعاة الكنيسة والاجتماع - انقر للتفاصيل"
              aria-label="نيافة الأنبا مرقس"
            >
              <div className="position-relative d-inline-block mb-2">
                <Image
                  src={bishop.image}
                  alt={bishop.nameAr}
                  width={160}
                  height={160}
                  className="rounded-circle shadow-lg hero-bishop-img"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '3px solid var(--accent)',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                  priority
                />
              </div>
              <h3 className="hero-bishop-name text-main dark:text-white fw-extrabold mb-1 fs-4">
                {bishop.nameAr}
              </h3>
              <p className="hero-bishop-title text-accent fw-bold mb-0 fs-6">
                مطرانية شبرا الخيمة وتوابعها
              </p>
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
