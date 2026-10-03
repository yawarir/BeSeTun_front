import React, { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Users,
  FolderKanban,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_PROVIDERS } from '../../mockData';
import { ModelProvider } from '../../types';

interface SettingsStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isIsolated: boolean;
  onToggleIsolated: (val: boolean) => void;
  providers: ModelProvider[];
  onToggleProvider: (id: string) => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({
  activeTab,
  onChangeTab,
  isIsolated,
  onToggleIsolated,
  providers,
  onToggleProvider,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);

  const testProvider = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      alert('اتصال با موفقیت برقرار شد و پاسخ استاندارد مدل دریافت گردید (Latency: 45ms).');
    }, 600);
  };

  const hasExternalEnabled = providers.some((p) => p.active && p.isExternal);

  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2 border-b border-line overflow-x-auto pb-px">
        {[
          { id: 'mode', label: 'حالت حریم خصوصی و امنیت' },
          { id: 'providers', label: 'اتصال به سرویس‌دهنده‌های مدل' },
          { id: 'projects', label: 'پروژه‌ها و پوشه‌های ذخیره‌سازی' },
          { id: 'users', label: 'کاربران و کارشناسان برچسب‌زن' },
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

      {/* TAB 1: OPERATING MODE */}
      {activeTab === 'mode' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-ink mb-1">
              حالت عملیاتی برنامه و حاکمیت داده (Data Governance)
            </h3>
            <p className="text-xs text-muted">
              تعیین سطح دسترسی داده‌های سازمانی به شبکه‌های داخلی یا خارجی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => onToggleIsolated(true)}
              className={`p-5 rounded-xl border text-right transition-all cursor-pointer ${
                isIsolated
                  ? 'bg-accent-soft border-accent shadow-xs'
                  : 'bg-surface border-line hover:border-line-strong'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-ink flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span>حالت ایزوله (کاملاً آفلاین و امن)</span>
                </span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isIsolated ? 'border-accent' : 'border-muted'
                  }`}
                >
                  {isIsolated && <span className="w-2 h-2 rounded-full bg-accent" />}
                </span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed mb-2">
                هیچ متنی از شبکه داخلی یا رایانه سازمان بیرون نمی‌رود. استنتاج صرفاً از طریق سرورهای محلی LM Studio یا Ollama انجام می‌شود.
              </p>
              <span className="text-[11px] text-good font-semibold">
                مناسب داده‌های محرمانه، شکایات سازمانی و اسناد بانکی
              </span>
            </button>

            <button
              onClick={() => onToggleIsolated(false)}
              className={`p-5 rounded-xl border text-right transition-all cursor-pointer ${
                !isIsolated
                  ? 'bg-accent-soft border-accent shadow-xs'
                  : 'bg-surface border-line hover:border-line-strong'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-ink flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  <span>حالت آزاد (اتصال به کلود مجاز)</span>
                </span>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !isIsolated ? 'border-accent' : 'border-muted'
                  }`}
                >
                  {!isIsolated && <span className="w-2 h-2 rounded-full bg-accent" />}
                </span>
              </div>
              <p className="text-xs text-ink-2 leading-relaxed mb-2">
                ارسال به APIهای ابری مانند OpenRouter، OpenAI یا Claude امکان‌پذیر است.
              </p>
              <span className="text-[11px] text-muted">
                فقط برای متون عمومی و داده‌هایی که منع قانونی ندارند
              </span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink">سرویس‌دهنده‌های استنتاج مدل (Inference Gateways)</h3>
              <p className="text-xs text-muted">
                پیکربندی سرورهای LM Studio محلی، Ollama و رابط‌های سازمانی
              </p>
            </div>
            <button
              onClick={() => alert('افزودن درگاه مدل جدید (مانند vLLM محلی)')}
              className="px-3.5 py-1.5 rounded-lg border border-line-strong text-xs font-semibold text-ink hover:bg-surface-2"
            >
              افزودن سرویس‌دهنده
            </button>
          </div>

          {isIsolated && hasExternalEnabled && (
            <div className="p-3.5 rounded-xl bg-ochre-soft text-ochre border border-ochre/30 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <b>هشدار نشت اطلاعات:</b> برنامه در حالت «ایزوله» تنظیم شده اما سرویس‌دهنده ابری OpenRouter فعال است. متونی که به این درگاه فرستاده شوند از شبکه سازمان خارج خواهند شد.
              </div>
            </div>
          )}

          <div className="border border-line rounded-xl overflow-hidden divide-y divide-line bg-surface">
            {providers.map((prov) => (
              <div
                key={prov.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-sm">{prov.name}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-muted font-mono text-[10px]">
                      {prov.type}
                    </span>
                    {prov.isExternal && (
                      <span className="px-2 py-0.5 rounded bg-ochre-soft text-ochre font-bold text-[10px]">
                        بیرون از شبکه
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-muted block text-[11px]" dir="ltr">
                    {prov.url}
                  </span>
                  <div className="flex gap-1.5 pt-1">
                    {prov.models.map((m) => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-surface-2 font-mono text-[10px] text-ink-2">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => testProvider(prov.id)}
                    disabled={testingId === prov.id}
                    className="px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2 text-ink-2 hover:text-ink font-medium"
                  >
                    {testingId === prov.id ? 'آزمایش اتصال...' : 'آزمایش اتصال'}
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prov.active}
                      onChange={() => onToggleProvider(prov.id)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <span className="font-semibold text-ink">فعال</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-ink flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-accent" />
            <span>پروژه‌های ثبت‌شده در سامانه</span>
          </h3>

          <div className="p-4 rounded-lg bg-surface-2 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-ink">شکایت‌های شهروندی ۱۴۰۳ (پروژه فعال)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-good-soft text-good font-bold">
                فعال
              </span>
            </div>
            <p className="text-[11px] text-muted">
              مسیر ذخیره‌سازی داده‌های پاک، برچسب‌ها و خروجی نهایی:
            </p>
            <code className="font-mono text-xs block text-ink bg-surface p-2 rounded border border-line" dir="ltr">
              D:/Data/Besetun_projects/complaints_1403/
            </code>
          </div>
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span>حساب‌های کاربری و دسترسی‌ها</span>
          </h3>

          <div className="border border-line rounded-lg overflow-hidden divide-y divide-line text-xs">
            <div className="p-3 bg-surface-2 flex items-center justify-between">
              <div>
                <b className="text-ink">مدیر ارشد پروژه (admin)</b>
                <span className="text-muted block text-[11px]">دسترسی کامل به تمامی مراحل و تنظیمات</span>
              </div>
              <button
                onClick={() => alert('رمز عبور مدیر تازه شد: besetun-admin-secure')}
                className="text-xs text-accent hover:underline font-semibold"
              >
                تغییر رمز
              </button>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <b className="text-ink">کارشناس ۱ (expert1)</b>
                <span className="text-muted block text-[11px]">مهندس حسینی — دسترسی به میزکار برچسب‌زنی</span>
              </div>
              <span className="text-good font-semibold">فعال</span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <b className="text-ink">کارشناس ۲ (expert2)</b>
                <span className="text-muted block text-[11px]">دکتر مرادی — دسترسی به میزکار برچسب‌زنی</span>
              </div>
              <span className="text-good font-semibold">فعال</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
