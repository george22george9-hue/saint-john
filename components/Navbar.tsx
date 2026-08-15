'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top gsap-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand d-flex align-items-center" href="/#hero">
            <Image
              src="/logo.png"
              alt="شعار"
              width={45}
              height={45}
              className="me-2 rounded-circle"
              style={{ objectFit: 'cover', border: '2px solid var(--accent)' }}
              priority
            />
            <span>
              <span className="text-primary">يوحنا</span>{' '}
              <span className="text-accent">الحبيب</span>
            </span>
          </Link>

          {/* Desktop Navigation Links & Controls */}
          <div className="d-none d-lg-flex align-items-center ms-auto" id="navbarNavDesktop">
            <ul className="navbar-nav me-3 mb-0 align-items-center">
              <li className="nav-item">
                <a className="nav-link active" href="#hero">
                  الرئيسية
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  من نحن
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#pastors">
                  رعاة الكنيسة
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#programs">
                  برامجنا
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#news">
                  أحدث الفعاليات
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link text-danger fw-bold hover-magnet"
                  href="https://eftqad.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-heart"></i> وحشتنا
                </a>
              </li>
              <li className="nav-item ms-lg-3">
                <Link
                  className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold hover-magnet"
                  href="/admin"
                >
                  <i className="fas fa-shield-alt me-1"></i> دخول الخدام
                </Link>
              </li>
            </ul>

            {/* Desktop Theme Toggle */}
            <ThemeToggle className="ms-2" />
          </div>

          {/* Mobile Right Controls (Theme Toggle + Toggler Button) */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <ThemeToggle />
            <button
              className="navbar-toggler border-0 p-2"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="قائمة الملاحة"
              style={{ color: 'var(--accent)' }}
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} fs-3`} style={{ color: 'var(--accent)' }}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-nav-backdrop ${isOpen ? 'show' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${isOpen ? 'show' : ''}`} role="dialog" aria-label="قائمة الملاحة">
        <div className="mobile-drawer-header">
          <Link className="d-flex align-items-center" href="/#hero" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="شعار"
              width={38}
              height={38}
              className="me-2 rounded-circle"
              style={{ objectFit: 'cover', border: '2px solid var(--accent)' }}
            />
            <span>
              <span className="text-primary fw-bold">يوحنا</span>{' '}
              <span className="text-accent fw-bold">الحبيب</span>
            </span>
          </Link>
          <button
            className="mobile-drawer-close"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
          >
            <i className="fas fa-times fs-5"></i>
          </button>
        </div>

        <div className="mobile-drawer-links">
          <a className="mobile-drawer-link active" href="#hero" onClick={closeMenu}>
            <i className="fas fa-home me-2 text-accent fs-6"></i> الرئيسية
          </a>
          <a className="mobile-drawer-link" href="#about" onClick={closeMenu}>
            <i className="fas fa-church me-2 text-accent fs-6"></i> من نحن
          </a>
          <a className="mobile-drawer-link" href="#pastors" onClick={closeMenu}>
            <i className="fas fa-user-shield me-2 text-accent fs-6"></i> رعاة الكنيسة
          </a>
          <a className="mobile-drawer-link" href="#programs" onClick={closeMenu}>
            <i className="fas fa-calendar-alt me-2 text-accent fs-6"></i> برامجنا
          </a>
          <a className="mobile-drawer-link" href="#news" onClick={closeMenu}>
            <i className="fas fa-newspaper me-2 text-accent fs-6"></i> أحدث الفعاليات
          </a>
          <a
            className="mobile-drawer-link text-danger"
            href="https://eftqad.vercel.app/"
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            <i className="fas fa-heart me-2 fs-6"></i> وحشتنا
          </a>
        </div>

        <div className="mobile-drawer-footer">
          <Link
            className="btn btn-outline-primary btn-md rounded-pill w-100 fw-bold hover-magnet text-center"
            href="/admin"
            onClick={closeMenu}
          >
            <i className="fas fa-shield-alt me-1"></i> دخول الخدام
          </Link>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <a
              href="https://www.facebook.com/share/1ESrPMcJEC/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link fb-link"
              aria-label="فيسبوك"
              title="فيسبوك"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VarbdqNCXC3T4BwPj90V"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link wa-link"
              aria-label="واتساب"
              title="واتساب"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a
              href="https://www.tiktok.com/@stjohnmeeting?_r=1&_t=ZS-98fBl2ThvFK"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link tt-link"
              aria-label="تيك توك"
              title="تيك توك"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="https://www.instagram.com/stjohnmeeting?igsh=ejNoNnIwaDlreWdv"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link ig-link"
              aria-label="إنستغرام"
              title="إنستغرام"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://drive.google.com/drive/folders/1Khsi7gv1mcFDEBuB2uLfoFil6Ppk8OVU"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link app-link"
              aria-label="تطبيق اجتماعنا"
              title="تطبيق اجتماعنا"
            >
              <i className="fas fa-mobile-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
