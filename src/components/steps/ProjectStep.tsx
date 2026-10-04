import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  FolderTree,
  Folder,
  FileText,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  HardDrive,
  Database,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ProjectConfig } from '../../types';
import { STANDARD_PROJECT_DIRECTORIES } from '../../demo/projectDemo';

interface ProjectStepProps {
  project: ProjectConfig;
  onUpdateProject: (config: ProjectConfig) => void;
  onProceedToData: () => void;
}

export const ProjectStep: React.FC<ProjectStepProps> = ({
  project,
  onUpdateProject,
  onProceedToData,
}) => {
  const [persianName, setPersianName] = useState(project.persianName);
  const [latinSlug, setLatinSlug] = useState(project.latinSlug);
  const [userName, setUserName] = useState(project.user);
  const [description, setDescription] = useState(project.description);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute live directory path
  const sanitizedSlug = latinSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '_') || 'unnamed_project';
  const computedPath = `${userName || 'user1'}/projects/${sanitizedSlug}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!persianName.trim() || !latinSlug.trim()) {
      setErrorMsg('لطفاً هم نام فارسی و هم نام لاتین پوشه پروژه را وارد نمایید.');
      return;
    }
    setErrorMsg(null);

    const updated: ProjectConfig = {
      ...project,
      persianName: persianName.trim(),
      latinSlug: sanitizedSlug,
      user: userName.trim() || 'user1',
      baseDir: computedPath,
      description: description.trim(),
      isInitialized: true,
      directories: STANDARD_PROJECT_DIRECTORIES.map((d) => d.path),
    };

    onUpdateProject(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onProceedToData();
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      {/* Step Header */}
      <div className="bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent text-on-accent flex items-center justify-center font-bold text-sm shadow-xs">
              ۰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-ink">مرحله صفر: تعریف و ساختار پوشه‌بندی پروژه</h1>
                <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold">
                  پیش‌نیاز درون‌ریزی داده
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                  داده‌ی نمایشی
                </span>
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                تا زمانی که نام فارسی و نام لاتین برای ایجاد پوشه استاندارد پروژه تعیین و تثبیت نشود، مرحله ورود داده و شروع ویزارد قفل است.
              </p>
            </div>
          </div>

          {project.isInitialized && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-good-soft border border-good/30 text-good text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>پروژه تثبیت‌شده و فعال</span>
            </div>
          )}
        </div>

        {/* Directory Path Notice */}
        <div className="p-3.5 rounded-xl bg-surface-2 border border-line text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-ink">
            <HardDrive className="w-4 h-4 text-accent shrink-0" />
            <span>مسیر اصلی استاندارد ذخیره‌سازی داده‌ها و گزارش‌ها:</span>
            <span className="font-mono text-accent font-bold px-2 py-0.5 rounded bg-surface border border-line text-[11px]" dir="ltr">
              {computedPath}/
            </span>
          </div>
          <span className="text-[11px] text-muted">ساختار یکنواخت و قابل تکرار برای تمامی پروژه‌ها</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Configuration Form (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <FolderKanban className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-base text-ink">مشخصات هویتی پروژه</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Persian Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-ink block">
                نام فارسی پروژه <span className="text-crit">*</span>:
              </label>
              <input
                type="text"
                value={persianName}
                onChange={(e) => setPersianName(e.target.value)}
                placeholder="مثال: شکایت‌های شهروندی ۱۴۰۳"
                className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent"
                required
              />
              <span className="text-[11px] text-muted block">
                این عنوان در تمام سربرگ‌ها، پیشخوان و گزارش‌های پروژه نمایش داده می‌شود.
              </span>
            </div>

            {/* Latin Slug */}
            <div className="space-y-1.5">
              <label className="font-bold text-ink block">
                نام لاتین پوشه پروژه (Latin Directory Slug) <span className="text-crit">*</span>:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={latinSlug}
                  onChange={(e) => setLatinSlug(e.target.value)}
                  placeholder="e.g. complaints_1403"
                  className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs font-mono focus:border-accent text-left"
                  dir="ltr"
                  required
                />
              </div>
              <span className="text-[11px] text-muted block">
                فقط حروف کوچک انگلیسی، اعداد، خط تیره و زیرخط مجاز است (جهت ایجاد پوشه روی دیسک).
              </span>
            </div>

            {/* User Account / Namespace */}
            <div className="space-y-1.5">
              <label className="font-bold text-ink block">
                نام کاربری یا واحد سازمانی (Namespace / User Folder):
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. user1"
                className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs font-mono focus:border-accent text-left"
                dir="ltr"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-ink block">شرح و هدف پروژه:</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیح مختصر در خصوص دامنه مسئله، منبع شکایات و اهداف فاین‌تیون..."
                className="w-full p-2.5 border border-line-strong rounded-xl bg-surface text-ink text-xs focus:border-accent leading-relaxed"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-crit-soft border border-crit/30 text-crit text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted">
                با تایید این مرحله، زیرپوشه‌های استاندارد ایجاد و مرحله ورود داده فعال می‌شود.
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-accent text-on-accent font-bold hover:bg-accent-2 transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{savedSuccess ? 'در حال هدایت...' : 'ثبت و ورود به مرحله آماده‌سازی داده'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Standard Directory Tree Structure (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-line rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <FolderTree className="w-5 h-5 text-accent" />
            <h2 className="font-bold text-base text-ink">ساختار دایرکتوری استاندارد</h2>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            تمامی فایل‌های تولیدی، لاگ‌های پالایش، متون گمنام‌شده، پرامپت‌ها و گزارش‌ها در این ساختار سلسله‌مراتبی ذخیره می‌شوند:
          </p>

          <div className="p-4 rounded-xl bg-surface-2 border border-line font-mono text-[11px] text-ink space-y-2 overflow-x-auto" dir="ltr">
            <div className="flex items-center gap-1.5 font-bold text-accent">
              <Folder className="w-4 h-4 fill-accent/20" />
              <span>{computedPath}/</span>
            </div>

            <div className="space-y-1.5 pl-4 border-l-2 border-accent/30 text-ink-2">
              {STANDARD_PROJECT_DIRECTORIES.map((dir, idx) => (
                <div key={idx} className="group relative">
                  <div className="flex items-center gap-1.5 hover:text-accent cursor-default">
                    <Folder className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                    <span className="font-bold text-ink">{dir.path}</span>
                  </div>
                  <div className="text-[10px] text-muted font-sans pl-5 leading-tight" dir="rtl">
                    {dir.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-good-soft/40 border border-good/20 text-xs text-good flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              این پوشه‌بندی استاندارد تضمین می‌کند هر پروژه به‌صورت ایزوله و مستقل، پکیج کامل داده‌ها و مانیفست مقالاتی خود را حفظ کند.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
