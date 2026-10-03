import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  Eye,
  RefreshCw,
  Search,
  ShieldAlert,
  Sliders,
  X,
  FileText,
  ArrowLeftRight,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_RULES, SAMPLE_TEXTS } from '../../mockData';
import { CleaningRule } from '../../types';

interface DataStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const DataStep: React.FC<DataStepProps> = ({ activeTab, onChangeTab }) => {
  const [rules, setRules] = useState<CleaningRule[]>([
    ...INITIAL_RULES,
    {
      id: 'html',
      title: 'حذف تگ‌های HTML و کاراکترهای کنترلی',
      description: 'پاک‌سازی برچسب‌های وب، تگ‌های &nbsp; و خط‌شکست‌های زائد با زمان‌سنج ایمنی',
      enabled: true,
      dropEstimate: 45,
    },
    {
      id: 'normalize',
      title: 'نرمال‌سازی نویسه‌ها و نیم‌فاصله‌ها',
      description: 'یکدست‌سازی «ي» و «ك» عربی به فارسی، اصلاح ارقام و تنظیم فواصل مجازی استاندارد',
      enabled: true,
      dropEstimate: 160,
    },
  ]);
  const [showDroppedModal, setShowDroppedModal] = useState(false);
  const [showDiffPreview, setShowDiffPreview] = useState(false);
  const [sampleSeed, setSampleSeed] = useState('۱۴۰۴');
  const [seedNotice, setSeedNotice] = useState('نمونه با عدد ۱۴۰۴ قفل و تثبیت شد');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('شرح شکایت');

  // Interactive funnel calculation
  const rawTotal = 3184;
  let currentTotal = rawTotal;

  const calculatedFunnel = [
    { label: 'متن‌های خام اولیه (مبدأ ورود)', count: rawTotal, drop: 0, why: '' },
    {
      label: 'بدون متن خالی و بی‌محتوا',
      count: rules.find((r) => r.id === 'empty')?.enabled ? (currentTotal -= 122) : currentTotal,
      drop: rules.find((r) => r.id === 'empty')?.enabled ? 122 : 0,
      why: 'سلول متن خالی یا فقط فاصله بود',
    },
    {
      label: 'بدون داده‌های تکراری (Exact & Fuzzy)',
      count: rules.find((r) => r.id === 'dedup')?.enabled ? (currentTotal -= 406) : currentTotal,
      drop: rules.find((r) => r.id === 'dedup')?.enabled ? 406 : 0,
      why: 'تکراری دقیق یا تطابق بالای ۹۵٪',
    },
    {
      label: 'دارای بلندی کافی (کمینه ۵ واژه)',
      count: rules.find((r) => r.id === 'length')?.enabled ? (currentTotal -= 218) : currentTotal,
      drop: rules.find((r) => r.id === 'length')?.enabled ? 218 : 0,
      why: 'متن کوتاه فاقد زمینه برای برچسب‌زنی',
    },
    {
      label: 'زبان فارسی استاندارد و بدون کد مخرب',
      count: rules.find((r) => r.id === 'lang')?.enabled ? (currentTotal -= 118) : currentTotal,
      drop: rules.find((r) => r.id === 'lang')?.enabled ? 118 : 0,
      why: 'متن غیرفارسی یا کاراکترهای خراب',
    },
  ];

  const finalReadyCount = calculatedFunnel[calculatedFunnel.length - 1].count;
  const readyPercent = Math.round((finalReadyCount / rawTotal) * 100);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleResample = () => {
    setSeedNotice(`نمونه‌گیری با دانه ${sampleSeed} مجدداً تولید و متوازن شد.`);
    setTimeout(() => {
      setSeedNotice('نمونه با عدد ' + sampleSeed + ' آماده و قفل شد');
    }, 2500);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'import', label: 'ورود فایل‌ها (xlsx, csv, jsonl)' },
          { id: 'clean', label: 'قیف و قواعد پالایش' },
          { id: 'sample', label: 'نمونه‌گیری متقارن (مرجع / بازبینی)' },
          { id: 'anon', label: 'گمنام‌سازی هویت‌ها (Regex + Model)' },
          { id: 'records', label: 'مرور رکوردهای تمیز' },
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

      {/* TAB 1: IMPORT */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="p-8 border-2 border-dashed border-line-strong rounded-xl bg-surface flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink mb-1">
                فایل داده خام سازمان را اینجا رها کنید
              </h3>
              <p className="text-xs text-muted max-w-sm">
                پشتیبانی از فایل‌های اکسل، CSV، JSONL و TXT (مقیاس هدف پروژه: تا حدود ۶۰ هزار رکورد)
              </p>
            </div>
            <div className="flex gap-2 font-mono text-xs text-muted" dir="ltr">
              <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.xlsx</span>
              <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.csv</span>
              <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.jsonl</span>
              <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.xls</span>
              <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.txt</span>
            </div>
            <button className="px-5 py-2.5 rounded-lg border border-line-strong bg-surface text-ink font-semibold text-xs hover:bg-surface-2 transition-colors">
              انتخاب از دیسک محلی
            </button>
          </div>

          <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-ink">فایل‌های بارگذاری‌شده در پروژه</h3>
            <div className="space-y-2 border border-line rounded-lg overflow-hidden">
              <div className="p-3 bg-surface-2 flex items-center justify-between border-b border-line">
                <div>
                  <b className="font-mono text-xs block text-ink" dir="ltr">complaints_1402.xlsx</b>
                  <span className="text-[11px] text-muted">۱٬۹۰۴ ردیف — ستون متن: شرح شکایت — برگه ۱</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-good-soft text-good">
                  تطبیق شد
                </span>
              </div>
              <div className="p-3 bg-surface-2 flex items-center justify-between">
                <div>
                  <b className="font-mono text-xs block text-ink" dir="ltr">complaints_1403.csv</b>
                  <span className="text-[11px] text-muted">۱٬۲۸۰ ردیف — ستون متن: متن پیام</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-good-soft text-good">
                  تطبیق شد
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-ink block">
                نگاشت ستون متن جهت پردازش و برچسب‌زنی:
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full h-10 px-3 border border-line-strong rounded-lg bg-surface text-xs font-medium text-ink focus:border-accent"
              >
                <option value="شرح شکایت">شرح شکایت (توصیه شده - حاوی بیشترین جزئیات)</option>
                <option value="متن پیام">متن پیام متقاضی</option>
                <option value="عنوان خلاصه">عنوان خلاصه تیکت</option>
              </select>
              <p className="text-[11px] text-muted">
                طبق اصل طراحی بیستون: «ابزار فقط روی ستون متن کار می‌کند؛ ستون‌های دیگر فراداده حساس به شمار می‌آیند و نه به مدل می‌رسند و نه بدون تأیید صریح در خروجی می‌آیند.»
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLEANING FUNNEL & RULES */}
      {activeTab === 'clean' && (
        <div className="space-y-6">
          <div className="bg-surface border border-line rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <h3 className="font-bold text-base text-ink">قیف پالایش و پاک‌سازی داده‌های خام</h3>
                <p className="text-xs text-muted">
                  از متن خام تا متن آماده؛ هر حذف با ثبت دلیل و شمار مشخص در قیف ثبت می‌شود.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setShowDiffPreview(!showDiffPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-ink hover:bg-surface-2 transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>پیش‌نمایش پیش و پس</span>
                </button>
                <button
                  onClick={() => setShowDroppedModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong text-xs font-medium text-ink-2 hover:bg-surface-2 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>دیدن متن‌های حذف‌شده</span>
                </button>
              </div>
            </div>

            {/* Before / After Preview Box (Specified in PDF) */}
            {showDiffPreview && (
              <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-ink block">پیش‌نمایش تغییرات پاک‌سازی روی نمونه واقعی:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-surface rounded-lg border border-line">
                    <span className="text-[11px] font-bold text-crit block mb-1">پیش از پاک‌سازی (متن خام):</span>
                    <p className="font-mono text-ink-2 text-[11px] leading-relaxed" dir="rtl">
                      &lt;div&gt;سلام خسته نباشید &nbsp;&nbsp; پرونده اینجانب ۳ هفته است که معطل است!!!...&lt;/div&gt;
                    </p>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-line">
                    <span className="text-[11px] font-bold text-good block mb-1">پس از اعمال قواعد (متن پاک‌شده):</span>
                    <p className="text-ink leading-relaxed">
                      سلام خسته نباشید پرونده اینجانب ۳ هفته است که معطل است.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Funnel bars */}
            <div className="space-y-3">
              {calculatedFunnel.map((item, idx) => {
                const widthPercent = Math.max(35, Math.round((item.count / rawTotal) * 100));
                const isLast = idx === calculatedFunnel.length - 1;

                return (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-8">
                      <div
                        className={`h-11 rounded-lg flex items-center justify-between px-4 transition-all duration-300 ${
                          isLast
                            ? 'bg-accent text-on-accent font-bold shadow-xs'
                            : 'bg-surface-2 border border-line text-ink'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="text-xs truncate">{item.label}</span>
                        <span className="text-xs font-mono font-bold">{item.count.toLocaleString('fa-IR')}</span>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-center gap-2 text-xs">
                      {item.drop > 0 ? (
                        <>
                          <span className="font-mono font-bold text-crit">
                            -{item.drop.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-muted text-[11px] truncate">({item.why})</span>
                        </>
                      ) : (
                        <span className="text-muted text-[11px]">مبنای ورودی خام</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-lg bg-good-soft text-good border border-good/20 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                <b>{finalReadyCount.toLocaleString('fa-IR')}</b> متن آماده برچسب‌زنی نهایی است (معادل{' '}
                <b>{readyPercent}٪</b> از کل متن‌های خام ورودی).
              </span>
            </div>
          </div>

          {/* Rules Toggle List - 3 Columns Layout as Requested */}
          <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <span>فهرست ۶ قاعده‌ی پالایش و پاک‌سازی هوشمند (ترتیبی و قابل ویرایش)</span>
              </h3>
              <span className="text-[11px] text-muted font-mono font-semibold">
                {rules.filter((r) => r.enabled).length} از {rules.length} قاعده فعال
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rules.map((rule) => (
                <label
                  key={rule.id}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    rule.enabled
                      ? 'bg-surface border-line hover:border-accent hover:bg-surface-2 shadow-2xs'
                      : 'bg-surface-2/60 border-dashed border-line text-muted'
                  }`}
                >
                  <div className="space-y-1.5 mb-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-bold leading-snug ${rule.enabled ? 'text-ink' : 'text-muted'}`}>
                        {rule.title}
                      </span>
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => toggleRule(rule.id)}
                        className="w-4 h-4 accent-accent rounded mt-0.5 shrink-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px]">
                    <span className="text-muted font-medium">اثر روی پالایش:</span>
                    <span className="font-mono font-bold text-accent">
                      {rule.enabled ? `~${rule.dropEstimate} رکورد` : 'غیرفعال'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAMPLING */}
      {activeTab === 'sample' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-3xl space-y-6">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">
              نمونه‌گیری متقارن بدون هم‌پوشانی (تضمین علمی)
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              از میان {finalReadyCount.toLocaleString('fa-IR')} متن آماده، دو بخش مجزا برداشته می‌شود. «عدد تکرارپذیری» مشخص می‌کند کدام متن‌ها انتخاب شوند، نه صرفاً تعداد، و با همان عدد، همین نمونه عیناً بازتولید می‌شود.
            </p>
          </div>

          <div className="border border-line rounded-lg overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-2 border-b border-line text-muted">
                <tr>
                  <th className="p-3 font-semibold">بخش نمونه</th>
                  <th className="p-3 font-semibold">کاربرد تخصصی در سامانه</th>
                  <th className="p-3 font-semibold w-28">اندازه نمونه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="p-3 font-bold text-ink">نمونه مرجع (Gold Reference)</td>
                  <td className="p-3 text-ink-2">
                    دو کارشناس به‌صورت جداگانه، کور و مستقل برچسب می‌زنند (محاسبه کاپای کوهن)
                  </td>
                  <td className="p-3">
                    <input
                      defaultValue="۱۰۰"
                      className="w-20 h-8 px-2 border border-line-strong rounded text-center font-mono font-bold bg-surface"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-ink">نمونه بازبینی (Review Split)</td>
                  <td className="p-3 text-ink-2">
                    یک کارشناس پیشنهادهای مدل را اصلاح و بازبینی می‌کند (نیمه دوم)
                  </td>
                  <td className="p-3">
                    <input
                      defaultValue="۱۰۰"
                      className="w-20 h-8 px-2 border border-line-strong rounded text-center font-mono font-bold bg-surface"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-surface-2 border border-line text-xs text-muted flex items-center justify-between">
            <span>کنار گذاشتن خودکار متن‌های نمونه راهنما:</span>
            <span className="font-semibold text-good">۱۰ متن پرامپت فیلتر شدند</span>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-bold text-ink block">
              عدد تکرارپذیری (Random Seed):
            </label>
            <input
              value={sampleSeed}
              onChange={(e) => setSampleSeed(e.target.value)}
              className="w-full h-10 px-3 border border-line-strong rounded-lg bg-surface font-mono font-bold text-ink"
            />
            <span className="text-[11px] text-muted">
              با وارد کردن مجدد عدد ۱۴۰۴، دقیقاً همین ۱۰۰ نمونه بدون انحراف بازسازی می‌شود.
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleResample}
              className="px-4 py-2.5 rounded-lg bg-accent text-on-accent font-semibold text-xs hover:bg-accent-2 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ساختن دوباره‌ی نمونه</span>
            </button>
            <span className="text-xs text-good font-medium">{seedNotice}</span>
          </div>
        </div>
      )}

      {/* TAB 4: ANONYMIZATION */}
      {activeTab === 'anon' && (
        <div className="bg-surface border border-line rounded-xl p-6 max-w-4xl space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3 className="font-bold text-base text-ink">گمنام‌سازی هوشمند هویت‌ها (PII Anonymization)</h3>
              <p className="text-xs text-muted">
                طبق اصل بیستون: مدل فقط بازه‌های شناسایی‌کننده را برمی‌گرداند؛ لایه عبارت باقاعده تلفن، رایانامه، پیوند و کد ملی (با کنترل رقم ۱۰ رقمی) را می‌گیرد.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-good-soft text-good border border-good/20">
              اعمال روی ۱۰۰٪ نمونه‌ها
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2">
              <span className="text-xs font-bold text-muted block">نمونه واقعی متن ماسک‌شده در سامانه:</span>
              <p className="text-sm text-ink leading-relaxed font-normal">
                از روزی که پرونده را تحویل دادم سه هفته گذشته و هنوز کسی پاسخ نداده. هر بار تماس می‌گیرم می‌گویند کارشناس مسئول،{' '}
                <span className="px-1.5 py-0.5 rounded bg-accent-soft text-accent font-mono font-bold text-xs">[نام]</span>
                ، در جلسه است و در شعبه{' '}
                <span className="px-1.5 py-0.5 rounded bg-accent-soft text-accent font-mono font-bold text-xs">[شهر]</span>{' '}
                حضور ندارد. کد ملی{' '}
                <span className="px-1.5 py-0.5 rounded bg-accent-soft text-accent font-mono font-bold text-xs">[کد ملی]</span>{' '}
                را هم پیگیری نکردند.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 border border-line rounded-lg bg-surface text-center">
                <span className="text-[11px] text-muted block">ماسک نام اشخاص</span>
                <span className="text-sm font-mono font-bold text-ink">۲۴۸ مورد</span>
              </div>
              <div className="p-3 border border-line rounded-lg bg-surface text-center">
                <span className="text-[11px] text-muted block">کد ملی (با الگوریتم کنترل رقم)</span>
                <span className="text-sm font-mono font-bold text-ink">۱۹۱ مورد</span>
              </div>
              <div className="p-3 border border-line rounded-lg bg-surface text-center">
                <span className="text-[11px] text-muted block">تلفن، پیوند و شعب خاص</span>
                <span className="text-sm font-mono font-bold text-ink">۸۴ مورد</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-ochre-soft/50 border border-ochre/20 text-xs text-ochre flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                رشته‌های حذف‌شده در هیچ لاگی ذخیره نمی‌شوند، فقط شمار و نوع آن ثبت می‌شود تا حریم خصوصی نقض نگردد. در صورت مشاهده مورد جاافتاده، کارشناس کلید P را می‌زند.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RECORDS EXPLORER */}
      {activeTab === 'records' && (
        <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-sm text-ink">مرور و جستجو در متن‌های تمیزشده</h3>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-muted absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجو در متن‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pr-9 pl-3 text-xs border border-line rounded-lg bg-surface text-ink focus:border-accent"
              />
            </div>
          </div>

          <div className="border border-line rounded-lg overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-surface-2 border-b border-line text-muted">
                <tr>
                  <th className="p-3 w-16">شناسه</th>
                  <th className="p-3">متن شکایت (گمنام‌شده)</th>
                  <th className="p-3 w-32">فایل مبدا</th>
                  <th className="p-3 w-28">وضعیت تخصیص</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SAMPLE_TEXTS.filter((t) => t.text.includes(searchQuery)).map((record) => (
                  <tr key={record.id} className="hover:bg-surface-2 transition-colors">
                    <td className="p-3 font-mono font-bold text-muted">{record.id}</td>
                    <td className="p-3 text-ink leading-relaxed max-w-lg">{record.text}</td>
                    <td className="p-3 font-mono text-muted text-[11px]" dir="ltr">
                      {record.sourceFile}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-soft text-accent">
                        {record.status === 'sampled_ref' ? 'نمونه مرجع' : 'نمونه بازبینی'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DROPPED TEXTS */}
      {showDroppedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-surface border border-line rounded-xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <div>
                <h4 className="font-bold text-base text-ink">نمونه متن‌های کنار گذاشته‌شده در قیف داده</h4>
                <p className="text-xs text-muted">شفافیت کامل در چرخه داده‌ورزی جهت جلوگیری از سوگیری</p>
              </div>
              <button
                onClick={() => setShowDroppedModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex justify-between items-center text-crit font-semibold">
                  <span>علت حذف: کوتاه‌تر از ۵ واژه</span>
                  <span className="font-mono">ID: 802</span>
                </div>
                <p className="text-ink font-mono" dir="rtl">«پیگیری پرونده»</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex justify-between items-center text-crit font-semibold">
                  <span>علت حذف: ردیف متن خالی</span>
                  <span className="font-mono">ID: 914</span>
                </div>
                <p className="text-muted font-mono" dir="rtl">[سلول فاقد محتوای متنی بود]</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex justify-between items-center text-crit font-semibold">
                  <span>علت حذف: تکرار دقیق ردیف پیشین</span>
                  <span className="font-mono">ID: 1042</span>
                </div>
                <p className="text-ink font-mono" dir="rtl">«سامانه قطع است و ثبت نام نمی‌شود.»</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                <div className="flex justify-between items-center text-crit font-semibold">
                  <span>علت حذف: بیشتر متن غیرفارسی</span>
                  <span className="font-mono">ID: 1180</span>
                </div>
                <p className="text-ink font-mono" dir="ltr">"HTTP Error 503 Service Unavailable nginx/1.18"</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-line flex justify-end">
              <button
                onClick={() => setShowDroppedModal(false)}
                className="px-4 py-2 bg-surface-2 border border-line-strong rounded-lg text-ink font-semibold text-xs hover:bg-line transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
