import React from 'react';
import { X, Keyboard, CheckCircle2 } from 'lucide-react';
import { INITIAL_LABELS } from '../mockData';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface border border-line rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-ink">کلیدهای میانبر میزکار اوپراتور</h3>
              <p className="text-xs text-muted">برای افزایش چشمگیر سرعت برچسب‌زنی بدون استفاده از ماوس</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-muted mb-2">کلیدهای اختصاصی برچسب‌ها (۱ تا ۸)</h4>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_LABELS.map((lb) => (
                <div
                  key={lb.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm"
                >
                  <span className="font-medium text-ink truncate">{lb.name}</span>
                  <kbd className="min-w-6 h-6 px-1.5 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono font-bold text-accent shadow-xs">
                    {lb.keyShortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-muted mb-2">عملیات ناوبری و پرچم‌گذاری</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm">
                <span className="text-ink">انتقال به متن بعدی</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="min-w-6 h-6 px-1.5 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono text-muted">←</kbd>
                  <span className="text-xs text-muted">یا کلید جهت‌نمای چپ</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm">
                <span className="text-ink">بازگشت به متن قبلی</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="min-w-6 h-6 px-1.5 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono text-muted">→</kbd>
                  <span className="text-xs text-muted">یا کلید جهت‌نمای راست</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm">
                <span className="text-ink">انتخاب «بدون دلیل / متفرقه» (پاکسازی برچسب‌ها)</span>
                <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono font-bold text-accent">N</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm">
                <span className="text-ink">علامت‌گذاری اطلاعات شخصی باقیمانده (PII Alert)</span>
                <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono text-ochre">P</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-surface-2 text-sm">
                <span className="text-ink">تنظیم و تغییر اندازه فونت متن ورودی</span>
                <div className="flex items-center gap-1">
                  <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono text-muted">+</kbd>
                  <span className="text-xs text-muted">و</span>
                  <kbd className="min-w-6 h-6 px-2 flex items-center justify-center rounded bg-surface border border-line-strong text-xs font-mono text-muted">-</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-good">
            <CheckCircle2 className="w-4 h-4" />
            <span>تمام تغییرات به‌صورت بلادرنگ در حافظه امن ذخیره می‌شوند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-on-accent text-sm font-semibold rounded-lg hover:bg-accent-2 transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
