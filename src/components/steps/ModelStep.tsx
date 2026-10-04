import React, { useState } from 'react';
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
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../../mockData';
import { LabelItem, ModelProvider } from '../../types';

interface ModelStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  providers: ModelProvider[];
  labels?: LabelItem[];
  onGoToLabels?: () => void;
  isRunCompleted: boolean;
  onRunComplete: () => void;
  datasetCount?: number;
}

export const ModelStep: React.FC<ModelStepProps> = ({
  activeTab,
  onChangeTab,
  providers,
  labels = [],
  onGoToLabels,
  isRunCompleted,
  onRunComplete,
  datasetCount = 42,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  const activeProvider = providers.find((p) => p.active) || providers[0];
  const extFlag = activeProvider?.isExternal;

  const suspiciousTexts = SAMPLE_TEXTS.filter((t) => t.isSuspicious);

  const startRuns = () => {
    setIsRunning(true);
    setRunProgress(0);

    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          onRunComplete();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Guard: If taxonomy has zero labels, require extraction first
  if (labels.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto shadow-xs" dir="rtl">
        <div className="w-12 h-12 rounded-2xl bg-ochre-soft text-ochre flex items-center justify-center mx-auto border border-ochre/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-ink">تاکسونومی پروژه هنوز برچسبی ندارد</h3>
          <p className="text-xs text-muted leading-relaxed">
            اجرای استنتاج و برچسب‌زنی دوگانه مدل زبانی (Run A و Run B) مستلزم آن است که ابتدا برچسب‌های پروژه در مرحله ۲ توسط هوش مصنوعی استخراج شده یا به صورت دستی تعریف شوند.
          </p>
        </div>
        <button
          onClick={onGoToLabels}
          className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>رفتن به مرحله ۲ (استخراج برچسب‌ها)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'runs', label: 'اجراهای دوگانه مدل (Run A & B)' },
          { id: 'susp', label: isRunCompleted ? `رکوردهای مشکوک و ناهمخوان (${suspiciousTexts.length} مورد)` : 'رکوردهای مشکوک و ناهمخوان' },
          { id: 'speed', label: 'سنجش سرعت و زمان استنتاج' },
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

      {/* TAB 1: RUNS */}
      {activeTab === 'runs' && (
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Run A */}
            <div className="bg-surface border border-line rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-bold text-sm text-ink">اجرای راهبرد A (پرامپت رسمی)</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${isRunCompleted ? 'bg-good-soft text-good' : 'bg-surface-2 text-muted'}`}>
                  {isRunCompleted ? 'اجرا شده' : 'آماده اجرا'}
                </span>
              </div>
              <p className="text-xs text-ink-2">
                برچسب‌زنی مستقل متون با پرامپت مجموعه راهنمای A و دمای قطعی
              </p>
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted">مدل زبانی:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink text-[11px]" dir="ltr">qwen2.5-14b-instruct</span>
                    {extFlag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ochre-soft text-ochre font-bold">
                        بیرون از شبکه
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">سرور میزبان:</span>
                  <span className="font-mono text-ink text-[11px]" dir="ltr">LM Studio Local</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">دمای تولید (Temperature):</span>
                  <span className="font-mono text-ink">۰٫۰ (قطعی / Greedy Decoding)</span>
                </div>
              </div>
            </div>

            {/* Run B */}
            <div className="bg-surface border border-line rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-bold text-sm text-ink">اجرای راهبرد B (پرامپت محاوره‌ای)</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${isRunCompleted ? 'bg-good-soft text-good' : 'bg-surface-2 text-muted'}`}>
                  {isRunCompleted ? 'اجرا شده' : 'آماده اجرا'}
                </span>
              </div>
              <p className="text-xs text-ink-2">
                برچسب‌زنی مستقل متون با پرامپت مجموعه راهنمای B و الگوی مقایسه‌ای
              </p>
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted">مدل زبانی:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-ink text-[11px]" dir="ltr">qwen2.5-14b-instruct</span>
                    {extFlag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ochre-soft text-ochre font-bold">
                        بیرون از شبکه
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">سرور میزبان:</span>
                  <span className="font-mono text-ink text-[11px]" dir="ltr">LM Studio Local</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">دمای تولید (Temperature):</span>
                  <span className="font-mono text-ink">۰٫۰ (قطعی / Greedy Decoding)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action and explanation */}
          <div className="p-5 rounded-2xl bg-surface border border-line space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-ink">
                  مکانیزم اجرای دوگانه جهت تضمین قابلیت اطمینان (Dual Execution)
                </h4>
                <p className="text-xs text-muted max-w-xl leading-relaxed">
                  هر متن دو بار به‌طور مستقل برچسب می‌خورد. مواردی که هر دو اجرا به برچسب‌های یکسان برسند به عنوان برچسب‌های نقره‌ای بااطمینان بالا ثبت شده و موارد مغایر بلافاصله در تب «رکوردهای مشکوک» جهت بازبینی انسانی تفکیک می‌شوند.
                </p>
              </div>

              <button
                onClick={startRuns}
                disabled={isRunning}
                className="px-6 py-2.5 bg-accent text-on-accent font-bold text-xs rounded-xl hover:bg-accent-2 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'در حال اجرای متون با مدل زبانی...' : isRunCompleted ? 'اجرای مجدد مدل‌ها (A و B)' : 'شروع اجرای دوگانه A و B'}</span>
              </button>
            </div>

            {isRunning && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-accent font-semibold">پردازش متن‌های نمونه با مدل زبانی...</span>
                  <span className="font-mono font-bold">{runProgress}٪</span>
                </div>
                <div className="h-2 rounded-full bg-track overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${runProgress}%` }}
                  />
                </div>
              </div>
            )}

            {isRunCompleted && (
              <div className="p-3.5 rounded-xl bg-good-soft text-good border border-good/20 text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>اجرای دوگانه کامل شد. تعداد {suspiciousTexts.length} مورد ناهمخوان (مشکوک) شناسایی شد و به تب رکوردهای مشکوک فرستاده شد.</span>
                </div>
                <button
                  onClick={() => onChangeTab('susp')}
                  className="font-bold underline hover:opacity-80 cursor-pointer"
                >
                  مشاهده موارد مشکوک
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUSPICIOUS RECORDS (NO DATA SHOWN BEFORE RUNNING TASK) */}
      {activeTab === 'susp' && (
        <div className="space-y-4">
          {!isRunCompleted ? (
            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto border border-line">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink">اجرای دوگانه هنوز انجام نشده است</h3>
                <p className="text-xs text-muted leading-relaxed">
                  رکوردهای مشکوک حاصل مقایسه خروجی‌های اجرای A و اجرای B هستند. تا زمانی که این دو استنتاج انجام نشوند، داده‌ای در این بخش وجود ندارد.
                </p>
              </div>
              <button
                onClick={() => onChangeTab('runs')}
                className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2 mx-auto"
              >
                <span>رفتن به زبانه اجراهای دوگانه و شروع تسک</span>
              </button>
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="font-bold text-sm text-ink">رکوردهای مشکوک و مغایرت‌های دو اجرا (Discrepancy Matrix)</h3>
                  <p className="text-xs text-muted">
                    این رکوردهای مرزی برای بازبینی اولویت‌دار توسط کارشناس و داوری نهایی آماده شده‌اند.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-ochre bg-ochre-soft px-2.5 py-1 rounded-full border border-ochre/20">
                  {suspiciousTexts.length} مورد مغایرت
                </span>
              </div>

              <div className="space-y-3">
                {suspiciousTexts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition-all space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted">رکورد #{item.id}</span>
                      <span className="text-[11px] font-semibold text-ochre px-2 py-0.5 rounded bg-ochre-soft">
                        مغایرت در برچسب‌های استخراج‌شده
                      </span>
                    </div>

                    <p className="text-xs text-ink leading-relaxed font-normal">{item.text}</p>

                    <div className="pt-2 border-t border-line flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted font-medium">پاسخ اجرای A:</span>
                        <div className="flex gap-1">
                          {item.modelSuggestions.map((lbId: number) => (
                            <span
                              key={lbId}
                              className="px-2 py-0.5 rounded bg-accent-soft text-accent font-semibold text-[11px]"
                            >
                              {labels[lbId]?.name || `برچسب ${lbId}`}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-muted font-medium">پاسخ اجرای B:</span>
                        <div className="flex gap-1">
                          {item.modelRunB.map((lbId: number) => (
                            <span
                              key={lbId}
                              className="px-2 py-0.5 rounded bg-surface-2 text-ink-2 border border-line font-medium text-[11px]"
                            >
                              {labels[lbId]?.name || `برچسب ${lbId}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPEED BENCHMARK */}
      {activeTab === 'speed' && (
        <div className="bg-surface border border-line rounded-2xl p-6 max-w-3xl space-y-5 shadow-2xs">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">آزمون کارایی و زمان پاسخ‌دهی استنتاج</h3>
            <p className="text-xs text-muted">
              سنجش تأخیر زمانی (Latency) مدل‌ها روی ۱۰ متن تصادفی پیش از پردازش انبوه
            </p>
          </div>

          <div className="data-table-container">
            <table className="data-table" dir="rtl">
              <colgroup>
                <col className="col-speed-34" />
                <col className="col-speed-26" />
                <col className="col-speed-20" />
                <col className="col-speed-20" />
              </colgroup>
              <thead>
                <tr>
                  <th className="col-speed-34">مدل زبانی</th>
                  <th className="col-speed-26">سرور / سخت‌افزار</th>
                  <th className="col-speed-20">میانگین زمان (ms)</th>
                  <th className="col-speed-20">توکن بر ثانیه</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-speed-34 font-bold text-ink">Qwen 2.5 14B Instruct</td>
                  <td className="col-speed-26 text-muted font-medium">LM Studio (RTX 4090)</td>
                  <td className="col-speed-20 text-good font-bold">۸۴۰ ms</td>
                  <td className="col-speed-20 text-good font-bold">۳۴.۲ t/s</td>
                </tr>
                <tr>
                  <td className="col-speed-34 font-bold text-ink">Gemma 2 9B Persian</td>
                  <td className="col-speed-26 text-muted font-medium">Ollama (شبکه داخلی)</td>
                  <td className="col-speed-20 text-ink font-medium">۶۱۰ ms</td>
                  <td className="col-speed-20 text-ink font-medium">۴۲.۸ t/s</td>
                </tr>
                <tr>
                  <td className="col-speed-34 font-bold text-ink">GPT-4o-mini</td>
                  <td className="col-speed-26 text-muted font-medium">OpenRouter (ابری)</td>
                  <td className="col-speed-20 text-ochre font-bold">۱٬۱۸۰ ms</td>
                  <td className="col-speed-20 text-ink font-medium">۵۸.۰ t/s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
