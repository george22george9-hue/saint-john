export default function About() {
  return (
    <section
      id="about"
      className="section-padding bg-warm-white overflow-hidden relative-z"
    >
      <div className="container">
        <h2 className="section-title gsap-fade-up">عن الاجتماع ورؤيتنا</h2>
        <div className="row align-items-center">
          <div className="col-md-5 text-center mb-5 mb-md-0 gsap-fade-left">
            <div className="position-relative d-inline-block">
              <i
                className="fas fa-church text-primary"
                style={{ fontSize: '8rem', opacity: 0.1 }}
              ></i>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="الشعار"
                className="position-absolute top-50 start-50 translate-middle rounded-circle shadow-lg"
                width="120"
                style={{ border: '4px solid var(--accent)' }}
              />
            </div>
          </div>
          <div className="col-md-7 gsap-fade-right">
            <div className="glass-card">
              <h3 className="mb-4 text-primary d-flex align-items-center">
                <i className="fas fa-heart text-accent ms-3 fs-2"></i> بيت روحي
                وعيلة واحدة
              </h3>
              <p className="text-muted fs-5 mb-3">
                اجتماع القديس يوحنا الحبيب للشباب هو أكتر من مجرد لقاء أسبوعي،
                هو <strong>#عيلة_واحدة</strong> بنجتمع فيها على محبة المسيح لتشجيع
                بعضنا البعض.
              </p>
              <p className="text-muted fs-5 mb-0">
                رؤيتنا إن كل شاب وشابة ينمو روحياً من خلال كلمة ربنا، ويبني صداقات
                مسيحية حقيقية، ويطور من مهاراته عشان يكون نور وملح في مجتمعه.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
