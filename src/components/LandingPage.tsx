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
} from 'lucide-react';
import { AppTheme } from '../types';
import { MAIN_STEPS } from '../mockData';

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

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoLogin,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-accent/20" dir="rtl">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 px-6 py-4 border-b border-line/60 bg-surface/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-sm shadow-[0_0_14px_rgba(30,58,138,0.35)]">
              <span className="font-mono text-base tracking-tighter">B</span>
            </div>
            <div>
              <span className="font-black text-lg text-ink tracking-tight">بیستون</span>
              <span className="text-[10px] text-muted mr-2 font-mono hidden sm:inline">
                سکوی تولید دیتاست طلایی
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#pipeline"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              خط لوله ۶ مرحله‌ای
            </a>
            <a
              href="#security"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              امنیت و ایزولاسیون
            </a>
            <a
              href="#roles"
              className="text-xs font-semibold text-ink-2 hover:text-ink px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors hidden md:inline-block"
            >
              نقش‌های کاربری
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

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold border border-accent/20 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>استاندارد ملی غنی‌سازی مجموعه‌داده برای فاین‌تیون مدل‌های زبانی فارسی</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight tracking-tight">
            خط تولید علمی و هدایت‌شده برای ساخت <br className="hidden sm:inline" />
            <span className="text-accent underline decoration-accent/30 decoration-wavy">
              مجموعه‌داده‌های طلایی هوش مصنوعی
            </span>
          </h1>

          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            از پاک‌سازی متون خام و گمنام‌سازی خودکار تا برچسب‌زنی دوگانه مدل‌های زبانی محلی،
            داوری کارشناسان انسانی و استخراج بسته‌های نهایی سازگار با HuggingFace و vLLM.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-accent text-on-accent text-sm font-bold hover:bg-accent-2 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ورود به محیط سامانه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href="#pipeline"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-line text-ink text-sm font-semibold hover:bg-surface-2 transition-all flex items-center justify-center gap-2"
            >
              <span>بررسی مراحل ۶گانه خط تولید</span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-xl font-black font-mono text-accent">۱۰۰٪</span>
              <span className="text-xs text-muted block">پردازش محلی و ایزوله</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-xl font-black font-mono text-good">۶ گام</span>
              <span className="text-xs text-muted block">اعتبارسنجی سیستماتیک</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-xl font-black font-mono text-ink">دوگانه A/B</span>
              <span className="text-xs text-muted block">استنتاج مدل زبانی محلی</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line text-center space-y-0.5">
              <span className="text-xl font-black font-mono text-ochre">κ توافق</span>
              <span className="text-xs text-muted block">شاخص کوهن کاپا داوران</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Pipeline Architecture Section */}
      <section id="pipeline" className="py-16 px-6 border-t border-line/60 bg-surface-2/40">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              گردش‌کار علمی و صنعتی
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              خط لوله ۶ مرحله‌ای تولید مجموعه‌داده بیستون
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              هر مرحله دارای قیف پالایش، اعتبارسنجی و قوانین کنترل کیفیت تکرارپذیر است.
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

      {/* Security & Isolation Section */}
      <section id="security" className="py-16 px-6 border-t border-line/60">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-good-soft text-good text-xs font-bold border border-good/20">
              <ShieldCheck className="w-4 h-4" />
              <span>ایمنی حداکثری و محرمانگی داده‌ها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              طراحی‌شده برای سازمان‌ها: بدون خروج حتی یک بایت داده
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              سامانه بیستون به‌طور کامل بر پایه درگاه‌های استنتاج محلی (مانند LM Studio، Ollama یا سرورهای vLLM داخل سازمان) عمل می‌کند. فرآیند ماسک‌سازی خودکار و تشخیص اطلاعات هویتی (PII) از نشت اطلاعات شهروندان و پرسنل جلوگیری می‌کند.
            </p>
            <ul className="space-y-2 text-xs text-ink-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                <span>عدم نیاز به اینترنت و ارتباط کاملاً آفلاین On-Premises</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                <span>الگوریتم‌های گمنام‌سازی کد ملی، شماره تلفن، اسامی و آدرس‌ها</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-good shrink-0" />
                <span>ثبت لاگ کامل ممیزی و بازبینی توسط داوران مستقل</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-6 shadow-md space-y-3 font-mono text-xs" dir="ltr">
            <div className="flex items-center justify-between pb-2 border-b border-line text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-crit" />
                <span className="w-2.5 h-2.5 rounded-full bg-ochre" />
                <span className="w-2.5 h-2.5 rounded-full bg-good" />
              </div>
              <span className="text-[11px]">besetun-offline-audit.sh</span>
            </div>
            <div className="text-muted leading-relaxed space-y-1">
              <p><span className="text-good">$</span> besetun check-isolation --strict</p>
              <p className="text-ink">[✓] Outbound network: BLOCKED (Isolated)</p>
              <p className="text-ink">[✓] Local Engine: Qwen2.5-14B (http://127.0.0.1:1234/v1)</p>
              <p className="text-ink">[✓] De-identification Rules: ACTIVE (9 Regex Patterns)</p>
              <p className="text-ink">[✓] Reproducibility Seed: 1404 (LOCKED)</p>
              <p className="text-good font-bold">[READY] All texts stay on premises safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Experience */}
      <section id="roles" className="py-16 px-6 border-t border-line/60 bg-surface-2/40">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              تجربه کاربری تفکیک‌شده برای نقش‌های سازمانی
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              هر کاربر فقط به ابزارهای موردنیاز نقش خود دسترسی دارد تا بهره‌وری به حداکثر برسد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-line rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink">نمای سرپرست و مهندس داده (Admin)</h3>
              <p className="text-xs text-muted leading-relaxed">
                مدیریت کامل جریان ۶ مرحله‌ای، بررسی وضعیت سرورهای محلی، مدیریت تاکسونومی برچسب‌ها، تحلیل آماری داوری‌ها و استخراج بسته‌های نهایی فاین‌تیون.
              </p>
            </div>

            <div className="bg-surface border border-line rounded-2xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-good-soft text-good flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ink">نمای اوپراتور برچسب‌زن (Annotator)</h3>
              <p className="text-xs text-muted leading-relaxed">
                محیط متمرکز و بدون حواس‌پرتی، طراحی ارگونومیک با کلیدهای میانبر سریع صفحه‌کلید (۱ تا ۸، N، P)، حالت‌های برچسب‌زنی کور و بازبینی خروجی مدل.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 px-6 border-t border-line/60 bg-gradient-to-b from-surface to-accent-soft/30 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-ink">
            آماده تولید مجموعه‌داده طلایی هستید؟
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            وارد سامانه شوید و خط لوله پردازش متون را با نمونه داده‌های آماده شروع کنید.
          </p>
          <div className="pt-2">
            <button
              onClick={onGoLogin}
              className="px-6 py-3 rounded-xl bg-accent text-on-accent text-xs sm:text-sm font-bold hover:bg-accent-2 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
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
          <span>سامانه بیستون — نسخه ۲.۴ سازمانی پردازش زبان طبیعی فارسی</span>
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
