import React from 'react';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { MainStepKey } from '../types';

interface LockedStepViewProps {
  title: string;
  stepNumber: number;
  prerequisites: string[];
  unlockTarget: {
    step: MainStepKey;
    tab?: string;
    ctaText: string;
  };
  onGoPrerequisite: (step: MainStepKey, tab?: string) => void;
}

export const LockedStepView: React.FC<LockedStepViewProps> = ({
  title,
  stepNumber,
  prerequisites,
  unlockTarget,
  onGoPrerequisite,
}) => {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 max-w-xl mx-auto space-y-6 text-center shadow-xs" dir="rtl">
      <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-line text-muted flex items-center justify-center mx-auto shadow-xs">
        <Lock className="w-7 h-7 text-muted" />
      </div>

      <div className="space-y-1.5">
        <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
          مرحله {stepNumber}
        </span>
        <h3 className="text-xl font-extrabold text-ink">{title}</h3>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          صفحه این مرحله را می‌توانید ببینید، اما شروع عملیات و برچسب‌زنی پس از آماده شدن پیش‌نیازهای قبلی امکان‌پذیر است.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-2 border border-line text-right space-y-2.5">
        <span className="text-xs font-bold text-muted block mb-1">
          پیش‌نیازهای لازم برای بازگشایی این مرحله:
        </span>
        <ul className="space-y-2 text-xs text-ink">
          {prerequisites.map((req, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-line-strong flex items-center justify-center shrink-0" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-2">
        <button
          onClick={() => onGoPrerequisite(unlockTarget.step, unlockTarget.tab)}
          className="w-full sm:w-auto px-6 py-2.5 bg-accent text-on-accent font-semibold text-xs rounded-xl hover:bg-accent-2 transition-all shadow-xs flex items-center justify-center gap-2 mx-auto"
        >
          <span>{unlockTarget.ctaText}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
