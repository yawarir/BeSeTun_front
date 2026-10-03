import React from 'react';
import {
  ShieldCheck,
  Cpu,
  UserCheck,
  Layers,
  Sparkles,
  ArrowLeft,
  Lock,
  CheckCircle2,
  FileSpreadsheet,
  Tags,
  Hash,
  Award,
  Sliders,
  Sun,
  Moon,
  ChevronDown,
  Terminal,
  Zap,
  Cloud,
  Server,
  Database,
  BrainCircuit,
  Boxes,
  Compass,
  Download,
  Share2,
  SlidersHorizontal,
  PlayCircle,
  Radio,
  Check,
} from 'lucide-react';
import { AppTheme } from '../types';
import { MAIN_STEPS } from '../mockData';
import { BisotunLogo } from './BisotunLogo';

interface LandingPageProps {
  onGoLogin: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

const STEP_ICONS: Record<string, React.ElementType> = {
  data: FileSpreadsheet,
  labels: Tags,
  model: Cpu,
  expert: UserCheck,
  keyword: Hash,
  results: Award,
};

// Five steps of Phase 2 based on user's exact specification
const PHASE_TWO_STEPS = [
  {
    stepNumber: 1,
    title: 'انتخاب مجموعه‌داده (دیتاست) طلایی و نهایی فاز اول',
    desc: 'اتصال بی‌واسطه به خروجی اعتبارسنجی‌شده فاز اول یا بارگذاری فایل‌های استاندارد JSONL آماده آموزش.',
    highlight: 'ورودی مستقیم فاز اول',
  },
  {
    stepNumber: 2,
    title: 'انتخاب مدل از فهرست مدل‌های محبوب یا بارگذاری مدل دلخواه',
    desc: 'انتخاب از مدل‌های برتر جهانی و زبان فارسی (مانند ParsBERT، Qwen2.5، Llama-3، Mistral) یا معرفی مدل سفارشی سازمان.',
    highlight: 'پشتیبانی از انواع LLM',
  },
  {
    stepNumber: 3,
    title: 'تنظیم پارامترهای آموزش و فاین‌تیونینگ (Hyperparameters)',
    desc: 'پیکربندی هوشمند نرخ یادگیری (Learning Rate)، تعداد دوره‌ها (Epochs) و بهینه‌سازهای حافظه برای مدل‌های طبقه‌بندی متنی (مانند ParsBERT و FaBERT).',
    highlight: 'تنظیم دقیق ParsBERT و FaBERT',
  },
  {
    stepNumber: 4,
    title: 'اجرای فاین‌تیون و بازبینی بلادرنگ نتایج و عملکرد',
    desc: 'پایش زنده نمودار تابع زیان (Loss)، سنجش سرعت همگرایی و ارزیابی خروجی مدل روی داده‌های آزمون اعتبارسنجی.',
    highlight: 'پایش بلادرنگ Loss',
  },
  {
    stepNumber: 5,
    title: 'خروجی مدل اختصاصی و در صورت نیاز هاست و ارائه API',
    desc: 'دریافت وزن‌های مدل فاین‌تیون‌شده (Safetensors / PyTorch) و امکان هاستینگ مستقیم درون سامانه با ارائه وب‌سرویس API امن.',
    highlight: 'مدل آماده + وب‌سرویس API',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoLogin,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-accent/20 relative" dir="rtl">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 px-6 py-4 border-b border-line/60 bg-surface/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Ancient Bisotun Cuneiform + Binary Logo (No English letter B) */}
            <BisotunLogo size={38} />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-xl text-ink tracking-tight">بیستون</span>
              <span className="text-xs text-muted font-bold hidden sm:inline border-r border-line pr-2.5">
                سکوی جامع ساخت دیتاست و فاین تیون مدل
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#phases"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              چرخه ۲ فازی
            </a>
            <a
              href="#phase-one-steps"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              مراحل فاز اول
            </a>
            <a
              href="#phase-two-steps"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              مراحل فاز دوم
            </a>
            <a
              href="#deployments"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              استقرار ایزوله و ابری
            </a>

            {/* Theme switcher */}
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-lg border border-line bg-surface flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
              aria-label="تغییر تم"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-ochre" /> : <Moon className="w-4 h-4 text-accent" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onGoLogin}
              className="px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>ورود به سامانه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Ancient Bisotun Cuneiform + Binary Fading Pattern in corners */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
        {/* Ancient Cuneiform and Binary Corner Watermarks (Opacity ~0.7 at corners, fading to 0 at center) */}
        {/* Top-Right Corner Watermark (Right-to-left layout corner) */}
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none select-none overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 100% 0%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 100% 0%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)',
          }}
        >
          <div className="p-4 text-accent/50 dark:text-accent/40 font-mono text-xs leading-relaxed space-y-2">
            {/* Authentic Old Persian Cuneiform Characters of Bisotun Inscription */}
            <div className="text-xl tracking-widest opacity-80">
              𐎠 𐎭 𐎶 𐎭 𐎠 𐎼 𐎹 𐎺 𐎢 𐏁
            </div>
            <div className="text-sm tracking-wider opacity-60">
              𐎧 𐏁 𐎠 𐎹 𐎰 𐎡 𐎹 𐎺 𐏀 𐎼 𐎣
            </div>
            <div className="text-[11px] font-mono opacity-70">
              01000010 01101001 01110011 01101111 01110100
            </div>
            <div className="text-lg tracking-widest opacity-75">
              𐎲 𐎥 𐎺 𐏀 𐎼 𐎣 𐎠 𐎢 𐎼 𐎶 𐏀 𐎭 𐎠
            </div>
            <div className="text-[11px] font-mono opacity-50">
              10110001 11001010 10100101 00110011 11110000
            </div>
          </div>
        </div>

        {/* Top-Left Corner Watermark */}
        <div
          className="absolute top-0 left-0 w-80 h-80 pointer-events-none select-none overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 0% 0%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 80%)',
          }}
        >
          <div className="p-4 text-accent/50 dark:text-accent/40 font-mono text-xs leading-relaxed space-y-2" dir="ltr">
            <div className="text-xl tracking-widest opacity-80">
              𐎠 𐎢 𐎼 𐎶 𐏀 𐎭 𐎠 𐎼 𐎧 𐏁 𐎠 𐎹
            </div>
            <div className="text-[11px] font-mono opacity-70">
              01100010 01100101 01110011 01100101 01110100
            </div>
            <div className="text-lg tracking-widest opacity-75">
              𐎭 𐎠 𐎼 𐎹 𐎺 𐎢 𐏁 𐎧 𐏁 𐎠 𐎹 𐎰 𐎡 𐎹
            </div>
            <div className="text-[11px] font-mono opacity-50">
              11001001 01010101 01110011 00011101 10101010
            </div>
          </div>
        </div>

        {/* Hero Content (Clear, crisp, unhindered by fading patterns) */}
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-bold border border-accent/20 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>چرخه کامل انتها به انتها: از متون خام سازمانی تا فاین‌تیون نهایی مدل دلخواه</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight tracking-tight">
            سکوی ساخت مجموعه‌داده‌های طلایی <br className="hidden sm:inline" />
            و <span className="text-accent underline decoration-accent/30 decoration-wavy">فاین‌تیون مدل‌های زبانی فارسی</span>
          </h1>

          <p className="text-sm md:text-base text-muted max-w-3xl mx-auto leading-relaxed">
            بیستون یک راهکار جامع دو فازی است؛ پوشش هم‌زمان <b>فاز اول (تولید و غنی‌سازی مجموعه‌داده استاندارد طلایی)</b> و بلافاصله <b>فاز دوم (آموزش و تنظیم دقیق مدل هوش مصنوعی دلخواه)</b>. قابل استقرار به‌صورت <b>کلون کامل در شبکه ایزوله سازمانی (On-Premises / Air-Gapped)</b> بدون نیاز به اینترنت، و همچنین ارائه به‌صورت <b>نسخه ابری آنلاین</b> با دسترسی به مدل‌های پیشرفته برای کلیه کاربردهای عمومی.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onGoLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-accent text-on-accent text-sm font-bold hover:bg-accent-2 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ورود به محیط سامانه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href="#phases"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-line text-ink text-sm font-semibold hover:bg-surface-2 transition-all flex items-center justify-center gap-2"
            >
              <span>مشاهده چرخه دو فازی بیستون</span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-base font-black text-accent">فاز اول</span>
              <span className="text-xs text-muted block">ساخت دیتاست طلایی</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-base font-black text-good">فاز دوم</span>
              <span className="text-xs text-muted block">فاین‌تیون مدل دلخواه</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-base font-black text-ink">کلون سازمانی</span>
              <span className="text-xs text-muted block">۱۰۰٪ آفلاین On-Premises</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-base font-black text-ochre">سرویس ابری</span>
              <span className="text-xs text-muted block">آنلاین با LLMهای جهانی</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE TWO PHASES OVERVIEW */}
      <section id="phases" className="py-16 px-6 border-t border-line/60 bg-surface-2/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              معماری یکپارچه سامانه
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              چرخه کامل: از داده خام تا مدل فاین‌تیون‌شده و وب‌سرویس اختصاصی
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              بیستون فاصله میان داده‌های سازمانی و یک مدل هوش مصنوعی اختصاصی و عملیاتی را در دو فاز پیوسته پر می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phase 1 Overview */}
            <div className="bg-surface border-2 border-line hover:border-accent/80 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-sm">
                    ۱
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent">فاز اول</span>
                    <h3 className="text-lg font-black text-ink">تولید و غنی‌سازی مجموعه‌داده طلایی</h3>
                  </div>
                </div>
                <Database className="w-6 h-6 text-accent opacity-80" />
              </div>

              <p className="text-xs text-muted leading-relaxed">
                ورود متن‌های خام پراکنده و پالایش آنها در ۶ مرحله استاندارد: گمنام‌سازی تضمین‌شده اطلاعات هویتی (PII)، طراحی تاکسونومی، برچسب‌زنی دوگانه مدل زبانی و داوری نهایی خبرگان انسانی با شاخص کاپای کوهن.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>تولید خودکار نمونه‌های راهنما (Few-Shot Prompts)</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>حل اختلاف هوشمند و داوری نهایی برچسب‌ها (Adjudication)</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>استخراج خروجی استاندارد اعتبارسنجی‌شده در قالب JSONL</span>
                </div>
              </div>

              <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                <span>دست‌آورد فاز اول:</span>
                <span className="font-mono text-accent font-bold">دیتاست طلایی آماده آموزش فاز دوم</span>
              </div>
            </div>

            {/* Phase 2 Overview */}
            <div className="bg-surface border-2 border-line hover:border-accent/80 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm transition-all relative overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-good text-white flex items-center justify-center font-bold text-sm">
                    ۲
                  </div>
                  <div>
                    <span className="text-xs font-bold text-good">فاز دوم</span>
                    <h3 className="text-lg font-black text-ink">تنظیم دقیق (Fine-Tuning) مدل دلخواه</h3>
                  </div>
                </div>
                <BrainCircuit className="w-6 h-6 text-good opacity-80" />
              </div>

              <p className="text-xs text-muted leading-relaxed">
                تغذیه مستقیم دیتاست طلایی فاز اول به مدل‌های طبقه‌بندی زبانی (مانند ParsBERT و FaBERT) جهت آموزش دسته‌بند متن، پایش زنده تابع زیان (Loss) و استخراج فایل وزن‌های نهایی مدل.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>انتخاب مدل پایه دلخواه یا بارگذاری فایل وزن‌های مدل سازمانی</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>پایش بلادرنگ تابع زیان (Loss)، نرخ همگرایی و خطای پیش‌بینی مدل</span>
                </div>
                <div className="flex items-center gap-2 text-ink">
                  <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                  <span>خروجی فایل Safetensors/PyTorch و امکان ارائه API هاست‌شده اختصاصی</span>
                </div>
              </div>

              <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                <span>دست‌آورد فاز دوم:</span>
                <span className="font-mono text-good font-bold">مدل فاین‌تیون‌شده سازمانی + وب‌سرویس API</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PHASE ONE 6-STEP PIPELINE */}
      <section id="phase-one-steps" className="py-16 px-6 border-t border-line/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              مراحل فاز اول
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              خط لوله ۶ مرحله‌ای تولید مجموعه‌داده طلایی در فاز اول
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              هر مرحله دارای قیف شفاف، قوانین پالایش قابل تنظیم و کنترل کیفیت سیستماتیک است.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAIN_STEPS.map((step) => {
              const Icon = STEP_ICONS[step.key] || Tags;
              return (
                <div
                  key={step.key}
                  className="bg-surface border border-line rounded-2xl p-5 space-y-3 shadow-xs hover:border-accent/60 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-mono font-bold text-xs">
                      ۰{step.stepNumber}
                    </span>
                    <Icon className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                  </div>

                  <h3 className="font-bold text-sm text-ink group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {step.detailedDesc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: PHASE TWO 5-STEP FINE-TUNING PIPELINE (USER REQUESTED EDIT 1) */}
      <section id="phase-two-steps" className="py-16 px-6 border-t border-line/60 bg-surface-2/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-good-soft text-good text-xs font-bold border border-good/20">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>مراحل فاز دوم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              مراحل پنج‌گانه فاین‌تیون مدل دلخواه در فاز دوم
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              جریان روان آموزش مدل بر پایه داده‌های طلایی فاز اول با بالاترین استانداردهای پردازش زبان طبیعی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PHASE_TWO_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-surface border border-line hover:border-good/60 rounded-2xl p-5 space-y-3 shadow-xs transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-good-soft text-good flex items-center justify-center font-mono font-bold text-xs">
                      ۰{step.stepNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-2 border border-line text-muted">
                      {step.highlight}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-ink group-hover:text-good transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-line/50 flex items-center justify-between text-[11px] text-muted">
                  <span>گام {step.stepNumber} از ۵</span>
                  <Check className="w-3.5 h-3.5 text-good" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: DUAL DEPLOYMENT OPTIONS (ISOLATED CLONE vs CLOUD ONLINE) */}
      <section id="deployments" className="py-16 px-6 border-t border-line/60">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              انعطاف در پیاده‌سازی و استقرار
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              دو شیوه استفاده متناسب با الزامات امنیتی شما
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              چه نیاز به یک دژ ایزوله بدون اینترنت داشته باشید و چه بخواهید بلافاصله آنلاین از مدل‌های ابری بهره ببرید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode A: On-Premises Isolated Clone */}
            <div className="bg-surface border border-line rounded-2xl p-6 md:p-8 space-y-5 shadow-xs relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-good-soft text-good text-xs font-bold border border-good/20">
                <ShieldCheck className="w-4 h-4" />
                <span>نسخه کلون سازمانی (Air-Gapped & On-Premises)</span>
              </div>

              <h3 className="text-xl font-bold text-ink">
                نصب کامل درون شبکه و سرورهای سازمان
              </h3>

              <p className="text-xs text-muted leading-relaxed">
                این نسخه به‌صورت یک بسته کامل در محیط دیتاسنتر داخلی سازمان یا نهادهای دولتی، بانکی و امنیتی کلون می‌شود. کل چرخه ساخت دیتاست و آموزش مدل روی سخت‌افزار داخلی و با درگاه‌های محلی (LM Studio، Ollama یا vLLM) اجرا شده و کلیه پردازش‌ها و فرآیندهای برچسب‌زنی و آموزش روی سرورهای داخلی سازمان اجرا می‌گردد.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">وضعیت اتصال اینترنت:</span>
                  <span className="font-bold text-crit">کاملاً مسدود و آفلاین (Isolated)</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">موتورهای استنتاج محلی:</span>
                  <span className="font-mono text-ink">LM Studio / Ollama / vLLM</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">جامعه هدف:</span>
                  <span className="font-bold text-ink">بانک‌ها، دستگاه‌های دولتی، بیمارستان‌ها و صنایع دفاعی</span>
                </div>
              </div>
            </div>

            {/* Mode B: Online Cloud Edition */}
            <div className="bg-surface border border-line rounded-2xl p-6 md:p-8 space-y-5 shadow-xs relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold border border-accent/20">
                <Cloud className="w-4 h-4" />
                <span>نسخه ابری آنلاین (SaaS / Cloud Edition)</span>
              </div>

              <h3 className="text-xl font-bold text-ink">
                دسترسی فوری از مرورگر با هوش مصنوعی ابری
              </h3>

              <p className="text-xs text-muted leading-relaxed">
                برای استارتاپ‌ها، تیم‌های تحقیقاتی، دانشگاه‌ها و کسب‌وکارهایی که ایزوله بودن داده‌ها مطرح نیست؛ نیازی به کلون کردن در شبکه سازمان یا داشتن سرورهای GPU اختصاصی وجود ندارد. کافیست به‌صورت آنلاین وارد سامانه شوید و با کمک برترین مدل‌های ابری جهان دیتاست دلخواه خود را بسازید و مدل خود را فاین‌تیون کنید.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">سرعت راه‌اندازی:</span>
                  <span className="font-bold text-good">فوری (Zero-Setup در مرورگر)</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">مدل‌های ابری پشتیبانی‌شده:</span>
                  <span className="font-mono text-ink">OpenAI / Anthropic / Google / DeepSeek</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
                  <span className="text-muted">جامعه هدف:</span>
                  <span className="font-bold text-ink">استارتاپ‌ها، شرکت‌های خصوصی، پژوهشگران و کاربردهای عمومی</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-6 border-t border-line/60 bg-gradient-to-b from-surface to-accent-soft/30 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-ink">
            آماده شروع چرخه کامل تولید دیتاست و فاین‌تیون مدل هستید؟
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            با کلیک روی دکمه زیر وارد صفحه ورود سامانه شوید و هر دو فاز را بررسی نمایید.
          </p>
          <div className="pt-2">
            <button
              onClick={onGoLogin}
              className="px-8 py-3.5 rounded-xl bg-accent text-on-accent text-sm font-bold hover:bg-accent-2 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>ورود به سامانه بیستون</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-line/60 bg-surface text-center text-xs text-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BisotunLogo size={24} />
            <span className="font-bold text-ink">سامانه بیستون</span>
            <span className="text-muted">— سکوی جامع ساخت دیتاست و فاین تیون مدل</span>
          </div>
          <button
            onClick={onGoLogin}
            className="text-accent hover:underline font-bold cursor-pointer"
          >
            ورود به سامانه
          </button>
        </div>
      </footer>
    </div>
  );
};
