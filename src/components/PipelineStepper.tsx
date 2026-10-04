import React, { useState } from 'react';
import {
  Check,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { MAIN_STEPS } from '../mockData';
import { MainStepKey, StepStatus } from '../types';

interface PipelineStepperProps {
  currentStep: MainStepKey;
  onSelectStep: (step: MainStepKey) => void;
  stepStatuses: Record<string, StepStatus>;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStep,
  onSelectStep,
  stepStatuses,
}) => {
  // Collapsible state: Default is closed (false) as requested by user to keep dashboard compact
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const pipelineSteps = MAIN_STEPS.filter((s) => s.stepNumber > 0);
  const completedCount = pipelineSteps.filter((s) => stepStatuses[s.key] === 'done').length;
  const progressPct = Math.round((completedCount / pipelineSteps.length) * 100);
  const activeStepDef = pipelineSteps.find((s) => s.key === currentStep);

  return (
    <div
      className={`bg-surface border border-line rounded-2xl p-4 md:p-5 shadow-xs relative overflow-hidden transition-all duration-300 ${
        isExpanded ? 'space-y-4' : ''
      }`}
      dir="rtl"
    >
      {/* Header bar with progress overview, active step preview, and collapsible toggle button */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isExpanded ? 'pb-3 border-b border-line' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-xs shadow-[0_0_14px_rgba(30,58,138,0.35)] shrink-0">
            {completedCount}/{pipelineSteps.length}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-extrabold text-ink">خط لوله ۶ مرحله‌ای تولید مجموعه‌داده طلایی</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-soft text-accent font-bold">
                BeSeTun Pipeline
              </span>
              {!isExpanded && activeStepDef && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 hidden md:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span>مرحله فعلی: {activeStepDef.title}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              مسیر پیوسته از ورود متن خام تا ساخت دیتاست استاندارد آماده برای فاین‌تیون
            </p>
          </div>
        </div>

        {/* Left Side: Progress bar and User-Requested Collapsible Toggle Button with soft pulsing green glow */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="w-32 hidden md:block">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted font-medium">پیشرفت</span>
              <span className="font-mono font-bold text-accent">{progressPct}٪</span>
            </div>
            <div className="h-2 rounded-full bg-track overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-l from-accent to-accent-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(30,58,138,0.4)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* User Requested: Compact Arrow button without text, with tooltip and soft pulsing green ring */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-xl bg-surface border border-line hover:border-emerald-500/70 text-ink flex items-center justify-center transition-all cursor-pointer ring-2 ring-emerald-400/40 hover:ring-emerald-500/80 shadow-[0_0_12px_rgba(52,211,153,0.28)] hover:scale-105"
            title={isExpanded ? 'بستن ۶ مرحله خط لوله' : 'مشاهده ۶ مرحله خط لوله'}
            aria-label={isExpanded ? 'بستن ۶ مرحله خط لوله' : 'مشاهده ۶ مرحله خط لوله'}
          >
            <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 6 Stage Cards Grid: Expands with smooth fade & slide when isExpanded is true */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          {pipelineSteps.map((step) => {
            const status = stepStatuses[step.key] || 'ready';
            const isActive = currentStep === step.key;
            const isDone = status === 'done';
            const isLocked = status === 'locked';

            return (
              <button
                key={step.key}
                onClick={() => onSelectStep(step.key)}
                className={`relative flex flex-col p-3 rounded-xl border text-right transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-accent-soft/80 via-surface to-accent-soft/40 border-2 border-accent shadow-[0_0_22px_rgba(30,58,138,0.22)] ring-2 ring-accent/30 scale-[1.02]'
                    : isDone
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/40 hover:border-emerald-500/70 shadow-[0_0_12px_rgba(27,101,53,0.12)]'
                    : isLocked
                    ? 'bg-surface-2/60 border border-dashed border-line text-muted hover:border-line-strong opacity-80'
                    : 'bg-surface border border-line hover:border-line-strong hover:bg-surface-2 hover:shadow-xs'
                }`}
              >
                {/* Active illuminated top indicator bar */}
                {isActive && (
                  <div className="absolute top-0 left-2 right-2 h-1 rounded-b-full bg-accent shadow-[0_0_8px_rgba(30,58,138,0.8)]" />
                )}

                {/* Status Header: Number Badge & Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      isActive
                        ? 'bg-accent text-white shadow-[0_0_12px_rgba(30,58,138,0.6)] ring-2 ring-accent/40'
                        : isDone
                        ? 'bg-good text-white shadow-[0_0_10px_rgba(27,101,53,0.35)]'
                        : isLocked
                        ? 'bg-surface-2 border border-line text-muted'
                        : 'bg-surface-2 border border-line text-ink font-bold'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                  </span>

                  {isDone ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-good-soft text-good border border-good/20 flex items-center gap-1 shadow-xs">
                      <span>انجام شد</span>
                    </span>
                  ) : isActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-on-accent flex items-center gap-1.5 shadow-[0_0_8px_rgba(30,58,138,0.4)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>گام جاری</span>
                    </span>
                  ) : isLocked ? (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-2 border border-line text-muted flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>قفل</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-2 border border-line text-muted">
                      آماده
                    </span>
                  )}
                </div>

                {/* Title */}
                <span
                  className={`text-xs font-bold truncate block mb-1 ${
                    isActive
                      ? 'text-accent font-black'
                      : isDone
                    ? 'text-ink font-bold'
                    : isLocked
                    ? 'text-muted'
                    : 'text-ink'
                  }`}
                >
                  {step.title}
                </span>

                {/* Short Description */}
                <span className="text-[11px] text-muted line-clamp-1 leading-tight">
                  {step.shortDesc}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
