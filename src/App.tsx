import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PipelineStepper } from './components/PipelineStepper';
import { OperatorGuideBar } from './components/OperatorGuideBar';
import { ShortcutsModal } from './components/ShortcutsModal';
import { LockedStepView } from './components/LockedStepView';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';

import { Dashboard } from './components/steps/Dashboard';
import { DataStep } from './components/steps/DataStep';
import { LabelsStep } from './components/steps/LabelsStep';
import { ModelStep } from './components/steps/ModelStep';
import { ExpertStep } from './components/steps/ExpertStep';
import { KeywordStep } from './components/steps/KeywordStep';
import { ResultsStep } from './components/steps/ResultsStep';
import { FineTuneStep } from './components/steps/FineTuneStep';
import { SettingsStep } from './components/steps/SettingsStep';

import { MainStepKey, StepStatus, UserRole, AppTheme, ModelProvider, LabelItem } from './types';
import { INITIAL_PROVIDERS, OPERATOR_WALKTHROUGH_STEPS, MAIN_STEPS } from './mockData';

export default function App() {
  // Screen state: Default is 'landing' as requested by the user
  const [currentScreen, setCurrentScreen] = useState<'login' | 'landing' | 'app'>('landing');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [role, setRole] = useState<UserRole>('admin');
  const [currentStep, setCurrentStep] = useState<MainStepKey>('dash');
  const [subTabs, setSubTabs] = useState<Record<string, string>>({
    data: 'import',
    labels: 'extract',
    model: 'runs',
    expert: 'progress',
    keyword: 'dict',
    results: 'paper',
    settings: 'mode',
  });

  // Clean empty initial state: Steps locked until dataset is loaded
  const [isDatasetLoaded, setIsDatasetLoaded] = useState<boolean>(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({
    data: 'active',
    labels: 'locked',
    model: 'locked',
    expert: 'locked',
    keyword: 'locked',
    results: 'locked',
  });

  const [isIsolated, setIsIsolated] = useState<boolean>(true);
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [extractedLabels, setExtractedLabels] = useState<LabelItem[]>([]);
  const [isModelRunCompleted, setIsModelRunCompleted] = useState<boolean>(false);
  const [guideActive, setGuideActive] = useState<boolean>(false);
  const [guideMode, setGuideMode] = useState<'banner' | 'floating' | 'minimized'>('banner');
  const [currentGuideIndex, setCurrentGuideIndex] = useState<number>(0);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  // Sync theme with HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Dataset Loaded Handler
  const handleDatasetLoaded = (_count: number) => {
    setIsDatasetLoaded(true);
    setStepStatuses({
      data: 'done',
      labels: 'ready',
      model: 'ready',
      expert: 'ready',
      keyword: 'ready',
      results: 'ready',
    });
  };

  // Dataset Cleared Handler
  const handleDatasetCleared = () => {
    setIsDatasetLoaded(false);
    setExtractedLabels([]);
    setIsModelRunCompleted(false);
    setStepStatuses({
      data: 'active',
      labels: 'locked',
      model: 'locked',
      expert: 'locked',
      keyword: 'locked',
      results: 'locked',
    });
  };

  // Handle Login from LoginPage
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'operator') {
      setCurrentStep('expert');
      setSubTabs((prev) => ({ ...prev, expert: 'work' }));
    } else {
      setCurrentStep('dash');
    }
    setCurrentScreen('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Logout to return to LoginPage
  const handleLogout = () => {
    setCurrentScreen('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle switching role inside dashboard
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'operator') {
      setCurrentStep('expert');
      setSubTabs((prev) => ({ ...prev, expert: 'work' }));
    } else {
      setSubTabs((prev) => ({ ...prev, expert: 'progress' }));
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectStep = (step: MainStepKey, tab?: string) => {
    setCurrentStep(step);
    if (tab) {
      setSubTabs((prev) => ({ ...prev, [step]: tab }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubTabChange = (tab: string) => {
    setSubTabs((prev) => ({ ...prev, [currentStep]: tab }));
  };

  const handleToggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddProvider = (newProv: ModelProvider) => {
    setProviders((prev) => [...prev, newProv]);
  };

  const handleGuideNavigate = (index: number) => {
    setCurrentGuideIndex(index);
    const target = OPERATOR_WALKTHROUGH_STEPS[index]?.target;
    if (target) {
      const [stepKey, tabKey] = target.split(':') as [MainStepKey, string];
      handleSelectStep(stepKey, tabKey);
    }
  };

  // ========================================================
  // 1. LOGIN SCREEN (DEFAULT ON APP LOAD)
  // ========================================================
  if (currentScreen === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoLanding={() => {
          setCurrentScreen('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // ========================================================
  // 2. LANDING PAGE
  // ========================================================
  if (currentScreen === 'landing') {
    return (
      <LandingPage
        onGoLogin={() => {
          setCurrentScreen('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // ========================================================
  // 3. MAIN APP WORKSPACE
  // ========================================================
  const extFlag = isIsolated && providers.some((p) => p.active && p.isExternal);
  const isCurrentLocked = stepStatuses[currentStep] === 'locked';

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans" dir="rtl">
      {/* Top Enterprise Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        role={role}
        onChangeRole={handleRoleChange}
        projectName="شکایت‌های شهروندی ۱۴۰۳"
        isIsolated={isIsolated}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        guideActive={guideActive}
        onToggleGuide={() => {
          setGuideActive(!guideActive);
          if (!guideActive) setGuideMode('banner');
        }}
        onNavigate={(step) => handleSelectStep(step as MainStepKey)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Rail */}
        <Sidebar
          currentStep={currentStep}
          onSelectStep={(step, tab) => handleSelectStep(step, tab)}
          stepStatuses={stepStatuses}
          role={role}
          onChangeRole={handleRoleChange}
          onLogout={handleLogout}
          extFlag={extFlag}
        />

        {/* Main Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 min-w-0 max-w-6xl">
          {/* 6-stage lifecycle stepper: Only visible in Admin / Lead role! In Operator mode, it is hidden as requested */}
          {role === 'admin' && currentStep !== 'settings' && (
            <PipelineStepper
              currentStep={currentStep}
              onSelectStep={(step) => handleSelectStep(step)}
              stepStatuses={stepStatuses}
            />
          )}

          {/* User Requested: Default guide bar appears right below the 6-stage pipeline box */}
          {guideActive && guideMode === 'banner' && (
            <OperatorGuideBar
              isOpen={guideActive}
              onClose={() => setGuideActive(false)}
              currentGuideIndex={currentGuideIndex}
              onNavigateGuide={handleGuideNavigate}
              mode={guideMode}
              onToggleMode={setGuideMode}
            />
          )}

          {/* Locked Step Guard Screen */}
          {isCurrentLocked ? (
            <LockedStepView
              title={MAIN_STEPS.find((s) => s.key === currentStep)?.title || ''}
              stepNumber={MAIN_STEPS.find((s) => s.key === currentStep)?.stepNumber || 1}
              prerequisites={['اجرای موفق مدل روی نمونه‌های آماده‌شده', 'ثبت نهایی برچسب‌زنی کارشناسان ۱ و ۲']}
              unlockTarget={{
                step: 'model',
                tab: 'runs',
                ctaText: 'رفتن به برچسب‌زنی مدل جهت تکمیل پیش‌نیاز',
              }}
              onGoPrerequisite={(s, t) => handleSelectStep(s, t)}
            />
          ) : (
            <>
              {/* Render Active View */}
              {currentStep === 'dash' && (
                <Dashboard
                  onNavigate={(step, tab) => handleSelectStep(step, tab)}
                  stepStatuses={stepStatuses}
                  role={role}
                  onStartGuide={() => {
                    setGuideActive(true);
                    setGuideMode('banner');
                    handleGuideNavigate(0);
                  }}
                />
              )}

              {currentStep === 'data' && (
                <DataStep
                  activeTab={subTabs.data || 'import'}
                  onChangeTab={handleSubTabChange}
                  onDatasetLoaded={handleDatasetLoaded}
                  onDatasetCleared={handleDatasetCleared}
                  isInitialLoaded={isDatasetLoaded}
                />
              )}

              {currentStep === 'labels' && (
                <LabelsStep
                  activeTab={subTabs.labels || 'extract'}
                  onChangeTab={handleSubTabChange}
                  onOpenSettings={() => handleSelectStep('settings', 'providers')}
                  labels={extractedLabels}
                  onLabelsChange={setExtractedLabels}
                  isDatasetLoaded={isDatasetLoaded}
                />
              )}

              {currentStep === 'model' && (
                <ModelStep
                  activeTab={subTabs.model || 'runs'}
                  onChangeTab={handleSubTabChange}
                  providers={providers}
                  labels={extractedLabels}
                  onGoToLabels={() => handleSelectStep('labels', 'extract')}
                  isRunCompleted={isModelRunCompleted}
                  onRunComplete={() => setIsModelRunCompleted(true)}
                />
              )}

              {currentStep === 'expert' && (
                <ExpertStep
                  activeTab={subTabs.expert || 'work'}
                  onChangeTab={handleSubTabChange}
                  onOpenShortcuts={() => setShortcutsModalOpen(true)}
                  role={role}
                />
              )}

              {currentStep === 'keyword' && (
                <KeywordStep
                  labels={extractedLabels}
                  onGoToLabels={() => handleSelectStep('labels', 'extract')}
                />
              )}

              {currentStep === 'results' && (
                <ResultsStep
                  activeTab={subTabs.results || 'paper'}
                  onChangeTab={handleSubTabChange}
                  onGoFineTune={() => handleSelectStep('tune')}
                />
              )}

              {currentStep === 'tune' && <FineTuneStep />}

              {currentStep === 'settings' && (
                <SettingsStep
                  activeTab={subTabs.settings || 'mode'}
                  onChangeTab={handleSubTabChange}
                  isIsolated={isIsolated}
                  onToggleIsolated={setIsIsolated}
                  providers={providers}
                  onToggleProvider={handleToggleProvider}
                  onAddProvider={handleAddProvider}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* User Requested: Floating / absolute draggable mode positioning on right over sidebar or minimized */}
      {guideActive && guideMode !== 'banner' && (
        <OperatorGuideBar
          isOpen={guideActive}
          onClose={() => setGuideActive(false)}
          currentGuideIndex={currentGuideIndex}
          onNavigateGuide={handleGuideNavigate}
          mode={guideMode}
          onToggleMode={setGuideMode}
        />
      )}

      {/* Keyboard Shortcuts Reference Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}

