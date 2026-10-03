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
  Edit2,
  Trash2,
  X,
  Check,
  Save,
  Layers,
  HelpCircle,
  FileText,
  Sliders,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { INITIAL_CANDIDATE_LABELS, INITIAL_LABELS } from '../../mockData';
import { CandidateLabel, LabelItem, FewShotPromptExample } from '../../types';

interface LabelsStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenSettings: () => void;
  labels: LabelItem[];
  onLabelsChange: (labels: LabelItem[]) => void;
  isDatasetLoaded: boolean;
  datasetCount?: number;
}

export const LabelsStep: React.FC<LabelsStepProps> = ({
  activeTab,
  onChangeTab,
  onOpenSettings,
  labels,
  onLabelsChange,
  isDatasetLoaded,
  datasetCount = 42,
}) => {
  const [jobState, setJobState] = useState<'idle' | 'run' | 'err' | 'done'>('idle');
  const [jobProgress, setJobProgress] = useState(0);
  const [simulateError, setSimulateError] = useState(false);
  const [selectedExtractionModel, setSelectedExtractionModel] = useState('qwen2.5-14b-instruct');
  const [extractionInstruction, setExtractionInstruction] = useState(
    'متن‌های شکایات شهروندی را تحلیل کرده و دلایل پرتکرار و ساختارمند نارضایتی را استخراج و دسته‌بندی کنید.'
  );

  // Dynamically proportion candidate frequencies so they never exceed datasetCount (e.g. 42)
  const [candidates, setCandidates] = useState<CandidateLabel[]>(() => {
    const total = datasetCount || 42;
    return [
      { id: 0, name: 'کندی پاسخ‌گویی', frequency: Math.min(total, Math.round(total * 0.43)), selected: true },
      { id: 1, name: 'هزینه‌ی بالا', frequency: Math.min(total, Math.round(total * 0.33)), selected: true },
      { id: 2, name: 'کیفیت پایین خدمت', frequency: Math.min(total, Math.round(total * 0.26)), selected: true },
      { id: 3, name: 'رفتار نامناسب پرسنل', frequency: Math.min(total, Math.round(total * 0.21)), selected: true },
      { id: 4, name: 'پیچیدگی و سردرگمی مراحل', frequency: Math.min(total, Math.round(total * 0.19)), selected: true },
      { id: 5, name: 'خطا و قطعی سامانه برخط', frequency: Math.min(total, Math.round(total * 0.14)), selected: true },
      { id: 6, name: 'عدم شفافیت ضوابط', frequency: Math.min(total, Math.round(total * 0.12)), selected: true },
      { id: 7, name: 'محدودیت دسترسی مکانی/زمانی', frequency: Math.min(total, Math.round(total * 0.10)), selected: true },
      { id: 8, name: 'نقض حریم خصوصی کاربران', frequency: Math.min(total, Math.round(total * 0.07)), selected: false },
      { id: 9, name: 'مشکل پیگیری کد رهگیری', frequency: Math.min(total, Math.round(total * 0.05)), selected: false },
    ];
  });

  // Candidate Actions Modal States
  const [mergeCandidateSource, setMergeCandidateSource] = useState<CandidateLabel | null>(null);
  const [isMergeCandidateModalOpen, setIsMergeCandidateModalOpen] = useState(false);

  // Label Actions Modal States
  const [mergeLabelSource, setMergeLabelSource] = useState<LabelItem | null>(null);
  const [isMergeLabelModalOpen, setIsMergeLabelModalOpen] = useState(false);

  // Edit / Add Label Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formDef, setFormDef] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formShortcut, setFormShortcut] = useState('۱');
  const [formColor, setFormColor] = useState('#24418F');

  // =========================================================================
  // FEW-SHOT PROMPTS SET A AND B (TRANSPARENT, FULLY EDITABLE & EXPLAINED)
  // =========================================================================
  const [activePromptSet, setActivePromptSet] = useState<'A' | 'B'>('A');

  const [promptSetA, setPromptSetA] = useState<FewShotPromptExample[]>([
    {
      id: 'a1',
      text: 'سه هفته است پرونده در دبیرخانه مانده و هیچ‌کس پاسخگو نیست. هر بار تماس می‌گیرم می‌گویند کارشناس در جلسه است.',
      labels: ['کندی پاسخ‌گویی'],
      rationale: 'متن صراحتاً به گذشت ۳ هفته زمان غیرمعمول بدون دریافت هیچ پاسخ اداری اشاره دارد.',
    },
    {
      id: 'a2',
      text: 'تعرفه صدور مجوز نسبت به سال گذشته دو برابر شده و هزینه اضافی بابت پوشه دریافت کردند بدون اینکه رسید بدهند.',
      labels: ['هزینه‌ی بالا'],
      rationale: 'اعتراض صریح به افزایش دو برابری مبلغ و دریافت کارمزد مازاد و غیرقانونی.',
    },
    {
      id: 'a3',
      text: 'وسط پرداخت اینترنتی کارمزد، سامانه ارور ۵۰۰ داد؛ پول از حساب کسر شد ولی وضعیت تیکت ناموفق ماند.',
      labels: ['مشکل فنی'],
      rationale: 'خطای کد ۵۰۰ سرور و ناموفق ماندن تراکنش آنلاین در درگاه پرداخت الکترونیک.',
    },
    {
      id: 'a4',
      text: 'کارمند باجه با لحن تندی گفت مدارک را از سایت بخوانید، در حالی که در پورتال هیچ توضیحی برای فرم شماره ۴ نبود.',
      labels: ['رفتار کارکنان', 'اطلاعات ناکافی'],
      rationale: 'دو دلیل همزمان: ۱. لحن غیرحرفه‌ای کارمند باجه ۲. عدم بارگذاری شرایط و مدارک در سایت.',
    },
    {
      id: 'a5',
      text: 'برای دریافت یک استعلام ساده ۷ امضا و تأییدیه از ۵ اداره مختلف خواستند و کارمند مربوطه نیز حضور نداشت.',
      labels: ['پیچیدگی فرایند', 'کندی پاسخ‌گویی'],
      rationale: 'بوروکراسی پیچیده و مراحل اضافه اداری همراه با معطلی شهروند.',
    },
  ]);

  const [promptSetB, setPromptSetB] = useState<FewShotPromptExample[]>([
    {
      id: 'b1',
      text: 'از صبح ساعت ۸ تو صف علاف شدیم آخرشم کارمند گفت سیستم قطعه فردا بیاین!',
      labels: ['کندی پاسخ‌گویی', 'مشکل فنی'],
      rationale: 'معطلی چند ساعته به دلیل قطعی سامانه و ارسال به روز بعد (لحن محاوره‌ای مردمی).',
    },
    {
      id: 'b2',
      text: 'هر دفعه میایم یه پول جدید طلب میکنن، مگه نرخ مصوب دولتی نداره این خدمات؟',
      labels: ['هزینه‌ی بالا'],
      rationale: 'نقد تغییر مکرر هزینه‌ها و عدم شفافیت تعرفه مصوب خدمت.',
    },
    {
      id: 'b3',
      text: 'اصلا معلوم نیست مدارک لازم چیه، هیشکی هم راهنمایی نمیکنه تو این اداره بزرگ.',
      labels: ['اطلاعات ناکافی'],
      rationale: 'فقدان تابلوی راهنما و نبود اطلاعات اولیه مورد نیاز متقاضیان.',
    },
    {
      id: 'b4',
      text: 'با اینکه مدارکم کامل بود پرونده رو رد کردن و گفتن مدارک پیوست گم شده است.',
      labels: ['کیفیت پایین'],
      rationale: 'نقص اجرایی فاحش در بایگانی سازمان و تضییع حق ارباب‌رجوع.',
    },
    {
      id: 'b5',
      text: 'تنها باجه رسیدگی افتاده ته یه زیرزمین بدون آسانسور، مادرم با ویلچر چطور باید بیاد؟',
      labels: ['دسترسی دشوار'],
      rationale: 'عدم مناسب‌سازی فضا و دسترسی فیزیکی برای معلولین و سالمندان.',
    },
  ]);

  // Edit / Add Few-Shot Example Modal
  const [isFewShotModalOpen, setIsFewShotModalOpen] = useState(false);
  const [editingFewShotId, setEditingFewShotId] = useState<string | null>(null);
  const [fewShotText, setFewShotText] = useState('');
  const [fewShotLabels, setFewShotLabels] = useState<string[]>([]);
  const [fewShotRationale, setFewShotRationale] = useState('');

  // Versioning state
  const [versions, setVersions] = useState([
    {
      id: 'v1.1',
      title: 'نسخه ۱.۱ (فعال کنونی)',
      desc: 'بهبود تعریف «کیفیت پایین» و انطباق کلیدهای میانبر با صفحه‌کلید فارسی',
      date: 'امروز',
      labelCount: labels.length,
      active: true,
    },
  ]);

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
      }, 450);
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

  // Populate taxonomy from selected candidate labels
  const handleApplyCandidates = () => {
    const selected = candidates.filter((c) => c.selected);
    const newLabels: LabelItem[] = selected.map((c, idx) => ({
      id: idx,
      name: c.name,
      definition: INITIAL_LABELS.find((l) => l.name === c.name)?.definition || `تعریف رسمی و ضوابط شمول برچسب ${c.name} در پرونده‌های سازمانی.`,
      example: INITIAL_LABELS.find((l) => l.name === c.name)?.example || `متن نمونه ثبت‌شده جهت ارزیابی برچسب ${c.name}.`,
      keyShortcut: String((idx + 1) % 9 || 9),
      color: INITIAL_LABELS.find((l) => l.name === c.name)?.color || (idx % 2 === 0 ? '#2563eb' : '#059669'),
    }));

    onLabelsChange(newLabels);
    alert(`${selected.length} برچسب با موفقیت توسط مدل زبانی کشف و به عنوان تاکسونومی رسمی پروژه ثبت شدند.`);
    onChangeTab('list');
  };

  // Label Edit/Add
  const handleOpenEdit = (lb: LabelItem) => {
    setEditingLabel(lb);
    setFormName(lb.name);
    setFormDef(lb.definition);
    setFormExample(lb.example);
    setFormShortcut(lb.keyShortcut);
    setFormColor(lb.color);
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingLabel(null);
    setFormName('');
    setFormDef('');
    setFormExample('');
    setFormShortcut(String(labels.length + 1));
    setFormColor('#3b82f6');
    setIsEditModalOpen(true);
  };

  const handleSaveLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingLabel) {
      onLabelsChange(
        labels.map((l) =>
          l.id === editingLabel.id
            ? {
                ...l,
                name: formName,
                definition: formDef,
                example: formExample,
                keyShortcut: formShortcut,
                color: formColor,
              }
            : l
        )
      );
    } else {
      const newLabel: LabelItem = {
        id: Date.now(),
        name: formName,
        definition: formDef,
        example: formExample,
        keyShortcut: formShortcut,
        color: formColor,
      };
      onLabelsChange([...labels, newLabel]);
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteLabel = (id: number, name: string) => {
    if (confirm(`آیا از حذف برچسب «${name}» از تاکسونومی اطمینان دارید؟`)) {
      onLabelsChange(labels.filter((l) => l.id !== id));
    }
  };

  // Few-Shot Prompt Modal Actions
  const handleOpenFewShotEdit = (ex: FewShotPromptExample) => {
    setEditingFewShotId(ex.id);
    setFewShotText(ex.text);
    setFewShotLabels(ex.labels);
    setFewShotRationale(ex.rationale);
    setIsFewShotModalOpen(true);
  };

  const handleOpenFewShotAdd = () => {
    setEditingFewShotId(null);
    setFewShotText('');
    setFewShotLabels(labels.length > 0 ? [labels[0].name] : ['کندی پاسخ‌گویی']);
    setFewShotRationale('');
    setIsFewShotModalOpen(true);
  };

  const handleSaveFewShot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fewShotText.trim()) return;

    const targetSet = activePromptSet === 'A' ? promptSetA : promptSetB;
    const setTargetSet = activePromptSet === 'A' ? setPromptSetA : setPromptSetB;

    if (editingFewShotId) {
      setTargetSet(
        targetSet.map((item) =>
          item.id === editingFewShotId
            ? { ...item, text: fewShotText, labels: fewShotLabels, rationale: fewShotRationale }
            : item
        )
      );
    } else {
      const newItem: FewShotPromptExample = {
        id: `fs_${Date.now()}`,
        text: fewShotText,
        labels: fewShotLabels,
        rationale: fewShotRationale,
      };
      setTargetSet([...targetSet, newItem]);
    }
    setIsFewShotModalOpen(false);
  };

  const handleDeleteFewShot = (id: string) => {
    if (confirm('آیا از حذف این نمونه راهنما از بسته پرامپت اطمینان دارید؟')) {
      if (activePromptSet === 'A') {
        setPromptSetA((prev) => prev.filter((item) => item.id !== id));
      } else {
        setPromptSetB((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const handleSynthesizeFewShots = () => {
    alert(
      'فرآیند نمونه‌گیری متوازن معنایی (Semantic Diversity Sampling) روی متون تمیزشده مرحله ۱ اجرا شد و ۵ نمونه طلایی جدید با پوشش حداکثری برچسب‌ها در بسته پرامپت جایگزین گردید.'
    );
  };

  const handleCreateSnapshot = () => {
    const nextVer = `v1.${versions.length + 1}`;
    const newVer = {
      id: nextVer,
      title: `نسخه ${nextVer} (ثبت دستی کارشناس)`,
      desc: `اسنپ‌شات تغییرناپذیر شامل ${labels.length} برچسب تاکسونومی کنونی`,
      date: 'هم‌اکنون',
      labelCount: labels.length,
      active: true,
    };
    setVersions((prev) => [newVer, ...prev.map((v) => ({ ...v, active: false }))]);
    alert(`نسخه جدید (${nextVer}) با موفقیت ایجاد و ثبت شد.`);
  };

  const currentPromptList = activePromptSet === 'A' ? promptSetA : promptSetB;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'extract', label: 'استخراج برچسب با مدل زبانی' },
          { id: 'list', label: `فهرست برچسب‌ها و تعاریف (${labels.length})` },
          { id: 'fewshot', label: 'نمونه‌های راهنما (Few-shot Prompts)' },
          { id: 'versions', label: 'تاریخچه نسخه‌ها' },
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
      {/* TAB 1: EXTRACT JOB */}
      {/* ======================================================== */}
      {activeTab === 'extract' && (
        <div className="space-y-6 max-w-3xl">
          {jobState === 'idle' && (
            <div className="bg-surface border border-line rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-line">
                  آماده اجرا
                </span>
                <h3 className="font-bold text-base text-ink">
                  استخراج هوشمند برچسب‌ها و دلایل تکرارشونده با مدل زبانی
                </h3>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed">
                مدل زبانی متن‌های پالایش‌شده مرحله ۱ را دسته‌دسته می‌خواند، دلایل صریح شکایت شهروندان را بیرون می‌کشد و سپس دلایل مشابه را در برچسب‌های متمرکز دسته‌بندی می‌کند تا تاکسونومی پروژه تشکیل شود.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink block">انتخاب مدل زبانی استخراج‌کننده برچسب:</label>
                  <select
                    value={selectedExtractionModel}
                    onChange={(e) => setSelectedExtractionModel(e.target.value)}
                    className="w-full px-3 py-2 border border-line-strong rounded-xl bg-surface text-xs font-medium text-ink focus:border-accent"
                  >
                    <option value="qwen2.5-14b-instruct">qwen2.5-14b-instruct (LM Studio محلی On-Premises)</option>
                    <option value="llama-3.1-8b-instruct">llama-3.1-8b-instruct (Ollama درگاه سازمانی)</option>
                    <option value="parsbert-base">parsbert-base (طبقه‌بند متنی هوفا)</option>
                    <option value="fabert">fabert (ترنسفورمر فارسی)</option>
                    <option value="gpt-4o-mini">gpt-4o-mini (درگاه ابری مجاز)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink block">جامعه آماری استخراج:</label>
                  <input
                    type="text"
                    disabled
                    value={`پوشش ${datasetCount.toLocaleString('fa-IR')} متن پالایش‌شده مرحله ۱`}
                    className="w-full px-3 py-2 border border-line rounded-xl bg-surface-2 text-xs font-mono text-muted"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink block">توضیح و دستور استخراج برچسب (System Prompt / Instruction):</label>
                <textarea
                  rows={2}
                  value={extractionInstruction}
                  onChange={(e) => setExtractionInstruction(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-xs text-ink focus:border-accent font-sans leading-relaxed"
                  placeholder="دستور استخراج دلایل و برچسب‌های پرتکرار از شکایات..."
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2/60 border border-line text-xs text-muted flex items-center justify-between">
                <span>وضعیت ورودی: <b>متن‌های تمیزشده آماده استخراج ({datasetCount.toLocaleString('fa-IR')} متن)</b></span>
                <span className="font-mono text-accent font-semibold">بسته‌های ۱۵تایی</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleStartJob(0)}
                  className="px-6 py-2.5 bg-accent text-on-accent text-xs font-bold rounded-xl hover:bg-accent-2 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>شروع استخراج برچسب با مدل زبانی</span>
                </button>
              </div>
            </div>
          )}

          {jobState === 'run' && (
            <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-ink">
                  مدل زبانی در حال پردازش دسته‌ای و استخراج دلایل شکایات...
                </h3>
                <span className="font-mono text-xs text-accent font-bold">بسته {jobProgress} از ۱۵</span>
              </div>
              <div className="h-2 rounded-full bg-track overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((jobProgress / 15) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted">
                خوشه‌بندی معنایی و شمارش تکرار دلایل در جریان است...
              </p>
            </div>
          )}

          {jobState === 'done' && (
            <div className="bg-surface border border-line rounded-2xl p-6 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-good" />
                  <h3 className="font-bold text-base text-ink">
                    ۸ برچسب پرتکرار پیشنهادی از متون کشف شد
                  </h3>
                </div>
                <button
                  onClick={() => handleStartJob(0)}
                  className="text-xs text-muted hover:text-ink border border-line px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  اجرای دوباره استخراج
                </button>
              </div>

              <p className="text-xs text-ink-2">
                برچسب‌های مد نظر خود را تیک بزنید؛ این برچسب‌ها وارد تاکسونومی رسمی پروژه شده و در مراحل بعدی فعال می‌شوند:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.map((cand) => (
                  <label
                    key={cand.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
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
                  className="px-5 py-2.5 bg-accent text-on-accent text-xs font-bold rounded-xl hover:bg-accent-2 transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>پذیرفتن برچسب‌های انتخاب‌شده و انتقال به تاکسونومی ({candidates.filter((c) => c.selected).length} برچسب)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LABELS TAXONOMY LIST (STRICT EMPTY STATE IF NOT EXTRACTED) */}
      {/* ======================================================== */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {labels.length === 0 ? (
            /* Clean Empty State as requested: No data before task executed! */
            <div className="bg-surface border border-line rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-surface-2 text-muted flex items-center justify-center mx-auto border border-line">
                <Tags className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink">تاکسونومی پروژه هنوز برچسبی ندارد</h3>
                <p className="text-xs text-muted leading-relaxed">
                  برچسب‌های موضوعی هنوز از داده‌های تمیزشده مرحله ۱ استخراج نشده‌اند. می‌توانید اجازه دهید مدل زبانی دلایل پرتکرار را استخراج کند، یا به صورت دستی برچسب اضافه کنید.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => onChangeTab('extract')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>رفتن به استخراج با مدل زبانی</span>
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  افزودن برچسب سفارشی به صورت دستی
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-base text-ink">
                    تاکسونومی رسمی برچسب‌های پروژه ({labels.length} برچسب فعال)
                  </h3>
                  <p className="text-xs text-muted">
                    برچسب‌های استخراج‌شده دارای تعریف دقیق، نمونه کاربردی، کلید میانبر کیبورد و دکمه‌های ویرایش و حذف هستند.
                  </p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-accent text-on-accent hover:bg-accent-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن برچسب جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {labels.map((lb) => (
                  <div
                    key={lb.id}
                    className="p-4 rounded-2xl border border-line bg-surface hover:border-line-strong transition-all space-y-3 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: lb.color }}
                        />
                        <h4 className="font-bold text-sm text-ink">{lb.name}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded-lg bg-surface-2 border border-line-strong text-xs font-mono font-bold text-accent">
                          کلید {lb.keyShortcut}
                        </kbd>

                        <button
                          onClick={() => handleOpenEdit(lb)}
                          className="p-1.5 rounded-lg border border-line text-muted hover:text-accent hover:bg-surface-2 transition-colors cursor-pointer"
                          title="ویرایش برچسب"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteLabel(lb.id, lb.name)}
                          className="p-1.5 rounded-lg border border-line text-muted hover:text-crit hover:bg-crit-soft transition-colors cursor-pointer"
                          title="حذف برچسب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-ink-2 leading-relaxed">
                      <span className="font-semibold text-ink">تعریف: </span>
                      {lb.definition}
                    </p>

                    <div className="p-2.5 rounded-xl bg-surface-2/70 border border-line text-[11px] text-muted leading-relaxed">
                      <span className="font-bold text-ink">مثال عینی: </span>
                      «{lb.example}»
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FEW-SHOT EXAMPLES (FULL TRANSPARENCY & EDITABILITY) */}
      {/* ======================================================== */}
      {activeTab === 'fewshot' && (
        <div className="bg-surface border border-line rounded-2xl p-6 max-w-4xl space-y-6">
          {/* Explanation Header */}
          <div className="space-y-2 border-b border-line pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold border border-accent/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>نحوه ساخت و منطق نمونه‌های راهنما (Few-Shot Prompt Engineering)</span>
            </div>
            <h3 className="font-bold text-base text-ink">
              مدیریت نمونه‌های آموزشی درون پرامپت مدل (In-Context Learning)
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              <b>این نمونه‌ها چگونه ساخته می‌شوند و چه نقشی دارند؟</b><br />
              هنگامی که مدل زبانی می‌خواهد متون ناشناخته را برچسب بزند، این جفت‌های «متن نمونه + برچسب‌های انتصابی + راهنمای استدلال» در ابتدای دستور سیستمی (System Prompt) قرار می‌گیرند تا مدل سبک استدلال و معیارهای داوری سازمان را بیاموزد.
              برای سنجش علمی پایداری و کاهش واریانس خروجی، دو بسته متفاوت (بسته A با لحن رسمی و بسته B با لحن محاوره‌ای) طراحی شده‌اند که می‌توانید هرکدام را به دلخواه ویرایش، حذف یا تکمیل فرمایید.
            </p>
          </div>

          {/* Prompt Set Selector & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-2 border border-line w-fit">
              <button
                onClick={() => setActivePromptSet('A')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePromptSet === 'A'
                    ? 'bg-accent text-on-accent shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                مجموعه پرامپت راهنمای A ({promptSetA.length} نمونه)
              </button>
              <button
                onClick={() => setActivePromptSet('B')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePromptSet === 'B'
                    ? 'bg-accent text-on-accent shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                مجموعه پرامپت راهنمای B ({promptSetB.length} نمونه)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSynthesizeFewShots}
                className="px-3.5 py-1.5 rounded-xl border border-line bg-surface text-ink text-xs font-semibold hover:bg-surface-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="استخراج متوازن نمونه‌ها از میان داده‌های تمیزشده"
              >
                <RefreshCw className="w-3.5 h-3.5 text-muted" />
                <span>استخراج خودکار از رکوردهای تمیز</span>
              </button>

              <button
                onClick={handleOpenFewShotAdd}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن نمونه راهنما</span>
              </button>
            </div>
          </div>

          {/* List of Concrete Few-Shot Demonstrations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>فهرست نمونه‌های فعال در {activePromptSet === 'A' ? 'مجموعه راهنمای A (لحن اداری)' : 'مجموعه راهنمای B (لحن محاوره‌ای)'}:</span>
              <span className="font-mono">{currentPromptList.length} نمونه تزریق‌شده در پرامپت</span>
            </div>

            {currentPromptList.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-line bg-surface hover:border-line-strong transition-all space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-2 border border-line text-accent">
                      نمونه آموزشی #{idx + 1}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {item.labels.map((lbl) => (
                        <span
                          key={lbl}
                          className="px-2 py-0.5 rounded-md bg-accent-soft text-accent text-[11px] font-bold"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenFewShotEdit(item)}
                      className="p-1.5 rounded-lg border border-line text-muted hover:text-accent hover:bg-surface-2 transition-colors cursor-pointer"
                      title="ویرایش این نمونه و راهنمای استدلال"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFewShot(item.id)}
                      className="p-1.5 rounded-lg border border-line text-muted hover:text-crit hover:bg-crit-soft transition-colors cursor-pointer"
                      title="حذف این نمونه از پرامپت"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-2/60 border border-line text-xs text-ink leading-relaxed font-normal">
                  «{item.text}»
                </div>

                <div className="text-[11px] text-muted flex items-start gap-1.5 bg-surface p-2 rounded-lg border border-line/60">
                  <span className="font-bold text-ink shrink-0">راهنمای استدلال به مدل (Reasoning):</span>
                  <span>{item.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: VERSIONS */}
      {/* ======================================================== */}
      {activeTab === 'versions' && (
        <div className="bg-surface border border-line rounded-2xl p-6 max-w-3xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 text-muted text-xs font-bold border border-line mb-1">
                <History className="w-3.5 h-3.5" />
                <span>کنترل نسخه تاکسونومی (Taxonomy Versioning)</span>
              </div>
              <h3 className="font-bold text-base text-ink">تاریخچه نسخه‌گذاری تاکسونومی</h3>
              <p className="text-xs text-muted">
                هر زمان برچسب‌ها تغییر کنند، یک نسخه اسنپ‌شات ذخیره می‌شود تا تکرارپذیری فرآیند تضمین شود.
              </p>
            </div>

            <button
              onClick={handleCreateSnapshot}
              className="px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ثبت نسخه جدید (Snapshot)</span>
            </button>
          </div>

          <div className="border border-line rounded-xl overflow-hidden divide-y divide-line text-xs bg-surface">
            {versions.map((v) => (
              <div key={v.id} className="p-4 flex items-center justify-between hover:bg-surface-2/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <b className="text-ink text-sm">{v.title}</b>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-line text-muted">
                      {v.labelCount} برچسب
                    </span>
                    <span className="text-[10px] text-muted">{v.date}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">{v.desc}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                    v.active ? 'bg-good-soft text-good border border-good/20' : 'bg-surface-2 text-muted'
                  }`}
                >
                  {v.active ? 'فعال کنونی' : 'بایگانی‌شده'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD LABEL MODAL */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-2/40">
              <h3 className="font-bold text-sm text-ink">
                {editingLabel ? `ویرایش برچسب: ${editingLabel.name}` : 'افزودن برچسب جدید به تاکسونومی'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLabel} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink block">نام برچسب:</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent"
                  placeholder="مثال: نقض قوانین صنفی"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">تعریف رسمی و معیار تطابق:</label>
                <textarea
                  rows={2}
                  value={formDef}
                  onChange={(e) => setFormDef(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent leading-relaxed"
                  placeholder="تشریح دقیق شرط تعلق این برچسب..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">مثال عینی کاربردی:</label>
                <textarea
                  rows={2}
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent leading-relaxed"
                  placeholder="یک نمونه جمله واقعی که این برچسب به آن تعلق می‌گیرد..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink block">کلید میانبر (کیبورد):</label>
                  <input
                    type="text"
                    value={formShortcut}
                    onChange={(e) => setFormShortcut(e.target.value)}
                    className="w-full p-2 border border-line-strong rounded-xl bg-surface text-ink text-xs text-center font-bold"
                    maxLength={2}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink block">رنگ شناساگر:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-9 h-9 border border-line rounded-lg cursor-pointer bg-transparent"
                    />
                    <span className="font-mono text-muted text-[11px]">{formColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-on-accent font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD FEW-SHOT EXAMPLE MODAL */}
      {/* ======================================================== */}
      {isFewShotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-2/40">
              <h3 className="font-bold text-sm text-ink">
                {editingFewShotId ? 'ویرایش نمونه راهنما (Few-Shot)' : `افزودن نمونه راهنما به مجموعه ${activePromptSet}`}
              </h3>
              <button
                onClick={() => setIsFewShotModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFewShot} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink block">متن نمونه ورودی شهروند:</label>
                <textarea
                  rows={3}
                  value={fewShotText}
                  onChange={(e) => setFewShotText(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent leading-relaxed"
                  placeholder="متن نمونه شکایت شهروندی که در پرامپت قرار می‌گیرد..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">برچسب‌های هدف انتصابی (با کاما جدا کنید):</label>
                <input
                  type="text"
                  value={fewShotLabels.join('، ')}
                  onChange={(e) =>
                    setFewShotLabels(
                      e.target.value
                        .split(/[،,]/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent"
                  placeholder="مثال: کندی پاسخ‌گویی، مشکل فنی"
                  required
                />
                <span className="text-[10px] text-muted block">
                  می‌توانید یک یا چند برچسب را تایپ کنید.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">راهنمای استدلال و دلیل انتصاب (Reasoning Rationale):</label>
                <textarea
                  rows={2}
                  value={fewShotRationale}
                  onChange={(e) => setFewShotRationale(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent leading-relaxed"
                  placeholder="توضیح دهید که مدل زبانی بر اساس چه عبارتی در متن باید این برچسب را انتخاب کند..."
                  required
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFewShotModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-on-accent font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs"
                >
                  ثبت در پرامپت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
