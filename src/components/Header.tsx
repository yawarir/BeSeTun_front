import React from 'react';
import {
  ShieldCheck,
  Moon,
  Sun,
  Keyboard,
  HelpCircle,
  User,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  UserCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { UserRole, AppTheme } from '../types';
import { BisotunLogo } from './BisotunLogo';

interface HeaderProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  role: UserRole;
  onChangeRole: (newRole: UserRole) => void;
  projectName: string;
  isIsolated: boolean;
  onOpenShortcuts: () => void;
  guideActive: boolean;
  onToggleGuide: () => void;
  onNavigate: (step: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  role,
  onChangeRole,
  projectName,
  isIsolated,
  onOpenShortcuts,
  guideActive,
  onToggleGuide,
  onNavigate,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line px-4 lg:px-6 h-16 flex items-center justify-between gap-4 shadow-2xs">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => onNavigate('dash')}
          className="flex items-center gap-3 text-right focus-visible:outline-hidden group cursor-pointer"
          title="بازگشت به پیشخوان مهندسی بیستون"
        >
          <BisotunLogo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-ink">بیستون</span>
              <span className="text-xs text-muted font-bold hidden sm:inline border-r border-line pr-2">
                سکوی جامع ساخت دیتاست و فاین تیون مدل
              </span>
            </div>
            <span className="text-[11px] text-muted leading-none hidden md:block">چرخه ۲ فازی ساخت دیتاست طلایی و فاین‌تیون</span>
          </div>
        </button>

        <div className="h-6 w-px bg-line hidden sm:block" />

        {/* Project Selector Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-xs">
          <span className="text-muted">پروژه:</span>
          <span className="font-semibold text-ink truncate max-w-[180px]">{projectName}</span>
        </div>
      </div>

      {/* Center Actions: Role Switcher for seamless UX testing */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-lg bg-surface-2 border border-line">
          <button
            onClick={() => onChangeRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'admin'
                ? 'bg-surface text-accent shadow-xs'
                : 'text-ink-2 hover:text-ink'
            }`}
            title="نمای سرپرست / مهندس داده با دسترسی کامل به کل چرخه ۶ مرحله‌ای"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>مدیر پروژه</span>
          </button>
          <button
            onClick={() => onChangeRole('operator')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'operator'
                ? 'bg-surface text-accent shadow-xs'
                : 'text-ink-2 hover:text-ink'
            }`}
            title="نمای متمرکز برچسب‌زن / اوپراتور داده با رابط کاربری روان و بهینه"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>اوپراتور داده</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Security Badge, Guide, Shortcuts, Theme, User */}
      <div className="flex items-center gap-2">
        {/* Isolation Badge */}
        {isIsolated && (
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-good-soft text-good border border-good/30"
            title="حالت داده‌های ایزوله: هیچ متنی به سرویس‌دهنده‌های بیرونی ارسال نمی‌شود"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ایزوله سازمانی</span>
          </div>
        )}

        {/* Operator Smart Guide Button */}
        <button
          onClick={onToggleGuide}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
            guideActive
              ? 'bg-accent text-on-accent border-accent'
              : 'bg-surface-2 text-ink-2 border-line hover:text-ink'
          }`}
          title="راهنمای مرحله‌به‌مرحله برای اوپراتور"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">راهنمای گام‌به‌گام</span>
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={onOpenShortcuts}
          className="w-9 h-9 rounded-lg border border-line bg-surface flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          title="مشاهده کلیدهای میانبر کیبورد"
          aria-label="کلیدهای میانبر"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-lg border border-line bg-surface flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
          title={theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
          aria-label="تغییر حالت تم"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-ochre" /> : <Moon className="w-4 h-4 text-accent" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg border border-line hover:bg-surface-2 transition-colors text-right"
          >
            <div className="w-7 h-7 rounded-full bg-accent-soft text-accent font-bold text-xs flex items-center justify-center">
              {role === 'admin' ? 'م' : 'ک'}
            </div>
            <span className="text-xs font-semibold text-ink hidden md:inline">
              {role === 'admin' ? 'مدیر ارشد داده' : 'کارشناس ۱'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted" />
          </button>

          {userMenuOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-surface border border-line shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="p-2 border-b border-line mb-1">
                <p className="text-xs font-bold text-ink">
                  {role === 'admin' ? 'حساب کاربری سرپرست' : 'حساب کاربری کارشناس برچسب‌زن'}
                </p>
                <p className="text-[11px] text-muted font-mono" dir="ltr">
                  {role === 'admin' ? 'admin@besetun.local' : 'annotator1@besetun.local'}
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors text-right"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>تنظیمات و زیرساخت مدل‌ها</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('dash');
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors text-right"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>مرور کلی ویزارد</span>
              </button>

              <div className="h-px bg-line my-1" />

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-crit hover:bg-crit-soft transition-colors text-right cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از نشست و بازگشت به لاگین</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
