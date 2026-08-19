'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';

export default function PaizoNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav
        className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${
          scrolled ? 'py-2 shadow-lg glass-card' : 'py-3'
        }`}
        style={{
          zIndex: 1000,
          background: scrolled ? 'var(--navbar-bg)' : 'rgba(15, 28, 63, 0.4)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo Brand */}
          <Link className="navbar-brand d-flex align-items-center gap-2 group" href="/paizo">
            <div className="relative overflow-hidden rounded-xl border border-amber-400/40 p-1 bg-slate-900/60 shadow-gold">
              <Image
                src="/paizo/assets/logo.png"
                alt="PAIZO Logo"
                width={42}
                height={42}
                className="object-contain hover:scale-105 transition-transform duration-300"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="d-flex flex-column">
              <span className="fw-black fs-4 text-gradient-gold tracking-wide">
                PAIZO <span className="fs-6 text-accent fw-normal ms-1">παίζω</span>
              </span>
              <span className="small text-slate-400 fs-7 -mt-1">
                براند ألعاب ودراسات اجتماع يوحنا الحبيب
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center ms-auto gap-3">
            <ul className="navbar-nav me-3 mb-0 align-items-center gap-1">
              <li className="nav-item">
                <Link className="nav-link fw-bold text-main hover:text-accent px-3" href="/paizo">
                  <i className="fas fa-home me-1 text-accent"></i> الرئيسية
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold text-main hover:text-accent px-3" href="/paizo/games">
                  <i className="fas fa-gamepad me-1 text-accent"></i> ألعاب
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-main hover:text-accent px-3"
                  href="/paizo/bible-studies"
                >
                  <i className="fas fa-book-bible me-1 text-accent"></i> دراسات كتابية
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-main hover:text-accent px-3"
                  href="/paizo/workshops"
                >
                  <i className="fas fa-tools me-1 text-accent"></i> ورش عمل
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-main hover:text-accent px-3"
                  href="/paizo/infographics"
                >
                  <i className="fas fa-chart-pie me-1 text-accent"></i> إنفو جرافيك
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-main hover:text-accent px-3"
                  href="/paizo/designs"
                >
                  <i className="fas fa-magic me-1 text-accent"></i> ديزاينات
                </Link>
              </li>
            </ul>

            <Link
              href="/"
              className="btn btn-outline-amber-400 btn-sm rounded-pill px-3 fw-bold border-accent text-accent hover-magnet d-flex align-items-center gap-1"
            >
              <i className="fas fa-arrow-right"></i> موقع الاجتماع
            </Link>

            <ThemeToggle className="ms-1" />
          </div>

          {/* Mobile Right Controls */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            <ThemeToggle />
            <button
              className="navbar-toggler border-0 p-2 text-accent"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="قائمة PAIZO"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} fs-3`}></i>
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
      <div className={`mobile-nav-drawer ${isOpen ? 'show' : ''}`} role="dialog" aria-label="قائمة PAIZO">
        <div className="mobile-drawer-header border-b border-amber-400/20 pb-3">
          <Link className="d-flex align-items-center gap-2" href="/paizo" onClick={closeMenu}>
            <Image
              src="/paizo/assets/logo.png"
              alt="PAIZO Logo"
              width={36}
              height={36}
              className="rounded-lg border border-amber-400/30 object-contain"
              style={{ objectFit: 'contain' }}
            />
            <div className="d-inline-flex align-items-center gap-2">
              <span className="fw-black fs-5 text-gradient-gold">PAIZO</span>
              <span className="paizo-new-badge">NEW</span>
            </div>
          </Link>
          <button className="mobile-drawer-close" onClick={closeMenu} aria-label="إغلاق">
            <i className="fas fa-times fs-5 text-accent"></i>
          </button>
        </div>

        <div className="mobile-drawer-links py-3">
          <Link className="mobile-drawer-link" href="/paizo" onClick={closeMenu}>
            <i className="fas fa-home me-2 text-accent"></i> الرئيسية
          </Link>
          <Link className="mobile-drawer-link" href="/paizo/games" onClick={closeMenu}>
            <i className="fas fa-gamepad me-2 text-accent"></i> ألعاب PAIZO
          </Link>
          <Link className="mobile-drawer-link" href="/paizo/bible-studies" onClick={closeMenu}>
            <i className="fas fa-book-bible me-2 text-accent"></i> دراسات كتابية
          </Link>
          <Link className="mobile-drawer-link" href="/paizo/workshops" onClick={closeMenu}>
            <i className="fas fa-tools me-2 text-accent"></i> ورش عمل
          </Link>
          <Link className="mobile-drawer-link" href="/paizo/infographics" onClick={closeMenu}>
            <i className="fas fa-chart-pie me-2 text-accent"></i> إنفو جرافيك
          </Link>
          <Link className="mobile-drawer-link" href="/paizo/designs" onClick={closeMenu}>
            <i className="fas fa-magic me-2 text-accent"></i> ديزاينات وتنفيذ
          </Link>
        </div>

        <div className="mobile-drawer-footer border-t border-amber-400/20 pt-3">
          <Link
            className="btn btn-outline-primary btn-md rounded-pill w-100 fw-bold hover-magnet text-center"
            href="/"
            onClick={closeMenu}
          >
            <i className="fas fa-church me-2"></i> العودة للموقع الرئيسي
          </Link>
        </div>
      </div>
    </>
  );
}
