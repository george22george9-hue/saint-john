'use client';

import Image from 'next/image';

export default function Pastors() {
  return (
    <section id="pastors" className="section-padding bg-warm-white relative-z">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="section-title gsap-fade-up mb-2">رعاة الكنيسة والاجتماع</h2>
          <p
            className="text-muted dark:text-gray-300 fs-5 gsap-fade-up mb-0"
            dir="ltr"
            style={{ fontWeight: 600 }}
          >
            Church & Meeting Pastors
          </p>
        </div>

        {/* 1. Church Profile Card */}
        <div className="row justify-content-center mb-5 gsap-fade-up">
          <div className="col-lg-10">
            <div className="glass-card p-0 overflow-hidden hover-lift">
              <div className="row g-0 align-items-center">
                <div className="col-md-6 col-lg-7">
                  <div
                    className="position-relative w-100"
                    style={{ height: '300px', minHeight: '220px' }}
                  >
                    <Image
                      src="/church.jpeg"
                      alt="كنيسة الشهيد العظيم مارجرجس بسندبيس"
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      priority
                    />
                    <div
                      className="position-absolute bottom-0 start-0 w-100 p-3"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(15, 28, 63, 0.85) 0%, transparent 100%)',
                      }}
                    >
                      <span className="badge bg-accent text-dark fw-bold px-3 py-2 rounded-pill">
                        <i className="fas fa-church me-1"></i> كنيستنا المباركة
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-5 p-4 p-lg-5">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-cross text-accent fs-3 ms-2"></i>
                    <h3 className="text-primary fw-extrabold mb-0 fs-4">
                      كنيسة الشهيد العظيم مارجرجس بسندبيس
                    </h3>
                  </div>
                  <h4 className="text-accent fw-bold fs-6 mb-3" dir="ltr">
                    St. George Church – Sandbis
                  </h4>
                  <p className="text-muted dark:text-gray-300 mb-0 leading-relaxed fs-6">
                    البيت الروحي والملاذ الدائم لاجتماع القديس يوحنا الحبيب للشباب، حيث
                    نلتقي أسبوعياً تحت مظلة المحبة والصلاة وكلمة الله.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Metropolitan Profile */}
        <div className="row justify-content-center mb-5 gsap-fade-up">
          <div className="col-lg-8 col-md-10">
            <div
              className="glass-card text-center p-4 p-md-5 hover-lift position-relative"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: 'var(--shadow-gold)',
              }}
            >
              <div className="position-absolute top-0 start-50 translate-middle">
                <span
                  className="badge px-4 py-2 rounded-pill fw-bold"
                  style={{
                    background: 'var(--gradient-gold)',
                    color: '#070e24',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <i className="fas fa-crown me-1"></i> مطران الإيبارشية
                </span>
              </div>

              <div className="pt-3">
                <div
                  className="position-relative d-inline-block mb-3"
                  style={{ width: '150px', height: '150px' }}
                >
                  <Image
                    src="/anba-morcos.jpg"
                    alt="نيافة الأنبا مرقس"
                    fill
                    sizes="150px"
                    className="rounded-circle shadow-lg"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      border: '4px solid var(--accent)',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  />
                </div>

                <h3 className="text-primary fw-extrabold mb-1 fs-3">
                  نيافة الأنبا مرقس
                </h3>
                <h4
                  className="text-accent fw-bold fs-5 mb-2"
                  dir="ltr"
                >
                  H.G. Bishop Marcos
                </h4>
                <p className="text-muted dark:text-gray-300 fw-bold mb-1 fs-5">
                  مطران شبرا الخيمة وتوابعها
                </p>
                <p className="text-muted dark:text-gray-400 small mb-0" dir="ltr">
                  Metropolitan of Shoubra El-Kheima and its Dependencies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Church & Meeting Pastors Grid */}
        <div className="row g-4 justify-content-center gsap-fade-up">
          {/* Fr. Wessa (First Priest) */}
          <div className="col-md-6 col-lg-5">
            <div className="glass-card text-center p-4 hover-lift h-100">
              <div
                className="position-relative d-inline-block mb-3"
                style={{ width: '120px', height: '120px' }}
              >
                <Image
                  src="/abona_wessa.jpeg"
                  alt="القمص ويصا"
                  fill
                  sizes="120px"
                  className="rounded-circle shadow-md"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '3px solid var(--accent)',
                  }}
                />
              </div>

              <h4 className="text-primary fw-extrabold mb-1 fs-4">
                القمص ويصا
              </h4>
              <h5 className="text-accent fw-bold fs-6 mb-2" dir="ltr">
                Fr. Wessa
              </h5>
              <p className="text-muted dark:text-gray-300 fw-semibold mb-1 fs-6">
                كاهن الكنيسة ورائي الاجتماع
              </p>
              <p className="text-muted dark:text-gray-400 small mb-0" dir="ltr">
                Church & Meeting Pastor
              </p>
            </div>
          </div>

          {/* Fr. Bevnoty (Second Priest) */}
          <div className="col-md-6 col-lg-5">
            <div className="glass-card text-center p-4 hover-lift h-100">
              <div
                className="position-relative d-inline-block mb-3"
                style={{ width: '120px', height: '120px' }}
              >
                <Image
                  src="/abona_bevnoty.jpeg"
                  alt="القس بفنوتي عوض"
                  fill
                  sizes="120px"
                  className="rounded-circle shadow-md"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    border: '3px solid var(--accent)',
                  }}
                />
              </div>

              <h4 className="text-primary fw-extrabold mb-1 fs-4">
                القس بفنوتي عوض
              </h4>
              <h5 className="text-accent fw-bold fs-6 mb-2" dir="ltr">
                Fr. Bevnoty
              </h5>
              <p className="text-muted dark:text-gray-300 fw-semibold mb-1 fs-6">
                كاهن الكنيسة ورائي الاجتماع
              </p>
              <p className="text-muted dark:text-gray-400 small mb-0" dir="ltr">
                Church & Meeting Pastor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
