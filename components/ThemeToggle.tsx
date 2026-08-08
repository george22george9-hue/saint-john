'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Dispatch event so other components (like 3D Canvas) can react if needed
    window.dispatchEvent(new CustomEvent('themeChange', { detail: nextTheme }));
  };

  // Prevent SSR mismatch during initial render
  if (!mounted) {
    return (
      <button
        className={`theme-toggle-btn ${className}`}
        aria-label="تغيير المظهر"
        style={{ width: '38px', height: '38px', opacity: 0 }}
      >
        <i className="fas fa-moon"></i>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
      title={theme === 'dark' ? 'الوضع الفاتح (☀)' : 'الوضع الداكن (🌙)'}
      type="button"
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun text-warning fs-5"></i>
      ) : (
        <i className="fas fa-moon text-primary fs-5"></i>
      )}
    </button>
  );
}
