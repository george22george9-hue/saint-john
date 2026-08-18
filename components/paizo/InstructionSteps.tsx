'use client';

interface Step {
  number: string;
  title: string;
  desc: string;
}

interface InstructionStepsProps {
  steps: Step[];
}

export default function InstructionSteps({ steps }: InstructionStepsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className="relative p-5 rounded-2xl bg-slate-900/80 border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300 shadow-md group hover:-translate-y-1"
        >
          {/* Step Number Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-black text-amber-400/90 tracking-widest font-mono">
              {step.number}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-500/30">
              <i className="fas fa-arrow-left group-hover:-translate-x-0.5 transition-transform"></i>
            </div>
          </div>

          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
            {step.title}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-0">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
