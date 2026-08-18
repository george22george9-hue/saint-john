'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import InstructionSteps from '@/components/paizo/InstructionSteps';
import PaizoOrderCTA from '@/components/paizo/PaizoOrderCTA';
import { PAIZO_GAMES } from '@/lib/paizoData';

interface GameDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default function GameDetailsPage({ params }: GameDetailsPageProps) {
  const { slug } = use(params);
  const game = PAIZO_GAMES.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="container space-y-12 relative-z">
      {/* Back Button */}
      <div>
        <Link
          href="/paizo/games"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm transition-colors no-underline"
          style={{ textDecoration: 'none' }}
        >
          <i className="fas fa-arrow-right"></i>
          <span>العودة إلى مكتبة الألعاب</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-3xl p-6 md:p-10 bg-slate-900/80 border border-amber-400/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="row align-items-center g-5 relative-z">
          {/* Game Artwork */}
          <div className="col-lg-5 text-center">
            <div className="relative aspect-square max-w-sm mx-auto bg-slate-950 rounded-3xl p-6 border border-amber-400/40 shadow-2xl flex items-center justify-center">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-contain p-4 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Title & Core Details */}
          <div className="col-lg-7">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3 inline-block">
              {game.category}
            </span>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">
              {game.name}
            </h1>

            <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-4 dir-rtl">
              {game.titleArabic}
            </h2>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              {game.fullDescription}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block mb-1">
                  <i className="fas fa-users text-amber-400 me-1"></i> عدد اللاعبين
                </span>
                <span className="text-sm font-black text-white">{game.players}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block mb-1">
                  <i className="far fa-clock text-amber-400 me-1"></i> وقت اللعبة
                </span>
                <span className="text-sm font-black text-white">{game.duration}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 font-bold block mb-1">
                  <i className="fas fa-box text-amber-400 me-1"></i> الأدوات المطلوبة
                </span>
                <span className="text-sm font-black text-white">{game.materials}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Instruction Steps Section (طريقة اللعب) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
            <i className="fas fa-list-ol"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">طريقة اللعب (خطوات تفاعلية)</h3>
            <p className="text-slate-400 text-sm mb-0">اتبع هذه الخطوات البسيطة لتنظيم اللعبة في الاجتماع</p>
          </div>
        </div>

        <InstructionSteps steps={game.steps} />
      </section>

      {/* Rules & Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-amber-400/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <i className="fas fa-gavel"></i>
            </div>
            <h3 className="text-xl font-black text-white">قواعد وأحكام اللعبة</h3>
          </div>

          <ul className="space-y-3 pr-0 list-none">
            {game.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-amber-500/20">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes Box */}
        {game.notes && (
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-amber-400/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
                  <i className="fas fa-sticky-note"></i>
                </div>
                <h3 className="text-xl font-black text-white">ملاحظات وقيمة روحية</h3>
              </div>

              <p className="text-slate-300 text-base leading-relaxed mb-6">
                {game.notes}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-amber-400 text-xs font-bold mb-0">
                <i className="fas fa-heart text-amber-400 me-1"></i> من إعداد وابتكار براند PAIZO — كنيسة مارجرجس بسندبيس
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic WhatsApp Order CTA for this specific game */}
      <PaizoOrderCTA itemName={game.name} itemType="لعبة" />
    </div>
  );
}
