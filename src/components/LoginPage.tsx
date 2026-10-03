import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  SlidersHorizontal,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { AppTheme, UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onGoLanding: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onGoLanding,
  theme,
  onToggleTheme,
}) => {
  const [username, setUsername] = useState('admin@besetun.gov.ir');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between selection:bg-accent/20" dir="rtl">
      {/* Top minimal bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-line/60 bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(30,58,138,0.35)]">
            <span className="font-mono text-base tracking-tighter">B</span>
          </div>
          <div>
            <span className="font-black text-base text-ink tracking-tight">بیستون</span>
            <span className="text-[10px] text-muted mr-2 font-mono">v2.4 Enterprise</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Link to Landing Page */}
          <button
            onClick={onGoLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-2 hover:text-accent hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span>معرفی سامانه (لندینگ)</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg border border-line bg-surface flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
            aria-label="تغییر تم"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-ochre" /> : <Moon className="w-4 h-4 text-accent" />}
          </button>
        </div>
      </header>

      {/* Main Login Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-surface border border-line rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-ink">ورود به سامانه بیستون</h1>
            <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
              سکوی تولید و اعتبارسنجی مجموعه‌داده‌های طلایی پردازش زبان طبیعی و فاین‌تیون
            </p>
          </div>

          {/* Quick Demo Role Selector Cards (High UX Convenience) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted block">انتخاب سریع نقش کاربری جهت ورود:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setUsername('admin@besetun.gov.ir');
                }}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-accent-soft/80 border-accent text-accent shadow-xs ring-1 ring-accent'
                    : 'bg-surface-2/60 border-line text-ink-2 hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">مدیر پروژه</span>
                </div>
                <span className="text-[10px] text-muted block leading-tight">
                  دسترسی کامل به خط لوله ۶ مرحله‌ای و تنظیمات
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('operator');
                  setUsername('annotator1@besetun.gov.ir');
                }}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  selectedRole === 'operator'
                    ? 'bg-accent-soft/80 border-accent text-accent shadow-xs ring-1 ring-accent'
                    : 'bg-surface-2/60 border-line text-ink-2 hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">اوپراتور داده</span>
                </div>
                <span className="text-[10px] text-muted block leading-tight">
                  میزکار خلوت برچسب‌زنی مرجع و بازبینی
                </span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink block">ایمیل سازمانی / شناسه کاربری</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-line-strong bg-surface text-ink text-xs focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
                  dir="ltr"
                  required
                />
                <Mail className="w-4 h-4 text-muted absolute right-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-ink block">کلمه عبور</label>
                <span className="text-[11px] text-muted font-mono">پیش‌فرض تست</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-line-strong bg-surface text-ink text-xs focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
                  dir="ltr"
                  required
                />
                <Lock className="w-4 h-4 text-muted absolute right-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-muted hover:text-ink cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Direct Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>ورود به داشبورد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-2 border-t border-line text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-good font-medium bg-good-soft px-3 py-1 rounded-full border border-good/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>محیط ایزوله سازمانی: ارتباطات درون‌شبکه‌ای امن</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-muted border-t border-line/60 bg-surface/30">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2">
          <span>سامانه بیستون — سکوی پردازش و تولید دیتاست طلایی مدل‌های زبانی فارسی</span>
          <button
            onClick={onGoLanding}
            className="text-accent hover:underline font-semibold cursor-pointer"
          >
            مشاهده صفحه معرفی و مستندات
          </button>
        </div>
      </footer>
    </div>
  );
};
