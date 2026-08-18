'use client';

interface PaizoSectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function PaizoSectionHeader({
  badge,
  title,
  subtitle,
  center = true,
}: PaizoSectionHeaderProps) {
  return (
    <div className={`mb-5 ${center ? 'text-center' : 'text-start'}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3 shadow-gold">
          <i className="fas fa-sparkles text-amber-400"></i>
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-black text-main tracking-tight mb-3">
        <span className="text-gradient-gold">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full mt-4 ${center ? 'mx-auto' : ''}`} />
    </div>
  );
}
