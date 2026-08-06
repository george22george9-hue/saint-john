'use client';

import { useState } from 'react';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import ThreeCanvas from '@/components/ThreeCanvas';
import FloatingLogo from '@/components/FloatingLogo';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Programs from '@/components/Programs';
import News from '@/components/News';
import WahshatnaBanner from '@/components/WahshatnaBanner';
import Footer from '@/components/Footer';
import QAModal from '@/components/QAModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CustomCursor />
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
