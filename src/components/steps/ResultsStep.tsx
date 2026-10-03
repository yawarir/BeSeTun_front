import React, { useState } from 'react';
import {
  Award,
  Download,
  Copy,
  Check,
  FileCode,
  FileSpreadsheet,
  Table,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Sliders,
} from 'lucide-react';
import { INITIAL_LABELS } from '../../mockData';

interface ResultsStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onGoFineTune: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
  activeTab,
  onChangeTab,
  onGoFineTune,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const sampleJsonlSnippet = `{"messages": [{"role": "system", "content": "شما کارشناس تحلیل و برچسب‌زنی شکایات شهروندی هستید."}, {"role": "user", "content": "از روزی که پرونده را تحویل دادم سه هفته گذشته و هنوز کسی پاسخ نداده."}, {"role": "assistant", "content": "{\\"labels\\": [\\"کندی پاسخ‌گویی\\"]}"}]}
{"messages": [{"role": "system", "content": "شما کارشناس تحلیل و برچسب‌زنی شکایات شهروندی هستید."}, {"role": "user", "content": "هزینه‌ی خدمات نسبت به سال گذشته دو برابر شده ولی کیفیت هیچ فرقی نکرده."}, {"role": "assistant", "content": "{\\"labels\\": [\\"هزینه‌ی بالا\\", \\"کیفیت پایین\\"]}"}]}`;

  const executionManifestSnippet = `{
  "besetun_version": "0.1-rc3",
  "project_name": "complaints_1403",
  "execution_timestamp": "2026-10-02T13:30:00Z",
  "isolation_mode": true,
  "model_provider": "LM Studio Local (127.0.0.1:1234)",
  "model_name": "qwen2.5-14b-instruct",
  "sampling_seed": 1404,
  "total_records_processed": 2320,
  "reference_sample_size": 100,
  "review_sample_size": 100,
  "cohen_kappa": 0.78,
  "macro_f1": 0.77,
  "micro_f1": 0.81,
  "anonymization_error_rate": "0.015",
  "train_val_test_split": {"train": 1856, "val": 232, "test": 232},
  "note": "Reference sample is strictly segregated into test split to avoid leakage."
}`;

  const datasetCardSnippet = `# شناسنامه مجموعه‌داده طلایی بیستون (BeSeTun Dataset Card)
**پروژه:** شکایت‌های شهروندی و درخواست‌های خدمات عمومی ۱۴۰۳
**تعداد کل رکوردها:** ۲٬۳۲۰ ردیف متن آزاد گمنام‌شده
**تعداد برچسب‌های تاکسونومی:** ۸ برچسب موضوعی مستقل
**زبان:** فارسی استاندارد (FA)
**پروتکل برچسب‌زنی:** برچسب‌زنی کور دوگانه کارشناس + حل اختلاف داوری
**ضریب توافق کارشناسان (کاپا):** ۰٫۷۸ (Substantial Agreement)
**تقسیم‌بندی:** ۸۰٪ آموزش، ۱۰٪ اعتبارسنجی، ۱۰٪ آزمون نهایی (نمونه مرجع طلایی)`;

  const sampleLatexTable = `% جدول ۲ مقاله: ارزیابی توافق کارشناسان و کیفیت برچسب‌زنی روی نمونه مرجع
\\begin{table}[h]
\\centering
\\caption{کیفیت برچسب‌زنی و مقایسه مدل با خط پایه‌ی واژه‌محور (بیستون)}
\\label{tab:evaluation_results}
\\begin{tabular}{lcccc}
\\hline
\\textbf{روش / سنجه} & \\textbf{دقت} & \\textbf{بازیابی} & \\textbf{F1 خرد} & \\textbf{F1 کلان} \\\\
\\hline
روش واژه‌محور پایه (Baseline) & ۰٫۶۹ & ۰٫۵۲ & ۰٫۵۸ & ۰٫۵۹ \\\\
مدل زبانی Qwen 14B (نقره‌ای) & ۰٫۸۱ & ۰٫۷۴ & ۰٫۷۹ & ۰٫۷۷ \\\\
مدل + بازبینی کارشناس (طلایی) & \\textbf{۰٫۸۹} & \\textbf{۰٫۸۵} & \\textbf{۰٫۸۸} & \\textbf{۰٫۸۷} \\\\
\\hline
\\multicolumn{5}{l}{\\small توافق دو کارشناس (کاپای کوهن): ۰٫۷۸ (فاصله اطمینان ۹۵٪: [۰٫۷۱, ۰٫۸۵])} \\\\
\\multicolumn{5}{l}{\\small رکوردهای مشکوک در دو اجرا: ۲۶ از ۲۰۰ (۱۳٪)} \\\\
\\hline
\\end{tabular}
\\end{table}`;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'paper', label: 'جدول ۲ مقاله علمی (ارزیابی و کاپا)' },
          { id: 'perlabel', label: 'عملکرد تفکیکی هر برچسب' },
          { id: 'export', label: 'دانلود مجموعه‌داده و مانیفست' },
          { id: 'card', label: 'شناسنامه داده (Dataset Card)' },
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

      {/* TAB 1: PAPER TABLE */}
      {activeTab === 'paper' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-4xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-soft text-accent font-bold">
                  آماده درج در مقاله
                </span>
                <h3 className="font-bold text-base text-ink">
                  جدول ۲: مقایسه جامع مدل زبانی با خط پایه و توافق کارشناسان
                </h3>
              </div>
              <p className="text-xs text-muted">
                محاسبه روی ۱۰۰ متن نمونه مرجع در مقایسه با برچسب‌های نهایی پس از حل اختلاف (Adjudication)
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => copyText(sampleLatexTable, 'latex')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-line-strong rounded-lg text-xs font-semibold text-ink bg-surface hover:bg-surface-2 transition-colors"
              >
                {copiedType === 'latex' ? <Check className="w-3.5 h-3.5 text-good" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی کد LaTeX جدول ۲</span>
              </button>
            </div>
          </div>

          <div className="border border-line rounded-lg overflow-x-auto text-xs">
            <table className="w-full text-right">
              <thead className="bg-surface-2 border-b border-line text-ink font-bold">
                <tr>
                  <th className="p-3.5">روش برچسب‌زنی</th>
                  <th className="p-3.5 font-mono">دقت (Precision)</th>
                  <th className="p-3.5 font-mono">بازیابی (Recall)</th>
                  <th className="p-3.5 font-mono">F1 خرد (Micro)</th>
                  <th className="p-3.5 font-mono font-bold text-ink">F1 کلان (Macro)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="p-3.5 text-ink font-medium">روش واژه‌محور پایه (بدون هوش مصنوعی)</td>
                  <td className="p-3.5 font-mono">۰٫۶۹</td>
                  <td className="p-3.5 font-mono">۰٫۵۲</td>
                  <td className="p-3.5 font-mono">۰٫۵۸</td>
                  <td className="p-3.5 font-mono font-bold text-muted">۰٫۵۹</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-ink font-medium">مدل زبانی Qwen 14B (داده نقره‌ای)</td>
                  <td className="p-3.5 font-mono">۰٫۸۱</td>
                  <td className="p-3.5 font-mono">۰٫۷۴</td>
                  <td className="p-3.5 font-mono">۰٫۷۹</td>
                  <td className="p-3.5 font-mono font-bold text-accent">۰٫۷۷</td>
                </tr>
                <tr className="bg-good-soft/30 font-semibold">
                  <td className="p-3.5 text-ink font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-good" />
                    <span>مجموعه‌داده طلایی بیستون (با اصلاح کارشناس)</span>
                  </td>
                  <td className="p-3.5 font-mono text-good">۰٫۸۹</td>
                  <td className="p-3.5 font-mono text-good">۰٫۸۵</td>
                  <td className="p-3.5 font-mono text-good">۰٫۸۸</td>
                  <td className="p-3.5 font-mono font-bold text-good text-sm">۰٫۸۷</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statistical Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-line bg-surface-2 text-center">
              <span className="text-[11px] text-muted block mb-0.5">ضریب کاپای کوهن (توافق کارشناسان)</span>
              <span className="text-base font-mono font-bold text-good">۰٫۷۸</span>
              <span className="text-[10px] text-muted block">فاصله اطمینان ۹۵٪: [۰٫۷۱, ۰٫۸۵]</span>
            </div>

            <div className="p-3 rounded-lg border border-line bg-surface-2 text-center">
              <span className="text-[11px] text-muted block mb-0.5">رکوردهای مشکوک در اجراها</span>
              <span className="text-base font-mono font-bold text-ochre">۲۶ از ۲۰۰</span>
              <span className="text-[10px] text-muted block">معادل ۱۳٪ کل رکوردهای ارزیابی</span>
            </div>

            <div className="p-3 rounded-lg border border-line bg-surface-2 text-center">
              <span className="text-[11px] text-muted block mb-0.5">نرخ خطای گمنام‌سازی شناسایی‌شده</span>
              <span className="text-base font-mono font-bold text-good">۱٫۵٪</span>
              <span className="text-[10px] text-muted block">علامت‌گذاری شده توسط کارشناسان (P)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PER-LABEL METRICS */}
      {activeTab === 'perlabel' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-4xl space-y-4">
          <h3 className="font-bold text-base text-ink">تفکیک سنجه‌های F1 به ازای هر یک از ۸ برچسب</h3>
          <p className="text-xs text-muted">
            بررسی نقاط قوت و ضعف مدل در شناسایی برچسب‌های مختلف
          </p>

          <div className="border border-line rounded-lg overflow-x-auto text-xs">
            <table className="w-full text-right">
              <thead className="bg-surface-2 border-b border-line text-muted">
                <tr>
                  <th className="p-3">عنوان برچسب</th>
                  <th className="p-3 font-mono">دقت (Precision)</th>
                  <th className="p-3 font-mono">بازیابی (Recall)</th>
                  <th className="p-3 font-mono font-bold text-ink">امتیاز F1 مدل</th>
                  <th className="p-3 font-mono text-muted">F1 واژه‌محور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  { name: 'کندی پاسخ‌گویی', p: '۰٫۸۸', r: '۰٫۸۵', f1: '۰٫۸۶', base: '۰٫۷۱' },
                  { name: 'هزینه‌ی بالا', p: '۰٫۹۲', r: '۰٫۸۸', f1: '۰٫۹۰', base: '۰٫۷۸' },
                  { name: 'کیفیت پایین', p: '۰٫۷۴', r: '۰٫۶۸', f1: '۰٫۷۱', base: '۰٫۴۹' },
                  { name: 'رفتار کارکنان', p: '۰٫۸۴', r: '۰٫۷۹', f1: '۰٫۸۱', base: '۰٫۶۵' },
                  { name: 'پیچیدگی فرایند', p: '۰٫۷۲', r: '۰٫۶۵', f1: '۰٫۶۸', base: '۰٫۴۲' },
                  { name: 'مشکل فنی', p: '۰٫۸۹', r: '۰٫۸۴', f1: '۰٫۸۶', base: '۰٫۷۶' },
                  { name: 'اطلاعات ناکافی', p: '۰٫۷۸', r: '۰٫۷۰', f1: '۰٫۷۴', base: '۰٫۵۱' },
                  { name: 'دسترسی دشوار', p: '۰٫۸۱', r: '۰٫۷۵', f1: '۰٫۷۸', base: '۰٫۵۸' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-2">
                    <td className="p-3 font-semibold text-ink">{row.name}</td>
                    <td className="p-3 font-mono">{row.p}</td>
                    <td className="p-3 font-mono">{row.r}</td>
                    <td className="p-3 font-mono font-bold text-accent text-sm">{row.f1}</td>
                    <td className="p-3 font-mono text-muted">{row.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT & MANIFEST */}
      {activeTab === 'export' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-surface border border-line rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <h3 className="font-bold text-base text-ink">
                  مجموعه‌داده طلایی نهایی آماده برای فاین‌تیون مدل‌ها
                </h3>
                <p className="text-xs text-muted">
                  مجموعه ۲٬۳۲۰ رکوردی شامل تقسیم سه‌گانه با تضمین عدم نشت داده
                </p>
              </div>

              <button
                onClick={onGoFineTune}
                className="px-4 py-2 bg-accent text-on-accent text-xs font-bold rounded-lg hover:bg-accent-2 transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>ورود به فاز ۲: تنظیم دقیق مدل (Fine-Tune)</span>
              </button>
            </div>

            {/* Split Notice from PDF */}
            <div className="p-3.5 rounded-lg bg-accent-soft/60 border border-accent/20 text-xs text-accent-2 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <b>توزیع استاندارد تقسیم داده‌ها:</b> مجموعه‌داده به ۳ بخش تقسیم شده است: آموزش (۸۰٪)، اعتبارسنجی (۱۰٪) و آزمون (۱۰٪). طبق اصل طراحی بیستون، <b>نمونه مرجع طلایی فقط در بخش آزمون (Test) قرار می‌گیرد</b> تا مدل هنگام آموزش هرگز داده‌های مرجع ارزیابی را نبیند.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => copyText(sampleJsonlSnippet, 'jsonl')}
                className="p-4 rounded-xl border border-line bg-surface hover:border-accent hover:bg-surface-2 text-right transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileCode className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-muted border border-line">
                    .jsonl
                  </span>
                </div>
                <b className="text-xs font-bold text-ink block group-hover:text-accent">
                  فرمت استاندارد چت و فاین‌تیون
                </b>
                <span className="text-[11px] text-muted">
                  قالب Messages مناسب Qwen, Llama و OpenAI
                </span>
              </button>

              <button
                onClick={() => alert('دانلود بسته داده شامل فایل‌های train.csv, val.csv و test.csv آغاز شد.')}
                className="p-4 rounded-xl border border-line bg-surface hover:border-accent hover:bg-surface-2 text-right transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileSpreadsheet className="w-5 h-5 text-good" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-muted border border-line">
                    .csv (Train / Val / Test)
                  </span>
                </div>
                <b className="text-xs font-bold text-ink block group-hover:text-accent">
                  اکسل و دادگان تفکیک‌شده
                </b>
                <span className="text-[11px] text-muted">
                  شامل ستون متن اصلی، برچسب‌ها و تگ‌های ماسک
                </span>
              </button>

              <button
                onClick={() => copyText(executionManifestSnippet, 'manifest')}
                className="p-4 rounded-xl border border-line bg-surface hover:border-accent hover:bg-surface-2 text-right transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-5 h-5 text-ochre" />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-muted border border-line">
                    manifest.json
                  </span>
                </div>
                <b className="text-xs font-bold text-ink block group-hover:text-accent">
                  مانیفست ممیزی اجرا (بدون متن)
                </b>
                <span className="text-[11px] text-muted">
                  ثبت فراداده، نسخه مدل و پارامترها بدون ذخیره متن
                </span>
              </button>
            </div>

            {/* Execution Manifest Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-semibold text-ink">مانیفست اجرای بدون متن (Execution Manifest):</span>
                <button
                  onClick={() => copyText(executionManifestSnippet, 'manifest-btn')}
                  className="hover:text-ink flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedType === 'manifest-btn' ? <Check className="w-3.5 h-3.5 text-good" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی مانیفست</span>
                </button>
              </div>

              <pre
                className="p-3.5 rounded-xl bg-surface-2 border border-line text-[11px] font-mono leading-relaxed text-ink-2 overflow-x-auto whitespace-pre-wrap max-h-48"
                dir="ltr"
              >
                {executionManifestSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATASET CARD */}
      {activeTab === 'card' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-4xl space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="font-bold text-base text-ink">کارت مجموعه‌داده (Dataset Card Markdown)</h3>
              <p className="text-xs text-muted">مستندات استاندارد برای هاب‌های هوش مصنوعی و مستندسازی پژوهشی</p>
            </div>
            <button
              onClick={() => copyText(datasetCardSnippet, 'card-btn')}
              className="px-3 py-1.5 border border-line-strong rounded-lg text-xs font-semibold text-ink hover:bg-surface-2 flex items-center gap-1.5"
            >
              {copiedType === 'card-btn' ? <Check className="w-3.5 h-3.5 text-good" /> : <Copy className="w-3.5 h-3.5" />}
              <span>کپی متن مارک‌داون</span>
            </button>
          </div>

          <pre
            className="p-4 rounded-xl bg-surface-2 border border-line text-xs font-mono leading-relaxed text-ink whitespace-pre-wrap"
            dir="rtl"
          >
            {datasetCardSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
