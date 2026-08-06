'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top gsap-nav">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" href="/#hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="شعار"
            width="45"
            height="45"
            className="me-2 rounded-circle"
            style={{ objectFit: 'cover', border: '2px solid var(--accent)' }}
          />
          <span>
            <span className="text-primary">يوحنا</span>{' '}
            <span className="text-accent">الحبيب</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ color: 'var(--accent)' }}
        >
          <i className="fas fa-bars fs-3" style={{ color: 'var(--accent)' }}></i>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
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
                href="https://george22george9-hue.github.io/eftqad/"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-heart"></i> وحشتنا
              </a>
            </li>
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <Link
                className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold hover-magnet"
                href="/admin"
              >
                <i className="fas fa-shield-alt me-1"></i> دخول الخدام
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
