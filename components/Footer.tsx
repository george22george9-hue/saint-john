export default function Footer() {
  return (
    <footer className="footer relative-z">
      <div className="container">
        <h4 className="mb-3 text-white fw-bold gsap-fade-up">
          اجتماع القديس يوحنا الحبيب
        </h4>
        <p className="mb-4 text-white-50 gsap-fade-up">
          كنيسة الشهيد العظيم مارجرجس بسندبيس
        </p>

        <div className="footer-hashtags gsap-fade-up">
          #عيلة_واحدة <span className="mx-2 text-white-50">|</span>{' '}
          #متتأخرش_وهات_صاحبك_في_إيدك
        </div>

        <div className="footer-social mt-4 gsap-fade-up">
          <a
            href="#"
            className="hover-magnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            title="فيسبوك"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://www.tiktok.com/@stjohnmeeting?_r=1&_t=ZS-98fBl2ThvFK"
            className="hover-magnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            title="تيك توك"
          >
            <i className="fab fa-tiktok"></i>
          </a>
          <a
            href="#"
            className="hover-magnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            title="يوتيوب"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href="#"
            className="hover-magnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="إنستغرام"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://drive.google.com/drive/folders/1Khsi7gv1mcFDEBuB2uLfoFil6Ppk8OVU"
            className="hover-magnet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تطبيق اجتماعنا"
            title="تطبيق اجتماعنا"
          >
            <i className="fas fa-mobile-alt"></i>
          </a>
        </div>

        <div className="copyright gsap-fade-up mt-4">
          &copy; 2026 اجتماع القديس يوحنا الحبيب للشباب. مبني بمحبة ✝️
        </div>
      </div>
    </footer>
  );
}
