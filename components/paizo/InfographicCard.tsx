'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PaizoInfographic } from '@/lib/paizoData';

interface InfographicCardProps {
  infographic: PaizoInfographic;
}

export default function InfographicCard({ infographic }: InfographicCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group cursor-pointer rounded-2xl overflow-hidden border border-amber-400/20 bg-slate-900/60 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-2 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
          <Image
            src={infographic.imageUrl}
            alt={infographic.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
            {infographic.category}
          </span>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/50">
            <span className="btn btn-sm bg-amber-500 text-slate-950 font-bold rounded-full px-4 py-2 shadow-glow">
              <i className="fas fa-search-plus me-1"></i> مكبر الإنفوجرافيك
            </span>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-1">
            {infographic.title}
          </h4>
          <p className="text-slate-400 text-sm line-clamp-2 mb-0">
            {infographic.description}
          </p>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-amber-400/30 rounded-3xl p-6 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center font-bold transition-all"
              aria-label="إغلاق المعاينة"
            >
              <i className="fas fa-times fs-5"></i>
            </button>

            <h3 className="text-2xl font-black text-amber-400 mb-2">
              {infographic.title}
            </h3>
            <p className="text-slate-300 text-sm mb-4">{infographic.description}</p>

            <div className="relative w-full aspect-[4/3] max-h-[70vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <Image
                src={infographic.imageUrl}
                alt={infographic.title}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
