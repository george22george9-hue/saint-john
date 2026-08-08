export default function Footer() {
  return (
    <footer className="footer relative-z">
      <div className="container">
        <h4 className="mb-3 text-primary fw-bold gsap-fade-up">
          اجتماع القديس يوحنا الحبيب
        </h4>
        <p className="mb-4 text-muted gsap-fade-up">
          كنيسة الشهيد العظيم مارجرجس بسندبيس
        </p>

        <div className="footer-hashtags text-accent fw-bold gsap-fade-up">
          #عيلة_واحدة <span className="mx-2 text-muted">|</span>{' '}
          #متتأخرش_وهات_صاحبك_في_إيدك
        </div>

        <div className="premium-social-wrapper mt-4 gsap-fade-up">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/1ESrPMcJEC/"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-social-item hover-magnet fb-btn"
            aria-label="فيسبوك"
          >
            <div className="social-icon-btn">
              <i className="fab fa-facebook-f"></i>
            </div>
            <span className="social-label">فيسبوك</span>
          </a>

          {/* WhatsApp Channel */}
          <a
            href="https://whatsapp.com/channel/0029VarbdqNCXC3T4BwPj90V"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-social-item hover-magnet wa-btn"
            aria-label="واتساب"
          >
            <div className="social-icon-btn">
              <i className="fab fa-whatsapp"></i>
            </div>
            <span className="social-label">واتساب</span>
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@stjohnmeeting?_r=1&_t=ZS-98fBl2ThvFK"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-social-item hover-magnet tt-btn"
            aria-label="تيك توك"
          >
            <div className="social-icon-btn">
              <i className="fab fa-tiktok"></i>
            </div>
            <span className="social-label">تيك توك</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/stjohnmeeting?igsh=ejNoNnIwaDlreWdv"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-social-item hover-magnet ig-btn"
            aria-label="إنستغرام"
          >
            <div className="social-icon-btn">
              <i className="fab fa-instagram"></i>
            </div>
            <span className="social-label">إنستغرام</span>
          </a>

          {/* Egtma3na App */}
          <a
            href="https://drive.google.com/drive/folders/1Khsi7gv1mcFDEBuB2uLfoFil6Ppk8OVU"
            target="_blank"
            rel="noopener noreferrer"
            className="premium-social-item hover-magnet app-btn"
            aria-label="تطبيق اجتماعنا"
          >
            <div className="social-icon-btn">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <span className="social-label">تطبيق اجتماعنا</span>
          </a>
        </div>

        <div className="copyright text-muted gsap-fade-up mt-4">
          &copy; 2026 اجتماع القديس يوحنا الحبيب للشباب. مبني بمحبة ✝️
        </div>
      </div>
    </footer>
  );
}
