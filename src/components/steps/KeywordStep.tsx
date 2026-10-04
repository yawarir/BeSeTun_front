import React, { useState } from 'react';
import { Hash, Search, ArrowRight, CheckCircle2, BookOpen, BarChart3, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { LabelItem } from '../../types';
import { KEYWORD_RULES, KEYWORD_BENCHMARK_ROWS } from '../../demo';
import { formatInt, formatDec } from '../../lib/formatFa';

interface KeywordStepProps {
  labels?: LabelItem[];
  onGoToLabels?: () => void;
}

export const KeywordStep: React.FC<KeywordStepProps> = ({ labels = [], onGoToLabels }) => {
  const [testSentence, setTestSentence] = useState(
    'سه هفته است منتظر صدور مجوز هستم ولی هیچ پاسخی نداده‌اند.'
  );

  // Guard: If taxonomy is empty, prompt user to extract labels first
  if (labels.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto shadow-xs" dir="rtl">
        <div className="w-12 h-12 rounded-2xl bg-ochre-soft text-ochre flex items-center justify-center mx-auto border border-ochre/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base text-ink">تاکسونومی پروژه هنوز برچسبی ندارد</h3>
          <p className="text-xs text-muted leading-relaxed">
            روش پایه‌ی واژه‌محور بر اساس کلیدواژه‌های استخراج‌شده برای هر برچسب کار می‌کند. ابتدا باید برچسب‌های پروژه در مرحله ۲ توسط مدل زبانی استخراج شده یا به صورت دستی تعریف شوند.
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

  // Run keyword matcher on test sentence
  const matchedLabels = Object.entries(KEYWORD_RULES)
    .filter(([_, words]) => words.some((w) => testSentence.includes(w)))
    .map(([label]) => label);

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-base text-ink">
            روش پایه واژه‌محور و لغت‌نامه‌ای (Rule-based Baseline)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-line text-muted font-medium">
            سنجه مقایسه عملکرد
          </span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          برای سنجش و مقایسه عملکرد، این خط پایه‌ی بدون مدل زبانی پیاده‌سازی شده است تا تفاوت و میزان بهبود مدل‌های زبانی به صورت تجربی ارزیابی شود.
        </p>
      </div>

      {/* Suggested academic citation banner */}
      <div className="p-3 rounded-xl bg-surface-2/60 border border-line text-[11px] text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span>عنوان پیشنهادی جهت درج در گزارش‌های فنی یا مقالات پژوهشی:</span>
          <b className="text-ink">«جدول مقایسه روش پایه واژه‌محور با مدل‌های زبانی در تحلیل متون»</b>
        </div>
      </div>

      {/* Interactive Tester */}
      <div className="bg-surface border border-line rounded-2xl p-5 space-y-3 shadow-2xs">
        <label className="text-xs font-bold text-ink block">
          آزمایشگر برچسب‌زنی تطبیق لغوی:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testSentence}
            onChange={(e) => setTestSentence(e.target.value)}
            className="flex-1 h-10 px-3 border border-line-strong rounded-xl bg-surface text-xs text-ink focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-muted font-medium">برچسب‌های شناسایی‌شده توسط واژه‌نامه:</span>
          {matchedLabels.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap">
              {matchedLabels.map((lbl) => (
                <span
                  key={lbl}
                  className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent font-semibold text-[11px]"
                >
                  {lbl}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted italic">هیچ واژه کلیدی تطبیق داده نشد (فاقد برچسب)</span>
          )}
        </div>
      </div>

      {/* Benchmark Table with Pixel-Perfect Alignment */}
      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-ink">
              جدول مقایسه دقت روش واژه‌محور با مدل‌های هوش مصنوعی
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
              داده‌ی نمایشی
            </span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table" dir="rtl">
            <colgroup>
              <col className="col-title-40" />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="col-title-40">روش پردازش</th>
                <th style={{ width: '20%', textAlign: 'center' }}>دقت (Precision)</th>
                <th style={{ width: '20%', textAlign: 'center' }}>بازیابی (Recall)</th>
                <th style={{ width: '20%', textAlign: 'center' }}>امتیاز F1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-title-40 font-bold text-ink">
                  روش پایه واژه‌محور (Rule-based Dictionary)
                </td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-muted font-bold">۰٫۶۹</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-muted font-bold">۰٫۵۲</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-muted font-extrabold">۰٫۵۹</td>
              </tr>
              <tr className="bg-accent-soft/20">
                <td className="col-title-40 font-bold text-ink">
                  مدل زبانی محلی (Qwen 14B)
                </td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-accent font-bold">۰٫۸۱</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-accent font-bold">۰٫۷۴</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-accent font-extrabold">۰٫۷۷</td>
              </tr>
              <tr className="row-golden">
                <td className="col-title-40 font-bold text-good">
                  مدل زبانی + داوری کارشناسان (دیتاست طلایی)
                </td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-good font-extrabold">۰٫۸۹</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-good font-extrabold">۰٫۸۵</td>
                <td style={{ width: '20%', textAlign: 'center' }} className="text-good font-extrabold">۰٫۸۷</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dictionary Table from active labels */}
      <div className="bg-surface border border-line rounded-2xl p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-ink">فهرست کلیدواژه‌های تطبیقی هر برچسب در تاکسونومی فعال</h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
              داده‌ی نمایشی
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {labels.map((lb) => {
            const keywords = KEYWORD_RULES[lb.name] || ['شکایت', 'پیگیری', 'رسیدگی'];
            return (
              <div
                key={lb.id}
                className="p-3.5 rounded-xl border border-line bg-surface-2/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink">{lb.name}</span>
                  <span className="text-[10px] font-mono text-muted">
                    {formatInt(keywords.length)} کلیدواژه
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md bg-surface border border-line text-[11px] text-ink-2 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
