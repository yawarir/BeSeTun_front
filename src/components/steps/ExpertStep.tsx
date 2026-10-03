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
import { INITIAL_LABELS, SAMPLE_TEXTS, INITIAL_EXPERTS, INITIAL_ADJUDICATION_ITEMS } from '../../mockData';
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
  // Annotation Station State
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to 4 sample texts (representing 100 items)
  const [workMode, setWorkMode] = useState<'ref' | 'review'>('ref');
  const [textSize, setTextSize] = useState(16);
  const [savingState, setSavingState] = useState<'saved' | 'saving'>('saved');
  const [expandedExampleId, setExpandedExampleId] = useState<number | null>(null);

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

  const currentText = SAMPLE_TEXTS[currentIndex % SAMPLE_TEXTS.length];
  const currentAnswer = answers[currentIndex] || {
    labels: workMode === 'review' ? currentText.modelSuggestions.slice() : [],
    noReason: false,
    piiFlag: false,
    badAnonFlag: false,
    touched: false,
  };

  const totalItemsCount = 100;

  // Save feedback simulator
  const updateAnswer = (updater: (prev: OperatorAnswer) => OperatorAnswer) => {
    setSavingState('saving');
    setAnswers((prev) => {
      const existing = prev[currentIndex] || {
        labels: workMode === 'review' ? currentText.modelSuggestions.slice() : [],
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

  // Keyboard Navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'work') return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= 8) {
        e.preventDefault();
        toggleLabel(num - 1);
      } else if (e.key.toLowerCase() === 'n' || e.key === 'د') {
        e.preventDefault();
        toggleNoReason();
      } else if (e.key.toLowerCase() === 'p' || e.key === 'ح') {
        e.preventDefault();
        togglePiiFlag();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex < 4) setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setTextSize((s) => Math.min(24, s + 1));
      } else if (e.key === '-') {
        e.preventDefault();
        setTextSize((s) => Math.max(14, s - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeTab, answers, workMode]);

  // Adjudication consensus updater
  const currentAdj = adjItems[adjIndex];
  const toggleAdjFinal = (labelId: number) => {
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
      {/* If role is admin, show the full admin tabs; if operator, keep it clean and focused as shown in the screenshot */}
      {role === 'admin' && (
        <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
          {[
            { id: 'work', label: 'میز کار برچسب‌زنی کارشناس (Work Station)' },
            { id: 'progress', label: 'پیشرفت کارشناسان ۱ و ۲' },
            { id: 'adj', label: 'حل اختلاف و داوری نهایی (Adjudication)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: OPERATOR WORK STATION (EXACT MATCH TO ATTACHED MOCKUP) */}
      {/* ======================================================== */}
      {activeTab === 'work' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Greeting & Main Header (Matches screenshot) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
            <div>
              <span className="text-xs text-accent font-semibold block">سلام، کارشناس ۱</span>
              <h1 className="text-2xl font-black text-ink mt-0.5">برچسب‌زنی کارشناس</h1>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {workMode === 'ref'
                  ? 'نمونه‌ی مرجع: هر متن را بخوانید و دلیل‌هایی را که در آن هست تیک بزنید.'
                  : 'بازبینی: پیشنهادهای مدل را بررسی کرده و دلیل‌های درست را تایید یا اصلاح نمایید.'}
              </p>
            </div>

            {/* Mode Sub-tabs (Matches screenshot: نمونه‌ی مرجع / بازبینی) */}
            <div className="flex items-center gap-6 border-b border-line pb-0.5 self-start sm:self-auto">
              <button
                onClick={() => setWorkMode('ref')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
                  workMode === 'ref'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                نمونه‌ی مرجع
              </button>
              <button
                onClick={() => setWorkMode('review')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 -mb-px cursor-pointer ${
                  workMode === 'review'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                بازبینی
              </button>
            </div>
          </div>

          {/* Progress Row with Jump button, Autosave indicator, and full-width blue bar (Matches screenshot) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black font-mono text-ink">
                  {(currentIndex + 37).toLocaleString('fa-IR')} از {totalItemsCount.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-muted font-medium">
                  {(currentIndex + 36).toLocaleString('fa-IR')} متن کامل شده
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
                  onClick={() => setCurrentIndex(4)}
                  className="px-3 py-1.5 rounded-lg border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors cursor-pointer shadow-2xs"
                >
                  پرش به ناتمام
                </button>
              </div>
            </div>

            {/* Blue line progress bar */}
            <div className="h-1 rounded-full bg-track overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 37) / totalItemsCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Mode Guidance Tip for Review Mode */}
          {workMode === 'review' && (
            <div className="p-3 rounded-xl bg-accent-soft/50 border border-accent/20 text-xs text-accent-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded flex items-center justify-center border border-dashed border-accent font-mono text-[11px] font-bold text-accent shrink-0">
                م
              </span>
              <span>
                <b>حالت بازبینی فعال است:</b> پیشنهادهای مدل زبانی با خط‌چین و علامت «م» مشخص شده‌اند. برچسب‌های صحیح را تایید و موارد نادرست را با کلیک بردارید.
              </span>
            </div>
          )}

          {/* THE PRIMARY COMPLAINT TEXT CARD (Matches screenshot) */}
          <div className="bg-surface border border-line rounded-2xl p-6 md:p-8 shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted">
                متن شماره‌ی {currentText.id.toLocaleString('fa-IR')}
              </span>

              {/* Font Size Adjusters */}
              <div className="flex items-center border border-line rounded-lg p-0.5 bg-surface-2">
                <button
                  onClick={() => setTextSize((s) => Math.max(14, s - 1))}
                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-ink rounded cursor-pointer"
                  title="کاهش قلم (-)"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-2 text-[11px] font-mono font-bold text-ink">{textSize}px</span>
                <button
                  onClick={() => setTextSize((s) => Math.min(24, s + 1))}
                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-ink rounded cursor-pointer"
                  title="افزایش قلم (+)"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            <p
              className="text-ink leading-loose font-normal selection:bg-accent/20 pt-1"
              style={{ fontSize: `${textSize}px` }}
            >
              {currentText.text}
            </p>
          </div>

          {/* THE 8 LABEL SELECTION CARDS (Matches layout in screenshot: 4 columns x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INITIAL_LABELS.map((lb) => {
              const isSelected = currentAnswer.labels.includes(lb.id);
              const isModelSuggested = workMode === 'review' && currentText.modelSuggestions.includes(lb.id);
              const isExExpanded = expandedExampleId === lb.id;

              return (
                <div
                  key={lb.id}
                  onClick={() => toggleLabel(lb.id)}
                  className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-right transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-accent-soft/80 border-accent shadow-xs ring-1 ring-accent'
                      : isModelSuggested
                      ? 'bg-surface border-dashed border-accent/60 hover:bg-surface-2'
                      : 'bg-surface border-line hover:border-line-strong hover:bg-surface-2'
                  }`}
                >
                  {/* Top row of card: Number shortcut badge in left, Checkbox in right */}
                  <div className="flex items-center justify-between mb-2">
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-accent text-on-accent'
                          : 'border border-line-strong bg-surface text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    {/* Shortcut key & model suggestion tag */}
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

                  {/* Label title and short description */}
                  <div className="space-y-1 mb-2">
                    <b className="text-xs font-bold text-ink block">{lb.name}</b>
                    <p className="text-[11px] text-muted line-clamp-2 leading-tight">
                      {lb.definition}
                    </p>
                  </div>

                  {/* Bottom row of card: Question mark (?) to expand practical example */}
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

          {/* FAST ACTION BAR: N (No Reason), P (PII), Bad Anonymization */}
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
                onClick={togglePiiFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  currentAnswer.piiFlag
                    ? 'bg-ochre-soft text-ochre border-ochre'
                    : 'border-line text-muted hover:text-ink hover:bg-surface-2'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>گزارش اطلاعات هویتی ماسک‌نشده (P)</span>
              </button>

              <button
                onClick={toggleBadAnonFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  currentAnswer.badAnonFlag
                    ? 'bg-crit-soft text-crit border-crit'
                    : 'border-line text-muted hover:text-ink hover:bg-surface-2'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>گزارش گمنام‌سازی نادرست</span>
              </button>
            </div>
          </div>

          {/* DOCKED BOTTOM WORKBENCH BAR */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between p-3.5 rounded-2xl bg-surface/95 backdrop-blur-md border border-line shadow-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-line-strong bg-surface text-ink text-xs font-semibold hover:bg-surface-2 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>متن قبلی (→)</span>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(4, prev + 1))}
                disabled={currentIndex === 4}
                className="px-5 py-2 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>متن بعدی (←)</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-xs text-muted">
              <span><b>۱ تا ۸:</b> انتخاب برچسب‌ها</span>
              <span><b>N:</b> بدون دلیل</span>
              <span><b>جهت‌نماها:</b> جابه‌جایی میان متون</span>
            </div>

            <button
              onClick={() => {
                alert('ثبت نهایی این دسته انجام شد و برای تطابق با کارشناس ۲ ذخیره گردید.');
              }}
              className="px-5 py-2 rounded-xl bg-good text-white text-xs font-bold hover:bg-good/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ثبت و تحویل نهایی</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PROGRESS (VISIBLE TO ADMIN OR WHEN CLICKED) */}
      {/* ======================================================== */}
      {activeTab === 'progress' && (
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_EXPERTS.map((exp) => (
              <div
                key={exp.id}
                className="bg-surface border border-line rounded-xl p-5 space-y-4 shadow-xs"
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
                  <span className="text-[11px] font-semibold text-good bg-good-soft px-2 py-0.5 rounded-full">
                    {exp.lastActive}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">برچسب‌زنی کور نمونه مرجع:</span>
                      <span className="font-mono font-bold text-ink">
                        {exp.refCompleted} از {exp.refTotal} متن
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-track overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(exp.refCompleted / exp.refTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">بازبینی خروجی مدل:</span>
                      <span className="font-mono font-bold text-ink">
                        {exp.revCompleted} از {exp.revTotal} متن
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-track overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(exp.revCompleted / exp.revTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ADJUDICATION WORKBENCH */}
      {/* ======================================================== */}
      {activeTab === 'adj' && (
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
          <div className="p-6 bg-surface border border-line rounded-xl">
            <p className="text-sm md:text-base text-ink leading-relaxed font-normal">
              «{currentAdj.text}»
            </p>
          </div>

          {/* Discrepancy comparison table */}
          <div className="bg-surface border border-line rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-surface-2 border-b border-line text-xs text-muted font-semibold p-3">
              <span className="col-span-5">عنوان برچسب در تاکسونومی</span>
              <span className="col-span-2 text-center">کارشناس ۱</span>
              <span className="col-span-2 text-center">کارشناس ۲</span>
              <span className="col-span-3 text-center text-ink">برچسب نهایی داور</span>
            </div>

            <div className="divide-y divide-line text-xs">
              {INITIAL_LABELS.map((lb) => {
                const e1 = currentAdj.expert1Labels.includes(lb.id);
                const e2 = currentAdj.expert2Labels.includes(lb.id);
                const isDiff = e1 !== e2;
                const isFinal = currentAdj.finalLabels.includes(lb.id);

                return (
                  <div
                    key={lb.id}
                    className={`grid grid-cols-12 items-center p-3 transition-colors ${
                      isDiff ? 'bg-ochre-soft/30' : ''
                    }`}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      {isDiff && (
                        <span
                          className="w-2 h-2 rounded-full bg-ochre shrink-0"
                          title="نقطه اختلاف دو کارشناس"
                        />
                      )}
                      <span className={`font-semibold ${isDiff ? 'text-ochre' : 'text-ink'}`}>
                        {lb.name}
                      </span>
                    </div>

                    <div className="col-span-2 text-center font-bold">
                      {e1 ? (
                        <span className="text-accent">✓ ثبت کرد</span>
                      ) : (
                        <span className="text-muted opacity-40">—</span>
                      )}
                    </div>

                    <div className="col-span-2 text-center font-bold">
                      {e2 ? (
                        <span className="text-accent">✓ ثبت کرد</span>
                      ) : (
                        <span className="text-muted opacity-40">—</span>
                      )}
                    </div>

                    <div className="col-span-3 flex justify-center">
                      <button
                        onClick={() => toggleAdjFinal(lb.id)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isFinal
                            ? 'bg-accent text-on-accent border-accent'
                            : 'border-line-strong bg-surface text-transparent hover:border-accent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Note & Confirm Button */}
          <div className="p-5 bg-surface border border-line rounded-xl space-y-3">
            <label className="text-xs font-bold text-ink block">
              یادداشت داوری و استدلال علمی:
            </label>
            <textarea
              placeholder="دلیل تصمیم نهایی، بر اساس دستورالعمل برچسب‌زنی..."
              defaultValue={currentAdj.note}
              className="w-full h-16 p-3 border border-line-strong rounded-lg bg-surface text-xs leading-relaxed text-ink"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted">
                ردیف‌های با رنگ زرد نشان‌دهنده اختلاف نظر هستند؛ برچسب‌های مورد توافق به‌صورت خودکار تأیید شده‌اند.
              </span>
              <button
                onClick={() => {
                  alert('رای نهایی برای این متن ثبت و در دیتاست طلایی اعمال شد.');
                  if (adjIndex < adjItems.length - 1) setAdjIndex(adjIndex + 1);
                }}
                className="px-5 py-2 bg-accent text-on-accent text-xs font-bold rounded-lg hover:bg-accent-2 transition-colors shrink-0 cursor-pointer"
              >
                ثبت تصمیم و بررسی متن بعدی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
