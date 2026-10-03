import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Cpu,
  UserCheck,
  FileSpreadsheet,
  Tags,
  Hash,
  Award,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { MainStepKey, StepStatus, UserRole } from '../../types';
import { MAIN_STEPS } from '../../mockData';

interface DashboardProps {
  onNavigate: (step: MainStepKey, tab?: string) => void;
  stepStatuses: Record<string, StepStatus>;
  role: UserRole;
  onStartGuide: () => void;
}

const STEP_ICONS: Record<string, React.ElementType> = {
  data: FileSpreadsheet,
  labels: Tags,
  model: Cpu,
  expert: UserCheck,
  keyword: Hash,
  results: Award,
};

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  stepStatuses,
  role,
  onStartGuide,
}) => {
  return (
    <div className="space-y-5" dir="rtl">
      {/* User Requested: Guide Callout Container sits immediately below the top pipeline stepper bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 border-dashed border-accent/40 bg-gradient-to-r from-accent-soft/70 via-surface to-accent-soft/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center shadow-[0_0_10px_rgba(30,58,138,0.3)] shrink-0">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-ink text-sm block">
              آشنایی ندارید؟ راهنمای تعاملی ۱۱ گامی را شروع کنید
            </span>
            <span className="text-muted text-xs leading-relaxed block">
              آموزش گام‌به‌گام و مصور از ورود اولین فایل اکسل تا استخراج نهایی مجموعه‌داده طلایی فاین‌تیون
            </span>
          </div>
        </div>
        <button
          onClick={onStartGuide}
          className="px-5 py-2.5 rounded-xl bg-accent text-on-accent font-bold text-xs hover:bg-accent-2 transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <span>فعال‌سازی راهنما</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* User Requested: Following the guide callout, render the Navy Next Step Banner */}
      <div className="p-6 rounded-2xl bg-accent text-on-accent relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              گام پیشنهادی خط لوله
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            اجرای دوگانه (A و B) مدل روی نمونه‌های آماده‌شده
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-2xl leading-relaxed">
            ۲٬۳۲۰ متن پاک‌سازی شده و ۸ برچسب نهایی ثبت شده است. مدل باید دو بار با دو راهبرد نمونه برچسب بزند تا موارد مشکوک جهت بررسی دقیق استخراج شوند.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => onNavigate('model', 'runs')}
            className="px-5 py-2.5 rounded-xl bg-surface text-accent font-extrabold text-sm hover:bg-surface-2 transition-all shadow-sm flex items-center gap-2"
          >
            <span>شروع برچسب‌زنی مدل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative background geometry */}
        <div className="absolute left-[-20px] bottom-[-30px] opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-64 h-64 text-white fill-current">
            <polygon points="100,10 190,190 10,190" />
          </svg>
        </div>
      </div>

      {/* 6 Core Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-ink">مراحل شش‌گانه پردازش داده بیستون</h3>
          <span className="text-xs text-muted">هر مرحله با کلیک به‌صورت مستقیم قابل بررسی است</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_STEPS.map((step) => {
            const Icon = STEP_ICONS[step.key] || Tags;
            const status = stepStatuses[step.key] || 'ready';
            const isDone = status === 'done';
            const isLocked = status === 'locked';

            return (
              <div
                key={step.key}
                onClick={() => onNavigate(step.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  step.key === 'model'
                    ? 'bg-surface border-accent shadow-xs ring-1 ring-accent/30'
                    : isDone
                    ? 'bg-surface border-line hover:border-good/50'
                    : 'bg-surface border-line hover:border-line-strong hover:bg-surface-2'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-2xl font-black font-mono ${
                        isDone
                          ? 'text-good'
                          : step.key === 'model'
                          ? 'text-accent'
                          : isLocked
                          ? 'text-muted'
                          : 'text-ink'
                      }`}
                    >
                      ۰{step.stepNumber}
                    </span>

                    {isDone ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>انجام شد</span>
                      </span>
                    ) : step.key === 'model' ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-soft text-accent font-bold">
                        آماده اجرا
                      </span>
                    ) : isLocked ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-muted flex items-center gap-1 border border-line">
                        <Lock className="w-3 h-3" />
                        <span>نیازمند پیش‌نیاز</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-line">
                        در انتظار
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-accent" />
                    <h4 className="font-bold text-base text-ink group-hover:text-accent transition-colors">
                      {step.title}
                    </h4>
                  </div>

                  <p className="text-xs text-ink-2 leading-relaxed mb-4">
                    {step.detailedDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-line border-dashed flex items-center justify-between text-xs text-muted">
                  <span>
                    {step.key === 'data' && '۲٬۳۲۰ متن پالایش شد'}
                    {step.key === 'labels' && '۸ برچسب + نمونه راهنما'}
                    {step.key === 'model' && 'آماده اجرای دوگانه Qwen'}
                    {step.key === 'expert' && 'کارشناس ۱: ۳۶ از ۱۰۰'}
                    {step.key === 'keyword' && 'روش پایه واژه‌ای'}
                    {step.key === 'results' && 'فرمت JSONL و مقاله'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all text-accent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Stats: System Engine & Annotator Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* System & Isolation Box */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>وضعیت امنیتی و سرور محلی مدل</span>
            </h3>
            <span className="text-[11px] font-semibold text-good bg-good-soft px-2 py-0.5 rounded-full">
              اتصال پایدار
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-line">
              <span className="text-muted">حالت عملیاتی داده:</span>
              <span className="font-semibold text-ink">ایزوله (بدون دسترسی به اینترنت بیرونی)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-line">
              <span className="text-muted">مدل زبانی پیش‌فرض:</span>
              <span className="font-mono text-ink text-[11px]" dir="ltr">qwen2.5-14b-instruct (LM Studio)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-line">
              <span className="text-muted">درگاه استنتاج محلی:</span>
              <span className="font-mono text-ink text-[11px]" dir="ltr">http://127.0.0.1:1234/v1</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted">سرعت استنتاج میانگین:</span>
              <span className="font-semibold text-good">۳۲ توکن بر ثانیه روی کارت گرافیک محلی</span>
            </div>
          </div>
        </div>

        {/* Human Expert Labeling Tracker */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-bold text-sm text-ink flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              <span>پیشرفت برچسب‌زنی کارشناسان (نمونه مرجع)</span>
            </h3>
            <button
              onClick={() => onNavigate('expert', 'progress')}
              className="text-xs text-accent hover:underline font-semibold"
            >
              مشاهده جزییات
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-ink">کارشناس شماره ۱ (برچسب‌زن ارشد)</span>
                <span className="text-muted font-mono font-bold">۷۸ از ۱۰۰ متن</span>
              </div>
              <div className="h-2 rounded-full bg-track overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-ink">کارشناس شماره ۲ (تحلیل‌گر داده)</span>
                <span className="text-muted font-mono font-bold">۹۲ از ۱۰۰ متن</span>
              </div>
              <div className="h-2 rounded-full bg-track overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-ochre-soft/60 border border-ochre/20 text-[11px] text-ochre flex items-center justify-between">
              <span>تاکنون ۴ مورد عدم تطابق شناسایی شده که نیازمند داوری (Adjudication) است.</span>
              <button
                onClick={() => onNavigate('expert', 'adj')}
                className="font-bold underline shrink-0 hover:text-ochre"
              >
                حل اختلاف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
