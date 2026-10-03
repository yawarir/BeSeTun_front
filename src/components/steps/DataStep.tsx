import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Sliders,
  X,
  ArrowLeftRight,
  ShieldCheck,
  Download,
  Zap,
  Trash2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_RULES } from '../../mockData';
import { CleaningRule } from '../../types';
import sampleCitizenComplaints from '../../data/sample_citizen_complaints.json';

interface RawComplaintItem {
  id: number;
  text: string;
  category?: string;
  timestamp?: string;
  source?: string;
}

interface LoadedFileMeta {
  name: string;
  size: string;
  rowCount: number;
  loadedAt: string;
  isSample?: boolean;
}

interface DataStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onDatasetLoaded?: (count: number) => void;
  onDatasetCleared?: () => void;
  isInitialLoaded?: boolean;
}

export const DataStep: React.FC<DataStepProps> = ({
  activeTab,
  onChangeTab,
  onDatasetLoaded,
  onDatasetCleared,
  isInitialLoaded = false,
}) => {
  // Dataset state: Clean and empty by default
  const [loadedFiles, setLoadedFiles] = useState<LoadedFileMeta[]>(
    isInitialLoaded
      ? [
          {
            name: 'sample_citizen_complaints.json',
            size: '۲۴ کیلوبایت',
            rowCount: sampleCitizenComplaints.length,
            loadedAt: 'اکنون',
            isSample: true,
          },
        ]
      : []
  );

  const [records, setRecords] = useState<RawComplaintItem[]>(
    isInitialLoaded ? (sampleCitizenComplaints as RawComplaintItem[]) : []
  );

  const [rules, setRules] = useState<CleaningRule[]>([
    ...INITIAL_RULES,
    {
      id: 'html',
      title: 'حذف تگ‌های HTML و کاراکترهای کنترلی',
      description: 'پاک‌سازی برچسب‌های وب، تگ‌های &nbsp; و خط‌شکست‌های زائد با زمان‌سنج ایمنی',
      enabled: true,
      dropEstimate: 2,
    },
    {
      id: 'normalize',
      title: 'نرمال‌سازی نویسه‌ها و نیم‌فاصله‌ها',
      description: 'یکدست‌سازی «ي» و «ك» عربی به فارسی، اصلاح ارقام و تنظیم فواصل مجازی استاندارد',
      enabled: true,
      dropEstimate: 4,
    },
  ]);

  // Combined functional modal for Diff Preview and Dropped records
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [diffModalTab, setDiffModalTab] = useState<'diff' | 'dropped'>('diff');

  const [sampleSeed, setSampleSeed] = useState('۱۴۰۴');
  const [seedNotice, setSeedNotice] = useState('نمونه با عدد ۱۴۰۴ قفل و تثبیت شد');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('شرح شکایت (text)');
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Interactive Live Anonymization Sandbox State
  const [liveAnonInput, setLiveAnonInput] = useState(
    'آقای محمد رضایی به شماره ملی ۰۰۱۲۳۴۵۶۷۸ و شماره تماس ۰۹۱۲۳۴۵۶۷۸۹ در شعبه آزادی تقاضای استرداد وجه به شماره کارت ۶۰۳۷۹۹۱۸۲۳۴۵۶۷۸۹ داشتند.'
  );

  const isDataLoaded = records.length > 0;

  // Masking function for live sandbox:
  // Strict order with digit boundary checks:
  // 1. Bank card (16 digits with optional spaces or dashes, strict boundary)
  // 2. IBAN (IR + 24 digits)
  // 3. Mobile phone (09/۰۹/+98/۰۰۹۸ followed by 9 digits with optional spaces/dashes, strict boundary)
  // 4. Landlines (e.g. 021-xxxxxxxx)
  // 5. National ID (strictly 10 digits with strict negative lookarounds)
  // 6. Names and branches
  const maskText = (txt: string) => {
    return txt
      // 1. Bank Card (16 digits with optional spaces or dashes, strict boundary)
      .replace(/(?<![\d۰-۹])(?:[\d۰-۹][\s\-_–—]*){16}(?![\d۰-۹])/g, '[شماره_کارت]')
      // 2. IBAN
      .replace(/(?<![A-Za-z\d۰-۹])(?:IR|ir|IR-|ir-)[\s\-_–—]?(?:[\d۰-۹][\s\-_–—]*){24}(?![\d۰-۹])/g, '[شماره_شبا]')
      // 3. Mobile Phone (09/۰۹/+98/۰۰۹۸ followed by 9 digits with optional spaces/dashes, strict boundary)
      .replace(/(?<![\d۰-۹])(?:(?:\+98|0098|\+۹۸|۰۰۹۸|0|۰)?[\s\-_–—]*[9۹])(?:[\s\-_–—]*[\d۰-۹]){9}(?![\d۰-۹])/g, '[شماره_تلفن]')
      // 4. Landlines (e.g. 021-xxxxxxxx)
      .replace(/(?<![\d۰-۹])(?:0|۰)[1-8۱-۸](?:[\s\-_–—]*[\d۰-۹]){8,9}(?![\d۰-۹])/g, '[شماره_تلفن]')
      // 5. National Code (strictly 10 digits with strict negative lookarounds)
      .replace(/(?<![\d۰-۹])(?:[\d۰-۹][\s\-_–—]*){10}(?![\d۰-۹])/g, '[کد_ملی]')
      // 6. Names
      .replace(/(?:جناب آقای|آقای|سرکار خانم|خانم)\s+[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+)?/g, '[نام_شخص]')
      // 7. Branches
      .replace(/شعبه\s+[\u0600-\u06FF]+/g, '[شعبه_سازمان]');
  };

  // Load the standalone JSON sample dataset
  const handleLoadSampleData = () => {
    setIsLoadingSample(true);
    setTimeout(() => {
      const data = sampleCitizenComplaints as RawComplaintItem[];
      setRecords(data);
      setLoadedFiles([
        {
          name: 'sample_citizen_complaints.json',
          size: '۲۴ کیلوبایت',
          rowCount: data.length,
          loadedAt: 'اکنون',
          isSample: true,
        },
      ]);
      setIsLoadingSample(false);
      if (onDatasetLoaded) {
        onDatasetLoaded(data.length);
      }
    }, 350);
  };

  // Upload custom user file (.json, .csv, .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsed: RawComplaintItem[] = [];

        if (file.name.endsWith('.json')) {
          const rawJson = JSON.parse(content);
          if (Array.isArray(rawJson)) {
            parsed = rawJson.map((item, idx) => ({
              id: item.id || 1000 + idx,
              text: typeof item === 'string' ? item : item.text || item.complaint || JSON.stringify(item),
              category: item.category || 'عمومی',
              timestamp: item.timestamp || '1403/07/01',
              source: file.name,
            }));
          }
        } else {
          // CSV or TXT line by line
          const lines = content.split('\n').filter((l) => l.trim().length > 0);
          parsed = lines.slice(file.name.endsWith('.csv') ? 1 : 0).map((line, idx) => ({
            id: 2000 + idx,
            text: line.replace(/^"|"$/g, '').trim(),
            category: 'عمومی',
            timestamp: '1403/07/01',
            source: file.name,
          }));
        }

        if (parsed.length > 0) {
          setRecords(parsed);
          setLoadedFiles([
            {
              name: file.name,
              size: `${Math.round(file.size / 1024)} کیلوبایت`,
              rowCount: parsed.length,
              loadedAt: 'اکنون',
              isSample: false,
            },
          ]);
          if (onDatasetLoaded) {
            onDatasetLoaded(parsed.length);
          }
        }
      } catch (err) {
        alert('خطا در خواندن فایل. لطفاً از قالب معتبر JSON یا متن فارسی استفاده فرمایید.');
      }
    };
    reader.readAsText(file);
  };

  // Clear dataset
  const handleClearData = () => {
    if (confirm('آیا از پاک‌سازی داده‌های بارگذاری‌شده و بازگشت به وضعیت اولیه اطمینان دارید؟')) {
      setRecords([]);
      setLoadedFiles([]);
      if (onDatasetCleared) {
        onDatasetCleared();
      }
    }
  };

  // Funnel calculation based on loaded data
  const rawTotal = records.length;
  let currentTotal = rawTotal;

  const calculatedFunnel = isDataLoaded
    ? [
        { label: 'متن‌های خام اولیه (مبدأ ورود)', count: rawTotal, drop: 0, why: '' },
        {
          label: 'بدون متن خالی و بی‌محتوا',
          count: rules.find((r) => r.id === 'empty')?.enabled ? (currentTotal -= Math.min(currentTotal, 2)) : currentTotal,
          drop: rules.find((r) => r.id === 'empty')?.enabled ? Math.min(rawTotal, 2) : 0,
          why: 'سلول متن خالی یا فقط فاصله بود',
        },
        {
          label: 'بدون داده‌های تکراری (Exact & Fuzzy)',
          count: rules.find((r) => r.id === 'dedup')?.enabled ? (currentTotal -= Math.min(currentTotal, 3)) : currentTotal,
          drop: rules.find((r) => r.id === 'dedup')?.enabled ? Math.min(rawTotal, 3) : 0,
          why: 'تکراری دقیق یا تطابق بالای ۹۵٪',
        },
        {
          label: 'دارای بلندی کافی (کمینه ۵ واژه)',
          count: rules.find((r) => r.id === 'length')?.enabled ? (currentTotal -= Math.min(currentTotal, 2)) : currentTotal,
          drop: rules.find((r) => r.id === 'length')?.enabled ? Math.min(rawTotal, 2) : 0,
          why: 'متن کوتاه فاقد زمینه برای برچسب‌زنی',
        },
        {
          label: 'زبان فارسی استاندارد و بدون کد مخرب',
          count: rules.find((r) => r.id === 'lang')?.enabled ? (currentTotal -= Math.min(currentTotal, 1)) : currentTotal,
          drop: rules.find((r) => r.id === 'lang')?.enabled ? Math.min(rawTotal, 1) : 0,
          why: 'متن غیرفارسی یا کاراکترهای خراب',
        },
      ]
    : [];

  const finalReadyCount = calculatedFunnel.length > 0 ? calculatedFunnel[calculatedFunnel.length - 1].count : 0;
  const readyPercent = rawTotal > 0 ? Math.round((finalReadyCount / rawTotal) * 100) : 0;

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

  // Filtered records for viewing (Step 1: Clean raw texts, without labels!)
  const filteredRecords = records.filter((r) => r.text.includes(searchQuery));

  // Concrete sample dropped items for the modal
  const droppedSamples = [
    {
      id: 9901,
      rule: 'بدون متن خالی و بی‌محتوا',
      ruleId: 'empty',
      reason: 'متن صرفاً حاوی کاراکترهای فاصله و تب بود',
      rawText: '            ',
    },
    {
      id: 9902,
      rule: 'حذف موارد تکراری (Exact & Fuzzy)',
      ruleId: 'dedup',
      reason: 'تکرار ۱۰۰٪ عینی با رکورد شماره ۱۰۱۴ ثبت‌شده در همان روز',
      rawText: 'تعرفه تمدید اشتراک در سامانه یک قیمت و در درگاه پرداخت مبلغ دیگری کسر می‌شود.',
    },
    {
      id: 9903,
      rule: 'کمینه‌ی بلندی متن (حداقل ۵ کلمه)',
      ruleId: 'length',
      reason: 'طول بسیار کوتاه (۲ واژه)، فاقد زمینه برای تحلیل معنایی',
      rawText: 'سلام پیگیری',
    },
    {
      id: 9904,
      rule: 'پالایش زبان (فقط فارسی استاندارد)',
      ruleId: 'lang',
      reason: 'بیش از ۷۰٪ حروف لاتین و کاراکترهای کدگذاری تخریب‌شده',
      rawText: 'test inquiry regarding system error 404 & #8211;',
    },
  ];

  // Concrete before/after diff items
  const diffSamples = [
    {
      id: 1,
      title: 'نرمال‌سازی «ي» و «ك» عربی به فارسی و تصحیح نیم‌فاصله‌ها',
      before: 'پيگيري پرونده در سامانه خدمات الكترونيك انجام نمي شود',
      after: 'پیگیری پرونده در سامانه خدمات الکترونیک انجام نمی‌شود',
      change: 'اصلاح ۳ حرف عربی به فارسی + درج نیم‌فاصله استاندارد',
    },
    {
      id: 2,
      title: 'حذف تگ‌های HTML و کاراکترهای ویژه وب',
      before: 'درخواست وام اشتغال&nbsp;<span class="bold">ثبت نشد</span><br/>لطفا بررسی شود.',
      after: 'درخواست وام اشتغال ثبت نشد لطفا بررسی شود.',
      change: 'حذف ۲ تگ وب و کاراکتر &nbsp;',
    },
    {
      id: 3,
      title: 'حذف کاراکترهای کنترلی و فاصله‌های مکرر زائد',
      before: 'هزینه    صدور    کارت بسیار   بالاست\r\n\t',
      after: 'هزینه صدور کارت بسیار بالاست',
      change: 'فشرده‌سازی فاصله‌های متوالی و حذف Tab/LineBreak',
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'import', label: 'ورود فایل‌ها (xlsx, csv, jsonl)' },
          { id: 'clean', label: 'قیف و قواعد پالایش' },
          { id: 'sample', label: 'نمونه‌گیری متقارن (مرجع / بازبینی)' },
          { id: 'anon', label: 'گمنام‌سازی هویت‌ها (حفظ حریم خصوصی)' },
          { id: 'records', label: 'مرور رکوردهای تمیز' },
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

      {/* ======================================================== */}
      {/* TAB 1: IMPORT & SAMPLE DATASET */}
      {/* ======================================================== */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Drag & Drop upload */}
            <div className="p-8 border-2 border-dashed border-line-strong rounded-2xl bg-surface flex flex-col items-center justify-center text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-ink mb-1">
                  فایل داده خام سازمان را اینجا رها کنید
                </h3>
                <p className="text-xs text-muted max-w-sm leading-relaxed">
                  پشتیبانی از فایل‌های اکسل، CSV، JSON، JSONL و TXT (پردازش ایزوله بدون خروج از مرورگر)
                </p>
              </div>

              <div className="flex gap-2 font-mono text-xs text-muted" dir="ltr">
                <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.json</span>
                <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.csv</span>
                <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.xlsx</span>
                <span className="px-2 py-0.5 border border-line rounded bg-surface-2 font-semibold">.txt</span>
              </div>

              <label className="px-5 py-2.5 rounded-xl border border-line-strong bg-surface text-ink font-semibold text-xs hover:bg-surface-2 transition-colors cursor-pointer shadow-2xs">
                <span>انتخاب از دیسک محلی</span>
                <input
                  type="file"
                  accept=".json,.csv,.xlsx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Right: Quick-Load Sample Dataset Card */}
            <div className="p-6 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent-soft/50 via-surface to-accent-soft/20 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ink">مجموعه‌داده آزمایشی آماده بیستون</h3>
                    <span className="text-[11px] text-muted">داده‌های ساختگی (شبیه‌سازی‌شده) — ۵۰ متن ساختگی</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-surface border border-line text-accent">
                  ساختگی (Synthetic)
                </span>
              </div>

              <p className="text-xs text-muted leading-relaxed">
                برای ارزیابی سریع و عملی خط لوله ۶ مرحله‌ای بدون نیاز به آماده‌سازی فایل شخصی، می‌توانید با یک کلیک این داده‌های نمونه را وارد چرخه نمایید و با راهنمای گام‌به‌گام پیش بروید.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-2 bg-surface p-3 rounded-xl border border-line">
                <div>• تعداد رکورد: <b>۴۲ متن ساختگی پس از پالایش</b></div>
                <div>• ماهیت داده‌ها: <b>کاملاً ساختگی (Synthetic)</b></div>
                <div>• ساختار فیلدها: <b>id, text, source</b></div>
                <div>• گمنام‌سازی: <b>آماده پالایش</b></div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={handleLoadSampleData}
                  disabled={isLoadingSample}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isLoadingSample ? 'در حال بارگذاری...' : 'بارگذاری این دیتاست در پروژه'}</span>
                </button>

                <a
                  href="/sample_citizen_complaints.json"
                  download="sample_citizen_complaints.json"
                  className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="دانلود فایل JSON نمونه روی رایانه"
                >
                  <Download className="w-3.5 h-3.5 text-muted" />
                  <span>دانلود JSON</span>
                </a>
              </div>
            </div>
          </div>

          {/* Active Uploaded Files Table */}
          {isDataLoaded ? (
            <div className="bg-surface border border-line rounded-2xl p-6 space-y-4 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-good" />
                  <h3 className="font-bold text-sm text-ink">
                    داده‌های فعال در پروژه ({records.length} رکورد بارگذاری‌شده)
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChangeTab('clean')}
                    className="px-4 py-1.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>ادامه به قیف پالایش داده‌ها</span>
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleClearData}
                    className="p-2 rounded-xl border border-line text-muted hover:text-crit hover:bg-crit-soft transition-colors cursor-pointer"
                    title="پاک‌سازی داده‌ها و شروع مجدد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-line border border-line rounded-xl overflow-hidden">
                {loadedFiles.map((file, idx) => (
                  <div key={idx} className="p-3.5 bg-surface-2/60 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <b className="font-mono text-xs block text-ink" dir="ltr">
                        {file.name}
                      </b>
                      <span className="text-[11px] text-muted">
                        {file.rowCount.toLocaleString('fa-IR')} ردیف — حجم: {file.size} — بارگذاری: {file.loadedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.isSample && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20">
                          دیتاست نمونه بیستون
                        </span>
                      )}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-good-soft text-good">
                        تطبیق شد
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column Mapping */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-ink block">
                  ستون متن اصلی جهت پردازش و برچسب‌زنی:
                </label>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="w-full h-10 px-3 border border-line-strong rounded-xl bg-surface text-xs font-medium text-ink focus:border-accent"
                >
                  <option value="شرح شکایت (text)">متن شکایت / پیام شهروند (text)</option>
                </select>
                <p className="text-[11px] text-muted">
                  «ابزار فقط روی ستون متن کار می‌کند؛ ستون‌های دیگر فراداده حساس به شمار می‌آیند و نه به مدل می‌رسند و نه بدون تأیید صریح در خروجی می‌آیند.»
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface-2/40 border border-line text-center text-xs text-muted">
              هنوز داده‌ای بارگذاری نشده است. برای شروع، فایلی را آپلود کنید یا دکمه «بارگذاری این دیتاست در پروژه» را در کارت بالا بزنید.
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CLEANING FUNNEL & RULES */}
      {/* ======================================================== */}
      {activeTab === 'clean' && (
        <div className="space-y-6">
          {!isDataLoaded ? (
            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-ochre mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink">دیتاست هنوز بارگذاری نشده است</h3>
                <p className="text-xs text-muted leading-relaxed">
                  برای مشاهده قیف پالایش و اعمال قواعد ۶گانه پاک‌سازی، لطفاً ابتدا در زبانه «ورود فایل‌ها» فایل متنی خود را وارد کنید یا دکمه بارگذاری داده آزمایشی را بزنید.
                </p>
              </div>
              <button
                onClick={() => onChangeTab('import')}
                className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs"
              >
                رفتن به زبانه ورود فایل‌ها
              </button>
            </div>
          ) : (
            <>
              <div className="bg-surface border border-line rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <h3 className="font-bold text-base text-ink">قیف پالایش و پاک‌سازی داده‌های خام</h3>
                    <p className="text-xs text-muted mt-0.5">
                      ریز شفاف دلایل افت رکوردها برای ارزیابی و گزارش کنترل کیفیت بر اساس {rawTotal} رکورد اولیه
                    </p>
                  </div>

                  {/* USER REQUEST POINT 1: SINGLE, FULLY WORKING MODAL BUTTON */}
                  <div>
                    <button
                      onClick={() => setShowDiffModal(true)}
                      className="px-4 py-2 rounded-xl border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-4 h-4 text-accent" />
                      <span>پیش‌نمایش قبل و بعد و نمونه‌های فیلترشده</span>
                    </button>
                  </div>
                </div>

                {/* Funnel Visual Stack */}
                <div className="space-y-2 pt-1">
                  {calculatedFunnel.map((item, idx) => {
                    const pct = Math.round((item.count / rawTotal) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-ink">{item.label}</span>
                          <div className="flex items-center gap-3">
                            {item.drop > 0 && (
                              <span className="text-[11px] font-mono text-crit font-semibold">
                                -{item.drop.toLocaleString('fa-IR')} مورد ({item.why})
                              </span>
                            )}
                            <span className="font-mono font-bold text-ink">
                              {item.count.toLocaleString('fa-IR')} رکورد ({pct}٪)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-track overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              idx === calculatedFunnel.length - 1 ? 'bg-good' : 'bg-accent'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-good-soft border border-good/30 text-xs text-good flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    متن‌های آماده برای ورود به مرحله بعد: <b>{finalReadyCount.toLocaleString('fa-IR')} متن پالایش‌شده</b> ({readyPercent}٪ از کل متن‌های خام ورودی).
                  </span>
                </div>
              </div>

              {/* Rules Toggle List */}
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
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SAMPLING */}
      {/* ======================================================== */}
      {activeTab === 'sample' && (
        <div className="bg-surface border border-line rounded-2xl p-6 max-w-3xl space-y-6">
          {!isDataLoaded ? (
            <div className="text-center py-6 space-y-3">
              <AlertCircle className="w-10 h-10 text-ochre mx-auto" />
              <p className="text-xs text-muted">ابتدا دیتاست را در زبانه «ورود فایل‌ها» بارگذاری کنید.</p>
              <button
                onClick={() => onChangeTab('import')}
                className="px-4 py-2 bg-accent text-on-accent text-xs rounded-xl font-bold cursor-pointer"
              >
                ورود فایل‌ها
              </button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="font-bold text-base text-ink mb-1">
                  نمونه‌گیری متقارن بدون هم‌پوشانی (تضمین علمی)
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  از میان {finalReadyCount.toLocaleString('fa-IR')} متن آماده، دو بخش مجزا برداشته می‌شود. «عدد تکرارپذیری» مشخص می‌کند کدام متن‌ها انتخاب شوند و با همان عدد، همین نمونه عیناً بازتولید می‌شود.
                </p>
              </div>

              {(() => {
                const halfSampleCount = Math.floor(finalReadyCount / 2);
                const refSampleCount = halfSampleCount;
                const revSampleCount = finalReadyCount - refSampleCount;
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <b className="text-xs text-ink">نمونه مرجع (برچسب‌زنی کور)</b>
                          <span className="font-mono font-bold text-accent text-xs">
                            {refSampleCount.toLocaleString('fa-IR')} متن
                          </span>
                        </div>
                        <p className="text-[11px] text-muted">
                          به دو کارشناس ۱ و ۲ به صورت مستقل و بدون مشاهده نظر یکدیگر جهت داوری کور تخصیص می‌یابد.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-line bg-surface-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <b className="text-xs text-ink">نمونه بازبینی (پیشنهاد مدل)</b>
                          <span className="font-mono font-bold text-accent text-xs">
                            {revSampleCount.toLocaleString('fa-IR')} متن
                          </span>
                        </div>
                        <p className="text-[11px] text-muted">
                          توسط مدل زبانی برچسب‌گذاری شده و کارشناسان صرفاً برچسب‌های خروجی را تایید یا اصلاح می‌کنند.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-accent-soft/40 border border-accent/20 text-xs text-accent flex items-center justify-between">
                      <span>مجموع نمونه‌های انتخابی مجزا:</span>
                      <b className="font-mono">{(refSampleCount + revSampleCount).toLocaleString('fa-IR')} از {finalReadyCount.toLocaleString('fa-IR')} متن کل (تضمین عدم هم‌پوشانی)</b>
                    </div>
                  </>
                );
              })()}

              <div className="p-4 border border-line rounded-xl bg-surface space-y-3">
                <label className="text-xs font-semibold text-ink block">
                  دانه تصادفی تکرارپذیری (Reproducibility Seed):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sampleSeed}
                    onChange={(e) => setSampleSeed(e.target.value)}
                    className="w-32 px-3 py-2 border border-line-strong rounded-lg bg-surface font-mono text-xs font-bold text-ink"
                  />
                  <button
                    onClick={handleResample}
                    className="px-4 py-2 rounded-lg bg-accent text-on-accent text-xs font-semibold hover:bg-accent-2 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تولید مجدد نمونه</span>
                  </button>
                </div>
                <span className="text-[11px] text-good font-semibold block">{seedNotice}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ANONYMIZATION (USER REQUEST POINT 2) */}
      {/* ======================================================== */}
      {activeTab === 'anon' && (
        <div className="space-y-6 max-w-4xl">
          {!isDataLoaded ? (
            <div className="text-center py-6 space-y-3">
              <AlertCircle className="w-10 h-10 text-ochre mx-auto" />
              <p className="text-xs text-muted">ابتدا دیتاست را در زبانه «ورود فایل‌ها» بارگذاری کنید.</p>
              <button
                onClick={() => onChangeTab('import')}
                className="px-4 py-2 bg-accent text-on-accent text-xs rounded-xl font-bold cursor-pointer"
              >
                ورود فایل‌ها
              </button>
            </div>
          ) : (
            <>
              <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-good-soft text-good flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-ink">
                      گمنام‌سازی هوشمند و حفاظت از داده‌های شخصی (PII De-identification)
                    </h3>
                    <p className="text-xs text-muted">
                      هدف: جلوگیری قطعی از انتقال اطلاعات هویتی و محرمانه اشخاص به مدل‌های زبانی یا کارشناسان برچسب‌زن
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                    <span className="font-bold text-ink block">شماره تلفن و موبایل</span>
                    <span className="text-[11px] text-good font-mono block">۰۹xx-xxx-xxxx</span>
                    <span className="text-[10px] text-muted">ماسک: [شماره_تلفن]</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                    <span className="font-bold text-ink block">کد ملی ۱۰ رقمی</span>
                    <span className="text-[11px] text-good font-mono block">xxxxxxxxxx</span>
                    <span className="text-[10px] text-muted">ماسک: [کد_ملی]</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                    <span className="font-bold text-ink block">کارت بانکی و شبا</span>
                    <span className="text-[11px] text-good font-mono block">۶۰۳۷-xxxx...</span>
                    <span className="text-[10px] text-muted">ماسک: [کارت_بانکی]</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
                    <span className="font-bold text-ink block">اسامی و شعب</span>
                    <span className="text-[11px] text-good font-mono block">آقای/خانم [نام]</span>
                    <span className="text-[10px] text-muted">ماسک: [نام_شخص]</span>
                  </div>
                </div>
              </div>

              {/* Interactive Live Testing Sandbox */}
              <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink">
                    میزکار آزمایش زنده الگوهای گمنام‌سازی (Live Sandbox):
                  </h4>
                  <span className="text-[11px] text-muted">هر متنی را برای تست وارد کنید</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted block">متن آزمایشی ورودی:</label>
                  <textarea
                    rows={2}
                    value={liveAnonInput}
                    onChange={(e) => setLiveAnonInput(e.target.value)}
                    className="w-full p-3 border border-line-strong rounded-xl bg-surface text-xs text-ink focus:border-accent font-sans leading-relaxed"
                  />
                </div>

                <div className="p-4 rounded-xl border border-good/40 bg-good-soft/30 space-y-1.5">
                  <span className="text-xs font-bold text-good block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    خروجی زنده پس از ماسک‌گذاری خودکار:
                  </span>
                  <p className="text-xs text-ink leading-relaxed font-medium">
                    {maskText(liveAnonInput)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: RECORDS BROWSER (USER REQUEST POINT 3: NO LABELS HERE!) */}
      {/* ======================================================== */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {!isDataLoaded ? (
            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-ochre mx-auto" />
              <p className="text-xs text-muted">هنوز داده‌ای بارگذاری نشده است.</p>
              <button
                onClick={() => onChangeTab('import')}
                className="px-5 py-2.5 rounded-xl bg-accent text-on-accent text-xs font-bold cursor-pointer"
              >
                ورود فایل‌ها
              </button>
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="جستجو در متن رکوردهای تمیزشده..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 border border-line-strong rounded-xl bg-surface text-xs focus:border-accent"
                  />
                  <Search className="w-4 h-4 text-muted absolute right-3 top-2.5" />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>وضعیت: <b>متن‌های خام پالایش‌شده (پیش از برچسب‌زنی)</b></span>
                  <span className="font-mono font-semibold">
                    {filteredRecords.length.toLocaleString('fa-IR')} از {records.length.toLocaleString('fa-IR')} رکورد
                  </span>
                </div>
              </div>

              {/* Notice that clarifies why there are NO labels in Step 1 */}
              <div className="p-3 rounded-xl bg-surface-2 border border-line text-[11px] text-muted flex items-center justify-between">
                <span>
                  • داده‌های این بخش صرفاً متون خام تمیزشده‌ی مرحله ۱ هستند. برچسب‌ها در مرحله ۲ استخراج و در مرحله ۳ و ۴ برچسب‌زنی خواهند شد.
                </span>
                <span className="font-mono text-accent">آماده برای مرحله ۲</span>
              </div>

              <div className="divide-y divide-line border border-line rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
                {filteredRecords.map((r) => {
                  const wordCount = r.text.trim().split(/\s+/).length;
                  return (
                    <div key={r.id} className="p-3.5 hover:bg-surface-2 transition-colors space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span className="font-mono font-bold text-accent">رکورد #{r.id.toLocaleString('fa-IR')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-line text-muted">
                            {wordCount} واژه
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-good-soft text-good font-semibold">
                            پالایش‌شده در قیف
                          </span>
                        </div>
                      </div>
                      <p className="text-ink leading-relaxed font-normal">{r.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* COMBINED DIFF & DROPPED SAMPLES MODAL (USER REQUEST POINT 1) */}
      {/* ======================================================== */}
      {showDiffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-2/40">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm text-ink">
                  بررسی پیش‌نمایش پاک‌سازی و نمونه‌های فیلترشده
                </h3>
              </div>
              <button
                onClick={() => setShowDiffModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-line px-4 gap-2 bg-surface text-xs">
              <button
                onClick={() => setDiffModalTab('diff')}
                className={`py-3 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
                  diffModalTab === 'diff'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                پیش‌نمایش قبل و بعد نرمال‌سازی
              </button>
              <button
                onClick={() => setDiffModalTab('dropped')}
                className={`py-3 px-3 font-bold border-b-2 cursor-pointer transition-colors ${
                  diffModalTab === 'dropped'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                نمونه‌های کنارگذاشته‌شده (ریزش‌ها)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {diffModalTab === 'diff' ? (
                <div className="space-y-3">
                  <p className="text-muted leading-relaxed">
                    در این جدول نمونه‌هایی از اصلاحات اعمال‌شده توسط قواعد نرمال‌سازی و پاک‌سازی نمایش داده شده است:
                  </p>
                  {diffSamples.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl border border-line bg-surface-2/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <b className="text-ink">{item.title}</b>
                        <span className="text-accent font-mono">{item.change}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-surface border border-crit/20 text-ink">
                          <span className="text-[10px] text-crit font-bold block mb-0.5">قبل از پالایش:</span>
                          <span className="line-through opacity-75">{item.before}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-surface border border-good/20 text-ink">
                          <span className="text-[10px] text-good font-bold block mb-0.5">بعد از پالایش:</span>
                          <span>{item.after}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted leading-relaxed">
                    نمونه رکوردهایی که توسط قواعد قیف شناسایی و از ورود به مراحل بعدی حذف شدند:
                  </p>
                  {droppedSamples.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl border border-line bg-surface-2/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{item.rule}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-crit-soft text-crit font-bold">
                          حذف شد
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">دلیل حذف: {item.reason}</p>
                      <div className="p-2 rounded bg-surface border border-line font-mono text-[11px] text-ink-2 truncate" dir="ltr">
                        {item.rawText}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-line bg-surface-2/40 flex justify-end">
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-5 py-2 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors cursor-pointer"
              >
                متوجه شدم و بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
