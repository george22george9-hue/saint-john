'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function FloatingLogo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const logo = logoRef.current;
    if (!logo) return;

    // Idle animation
    const idleAnim = gsap.to(logo, {
      y: 20,
      rotation: 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Scroll interaction
    const scrollAnim = gsap.to(logo, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
      y: '50vh',
      x: '5vw',
      rotation: 360,
      scale: 0.8,
      opacity: typeof window !== 'undefined' && window.innerWidth > 768 ? 1 : 0.5,
    });

    return () => {
      idleAnim.kill();
      scrollAnim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div id="floating-logo" ref={logoRef}>
      <Image src="/logo.png" alt="الشعار" width={120} height={120} priority={false} />
    </div>
  );
}

