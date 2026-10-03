import React, { useState } from 'react';
import { Hash, Search, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { INITIAL_LABELS } from '../../mockData';

export const KeywordStep: React.FC = () => {
  const [testSentence, setTestSentence] = useState(
    'سه هفته است منتظر صدور مجوز هستم ولی هیچ پاسخی نداده‌اند.'
  );

  const KEYWORD_DICTIONARY: Record<string, string[]> = {
    'کندی پاسخ‌گویی': ['سه هفته', 'طولانی', 'تاخیر', 'معطل', 'پاسخ نداده', 'چند ماه', 'پیگیری'],
    'هزینه‌ی بالا': ['تعرفه', 'دو برابر', 'گران', 'هزینه', 'مبلغ بالا', 'پول اضافه'],
    'کیفیت پایین': ['ناقص', 'کیفیت', 'اشتباه', 'خراب', 'دوباره کاری', 'ایراد'],
    'رفتار کارکنان': ['تند', 'لحن', 'بی‌احترامی', 'توهین', 'قطع کرد', 'برخورد بد'],
    'پیچیدگی فرایند': ['هفت امضا', 'پیچیده', 'گیج‌کننده', 'مراحل زیاد', 'بوروکراسی'],
    'مشکل فنی': ['خطا', 'سامانه', 'ارور', 'قطع شد', 'پرید', '۵۰۰', 'لود نشد'],
    'اطلاعات ناکافی': ['نگفتند', 'سایت نبود', 'اطلاع‌رسانی', 'مدارک نامشخص', 'راهنمایی'],
    'دسترسی دشوار': ['شعبه دور', 'ساعت اداری', 'تلاقی', 'نقطه دورافتاده', 'معلولین'],
  };

  // Run keyword matcher on test sentence
  const matchedLabels = Object.entries(KEYWORD_DICTIONARY)
    .filter(([_, words]) => words.some((w) => testSentence.includes(w)))
    .map(([label]) => label);

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      <div>
        <h3 className="font-bold text-base text-ink mb-1">
          روش پایه واژه‌محور و لغت‌نامه‌ای (Rule-based Baseline)
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          برای سنجش علمی اثربخشی هوش مصنوعی در مقالات پژوهشی، این خط پایه‌ی بدون مدل زبانی پیاده شده است تا در جدول مقایسه‌ای نشان داده شود که مدل‌های زبانی چقدر برتری دارند (F1: ۰.۷۷ در برابر ۰.۵۹).
        </p>
      </div>

      {/* Interactive Tester */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
        <label className="text-xs font-bold text-ink block">
          آزمایشگر برچسب‌زنی تطبیق لغوی:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testSentence}
            onChange={(e) => setTestSentence(e.target.value)}
            className="flex-1 h-10 px-3 border border-line-strong rounded-lg bg-surface text-xs text-ink focus:border-accent"
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

      {/* Dictionary Table */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-ink">فهرست کلیدواژه‌های اختصاصی هر برچسب</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INITIAL_LABELS.map((lb) => {
            const keywords = KEYWORD_DICTIONARY[lb.name] || [];
            return (
              <div
                key={lb.id}
                className="p-3.5 rounded-lg border border-line bg-surface-2 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink">{lb.name}</span>
                  <span className="text-[10px] font-mono text-muted">
                    {keywords.length} کلیدواژه
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded bg-surface border border-line text-[11px] text-ink-2 font-mono"
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
