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
import { formatInt, formatRatio, toFaDigits } from '../../lib/formatFa';

interface DashboardProps {
  onNavigate: (step: MainStepKey, tab?: string) => void;
  stepStatuses: Record<string, StepStatus>;
  role: UserRole;
  onStartGuide: () => void;
  isDatasetLoaded?: boolean;
  datasetCount?: number;
  labelsCount?: number;
  isModelRunCompleted?: boolean;
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
  isDatasetLoaded = false,
  datasetCount = 42,
  labelsCount = 0,
  isModelRunCompleted = false,
}) => {
  const isDataDone = isDatasetLoaded;
  const isLabelsDone = labelsCount > 0;
  const isModelDone = isModelRunCompleted;

  // Compute dynamic next step banner from real state (User Request Item 6)
  let nextStepTitle = 'بارگذاری داده‌های خام';
  let nextStepDesc = 'هنوز داده‌ای بارگذاری نشده است. برای آغاز خط لوله، فایل اکسل یا JSON شکایات شهروندی را وارد نمایید.';
  let nextStepCta = 'بارگذاری داده';
  let nextStepTarget: { step: MainStepKey; tab?: string } = { step: 'data', tab: 'import' };

  if (!isDataDone) {
    nextStepTitle = 'بارگذاری و پالایش داده‌های خام';
    nextStepDesc = 'جهت شروع خط لوله ۶ مرحله‌ای، داده‌های خام را وارد کرده و فرآیند گمنام‌سازی و نمونه‌گیری را اجرا نمایید.';
    nextStepCta = 'بارگذاری داده';
    nextStepTarget = { step: 'data', tab: 'import' };
  } else if (!isLabelsDone) {
    nextStepTitle = 'استخراج هوشمند برچسب‌ها با مدل زبانی';
    nextStepDesc = `${formatInt(datasetCount)} متن پالایش شد. اکنون برچسب‌ها و دلایل پرتکرار را با مدل زبانی استخراج نمایید.`;
    nextStepCta = 'استخراج برچسب‌ها';
    nextStepTarget = { step: 'labels', tab: 'extract' };
  } else if (!isModelDone) {
    nextStepTitle = 'اجرای دوگانه (A و B) مدل روی نمونه‌های آماده‌شده';
    nextStepDesc = `${formatInt(datasetCount)} متن پاک‌سازی شده و ${formatInt(labelsCount)} برچسب نهایی ثبت شده است. مدل باید دو بار با دو راهبرد نمونه برچسب بزند تا موارد مشکوک جهت بررسی دقیق استخراج شوند.`;
    nextStepCta = 'شروع برچسب‌زنی مدل';
    nextStepTarget = { step: 'model', tab: 'runs' };
  } else {
    nextStepTitle = 'برچسب‌زنی کارشناس و حل اختلاف داوری';
    nextStepDesc = 'اجرای مدل پایان یافته است. اکنون نظرات کارشناسان روی نمونه‌های مرجع را ثبت و موارد عدم تطابق را داوری فرمایید.';
    nextStepCta = 'میزکار کارشناس و داوری';
    nextStepTarget = { step: 'expert', tab: 'work' };
  }

  // Card metrics show «—» until that step is done (User Request Item 6)
  const getStepMetric = (key: string) => {
    if (key === 'data') {
      return isDataDone ? `${formatInt(datasetCount)} متن پالایش شد` : '—';
    }
    if (key === 'labels') {
      return isLabelsDone ? `${formatInt(labelsCount)} برچسب + نمونه راهنما` : '—';
    }
    if (key === 'model') {
      return isModelDone ? 'اجرای دوگانه انجام شد' : (isLabelsDone ? 'آماده اجرای دوگانه مدل' : '—');
    }
    if (key === 'expert') {
      const refCount = Math.floor(datasetCount / 2);
      return isModelDone ? `کارشناس ۱: ${formatRatio(Math.min(18, refCount), refCount)}` : '—';
    }
    if (key === 'keyword') {
      return isLabelsDone ? `${formatInt(labelsCount)} کلیدواژه فعال` : '—';
    }
    if (key === 'results') {
      return isModelDone ? `خروجی ${formatInt(datasetCount)} رکورد طلایی` : '—';
    }
    return '—';
  };

  const refSampleSize = Math.floor(datasetCount / 2);
  const exp1Done = Math.round(refSampleSize * 0.78);
  const exp2Done = Math.round(refSampleSize * 0.92);

  return (
    <div className="space-y-5" dir="rtl">
      {/* User Requested: Guide Callout Container */}
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
          className="px-5 py-2.5 rounded-xl bg-accent text-on-accent font-bold text-xs hover:bg-accent-2 transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>فعال‌سازی راهنما</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dynamic Next Step Banner computed from state */}
      <div className="p-6 rounded-2xl bg-accent text-on-accent relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              گام پیشنهادی خط لوله
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            {nextStepTitle}
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-2xl leading-relaxed">
            {nextStepDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => onNavigate(nextStepTarget.step, nextStepTarget.tab)}
            className="px-5 py-2.5 rounded-xl bg-surface text-accent font-extrabold text-sm hover:bg-surface-2 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>{nextStepCta}</span>
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
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-ink">مراحل شش‌گانه پردازش داده بیستون</h3>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
              داده‌ی نمایشی
            </span>
          </div>
          <span className="text-xs text-muted">هر مرحله با کلیک به‌صورت مستقیم قابل بررسی است</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_STEPS.filter((s) => s.stepNumber > 0).map((step) => {
            const Icon = STEP_ICONS[step.key] || Tags;
            const status = stepStatuses[step.key] || 'ready';
            const isDone = status === 'done';
            const isLocked = status === 'locked';

            return (
              <div
                key={step.key}
                onClick={() => onNavigate(step.key)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  step.key === 'model' && isLabelsDone && !isModelDone
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
                          : step.key === 'model' && isLabelsDone
                          ? 'text-accent'
                          : isLocked
                          ? 'text-muted'
                          : 'text-ink'
                      }`}
                    >
                      {toFaDigits(String(step.stepNumber).padStart(2, '0'))}
                    </span>

                    {isDone ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-good-soft text-good flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>انجام شد</span>
                      </span>
                    ) : step.key === 'model' && isLabelsDone ? (
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
                  <span className="font-medium">
                    {getStepMetric(step.key)}
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
              <span className="font-semibold text-good">
                {toFaDigits(32)} توکن بر ثانیه روی کارت گرافیک محلی
              </span>
            </div>
          </div>
        </div>

        {/* Human Expert Labeling Tracker */}
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              <h3 className="font-bold text-sm text-ink">
                پیشرفت برچسب‌زنی کارشناسان (نمونه مرجع)
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                داده‌ی نمایشی
              </span>
            </div>
            <button
              onClick={() => onNavigate('expert', 'progress')}
              className="text-xs text-accent hover:underline font-semibold cursor-pointer"
            >
              مشاهده جزییات
            </button>
          </div>

          {!isDataDone ? (
            <div className="text-center py-6 text-xs text-muted space-y-1">
              <span>پیشرفت کارشناسان پس از پالایش داده‌ها فعال می‌شود.</span>
              <div className="font-mono text-ink font-bold">—</div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink">کارشناس شماره ۱ (برچسب‌زن ارشد)</span>
                  <span className="text-muted font-mono font-bold">
                    {formatRatio(exp1Done, refSampleSize)} متن
                  </span>
                </div>
                <div className="h-2 rounded-full bg-track overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-ink">کارشناس شماره ۲ (تحلیل‌گر داده)</span>
                  <span className="text-muted font-mono font-bold">
                    {formatRatio(exp2Done, refSampleSize)} متن
                  </span>
                </div>
                <div className="h-2 rounded-full bg-track overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-ochre-soft/60 border border-ochre/20 text-[11px] text-ochre flex items-center justify-between">
                <span>
                  تاکنون {toFaDigits(4)} مورد عدم تطابق شناسایی شده که نیازمند داوری (Adjudication) است.
                </span>
                <button
                  onClick={() => onNavigate('expert', 'adj')}
                  className="font-bold underline shrink-0 hover:text-ochre cursor-pointer"
                >
                  حل اختلاف
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
