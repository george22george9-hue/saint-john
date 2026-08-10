export default function WahshatnaBanner() {
  return (
    <section
      className="wahshatna-banner text-center py-5 relative-z gsap-fade-up"
      style={{ backgroundColor: 'var(--primary-dark)', color: 'white' }}
    >
      <div className="container">
        <h3 className="mb-3 text-white fw-bold">مفتقدينك معانا! ❤️</h3>
        <p className="mb-4 text-white opacity-75">
          رسالة حب دافية مستنياك.. اللمة مش بتكمل غير بيك.
        </p>
        <a
          href="https://eftqad.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-danger btn-lg w-100 py-3 rounded-3 fw-bold hover-magnet"
          style={{
            maxWidth: '800px',
            fontSize: '1.2rem',
            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.4)',
            transition: 'all 0.3s ease',
          }}
        >
          <i className="fas fa-heart me-2"></i> شوف رسالتك دلوقتي
        </a>
      </div>
    </section>
  );
}
