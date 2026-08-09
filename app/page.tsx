'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ScrollProgress from '@/components/ScrollProgress';
import FloatingLogo from '@/components/FloatingLogo';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Programs from '@/components/Programs';
import News from '@/components/News';
import WahshatnaBanner from '@/components/WahshatnaBanner';
import Footer from '@/components/Footer';

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
  ssr: false,
});
const QAModal = dynamic(() => import('@/components/QAModal'), {
  ssr: false,
});


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ScrollProgress />
      <ThreeCanvas />
      <FloatingLogo />
      <Navbar />

      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <About />
        <Programs />
        <News />
        <WahshatnaBanner />
      </main>

      <Footer />

      {/* Floating Action Button (FAB) */}
      <div className="fab-container gsap-scale">
        <button
          className="fab-btn hover-magnet"
          onClick={() => setIsModalOpen(true)}
          title="شاركونا أسئلتكم"
        >
          <i className="fas fa-comment-dots"></i>
        </button>
      </div>

      <QAModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
