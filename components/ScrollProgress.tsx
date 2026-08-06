'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const progressBar = progressRef.current;
      if (!progressBar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${scrollPercent}%`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div id="scroll-progress" ref={progressRef}></div>;
}
