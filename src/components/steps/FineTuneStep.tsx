import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Cpu,
  BarChart3,
  Sliders,
  Send,
  FileCode,
  Check,
  Copy,
} from 'lucide-react';
import { INITIAL_LABELS } from '../../mockData';

export const FineTuneStep: React.FC = () => {
  const [dataCondition, setDataCondition] = useState<'silver' | 'plus' | 'both'>('both');
  const [preset, setPreset] = useState<'quick' | 'balanced' | 'accurate'>('balanced');
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(100);
  const [trainDone, setTrainDone] = useState(true);

  // Custom text testing state
  const [customTestInput, setCustomTestInput] = useState(
    'یک ماه است درخواست کارت هوشمند دادم ولی می‌گویند در سامانه ثبت نشده و باید دوباره مدارک بیاورید.'
  );
  const [testResult, setTestResult] = useState<string[]>(['کندی پاسخ‌گویی', 'مشکل فنی']);

  const runCustomTest = () => {
    // simple dynamic simulation based on keywords
    const results: string[] = [];
    if (customTestInput.includes('ماه') || customTestInput.includes('منتظر') || customTestInput.includes('وقت')) {
      results.push('کندی پاسخ‌گویی');
    }
    if (customTestInput.includes('سامانه') || customTestInput.includes('ثبت نشد') || customTestInput.includes('خطا')) {
      results.push('مشکل فنی');
    }
    if (customTestInput.includes('هزینه') || customTestInput.includes('تعرفه') || customTestInput.includes('پول')) {
      results.push('هزینه‌ی بالا');
    }
    if (customTestInput.includes('برخورد') || customTestInput.includes('لحن') || customTestInput.includes('کارمند')) {
      results.push('رفتار کارکنان');
    }
    setTestResult(results.length > 0 ? results : ['اطلاعات ناکافی']);
  };

  const startTraining = () => {
    setIsTraining(true);
    setTrainProgress(0);
    setTrainDone(false);

    const interval = setInterval(() => {
      setTrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setTrainDone(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent-soft text-accent">
            فاز دوم بیستون
          </span>
          <h3 className="font-bold text-base text-ink">
            تنظیم دقیق مدل روی مجموعه‌داده طلایی بیستون (Local Fine-Tuning)
          </h3>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          آموزش یک مدل طبقه‌بند سبک فارسی روی دادگان طلایی ساخته‌شده در ۶ گام پیشین؛ اجرای محلی روی رایانه بدون ارسال داده به اینترنت و بدون نیاز به GPU گران‌قیمت.
        </p>
      </div>

      {/* 1. Dataset Condition Selection */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-ink">۱. انتخاب نوع داده جهت سنجش تأثیر بازبینی انسانی بر مدل</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'silver',
              title: 'فقط برچسب نقره‌ای مدل',
              desc: 'آموزش صرفاً روی خروجی اولیه هوش مصنوعی بدون دخالت کارشناس',
            },
            {
              id: 'plus',
              title: 'برچسب نقره‌ای + اصلاح کارشناس',
              desc: 'جایگزینی نیمه بازبینی‌شده و حل اختلاف‌شده توسط کارشناس',
            },
            {
              id: 'both',
              title: 'هر دو (مقایسه جامع سنجه‌ها)',
              desc: 'سنجش و ارزیابی میزان بهبود F1 مدل در صورت نظارت کارشناس انسانی',
            },
          ].map((cond) => (
            <button
              key={cond.id}
              onClick={() => setDataCondition(cond.id as any)}
              className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                dataCondition === cond.id
                  ? 'bg-accent-soft border-accent shadow-xs'
                  : 'bg-surface-2 border-line hover:border-line-strong'
              }`}
            >
              <b className="text-xs font-bold text-ink block mb-1">{cond.title}</b>
              <span className="text-[11px] text-muted leading-relaxed block">{cond.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Presets & Models */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <h4 className="font-bold text-sm text-ink">۲. مدل‌ها و پیش‌تنظیم آموزش (Training Presets)</h4>
          <div className="flex items-center gap-1.5 p-1 bg-surface-2 rounded-lg border border-line text-xs">
            <button
              onClick={() => setPreset('quick')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                preset === 'quick' ? 'bg-surface text-accent shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              سریع (۱ اپوک)
            </button>
            <button
              onClick={() => setPreset('balanced')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                preset === 'balanced' ? 'bg-surface text-accent shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              متعادل (۳ اپوک)
            </button>
            <button
              onClick={() => setPreset('accurate')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                preset === 'accurate' ? 'bg-surface text-accent shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              دقیق (۵ اپوک)
            </button>
          </div>
        </div>

        <div className="space-y-2 border border-line rounded-lg divide-y divide-line overflow-hidden text-xs">
          <label className="flex items-center justify-between p-3 bg-surface hover:bg-surface-2 cursor-pointer">
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-bold text-ink" dir="ltr">TF-IDF + LogisticRegression</span>
              <span className="text-[11px] text-muted block">خط پایه‌ی آماری سبک جهت مقایسه در گزارش</span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-surface hover:bg-surface-2 cursor-pointer">
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-bold text-ink" dir="ltr">ParsBERT Base v2.0 (Transformer)</span>
              <span className="text-[11px] text-muted block">پوشه محلی: <code className="font-mono" dir="ltr">models/parsbert-base</code></span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-surface hover:bg-surface-2 cursor-pointer">
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-bold text-ink" dir="ltr">FaBERT (Farsi Transformer)</span>
              <span className="text-[11px] text-muted block">پوشه محلی: <code className="font-mono" dir="ltr">models/fabert</code></span>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-accent rounded" />
          </label>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="px-6 py-2.5 bg-accent text-on-accent text-xs font-bold rounded-lg hover:bg-accent-2 disabled:opacity-50 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isTraining ? 'در حال آموزش ترنسفورمر...' : 'شروع آموزش و برازش مدل‌ها'}</span>
          </button>

          {trainDone && (
            <span className="text-xs text-good font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>آموزش تکمیل شد؛ مدل‌ها آماده آزمون زنده هستند.</span>
            </span>
          )}
        </div>

        {isTraining && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-muted">
              <span>در حال محاسبه گرادیان و بهینه‌سازی وزن‌ها...</span>
              <span className="font-mono font-bold text-accent">{trainProgress}٪</span>
            </div>
            <div className="h-2 rounded-full bg-track overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${trainProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Performance Matrix */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-ink">۳. نتایج ارزیابی مدل‌های آموزش‌دیده روی بخش آزمون (Test Split)</h4>

        <div className="border border-line rounded-lg overflow-x-auto text-xs">
          <table className="w-full text-right">
            <thead className="bg-surface-2 border-b border-line text-muted">
              <tr>
                <th className="p-3 font-semibold">مدل آموزش‌دیده</th>
                <th className="p-3 font-semibold font-mono">F1 با دیتای نقره‌ای</th>
                <th className="p-3 font-semibold font-mono font-bold text-ink">F1 با دیتای طلایی بیستون</th>
                <th className="p-3 font-semibold text-good">میزان ارتقای عملکرد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="p-3 font-mono font-bold" dir="ltr">TF-IDF + LogReg</td>
                <td className="p-3 font-mono">۰٫۶۱</td>
                <td className="p-3 font-mono">۰٫۶۴</td>
                <td className="p-3 font-mono text-good font-semibold">+۳.۰٪</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold" dir="ltr">ParsBERT Base</td>
                <td className="p-3 font-mono">۰٫۷۲</td>
                <td className="p-3 font-mono font-bold text-accent text-sm">۰٫۷۶</td>
                <td className="p-3 font-mono text-good font-semibold">+۴.۰٪</td>
              </tr>
              <tr className="bg-good-soft/30">
                <td className="p-3 font-mono font-bold" dir="ltr">FaBERT (بهترین دقت)</td>
                <td className="p-3 font-mono">۰٫۷۴</td>
                <td className="p-3 font-mono font-bold text-good text-sm">۰٫۷۸</td>
                <td className="p-3 font-mono text-good font-bold">+۴.۰٪</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live Custom Text Tester (Specified in PDF: "آزمودن مدل روی متن دلخواه") */}
      <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-ink">۴. آزمودن زنده مدل آموزش‌دیده روی متن دلخواه</h4>
        <p className="text-xs text-muted">
          متن آزاد یک شکایت جدید را وارد کنید تا مدل فاین‌تیون‌شده فوراً برچسب‌های محتمل را استخراج کند.
        </p>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={customTestInput}
              onChange={(e) => setCustomTestInput(e.target.value)}
              placeholder="متن دلخواه خود را بنویسید..."
              className="flex-1 h-10 px-3 border border-line-strong rounded-lg bg-surface text-xs text-ink focus:border-accent"
            />
            <button
              onClick={runCustomTest}
              className="px-4 py-2 bg-accent text-on-accent text-xs font-semibold rounded-lg hover:bg-accent-2 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>پیش‌بینی مدل</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-2 border border-line flex items-center justify-between gap-3 text-xs">
            <span className="text-muted font-medium">برچسب‌های استخراج‌شده توسط FaBERT:</span>
            <div className="flex gap-1.5 flex-wrap">
              {testResult.map((res) => (
                <span
                  key={res}
                  className="px-2.5 py-1 rounded-full bg-accent text-on-accent font-bold text-[11px] shadow-xs"
                >
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
