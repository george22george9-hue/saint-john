'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PaizoGame } from '@/lib/paizoData';

interface GameCardProps {
  game: PaizoGame;
  index?: number;
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <Link
      href={`/paizo/games/${game.slug}`}
      className="paizo-game-card group block h-full rounded-2xl overflow-hidden border border-amber-400/25 bg-slate-900/80 hover:border-amber-400/70 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-2xl shadow-gold/20 flex flex-col justify-between"
      style={{
        animationDelay: `${index * 0.15}s`,
        backdropFilter: 'blur(12px)',
        textDecoration: 'none',
      }}
    >
      <div>
        {/* Box Art Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 p-4 flex items-center justify-center border-b border-amber-400/10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-70" />
          
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 z-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <span className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md">
            {game.category}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
              {game.name}
            </h3>
            <span className="text-sm font-bold text-amber-400/90 dir-rtl">
              {game.titleArabic}
            </span>
          </div>

          <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed mb-4">
            {game.shortDescription}
          </p>

          {/* Key Specs */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300 mb-2">
            {game.players && (
              <span className="inline-flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
                <i className="fas fa-users text-amber-400"></i>
                {game.players}
              </span>
            )}
            {game.duration && (
              <span className="inline-flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
                <i className="far fa-clock text-amber-400"></i>
                {game.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* High-Contrast Premium CTA Button */}
      <div className="p-5 pt-0 mt-auto">
        <div className="paizo-btn-cta">
          <span>تفاصيل وطريقة اللعب</span>
          <i className="fas fa-arrow-left cta-arrow text-sm"></i>
        </div>
      </div>
    </Link>
  );
}
