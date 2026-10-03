import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Tags,
  Keyboard,
  FileCode,
  History,
  Plus,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_LABELS, INITIAL_CANDIDATE_LABELS } from '../../mockData';
import { CandidateLabel, LabelItem } from '../../types';

interface LabelsStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSettings: () => void;
}

export const LabelsStep: React.FC<LabelsStepProps> = ({
  activeTab,
  onChangeTab,
  onOpenSettings,
}) => {
  const [jobState, setJobState] = useState<'idle' | 'run' | 'err' | 'done'>('idle');
  const [jobProgress, setJobProgress] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  const [candidates, setCandidates] = useState<CandidateLabel[]>(INITIAL_CANDIDATE_LABELS);
  const [labels, setLabels] = useState<LabelItem[]>(INITIAL_LABELS);
  const [promptContext, setPromptContext] = useState(
    'متن‌ها شکایت‌های رسمی شهروندان در حوزه خدمات عمومی اداری و سامانه‌های برخط کشوری هستند.'
  );

  // Simulated streaming batch job
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobState === 'run') {
      interval = setInterval(() => {
        setJobProgress((prev) => {
          const next = prev + 1;
          if (simulateError && next === 8) {
            setJobState('err');
            return 7;
          }
          if (next >= 15) {
            setJobState('done');
            return 15;
          }
          return next;
        });
      }, 550);
    }
    return () => clearInterval(interval);
  }, [jobState, simulateError]);

  const handleStartJob = (fromBatch = 0) => {
    setJobProgress(fromBatch);
    setJobState('run');
  };

  const toggleCandidate = (id: number) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleApplyCandidates = () => {
    alert('برچسب‌های کاندیدای انتخاب‌شده با موفقیت در تاکسونومی رسمی پروژه ادغام و ثبت شدند.');
    onChangeTab('list');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'extract', label: 'استخراج برچسب با مدل زبانی' },
          { id: 'list', label: 'فهرست برچسب‌ها و تعاریف' },
          { id: 'fewshot', label: 'نمونه‌های راهنما (Few-shot A/B)' },
          { id: 'versions', label: 'تاریخچه نسخه‌ها' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-2 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXTRACT JOB */}
      {activeTab === 'extract' && (
        <div className="space-y-6 max-w-3xl">
          {/* State: IDLE */}
          {jobState === 'idle' && (
            <div className="bg-surface border border-line rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-line">
                  آماده اجرا
                </span>
                <h3 className="font-bold text-base text-ink">
                  استخراج هوشمند برچسب‌ها و دلایل تکرارشونده با مدل زبانی
                </h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                مدل زبانی متن‌ها را دسته‌دسته می‌خواند، دلایل صریح شکایت شهروندان را بیرون می‌کشد و سپس دلایل مشابه را در برچسب‌های متمرکز دسته‌بندی می‌کند.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink block">مدل زبانی استخراج‌کننده:</label>
                  <select
                    className="w-full h-10 px-3 border border-line-strong rounded-lg bg-surface font-mono text-xs text-ink"
                    dir="ltr"
                  >
                    <option>qwen2.5-14b-instruct · LM Studio (محلی)</option>
                    <option>gemma2:9b-persian · Ollama</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink block">تعداد متن نمونه جهت کشف الگو:</label>
                  <input
                    defaultValue="۳۰۰ متن (۱۵ دسته ۲۰تایی)"
                    disabled
                    className="w-full h-10 px-3 border border-line rounded-lg bg-surface-2 font-mono text-xs text-muted"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink block">
                  زمینه و پرامپت راهنمای حوزه (Domain Context):
                </label>
                <textarea
                  value={promptContext}
                  onChange={(e) => setPromptContext(e.target.value)}
                  className="w-full h-20 p-3 border border-line-strong rounded-lg bg-surface text-xs leading-relaxed text-ink focus:border-accent"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="w-4 h-4 accent-accent rounded"
                />
                <span>شبیه‌سازی خطای قطعی شبکه در دسته‌ی ۸ (جهت آزمایش بازیابی و ادامه از دسته‌ی ۸)</span>
              </label>

              <button
                onClick={() => handleStartJob(0)}
                className="px-6 py-2.5 bg-accent text-on-accent font-semibold text-xs rounded-lg hover:bg-accent-2 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع استخراج هوشمند</span>
              </button>
            </div>
          )}

          {/* State: RUNNING */}
          {jobState === 'run' && (
            <div className="bg-surface border-2 border-accent rounded-xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-bold text-accent">در حال پردازش دسته‌ای با Qwen 14B</span>
                </div>
                <button
                  onClick={() => setJobState('idle')}
                  className="px-3 py-1 border border-line rounded text-xs text-muted hover:text-ink"
                >
                  توقف عملیات
                </button>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-ink">
                  دسته‌ی {jobProgress.toLocaleString('fa-IR')} از ۱۵
                </span>
                <span className="text-xs text-muted font-medium">
                  حدود {Math.max(1, Math.round((15 - jobProgress) * 0.4)).toLocaleString('fa-IR')} دقیقه مانده
                </span>
              </div>

              <div className="h-2.5 rounded-full bg-track overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((jobProgress / 15) * 100)}%` }}
                />
              </div>

              <p className="text-xs text-ink-2">
                تاکنون {(jobProgress * 28).toLocaleString('fa-IR')} دلیل اولیه استخراج شده است. می‌توانید این صفحه را ترک کنید؛ فرآیند در پس‌زمینه ادامه خواهد یافت.
              </p>
            </div>
          )}

          {/* State: ERROR */}
          {jobState === 'err' && (
            <div className="bg-surface border-2 border-crit rounded-xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-crit font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>استخراج در دسته‌ی ۸ از ۱۵ متوقف شد</span>
              </div>

              <div className="p-3.5 rounded-lg bg-crit-soft text-crit text-xs space-y-1">
                <p className="font-semibold">مدل زبانی پاسخ نداد (Connection Timeout).</p>
                <p className="text-[11px] opacity-90">
                  آیا سرور محلی LM Studio روشن است؟ درگاه <code className="font-mono" dir="ltr">http://127.0.0.1:1234</code> را بررسی کنید.
                </p>
              </div>

              <p className="text-xs text-ink-2">
                داده‌های ۷ دسته‌ی قبلی با موفقیت ذخیره شده‌اند. با کلیک روی «ادامه از همین‌جا»، استخراج بدون هدررفت زمان دقیقاً از دسته‌ی ۸ از سر گرفته خواهد شد.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleStartJob(7)}
                  className="px-5 py-2 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:bg-accent-2 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ادامه از همین‌جا</span>
                </button>
                <button
                  onClick={onOpenSettings}
                  className="px-4 py-2 border border-line-strong rounded-lg text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
                >
                  بررسی سرور مدل‌ها
                </button>
              </div>
            </div>
          )}

          {/* State: DONE */}
          {jobState === 'done' && (
            <div className="bg-surface border border-line rounded-xl p-6 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-good" />
                  <h3 className="font-bold text-base text-ink">
                    ۸ برچسب پرتکرار پیشنهادی از ۳۰۰ متن کشف شد
                  </h3>
                </div>
                <button
                  onClick={() => handleStartJob(0)}
                  className="text-xs text-muted hover:text-ink border border-line px-2.5 py-1 rounded"
                >
                  اجرای دوباره
                </button>
              </div>

              <p className="text-xs text-ink-2">
                برچسب‌های مد نظر خود را تیک بزنید؛ این برچسب‌ها به میزکار کارشناس و کلیدهای میانبر متصل خواهند شد.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.map((cand) => (
                  <label
                    key={cand.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      cand.selected
                        ? 'bg-accent-soft/40 border-accent/70'
                        : 'bg-surface-2 border-line text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={cand.selected}
                        onChange={() => toggleCandidate(cand.id)}
                        className="w-4 h-4 accent-accent rounded"
                      />
                      <span className="text-xs font-bold text-ink">{cand.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      در {cand.frequency.toLocaleString('fa-IR')} متن
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleApplyCandidates}
                  className="px-5 py-2.5 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:bg-accent-2 transition-colors"
                >
                  پذیرفتن برچسب‌های انتخاب‌شده و انتقال به تاکسونومی
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LABELS TAXONOMY LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink">تاکسونومی رسمی برچسب‌های پروژه (۸ برچسب استاندارد)</h3>
              <p className="text-xs text-muted">
                هر برچسب دارای تعریف یکتا، مثال کاربردی و کلید میانبر کیبورد است.
              </p>
            </div>
            <button className="px-3.5 py-2 rounded-lg bg-surface border border-line-strong hover:bg-surface-2 text-xs font-semibold text-ink flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن برچسب سفارشی</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {labels.map((lb) => (
              <div
                key={lb.id}
                className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition-all space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: lb.color }}
                    />
                    <h4 className="font-bold text-sm text-ink">{lb.name}</h4>
                  </div>
                  <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded bg-surface-2 border border-line-strong text-xs font-mono font-bold text-accent">
                    کلید {lb.keyShortcut}
                  </kbd>
                </div>

                <p className="text-xs text-ink-2 leading-relaxed">
                  <span className="font-semibold text-ink">تعریف: </span>
                  {lb.definition}
                </p>

                <div className="p-2.5 rounded-lg bg-surface-2 border border-line text-[11px] text-muted leading-relaxed">
                  <span className="font-bold text-ink">مثال عینی: </span>
                  «{lb.example}»
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEW-SHOT EXAMPLES */}
      {activeTab === 'fewshot' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-4xl space-y-5">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">
              مجموعه‌های نمونه‌های راهنما (Few-shot Prompts A و B)
            </h3>
            <p className="text-xs text-muted">
              برای سنجش پایداری مدل، دو دسته مجزا از نمونه‌های راهنما در پرامپت تزریق می‌شوند تا واریانس خروجی مدل ارزیابی گردد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-bold text-xs text-ink">مجموعه راهنمای A (۵ نمونه)</span>
                <span className="text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded font-mono">
                  prompt_set_a.json
                </span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                حاوی نمونه‌های متمرکز بر شکایات فرایندی، خطاهای سامانه برخط و تعرفه‌های خدمات.
              </p>
              <div className="p-2.5 rounded bg-surface border border-line text-[11px] text-muted">
                نمونه: «هزینه‌ی خدمات نسبت به سال گذشته دو برابر شده ولی کیفیت فرقی نکرده» → [هزینه بالا، کیفیت پایین]
              </div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-bold text-xs text-ink">مجموعه راهنمای B (۵ نمونه جایگزین)</span>
                <span className="text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded font-mono">
                  prompt_set_b.json
                </span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                حاوی نمونه‌های چندبرچسبی، رفتار کارکنان و عدم اطلاع‌رسانی کافی با لحن محاوره‌ای‌تر.
              </p>
              <div className="p-2.5 rounded bg-surface border border-line text-[11px] text-muted">
                نمونه: «کارمند باجه با لحن تندی گفت بقیه مدارک را از سایت بگیرید» → [رفتار کارکنان، اطلاعات ناکافی]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERSIONS */}
      {activeTab === 'versions' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-3xl space-y-4">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">تاریخچه نسخه‌گذاری تاکسونومی</h3>
            <p className="text-xs text-muted">
              جهت رعایت اصول تکرارپذیری علمی مقالات، تمام نسخه‌ها به‌صورت تغییرناپذیر ثبت می‌شوند.
            </p>
          </div>

          <div className="border border-line rounded-lg overflow-hidden divide-y divide-line text-xs">
            <div className="p-3.5 bg-surface-2 flex items-center justify-between">
              <div>
                <b className="text-ink">نسخه ۱.۱ (فعال کنونی)</b>
                <p className="text-[11px] text-muted">
                  بهبود تعریف «کیفیت پایین» و انطباق کلیدهای میانبر با صفحه‌کلید فارسی
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-good-soft text-good font-semibold font-mono">
                active-v1.1
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <b className="text-ink">نسخه ۱.۰ (اولیه)</b>
                <p className="text-[11px] text-muted">استخراج اولیه برچسب‌ها با مدل Qwen 14B</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-2 text-muted font-mono">
                archived-v1.0
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
