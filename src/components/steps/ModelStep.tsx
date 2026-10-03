import React, { useState } from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertCircle,
  Gauge,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SAMPLE_TEXTS, INITIAL_LABELS } from '../../mockData';

interface ModelStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  extFlag: boolean;
  onOpenSettings: () => void;
}

export const ModelStep: React.FC<ModelStepProps> = ({
  activeTab,
  onChangeTab,
  extFlag,
  onOpenSettings,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(true);
  const [runProgress, setRunProgress] = useState(100);

  const suspiciousTexts = SAMPLE_TEXTS.filter((t) => t.isSuspicious);

  const startRuns = () => {
    setIsRunning(true);
    setRunProgress(0);
    setCompleted(false);

    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'runs', label: 'اجراهای دوگانه مدل (Run A & B)' },
          { id: 'susp', label: 'رکوردهای مشکوک و ناهمخوان (۲۶ رکورد)' },
          { id: 'speed', label: 'سنجش سرعت و زمان استنتاج' },
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

      {/* TAB 1: RUNS */}
      {activeTab === 'runs' && (
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Run A */}
            <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-bold text-sm text-ink">اجرای راهبرد A</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-good-soft text-good">
                  آماده
                </span>
              </div>
              <p className="text-xs text-ink-2">
                برچسب‌زنی خودکار متون با پرامپت مجموعه راهنمای A
              </p>
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between">
                  <span className="text-muted">مدل زبانی:</span>
                  <span className="font-mono text-ink text-[11px]" dir="ltr">qwen2.5-14b-instruct</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">سرور میزبان:</span>
                  <span className="font-mono text-ink text-[11px]" dir="ltr">LM Studio Local</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">دمای تولید (Temperature):</span>
                  <span className="font-mono text-ink">۰.۲ (قطعی و کم‌خطا)</span>
                </div>
              </div>
            </div>

            {/* Run B */}
            <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-bold text-sm text-ink">اجرای راهبرد B</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-good-soft text-good">
                  آماده
                </span>
              </div>
              <p className="text-xs text-ink-2">
                برچسب‌زنی مستقل متون با پرامپت مجموعه راهنمای B
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
                  <span className="font-mono text-ink">۰.۲ (قطعی و کم‌خطا)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action and explanation */}
          <div className="p-5 rounded-xl bg-surface border border-line space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-ink">
                  مکانیزم اجرای دوگانه جهت تضمین قابلیت اطمینان (Dual Execution)
                </h4>
                <p className="text-xs text-muted max-w-xl leading-relaxed">
                  هر متن دو بار به‌طور مستقل برچسب می‌خورد. مواردی که هر دو اجرا به برچسب‌های یکسان برسند به عنوان برچسب‌های نقره‌ای بااطمینان بالا ثبت شده و موارد مغایر بلافاصله در تب «رکوردهای مشکوک» جدا می‌شوند.
                </p>
              </div>

              <button
                onClick={startRuns}
                disabled={isRunning}
                className="px-6 py-2.5 bg-accent text-on-accent font-semibold text-xs rounded-lg hover:bg-accent-2 disabled:opacity-50 transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'در حال اجرای متون...' : 'شروع اجرای دوگانه A و B'}</span>
              </button>
            </div>

            {isRunning && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-accent font-semibold">پردازش ۲۰۰ متن نمونه...</span>
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

            {completed && (
              <div className="p-3 rounded-lg bg-good-soft text-good border border-good/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اجرای A و B روی ۲۰۰ رکورد نمونه کامل شد. تعداد ۲۶ مورد ناهمخوان (مشکوک) کشف شد.</span>
                </div>
                <button
                  onClick={() => onChangeTab('susp')}
                  className="font-bold underline hover:opacity-80"
                >
                  مشاهده موارد مشکوک
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUSPICIOUS RECORDS */}
      {activeTab === 'susp' && (
        <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="font-bold text-sm text-ink">رکوردهای مشکوک و مغایرت‌های دو اجرا (Discrepancy Matrix)</h3>
              <p className="text-xs text-muted">
                این رکوردهای مرزی برای بازبینی اولویت‌دار توسط کارشناس و حل اختلاف نشانه‌گذاری شده‌اند.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-ochre bg-ochre-soft px-2.5 py-1 rounded-full">
              ۲۶ مورد مغایرت
            </span>
          </div>

          <div className="space-y-3">
            {suspiciousTexts.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-line bg-surface hover:border-line-strong transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted">شناسه: {item.id}</span>
                  <span className="text-[11px] font-semibold text-ochre px-2 py-0.5 rounded bg-ochre-soft">
                    عدم توافق در برچسب دوم
                  </span>
                </div>

                <p className="text-xs text-ink leading-relaxed font-normal">{item.text}</p>

                <div className="pt-2 border-t border-line flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted font-medium">پاسخ اجرای A:</span>
                    <div className="flex gap-1">
                      {item.modelSuggestions.map((lbId) => (
                        <span
                          key={lbId}
                          className="px-2 py-0.5 rounded bg-accent-soft text-accent font-semibold text-[11px]"
                        >
                          {INITIAL_LABELS[lbId]?.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-muted font-medium">پاسخ اجرای B:</span>
                    <div className="flex gap-1">
                      {item.modelRunB.map((lbId) => (
                        <span
                          key={lbId}
                          className="px-2 py-0.5 rounded bg-surface-2 text-ink-2 border border-line font-medium text-[11px]"
                        >
                          {INITIAL_LABELS[lbId]?.name}
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

      {/* TAB 3: SPEED BENCHMARK */}
      {activeTab === 'speed' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-3xl space-y-5">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">آزمون کارایی و زمان پاسخ‌دهی استنتاج</h3>
            <p className="text-xs text-muted">
              سنجش تأخیر زمانی (Latency) مدل‌ها روی ۱۰ متن تصادفی پیش از پردازش انبوه
            </p>
          </div>

          <div className="border border-line rounded-lg overflow-hidden text-xs">
            <table className="w-full text-right">
              <thead className="bg-surface-2 border-b border-line text-muted">
                <tr>
                  <th className="p-3">مدل زبانی</th>
                  <th className="p-3">سرور / سخت‌افزار</th>
                  <th className="p-3 font-mono">میانگین زمان (ms)</th>
                  <th className="p-3 font-mono">توکن بر ثانیه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="p-3 font-bold text-ink">Qwen 2.5 14B Instruct</td>
                  <td className="p-3 text-muted">LM Studio (RTX 4090)</td>
                  <td className="p-3 font-mono text-good font-bold">۸۴۰ ms</td>
                  <td className="p-3 font-mono text-good font-bold">۳۴.۲ t/s</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink">Gemma 2 9B Persian</td>
                  <td className="p-3 text-muted">Ollama (شبکه داخلی)</td>
                  <td className="p-3 font-mono">۶۱۰ ms</td>
                  <td className="p-3 font-mono">۴۲.۸ t/s</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink">GPT-4o-mini</td>
                  <td className="p-3 text-muted">OpenRouter (ابری)</td>
                  <td className="p-3 font-mono text-ochre">۱٬۱۸۰ ms</td>
                  <td className="p-3 font-mono">۵۸.۰ t/s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
