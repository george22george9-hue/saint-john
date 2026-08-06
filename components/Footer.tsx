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
          <a href="#" className="hover-magnet" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover-magnet" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="#" className="hover-magnet" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        <div className="copyright gsap-fade-up mt-4">
          &copy; 2026 اجتماع القديس يوحنا الحبيب للشباب. مبني بمحبة ✝️
        </div>
      </div>
    </footer>
  );
}
