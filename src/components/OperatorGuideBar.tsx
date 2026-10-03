import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  Move,
  Pin,
  Minimize2,
  Maximize2,
  GripHorizontal,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { OPERATOR_WALKTHROUGH_STEPS } from '../mockData';

export type GuideDisplayMode = 'banner' | 'floating' | 'minimized';

interface OperatorGuideBarProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuideIndex: number;
  onNavigateGuide: (index: number) => void;
  mode: GuideDisplayMode;
  onToggleMode: (newMode: GuideDisplayMode) => void;
}

export const OperatorGuideBar: React.FC<OperatorGuideBarProps> = ({
  isOpen,
  onClose,
  currentGuideIndex,
  onNavigateGuide,
  mode,
  onToggleMode,
}) => {
  if (!isOpen) return null;

  // Draggable position state for floating mode (default placed on the right over sidebar)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 30, y: 135 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startMouseX: number; startMouseY: number; initialCardX: number; initialCardY: number }>({
    startMouseX: 0,
    startMouseY: 0,
    initialCardX: 30,
    initialCardY: 135,
  });

  const currentStep = OPERATOR_WALKTHROUGH_STEPS[currentGuideIndex];

  // Mouse drag listeners for floating card
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'floating') return;
    setIsDragging(true);
    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      initialCardX: position.x,
      initialCardY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragRef.current.startMouseX;
      const deltaY = e.clientY - dragRef.current.startMouseY;

      // In RTL coordinate system, moving left increases distance from right edge
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 360, dragRef.current.initialCardX - deltaX)),
        y: Math.max(10, Math.min(window.innerHeight - 240, dragRef.current.initialCardY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // ========================================================
  // 1. MINIMIZED FLOATING PILL
  // ========================================================
  if (mode === 'minimized') {
    return (
      <div className="fixed bottom-5 right-6 z-50 animate-in fade-in" dir="rtl">
        <button
          onClick={() => onToggleMode('banner')}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-accent text-on-accent shadow-[0_4px_20px_rgba(30,58,138,0.4)] hover:bg-accent-2 transition-all font-bold text-xs"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>راهنما: گام {currentGuideIndex + 1} از {OPERATOR_WALKTHROUGH_STEPS.length}</span>
          <Maximize2 className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>
    );
  }

  // ========================================================
  // 2. FLOATING & DRAGGABLE MODE (Defaults to right over sidebar)
  // ========================================================
  if (mode === 'floating') {
    return (
      <div
        className="fixed z-50 w-88 bg-surface border-2 border-accent rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.25)] p-4 select-none animate-in fade-in zoom-in-95"
        style={{ right: `${position.x}px`, top: `${position.y}px` }}
        dir="rtl"
      >
        {/* Drag handle header bar */}
        <div
          onMouseDown={handleMouseDown}
          className="flex items-center justify-between pb-2 border-b border-line mb-3 cursor-grab active:cursor-grabbing hover:bg-surface-2 rounded-t-xl -m-1 p-2 transition-colors"
          title="جهت جابه‌جایی روی صفحه، کلیک کرده و بکشید"
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-muted shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="text-[11px] font-bold text-accent">
                راهنما: مرحله {currentGuideIndex + 1} از {OPERATOR_WALKTHROUGH_STEPS.length}
              </span>
            </div>
          </div>

          {/* Control icons */}
          <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleMode('banner')}
              className="p-1 rounded text-muted hover:text-ink hover:bg-surface-2 transition-colors"
              title="بازگشت به نوار زیر خط لوله"
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleMode('minimized')}
              className="p-1 rounded text-muted hover:text-ink hover:bg-surface-2 transition-colors"
              title="کوچک‌سازی"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-muted hover:text-crit hover:bg-crit-soft transition-colors"
              title="بستن راهنما"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 className="text-xs font-bold text-ink mb-1.5 leading-snug">{currentStep.title}</h4>
        <p className="text-[11px] text-ink-2 mb-3.5 leading-relaxed">{currentStep.desc}</p>

        {/* Action navigation buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigateGuide(Math.max(0, currentGuideIndex - 1))}
              disabled={currentGuideIndex === 0}
              className="px-2.5 py-1 rounded-lg border border-line bg-surface text-[11px] text-ink-2 hover:bg-surface-2 disabled:opacity-40 transition-colors"
            >
              قبلی
            </button>
            <button
              onClick={() => onNavigateGuide(Math.min(OPERATOR_WALKTHROUGH_STEPS.length - 1, currentGuideIndex + 1))}
              disabled={currentGuideIndex === OPERATOR_WALKTHROUGH_STEPS.length - 1}
              className="px-3 py-1 rounded-lg bg-accent text-on-accent text-[11px] font-bold hover:bg-accent-2 disabled:opacity-40 transition-colors shadow-xs"
            >
              بعدی
            </button>
          </div>

          <span className="text-[10px] text-muted font-mono font-bold">
            {currentGuideIndex + 1}/{OPERATOR_WALKTHROUGH_STEPS.length}
          </span>
        </div>
      </div>
    );
  }

  // ========================================================
  // 3. DEFAULT MODE: INLINE BANNER RIGHT BELOW PIPELINE STEPPER
  // ========================================================
  return (
    <div
      className="bg-gradient-to-l from-accent-soft/90 via-surface to-accent-soft/40 border-2 border-accent/70 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all animate-in fade-in slide-in-from-top-2"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-on-accent flex items-center justify-center shadow-[0_0_12px_rgba(30,58,138,0.4)] shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                راهنمای گام‌به‌گام اوپراتور — مرحله {currentGuideIndex + 1} از {OPERATOR_WALKTHROUGH_STEPS.length}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-ink mt-0.5">{currentStep.title}</h4>
          </div>
        </div>

        {/* Action Controls: Previous, Next, Pop-out to Floating over sidebar, Close */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => onNavigateGuide(Math.max(0, currentGuideIndex - 1))}
            disabled={currentGuideIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-medium text-ink-2 hover:bg-surface-2 disabled:opacity-40 transition-colors"
          >
            مرحله قبلی
          </button>
          <button
            onClick={() => onNavigateGuide(Math.min(OPERATOR_WALKTHROUGH_STEPS.length - 1, currentGuideIndex + 1))}
            disabled={currentGuideIndex === OPERATOR_WALKTHROUGH_STEPS.length - 1}
            className="px-3.5 py-1.5 rounded-lg bg-accent text-on-accent text-xs font-bold hover:bg-accent-2 disabled:opacity-40 transition-colors shadow-xs"
          >
            مرحله بعدی
          </button>

          {/* User Requested: Button to transform into floating/absolute card on sidebar with drag capability */}
          <button
            onClick={() => onToggleMode('floating')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-xs font-semibold text-ink transition-colors shadow-2xs"
            title="شناور کردن راهنما روی صفحه با قابلیت جابه‌جایی آزاد"
          >
            <Move className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">شناور کردن روی صفحه</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-crit hover:bg-crit-soft transition-colors"
            title="بستن راهنما"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-2 mb-3 leading-relaxed max-w-4xl">
        {currentStep.desc}
      </p>

      {/* Progress Dots Indicator for all 11 steps */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-line/60">
        <span className="text-[10px] text-muted font-medium ml-1">پیشرفت راهنما:</span>
        <div className="flex flex-1 gap-1">
          {OPERATOR_WALKTHROUGH_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onNavigateGuide(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx === currentGuideIndex
                  ? 'bg-accent shadow-[0_0_6px_rgba(30,58,138,0.5)]'
                  : idx < currentGuideIndex
                  ? 'bg-good'
                  : 'bg-track'
              }`}
              title={`پرش به مرحله ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
