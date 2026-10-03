import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Save,
  Check,
  AlertTriangle,
  RotateCcw,
  FastForward,
  Keyboard,
  Scale,
} from 'lucide-react';
import {
  INITIAL_LABELS,
  SAMPLE_TEXTS,
  SAMPLE_REF_TEXTS,
  SAMPLE_REV_TEXTS,
  INITIAL_EXPERTS,
  INITIAL_ADJUDICATION_ITEMS,
} from '../../mockData';
import { AdjudicationItem, LabelItem, OperatorAnswer } from '../../types';

interface ExpertStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenShortcuts: () => void;
  role?: string;
}

export const ExpertStep: React.FC<ExpertStepProps> = ({
  activeTab,
  onChangeTab,
  onOpenShortcuts,
  role = 'operator',
}) => {
  // Strict Double-Blind Protocol:
  // Operator ONLY has access to 'work' station! Adjudication and other experts' answers are strictly hidden.
  // Admin ONLY has access to 'progress' and 'adj' (adjudication).
  const effectiveTab = role === 'operator' ? 'work' : (activeTab === 'work' ? 'progress' : activeTab);

  // Annotation Station State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [workMode, setWorkMode] = useState<'ref' | 'review'>('ref');
  const [textSize, setTextSize] = useState(16);
  const [savingState, setSavingState] = useState<'saved' | 'saving'>('saved');
  const [expandedExampleId, setExpandedExampleId] = useState<number | null>(null);

  // Disjoint Dataset selection: Reference vs Review have zero overlap (USER REQUEST)
  const activeDataset = workMode === 'ref' ? SAMPLE_REF_TEXTS : SAMPLE_REV_TEXTS;
  const currentText = activeDataset[currentIndex % activeDataset.length];

  // Store answers for texts
  const [answers, setAnswers] = useState<Record<number, OperatorAnswer>>({
    0: { labels: [0], noReason: false, piiFlag: false, badAnonFlag: false, touched: true },
    1: { labels: [1, 2], noReason: false, piiFlag: false, badAnonFlag: false, touched: true },
    2: { labels: [4, 5], noReason: false, piiFlag: false, badAnonFlag: false, touched: true },
    3: { labels: [3, 6], noReason: false, piiFlag: false, badAnonFlag: false, touched: true },
    4: { labels: [], noReason: false, piiFlag: false, badAnonFlag: false, touched: false },
  });

  // Adjudication state
  const [adjIndex, setAdjIndex] = useState(0);
  const [adjItems, setAdjItems] = useState<AdjudicationItem[]>(INITIAL_ADJUDICATION_ITEMS);

  const currentAnswer = answers[currentIndex] || {
    labels: workMode === 'review' ? (currentText?.modelSuggestions.slice() || []) : [],
    noReason: false,
    piiFlag: false,
    badAnonFlag: false,
    touched: false,
  };

  const totalItemsCount = 100;
  // Consistent numbers: 78 completed
  const completedCount = 78;

  // Save feedback simulator
  const updateAnswer = (updater: (prev: OperatorAnswer) => OperatorAnswer) => {
    setSavingState('saving');
    setAnswers((prev) => {
      const existing = prev[currentIndex] || {
        labels: workMode === 'review' ? (currentText?.modelSuggestions.slice() || []) : [],
        noReason: false,
        piiFlag: false,
        badAnonFlag: false,
        touched: false,
      };
      const updated = updater(existing);
      updated.touched = true;
      return { ...prev, [currentIndex]: updated };
    });

    setTimeout(() => {
      setSavingState('saved');
    }, 350);
  };

  const toggleLabel = (labelId: number) => {
    updateAnswer((prev) => {
      const exists = prev.labels.includes(labelId);
      const nextLabels = exists
        ? prev.labels.filter((id) => id !== labelId)
        : [...prev.labels, labelId];
      return { ...prev, labels: nextLabels, noReason: false };
    });
  };

  const toggleNoReason = () => {
    updateAnswer((prev) => ({
      ...prev,
      noReason: !prev.noReason,
      labels: !prev.noReason ? [] : prev.labels,
    }));
  };

  const togglePiiFlag = () => {
    updateAnswer((prev) => ({ ...prev, piiFlag: !prev.piiFlag }));
  };

  const toggleBadAnonFlag = () => {
    updateAnswer((prev) => ({ ...prev, badAnonFlag: !prev.badAnonFlag }));
  };

  // Keyboard shortcut listener (1-8 for labels, N for noReason)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (effectiveTab !== 'work') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 8) {
        e.preventDefault();
        const targetLabel = INITIAL_LABELS.find((lb) => lb.keyShortcut === String(num));
        if (targetLabel) {
          toggleLabel(targetLabel.id);
        }
      }

      if (e.key === 'n' || e.key === 'N' || e.key === 'د') {
        e.preventDefault();
        toggleNoReason();
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(activeDataset.length - 1, prev + 1));
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveTab, activeDataset.length, currentIndex]);

  const currentAdj = adjItems[adjIndex] || adjItems[0];

  const toggleAdjFinalLabel = (labelId: number) => {
    setAdjItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== adjIndex) return item;
        const exists = item.finalLabels.includes(labelId);
        const nextLabels = exists
          ? item.finalLabels.filter((id) => id !== labelId)
          : [...item.finalLabels, labelId];
        return { ...item, finalLabels: nextLabels };
      })
    );
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* If role is admin: Show ONLY Supervisor tabs (Work Station removed for Admin as requested) */}
      {role === 'admin' ? (
        <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
          {[
            { id: 'progress', label: 'پیشرفت کارشناسان و وضعیت برچسب‌زنی' },
            { id: 'adj', label: 'حل اختلاف و داوری نهایی (Adjudication)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                effectiveTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* ======================================================== */}
      {/* TAB 1: OPERATOR WORK STATION (OPERATOR ONLY) */}
      {/* ======================================================== */}
      {role === 'operator' && effectiveTab === 'work' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Greeting & Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
            <div>
              <span className="text-xs text-accent font-semibold block">سلام، کارشناس شماره ۱</span>
              <h1 className="text-2xl font-black text-ink mt-0.5">میز کار برچسب‌زنی کارشناس</h1>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {workMode === 'ref'
                  ? 'مجموعه مرجع: هر متن را بخوانید و دلیل‌های استخراج‌شده را تیک بزنید (برچسب‌زنی کور مستقل).'
                  : 'مجموعه بازبینی: پیشنهادهای مدل را بررسی کرده و برچسب‌های صحیح را تایید یا اصلاح فرمایید.'}
              </p>
            </div>

            {/* Mode Sub-tabs (Disjoint datasets) */}
            <div className="flex items-center gap-6 border-b border-line pb-0.5 self-start sm:self-auto">
              <button
                onClick={() => {
                  setWorkMode('ref');
                  setCurrentIndex(0);
                }}
                className={`pb-2 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
                  workMode === 'ref'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                نمونه‌ی مرجع (داوری کور)
              </button>
              <button
                onClick={() => {
                  setWorkMode('review');
                  setCurrentIndex(0);
                }}
                className={`pb-2 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
                  workMode === 'review'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                نمونه‌ی بازبینی (پیشنهاد مدل)
              </button>
            </div>
          </div>

          {/* Progress Row with harmonious numbers (78 completed, matching dashboard & overview) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black font-mono text-ink">
                  {(completedCount).toLocaleString('fa-IR')} از {totalItemsCount.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-muted font-medium">
                  ({(completedCount).toLocaleString('fa-IR')} متن کامل شده — ۷۸٪ پیشرفت)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      savingState === 'saved' ? 'bg-good' : 'bg-ochre animate-pulse'
                    }`}
                  />
                  <span className="text-[11px] font-medium">
                    {savingState === 'saved' ? 'ذخیره شد' : 'در حال ذخیره...'}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentIndex(activeDataset.length - 1)}
                  className="px-3 py-1.5 rounded-lg border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors cursor-pointer shadow-2xs"
                >
                  پرش به ناتمام
                </button>
              </div>
            </div>

            {/* Blue line progress bar */}
            <div className="h-1.5 rounded-full bg-track overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: '78%' }}
              />
            </div>
          </div>

          {/* MAIN TEXT DISPLAY CARD */}
          <div className="bg-surface border border-line rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-2 text-accent border border-line">
                  {workMode === 'ref' ? 'نمونه مرجع' : 'نمونه بازبینی'} #{currentText?.id}
                </span>
                <span className="text-[11px] text-muted">
                  مبدأ: {currentText?.sourceFile}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTextSize((prev) => Math.max(13, prev - 1))}
                  className="p-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-surface-2 cursor-pointer"
                  title="کاهش اندازه قلم"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTextSize((prev) => Math.min(22, prev + 1))}
                  className="p-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-surface-2 cursor-pointer"
                  title="افزایش اندازه قلم"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenShortcuts}
                  className="p-1.5 rounded-lg border border-line text-muted hover:text-accent hover:bg-surface-2 cursor-pointer"
                  title="کلیدهای میانبر (؟)"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The Text */}
            <div className="py-2">
              <p
                className="text-ink leading-relaxed font-normal select-text"
                style={{ fontSize: `${textSize}px` }}
              >
                {currentText?.text}
              </p>
            </div>

            {/* Review mode indicator */}
            {workMode === 'review' && (
              <div className="p-3 rounded-xl bg-accent-soft/30 border border-accent/20 text-xs text-accent flex items-center justify-between">
                <span>پیشنهاد مدل زبانی برای این متن:</span>
                <div className="flex gap-1.5">
                  {currentText?.modelSuggestions.map((sid) => (
                    <span key={sid} className="px-2 py-0.5 rounded bg-surface border border-accent/40 font-bold">
                      {INITIAL_LABELS[sid]?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TAXONOMY LABEL CARDS (GRID 4x2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INITIAL_LABELS.map((lb) => {
              const isSelected = currentAnswer.labels.includes(lb.id);
              const isModelSuggested = workMode === 'review' && currentText?.modelSuggestions.includes(lb.id);
              const isExExpanded = expandedExampleId === lb.id;

              return (
                <div
                  key={lb.id}
                  onClick={() => toggleLabel(lb.id)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative select-none ${
                    isSelected
                      ? 'bg-accent-soft/70 border-accent shadow-xs ring-1 ring-accent'
                      : 'bg-surface border-line hover:border-line-strong hover:bg-surface-2/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-accent text-on-accent'
                          : 'border border-line-strong bg-surface text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isModelSuggested && (
                        <span
                          className="text-[10px] font-bold text-accent border border-dashed border-accent px-1.5 py-0.2 rounded"
                          title="پیشنهاد مدل"
                        >
                          م
                        </span>
                      )}
                      <kbd className="min-w-5 h-5 px-1 flex items-center justify-center rounded bg-surface border border-line-strong text-[11px] font-mono font-bold text-muted">
                        {lb.keyShortcut}
                      </kbd>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    <b className="text-xs font-bold text-ink block">{lb.name}</b>
                    <p className="text-[11px] text-muted line-clamp-2 leading-tight">
                      {lb.definition}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-line/40">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedExampleId(isExExpanded ? null : lb.id);
                      }}
                      className="w-5 h-5 rounded-full flex items-center justify-center border border-line text-muted hover:text-accent hover:border-accent text-xs cursor-pointer"
                      title={isExExpanded ? 'بستن مثال' : 'مشاهده مثال کاربردی'}
                    >
                      ؟
                    </button>
                    <span className="text-[10px] text-muted font-mono">{lb.keyShortcut}</span>
                  </div>

                  {isExExpanded && (
                    <div className="mt-2 p-2 rounded-lg bg-surface-2 border border-line text-[11px] text-ink leading-relaxed animate-in fade-in">
                      «{lb.example}»
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAST ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface border border-line rounded-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleNoReason}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  currentAnswer.noReason
                    ? 'bg-accent text-on-accent border-accent'
                    : 'border-line text-ink-2 hover:bg-surface-2'
                }`}
              >
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px] font-mono font-bold text-muted">
                  N
                </kbd>
                <span>بدون دلیل / شکایت نامعتبر</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-line text-xs font-semibold hover:bg-surface-2 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>متن قبلی</span>
              </button>

              <span className="text-xs font-mono font-bold text-ink px-2">
                {currentIndex + 1} از {activeDataset.length}
              </span>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(activeDataset.length - 1, prev + 1))}
                disabled={currentIndex === activeDataset.length - 1}
                className="px-4 py-1.5 rounded-lg bg-accent text-on-accent text-xs font-semibold hover:bg-accent-2 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>متن بعدی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PROGRESS OVERVIEW (FOR ADMIN SUPERVISOR) */}
      {/* ======================================================== */}
      {effectiveTab === 'progress' && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">
              پیشرفت برچسب‌زنی کارشناسان و ضریب توافق بین‌ارزیاب (Inter-Annotator Agreement)
            </h3>
            <p className="text-xs text-muted">
              پایش مستقل برچسب‌زنی کور دو کارشناس روی ۱۰۰ متن نمونه مرجع جهت سنجش شاخص کاپای کوهن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_EXPERTS.map((exp) => (
              <div
                key={exp.id}
                className="bg-surface border border-line rounded-2xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-soft text-accent font-bold flex items-center justify-center text-sm">
                      {exp.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-ink">{exp.name}</h4>
                      <span className="text-[11px] font-mono text-muted" dir="ltr">
                        @{exp.username}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-good bg-good-soft px-2.5 py-0.5 rounded-full">
                    {exp.lastActive}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">برچسب‌زنی کور نمونه مرجع:</span>
                      <span className="font-mono font-bold text-ink">
                        {exp.refCompleted} از {exp.refTotal} ({exp.refCompleted}٪)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-track overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${exp.refCompleted}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">بازبینی نمونه پیشنهاد مدل:</span>
                      <span className="font-mono font-bold text-ink">
                        {exp.revCompleted} از {exp.revTotal} ({exp.revCompleted}٪)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-track overflow-hidden">
                      <div
                        className="h-full bg-good rounded-full"
                        style={{ width: `${exp.revCompleted}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Kappa Agreement Metric Banner */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-ink">شاخص توافق کاپای کوهن (Cohen’s Kappa):</span>
              <p className="text-[11px] text-muted">
                محاسبه میزان همگرایی تصمیمات کارشناس ۱ و کارشناس ۲ روی متون مشترک مرجع
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black font-mono text-good">κ = ۰٫۷۸</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-good-soft text-good font-semibold">
                توافق قابل‌توجه (Substantial)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADJUDICATION WORKBENCH (SUPERVISOR ARBITRATION) */}
      {/* ======================================================== */}
      {effectiveTab === 'adj' && (
        <div className="space-y-5 max-w-4xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">
              بررسی مغایرت <b>{adjIndex + 1}</b> از {adjItems.length} (متن شماره {currentAdj.textId})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAdjIndex((prev) => Math.max(0, prev - 1))}
                disabled={adjIndex === 0}
                className="px-3 py-1 rounded-lg border border-line text-xs disabled:opacity-40 cursor-pointer"
              >
                مورد قبلی
              </button>
              <button
                onClick={() => setAdjIndex((prev) => Math.min(adjItems.length - 1, prev + 1))}
                disabled={adjIndex === adjItems.length - 1}
                className="px-3 py-1 rounded-lg border border-line text-xs disabled:opacity-40 cursor-pointer"
              >
                مورد بعدی
              </button>
            </div>
          </div>

          {/* Text under dispute */}
          <div className="p-6 bg-surface border border-line rounded-2xl">
            <p className="text-sm md:text-base text-ink leading-relaxed font-normal">
              «{currentAdj.text}»
            </p>
          </div>

          {/* Discrepancy comparison table */}
          <div className="bg-surface border border-line rounded-2xl overflow-hidden shadow-2xs">
            <div className="grid grid-cols-12 bg-surface-2 border-b border-line text-xs text-muted font-semibold p-3">
              <span className="col-span-5">عنوان برچسب در تاکسونومی</span>
              <span className="col-span-2 text-center">کارشناس شماره ۱</span>
              <span className="col-span-2 text-center">کارشناس شماره ۲</span>
              <span className="col-span-3 text-center text-ink font-bold">برچسب نهایی داور</span>
            </div>

            <div className="divide-y divide-line text-xs">
              {INITIAL_LABELS.map((lb) => {
                const e1 = currentAdj.expert1Labels.includes(lb.id);
                const e2 = currentAdj.expert2Labels.includes(lb.id);
                const isFinal = currentAdj.finalLabels.includes(lb.id);
                const isConflict = e1 !== e2;

                return (
                  <div
                    key={lb.id}
                    className={`grid grid-cols-12 p-3 items-center transition-colors ${
                      isConflict ? 'bg-ochre-soft/20' : ''
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: lb.color }}
                      />
                      <span className="font-bold text-ink">{lb.name}</span>
                    </div>

                    <div className="col-span-2 text-center">
                      {e1 ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
                          انتخاب
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </div>

                    <div className="col-span-2 text-center">
                      {e2 ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
                          انتخاب
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </div>

                    <div className="col-span-3 text-center">
                      <button
                        onClick={() => toggleAdjFinalLabel(lb.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isFinal
                            ? 'bg-good text-white shadow-xs'
                            : 'border border-line text-muted hover:text-ink'
                        }`}
                      >
                        {isFinal ? 'تأیید نهایی' : 'تعیین به عنوان نهایی'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
