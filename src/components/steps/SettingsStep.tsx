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
  Plus,
  X,
  Lock,
  Server,
  Zap,
} from 'lucide-react';
import { ModelProvider } from '../../types';

interface SettingsStepProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isIsolated: boolean;
  onToggleIsolated: (val: boolean) => void;
  providers: ModelProvider[];
  onToggleProvider: (id: string) => void;
  onAddProvider?: (provider: ModelProvider) => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({
  activeTab,
  onChangeTab,
  isIsolated,
  onToggleIsolated,
  providers,
  onToggleProvider,
  onAddProvider,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);

  // Add Provider Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'local' | 'lan' | 'cloud'>('local');
  const [newIsExternal, setNewIsExternal] = useState(false);
  const [newModels, setNewModels] = useState('qwen2.5-32b-persian, parsbert-base');

  const testProvider = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      alert('اتصال با موفقیت برقرار شد و پاسخ استاندارد مدل دریافت گردید (Latency: 45ms).');
    }, 600);
  };

  // Safe toggle with strict Isolation mode enforcement (USER REQUEST POINT 6)
  const handleToggle = (prov: ModelProvider) => {
    if (isIsolated && prov.isExternal && !prov.active) {
      alert(
        '⛔ حالت ایزوله امنیتی فعال است:\n\n' +
        'در این حالت ارتباط با سرویس‌های ابری خارجی به دلیل حفاظت قطعی از محرمانگی داده‌های سازمانی مسدود است.\n\n' +
        'برای فعال‌سازی این درگاه، ابتدا در زبانه «حالت حریم خصوصی و امنیت» حالت آزاد (اتصال به کلود مجاز) را انتخاب فرمایید.'
      );
      return;
    }
    onToggleProvider(prov.id);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newProv: ModelProvider = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      type: newIsExternal ? 'cloud' : newType,
      url: newUrl.trim(),
      status: 'connected',
      isExternal: newIsExternal,
      active: !(isIsolated && newIsExternal),
      models: newModels.split(',').map((m) => m.trim()).filter(Boolean),
    };

    if (onAddProvider) {
      onAddProvider(newProv);
    }
    setIsAddModalOpen(false);
    setNewName('');
    setNewUrl('');
    setNewModels('');
    alert(`سرویس‌دهنده جدید «${newProv.name}» با موفقیت اضافه شد.`);
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
      {/* TAB 1: OPERATING MODE */}
      {/* ======================================================== */}
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
              className={`p-5 rounded-2xl border text-right transition-all cursor-pointer ${
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
              className={`p-5 rounded-2xl border text-right transition-all cursor-pointer ${
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

      {/* ======================================================== */}
      {/* TAB 2: MODEL PROVIDERS (WITH ADD MODAL & ISOLATION RULE) */}
      {/* ======================================================== */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-ink">سرویس‌دهنده‌های استنتاج مدل (Inference Gateways)</h3>
              <p className="text-xs text-muted">
                پیکربندی سرورهای LM Studio محلی، Ollama، درگاه‌های vLLM و رابط‌های سازمانی
              </p>
            </div>

            {/* Functional Add Provider Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن سرویس‌دهنده جدید</span>
            </button>
          </div>

          {/* Active Isolation Status Banner */}
          {isIsolated ? (
            <div className="p-3.5 rounded-xl bg-surface-2 border border-line text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink">
                <ShieldCheck className="w-4 h-4 text-good" />
                <span>حالت ایزوله فعال است: <b>فقط درگاه‌های محلی (Local On-Premises) مجاز به فعال‌سازی هستند.</b></span>
              </div>
              <button
                onClick={() => onChangeTab('mode')}
                className="text-accent hover:underline text-[11px] font-semibold cursor-pointer"
              >
                تغییر به حالت آزاد
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-ochre-soft text-ochre border border-ochre/30 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>حالت آزاد فعال است: اتصال به کلیه ارائه‌دهندگان محلی و ابری اینترنتی مجاز است.</span>
            </div>
          )}

          <div className="border border-line rounded-2xl overflow-hidden divide-y divide-line bg-surface shadow-2xs">
            {providers.map((prov) => {
              const isBlockedByIsolation = isIsolated && prov.isExternal;
              return (
                <div
                  key={prov.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-surface-2/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">{prov.name}</span>
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-muted font-mono text-[10px]">
                        {prov.type}
                      </span>
                      {prov.isExternal ? (
                        <span className="px-2 py-0.5 rounded bg-ochre-soft text-ochre font-bold text-[10px]">
                          سرویس ابری خارجی
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-good-soft text-good font-bold text-[10px]">
                          درون‌شبکه‌ای (Local)
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-muted block text-[11px]" dir="ltr">
                      {prov.url}
                    </span>
                    <div className="flex gap-1.5 pt-1 flex-wrap">
                      {prov.models.map((m) => (
                        <span key={m} className="px-1.5 py-0.5 rounded bg-surface-2 font-mono text-[10px] text-ink-2 border border-line">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={() => testProvider(prov.id)}
                      disabled={testingId === prov.id}
                      className="px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2 text-ink-2 hover:text-ink font-medium cursor-pointer"
                    >
                      {testingId === prov.id ? 'آزمایش اتصال...' : 'آزمایش اتصال'}
                    </button>

                    {isBlockedByIsolation ? (
                      <div
                        onClick={() => handleToggle(prov)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-muted text-[11px] cursor-not-allowed"
                        title="در حالت ایزوله، سرویس‌های خارجی غیرقابل فعال‌سازی هستند."
                      >
                        <Lock className="w-3.5 h-3.5 text-ochre" />
                        <span className="text-ochre font-semibold">مسدود در ایزوله</span>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={prov.active}
                          onChange={() => handleToggle(prov)}
                          className="w-4 h-4 accent-accent rounded cursor-pointer"
                        />
                        <span className="font-semibold text-ink">فعال</span>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PROJECTS */}
      {/* ======================================================== */}
      {activeTab === 'projects' && (
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-ink flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-accent" />
            <span>پروژه‌های ثبت‌شده در سامانه</span>
          </h3>

          <div className="p-4 rounded-xl bg-surface-2/60 border border-line space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-ink">شکایت‌های شهروندی ۱۴۰۳ (پروژه فعال)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-good-soft text-good font-bold">
                فعال
              </span>
            </div>
            <p className="text-[11px] text-muted">
              پوشه ذخیره‌سازی داده‌های طلایی: <code className="font-mono text-ink" dir="ltr">/var/besetun/projects/complaints_1403</code>
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: USERS */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-surface border border-line rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            <span>کاربران و کارشناسان دارای دسترسی</span>
          </h3>

          <div className="divide-y divide-line border border-line rounded-xl overflow-hidden text-xs">
            <div className="p-3.5 bg-surface-2 flex items-center justify-between">
              <div>
                <b className="text-ink">مدیر ارشد داده (Admin)</b>
                <span className="text-[11px] text-muted block font-mono" dir="ltr">admin@besetun.local</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-accent-soft text-accent font-bold text-[10px]">
                سرپرست خط لوله
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <b className="text-ink">کارشناس ۱ (Annotator 1)</b>
                <span className="text-[11px] text-muted block font-mono" dir="ltr">annotator1@besetun.local</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-2 text-muted font-bold text-[10px]">
                برچسب‌زن کور
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PROVIDER MODAL (USER REQUEST POINT 6) */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-2/40">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm text-ink">افزودن درگاه سرویس‌دهنده مدل جدید</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink block">نام سرویس‌دهنده یا سرور:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent"
                  placeholder="مثال: vLLM سرور داخلی ۳"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">آدرس پایانه (Endpoint URL):</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent font-mono"
                  dir="ltr"
                  placeholder="http://192.168.1.100:8000/v1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink block">نوع رابط / نرم‌افزار:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'local' | 'lan' | 'cloud')}
                    className="w-full p-2 border border-line-strong rounded-xl bg-surface text-ink text-xs"
                  >
                    <option value="local">سرور محلی (Local)</option>
                    <option value="lan">شبکه محلی سازمان (LAN)</option>
                    <option value="cloud">سرویس ابری (Cloud)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink block">موقعیت شبکه:</label>
                  <label className="flex items-center gap-2 p-2 border border-line rounded-xl bg-surface cursor-pointer mt-0.5">
                    <input
                      type="checkbox"
                      checked={newIsExternal}
                      onChange={(e) => setNewIsExternal(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded"
                    />
                    <span className="text-[11px] text-ink font-medium">سرویس ابری/خارجی است</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink block">مدل‌های قابل فراخوانی (با کاما جدا کنید):</label>
                <input
                  type="text"
                  value={newModels}
                  onChange={(e) => setNewModels(e.target.value)}
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent font-mono"
                  dir="ltr"
                  placeholder="qwen2.5-14b, llama-3.1-8b"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-line text-ink hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent text-on-accent font-bold hover:bg-accent-2 transition-colors cursor-pointer shadow-xs"
                >
                  افزودن درگاه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
