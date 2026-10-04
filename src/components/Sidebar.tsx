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
  CheckCircle2,
  Lock,
  ChevronLeft,
  LogOut,
  Scale,
  X,
  Keyboard,
  SlidersHorizontal,
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  projectName?: string;
  onOpenShortcuts?: () => void;
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
  isMobileOpen = false,
  onCloseMobile,
  projectName = 'شکایت‌های شهروندی ۱۴۰۳',
  onOpenShortcuts,
}) => {
  const handleStepClick = (step: MainStepKey, tab?: string) => {
    onSelectStep(step, tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderContent = () => {
    if (role === 'expert') {
      return (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="space-y-2">
            {/* Active Operator Work Task */}
            <button
              onClick={() => handleStepClick('expert', 'work')}
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
              onClick={() => handleStepClick('expert', 'adj')}
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
                handleStepClick('dash');
              }}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-[11px] text-muted hover:text-ink hover:bg-surface-2 transition-colors text-right cursor-pointer"
              title="سوییچ به نمای سرپرست / مهندس داده"
            >
              <span>سوییچ به نمای مدیر</span>
              <span className="font-mono text-[10px]">admin</span>
            </button>
          </div>
        </div>
      );
    }

    // ADMIN / PROJECT LEAD VIEW
    return (
      <div className="flex flex-col justify-between h-full space-y-4">
        <div className="space-y-4">
          {/* Dashboard link */}
          <div className="space-y-1">
            <button
              onClick={() => handleStepClick('dash')}
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
                مراحل ۶گانه تولید دیتاست (فاز اول)
              </span>
            </div>

            <div className="space-y-1">
              {/* Step 0: Project Definition */}
              <button
                onClick={() => handleStepClick('project')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-right group cursor-pointer ${
                  currentStep === 'project'
                    ? 'bg-accent text-on-accent font-bold shadow-xs'
                    : 'text-ink-2 hover:text-ink hover:bg-surface-2'
                }`}
                title="تعریف نام فارسی و لاتین پروژه و ایجاد ساختار استاندارد پوشه‌ها"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      currentStep === 'project'
                        ? 'bg-white/20 text-white'
                        : 'bg-good-soft text-good'
                    }`}
                  >
                    0
                  </span>
                  <span className="truncate">تعریف پروژه و پوشه‌بندی</span>
                </div>
                <CheckCircle2
                  className={`w-4 h-4 ${currentStep === 'project' ? 'text-white' : 'text-good'}`}
                />
              </button>

              {MAIN_STEPS.filter((s) => s.stepNumber > 0).map((step) => {
                const Icon = STEP_ICONS[step.key] || Tags;
                const isActive = currentStep === step.key;
                const status = stepStatuses[step.key] || 'ready';
                const isDone = status === 'done';
                const isLocked = status === 'locked';

                return (
                  <button
                    key={step.key}
                    onClick={() => handleStepClick(step.key)}
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
                      <span className="truncate">
                        {step.key === 'expert'
                          ? role === 'admin'
                            ? 'داوری و پیشرفت کارشناسان'
                            : 'میز کار برچسب‌زنی'
                          : step.title}
                      </span>
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
                فاز دوم: یادگیری و فاین‌تیون مدل
              </span>
            </div>
            <button
              onClick={() => handleStepClick('tune')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-right cursor-pointer ${
                currentStep === 'tune'
                  ? 'bg-accent text-on-accent font-bold'
                  : 'text-ink-2 hover:text-ink hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-good" />
                <span>فاین‌تیون مدل زبانی</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-good-soft text-good font-bold">
                فاز ۲
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
              onClick={() => handleStepClick('settings')}
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
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Rail: Only visible on lg screens and up */}
      <aside
        className="hidden lg:flex w-68 bg-surface border-l border-line p-3 flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto"
        dir="rtl"
      >
        {renderContent()}
      </aside>

      {/* Mobile Drawer (Zero width when closed, smooth slide-out overlay when opened) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" dir="rtl">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed top-0 bottom-0 right-0 w-72 max-w-[85vw] bg-surface border-l border-line p-4 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-3">
              <span className="font-extrabold text-sm text-ink">منوی بخش‌های بیستون</span>
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-muted hover:text-ink cursor-pointer"
                aria-label="بستن منو"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Controls (hidden from top bar below 768px per user requirement) */}
            <div className="space-y-2 mb-3 pb-3 border-b border-line">
              {/* Project chip */}
              <div className="p-2.5 rounded-xl bg-surface-2 border border-line text-xs flex items-center justify-between">
                <span className="text-muted">پروژه:</span>
                <span className="font-bold text-ink truncate max-w-[150px]">{projectName}</span>
              </div>

              {/* Role Switch */}
              <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-line">
                <button
                  onClick={() => onChangeRole && onChangeRole('admin')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    role === 'admin' ? 'bg-surface text-accent shadow-xs' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>مدیر پروژه</span>
                </button>
                <button
                  onClick={() => onChangeRole && onChangeRole('expert')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                    role === 'expert' ? 'bg-surface text-accent shadow-xs' : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>کارشناس</span>
                </button>
              </div>

              {/* Shortcuts trigger */}
              {onOpenShortcuts && (
                <button
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    onOpenShortcuts();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-line bg-surface-2 text-xs font-semibold text-ink-2 hover:text-ink cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-accent" />
                    <span>کلیدهای میانبر کیبورد</span>
                  </div>
                  <span className="text-[10px] text-muted">راهنما</span>
                </button>
              )}
            </div>

            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
};
