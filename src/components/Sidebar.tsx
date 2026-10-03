import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Tags,
  Cpu,
  UserCheck,
  Hash,
  Award,
  Sliders,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronLeft,
  LogOut,
  Scale,
} from 'lucide-react';
import { MainStepKey, StepStatus, UserRole } from '../types';
import { MAIN_STEPS } from '../mockData';

interface SidebarProps {
  currentStep: MainStepKey;
  onSelectStep: (step: MainStepKey, tab?: string) => void;
  stepStatuses: Record<string, StepStatus>;
  role: UserRole;
  onChangeRole?: (newRole: UserRole) => void;
  onLogout?: () => void;
  extFlag: boolean;
}

const STEP_ICONS: Record<string, React.ElementType> = {
  data: FileSpreadsheet,
  labels: Tags,
  model: Cpu,
  expert: UserCheck,
  keyword: Hash,
  results: Award,
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onSelectStep,
  stepStatuses,
  role,
  onChangeRole,
  onLogout,
  extFlag,
}) => {
  // OPERATOR / ANNOTATOR VIEW (Matches the attached mockup screenshot!)
  if (role === 'operator') {
    return (
      <aside className="w-64 bg-surface border-l border-line p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto" dir="rtl">
        <div className="space-y-2">
          {/* Active Operator Work Task */}
          <button
            onClick={() => onSelectStep('expert', 'work')}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-accent text-on-accent font-bold text-xs shadow-xs text-right cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center font-mono text-[11px]">
                ۱
              </span>
              <span>برچسب‌زنی کارشناس</span>
            </div>
          </button>

          {/* Adjudication Task (if needed) */}
          <button
            onClick={() => onSelectStep('expert', 'adj')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-right transition-colors cursor-pointer ${
              currentStep === 'expert'
                ? 'text-ink hover:bg-surface-2'
                : 'text-ink-2 hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-muted" />
              <span>حل اختلاف و داوری</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-ochre-soft text-ochre font-bold font-mono">
              ۴ مورد
            </span>
          </button>
        </div>

        {/* Bottom: Exit to Login or switch to Admin View */}
        <div className="pt-3 border-t border-line space-y-1">
          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-crit hover:bg-crit-soft transition-colors text-right cursor-pointer"
            title="خروج از حساب و بازگشت به صفحه لاگین"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب (لاگین)</span>
            </div>
          </button>

          <button
            onClick={() => {
              if (onChangeRole) onChangeRole('admin');
              onSelectStep('dash');
            }}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-[11px] text-muted hover:text-ink hover:bg-surface-2 transition-colors text-right cursor-pointer"
            title="سوییچ به نمای سرپرست / مهندس داده"
          >
            <span>سوییچ به نمای مدیر</span>
            <span className="font-mono text-[10px]">admin</span>
          </button>
        </div>
      </aside>
    );
  }

  // ADMIN / PROJECT LEAD VIEW
  return (
    <aside className="w-68 bg-surface border-l border-line p-3 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto" dir="rtl">
      <div className="space-y-4">
        {/* Dashboard link */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectStep('dash')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-right cursor-pointer ${
              currentStep === 'dash'
                ? 'bg-accent-soft text-accent border border-accent/30 shadow-xs'
                : 'text-ink-2 hover:text-ink hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>پیشخوان مدیریت ویزارد</span>
            </div>
          </button>
        </div>

        {/* Pipeline Steps Section */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
              مراحل ۶گانه تولید دیتاست
            </span>
          </div>

          <div className="space-y-1">
            {MAIN_STEPS.map((step) => {
              const Icon = STEP_ICONS[step.key] || Tags;
              const isActive = currentStep === step.key;
              const status = stepStatuses[step.key] || 'ready';
              const isDone = status === 'done';
              const isLocked = status === 'locked';

              return (
                <button
                  key={step.key}
                  onClick={() => onSelectStep(step.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-right group cursor-pointer ${
                    isActive
                      ? 'bg-accent text-on-accent font-bold shadow-xs'
                      : isLocked
                      ? 'text-muted hover:bg-surface-2'
                      : 'text-ink-2 hover:text-ink hover:bg-surface-2'
                  }`}
                  title={step.detailedDesc}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isDone
                          ? 'bg-good-soft text-good'
                          : 'bg-surface-2 border border-line text-muted'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {step.key === 'model' && extFlag && (
                      <span
                        className="w-2 h-2 rounded-full bg-ochre"
                        title="مدل خارج از شبکه فعال است"
                      />
                    )}
                    {isDone ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-good'}`}
                      />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-muted" />
                    ) : (
                      <ChevronLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase 2: Fine-Tuning */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
              فاز ۲: یادگیری مدل
            </span>
          </div>
          <button
            onClick={() => onSelectStep('tune')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-right cursor-pointer ${
              currentStep === 'tune'
                ? 'bg-accent text-on-accent'
                : 'text-ink-2 hover:text-ink hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>تنظیم دقیق (Fine-Tune)</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                currentStep === 'tune'
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-2 text-muted border border-line'
              }`}
            >
              ParsBERT
            </span>
          </button>
        </div>

        {/* Settings */}
        <div>
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
              پیکربندی سیستم
            </span>
          </div>
          <button
            onClick={() => onSelectStep('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-right cursor-pointer ${
              currentStep === 'settings'
                ? 'bg-accent text-on-accent font-semibold'
                : 'text-ink-2 hover:text-ink hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>تنظیمات و سرور مدل‌ها</span>
            </div>
          </button>
        </div>
      </div>

      {/* Role Status Banner & Logout at bottom */}
      <div className="pt-3 border-t border-line mt-3 space-y-2">
        <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-ink">
              دسترسی: سرپرست
            </span>
            <span className="w-2 h-2 rounded-full bg-good animate-pulse" />
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            امکان مدیریت خط لوله و استخراج بسته نهایی فعال است.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogout) onLogout();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-crit hover:bg-crit-soft transition-colors text-right cursor-pointer"
          title="خروج از حساب کاربری و بازگشت به صفحه لاگین"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از نشست (لاگین)</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
