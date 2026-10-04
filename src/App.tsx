import React, { useState, useEffect, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
  Link,
} from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PipelineStepper } from './components/PipelineStepper';
import { OperatorGuideBar } from './components/OperatorGuideBar';
import { ShortcutsModal } from './components/ShortcutsModal';
import { LockedStepView } from './components/LockedStepView';

import {
  MainStepKey,
  StepStatus,
  UserRole,
  AppTheme,
  ModelProvider,
  LabelItem,
  ProjectConfig,
} from './types';
import { INITIAL_PROVIDERS } from './demo/modelDemo';
import { OPERATOR_WALKTHROUGH_STEPS, MAIN_STEPS } from './demo/pipelineSteps';
import { DEFAULT_PROJECT } from './demo/projectDemo';

// Lazy-loaded routes & step pages for < 500 kB initial bundle size (User Request Item 12)
const LandingPage = React.lazy(() =>
  import('./components/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const LoginPage = React.lazy(() =>
  import('./components/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const Dashboard = React.lazy(() =>
  import('./components/steps/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const ProjectStep = React.lazy(() =>
  import('./components/steps/ProjectStep').then((m) => ({ default: m.ProjectStep }))
);
const DataStep = React.lazy(() =>
  import('./components/steps/DataStep').then((m) => ({ default: m.DataStep }))
);
const LabelsStep = React.lazy(() =>
  import('./components/steps/LabelsStep').then((m) => ({ default: m.LabelsStep }))
);
const ModelStep = React.lazy(() =>
  import('./components/steps/ModelStep').then((m) => ({ default: m.ModelStep }))
);
const ExpertStep = React.lazy(() =>
  import('./components/steps/ExpertStep').then((m) => ({ default: m.ExpertStep }))
);
const KeywordStep = React.lazy(() =>
  import('./components/steps/KeywordStep').then((m) => ({ default: m.KeywordStep }))
);
const ResultsStep = React.lazy(() =>
  import('./components/steps/ResultsStep').then((m) => ({ default: m.ResultsStep }))
);
const FineTuneStep = React.lazy(() =>
  import('./components/steps/FineTuneStep').then((m) => ({ default: m.FineTuneStep }))
);
const SettingsStep = React.lazy(() =>
  import('./components/steps/SettingsStep').then((m) => ({ default: m.SettingsStep }))
);

const LoadingFallback = () => (
  <div className="min-h-[300px] flex items-center justify-center p-8 text-center" dir="rtl">
    <div className="space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
      <span className="text-xs text-muted font-medium block">در حال بارگذاری بخش مورد نظر...</span>
    </div>
  </div>
);

// 404 Simple Page with link to / (User Request Item 3)
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-line text-muted flex items-center justify-center mx-auto mb-4 shadow-sm">
        <span className="text-2xl font-mono font-bold text-accent">۴۰۴</span>
      </div>
      <h1 className="text-xl font-black mb-2 text-ink">صفحه مورد نظر یافت نشد</h1>
      <p className="text-xs text-muted mb-6 max-w-sm leading-relaxed">
        آدرس وارد شده در سامانه بیستون وجود ندارد یا جابه‌جا شده است.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-accent text-on-accent font-bold text-xs hover:bg-accent-2 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
      >
        <span>بازگشت به صفحه اصلی بیستون</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Default tabs for steps
const DEFAULT_SUBTABS: Record<string, string> = {
  data: 'import',
  labels: 'extract',
  model: 'runs',
  expert: 'work',
  keyword: 'dict',
  results: 'paper',
  settings: 'mode',
};

// Real prerequisites per locked step (User Request Item 6)
function getStepPrerequisites(stepKey: string) {
  switch (stepKey) {
    case 'labels':
      return {
        prerequisites: [
          'تعریف و ثبت ساختار پوشه‌بندی استاندارد پروژه (مرحله ۰)',
          'بارگذاری و اتمام مرحله پاک‌سازی و پالایش داده‌های خام (مرحله ۱)',
        ],
        unlockTarget: { step: 'data' as MainStepKey, tab: 'import', ctaText: 'رفتن به ورود داده‌ها' },
      };
    case 'model':
      return {
        prerequisites: [
          'پالایش داده‌های ورودی و عبور از قیف تمیزسازی (مرحله ۱)',
          'استخراج هوشمند یا تعیین تاکسونومی برچسب‌ها (مرحله ۲)',
        ],
        unlockTarget: { step: 'labels' as MainStepKey, tab: 'extract', ctaText: 'رفتن به استخراج برچسب‌ها' },
      };
    case 'expert':
      return {
        prerequisites: [
          'نمونه‌گیری متقارن بدون هم‌پوشانی (مرجع و بازبینی) (مرحله ۱)',
          'تصویب برچسب‌ها و دستورالعمل راهنمای چندنمونه‌ای (مرحله ۲)',
        ],
        unlockTarget: { step: 'data' as MainStepKey, tab: 'sample', ctaText: 'رفتن به نمونه‌گیری داده‌ها' },
      };
    case 'keyword':
      return {
        prerequisites: ['استخراج و تثبیت تاکسونومی برچسب‌ها در مرحله ۲'],
        unlockTarget: { step: 'labels' as MainStepKey, tab: 'extract', ctaText: 'رفتن به برچسب‌ها' },
      };
    case 'results':
      return {
        prerequisites: [
          'اجرای موفق دوگانه A و B مدل زبانی (مرحله ۳)',
          'تکمیل برچسب‌زنی کارشناسان و حل اختلاف در داوری (مرحله ۴)',
        ],
        unlockTarget: { step: 'expert' as MainStepKey, tab: 'adj', ctaText: 'رفتن به حل اختلاف و داوری' },
      };
    default:
      return {
        prerequisites: ['تکمیل پیش‌نیازهای مراحل قبل'],
        unlockTarget: { step: 'data' as MainStepKey, tab: 'import', ctaText: 'رفتن به بارگذاری داده' },
      };
  }
}

export default function App() {
  const [theme, setTheme] = useState<AppTheme>('light');
  const [role, setRole] = useState<UserRole>('admin');

  // Project Definition (Step 0) State
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>(DEFAULT_PROJECT);

  // Data Loading & Lifecycle Statuses
  const [isDatasetLoaded, setIsDatasetLoaded] = useState<boolean>(false);
  const [datasetCount, setDatasetCount] = useState<number>(42);
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

  // Navigation & Drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [guideActive, setGuideActive] = useState<boolean>(false);
  const [guideMode, setGuideMode] = useState<'banner' | 'floating' | 'minimized'>('banner');
  const [currentGuideIndex, setCurrentGuideIndex] = useState<number>(0);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  // Sync theme with HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync step completion progress dynamically
  useEffect(() => {
    if (!isDatasetLoaded) return;
    setStepStatuses((prev) => {
      const next = { ...prev };
      next.data = 'done';
      if (extractedLabels.length > 0) {
        next.labels = 'done';
      }
      if (isModelRunCompleted) {
        next.model = 'done';
      }
      return next;
    });
  }, [isDatasetLoaded, extractedLabels.length, isModelRunCompleted]);

  // Dataset Loaded Handler
  const handleDatasetLoaded = (count: number) => {
    setIsDatasetLoaded(true);
    setDatasetCount(count || 42);
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

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddProvider = (newProv: ModelProvider) => {
    setProviders((prev) => [...prev, newProv]);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <LandingRoute
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          }
        />

        {/* Login Page Route */}
        <Route
          path="/login"
          element={
            <LoginRoute
              theme={theme}
              onToggleTheme={handleToggleTheme}
              setRole={setRole}
            />
          }
        />

        {/* Redirect /app to /app/dash */}
        <Route path="/app" element={<Navigate to="/app/dash" replace />} />

        {/* Dedicated Expert Role Route: /expert/:part? (reference | review) */}
        <Route
          path="/expert"
          element={<Navigate to="/expert/reference" replace />}
        />
        <Route
          path="/expert/:part"
          element={
            <WorkspaceContainer
              theme={theme}
              onToggleTheme={handleToggleTheme}
              role="expert"
              setRole={setRole}
              projectConfig={projectConfig}
              setProjectConfig={setProjectConfig}
              isDatasetLoaded={isDatasetLoaded}
              datasetCount={datasetCount}
              handleDatasetLoaded={handleDatasetLoaded}
              handleDatasetCleared={handleDatasetCleared}
              stepStatuses={stepStatuses}
              isIsolated={isIsolated}
              setIsIsolated={setIsIsolated}
              providers={providers}
              handleToggleProvider={handleToggleProvider}
              handleAddProvider={handleAddProvider}
              extractedLabels={extractedLabels}
              setExtractedLabels={setExtractedLabels}
              isModelRunCompleted={isModelRunCompleted}
              setIsModelRunCompleted={setIsModelRunCompleted}
              mobileSidebarOpen={mobileSidebarOpen}
              setMobileSidebarOpen={setMobileSidebarOpen}
              guideActive={guideActive}
              setGuideActive={setGuideActive}
              guideMode={guideMode}
              setGuideMode={setGuideMode}
              currentGuideIndex={currentGuideIndex}
              setCurrentGuideIndex={setCurrentGuideIndex}
              shortcutsModalOpen={shortcutsModalOpen}
              setShortcutsModalOpen={setShortcutsModalOpen}
              isExpertRoute={true}
            />
          }
        />

        {/* Main App Workspace Route with real URL step and tab: /app/:step/:tab? */}
        <Route
          path="/app/:step"
          element={
            <WorkspaceContainer
              theme={theme}
              onToggleTheme={handleToggleTheme}
              role={role}
              setRole={setRole}
              projectConfig={projectConfig}
              setProjectConfig={setProjectConfig}
              isDatasetLoaded={isDatasetLoaded}
              datasetCount={datasetCount}
              handleDatasetLoaded={handleDatasetLoaded}
              handleDatasetCleared={handleDatasetCleared}
              stepStatuses={stepStatuses}
              isIsolated={isIsolated}
              setIsIsolated={setIsIsolated}
              providers={providers}
              handleToggleProvider={handleToggleProvider}
              handleAddProvider={handleAddProvider}
              extractedLabels={extractedLabels}
              setExtractedLabels={setExtractedLabels}
              isModelRunCompleted={isModelRunCompleted}
              setIsModelRunCompleted={setIsModelRunCompleted}
              mobileSidebarOpen={mobileSidebarOpen}
              setMobileSidebarOpen={setMobileSidebarOpen}
              guideActive={guideActive}
              setGuideActive={setGuideActive}
              guideMode={guideMode}
              setGuideMode={setGuideMode}
              currentGuideIndex={currentGuideIndex}
              setCurrentGuideIndex={setCurrentGuideIndex}
              shortcutsModalOpen={shortcutsModalOpen}
              setShortcutsModalOpen={setShortcutsModalOpen}
              isExpertRoute={false}
            />
          }
        />
        <Route
          path="/app/:step/:tab"
          element={
            <WorkspaceContainer
              theme={theme}
              onToggleTheme={handleToggleTheme}
              role={role}
              setRole={setRole}
              projectConfig={projectConfig}
              setProjectConfig={setProjectConfig}
              isDatasetLoaded={isDatasetLoaded}
              datasetCount={datasetCount}
              handleDatasetLoaded={handleDatasetLoaded}
              handleDatasetCleared={handleDatasetCleared}
              stepStatuses={stepStatuses}
              isIsolated={isIsolated}
              setIsIsolated={setIsIsolated}
              providers={providers}
              handleToggleProvider={handleToggleProvider}
              handleAddProvider={handleAddProvider}
              extractedLabels={extractedLabels}
              setExtractedLabels={setExtractedLabels}
              isModelRunCompleted={isModelRunCompleted}
              setIsModelRunCompleted={setIsModelRunCompleted}
              mobileSidebarOpen={mobileSidebarOpen}
              setMobileSidebarOpen={setMobileSidebarOpen}
              guideActive={guideActive}
              setGuideActive={setGuideActive}
              guideMode={guideMode}
              setGuideMode={setGuideMode}
              currentGuideIndex={currentGuideIndex}
              setCurrentGuideIndex={setCurrentGuideIndex}
              shortcutsModalOpen={shortcutsModalOpen}
              setShortcutsModalOpen={setShortcutsModalOpen}
              isExpertRoute={false}
            />
          }
        />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

// -------------------------------------------------------------
// Sub-Route Wrappers for Clean URL Navigation
// -------------------------------------------------------------
function LandingRoute({
  theme,
  onToggleTheme,
}: {
  theme: AppTheme;
  onToggleTheme: () => void;
}) {
  const navigate = useNavigate();
  return (
    <LandingPage
      onGoLogin={() => {
        navigate('/login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      theme={theme}
      onToggleTheme={onToggleTheme}
    />
  );
}

function LoginRoute({
  theme,
  onToggleTheme,
  setRole,
}: {
  theme: AppTheme;
  onToggleTheme: () => void;
  setRole: (role: UserRole) => void;
}) {
  const navigate = useNavigate();

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'expert') {
      navigate('/expert/reference');
    } else {
      navigate('/app/dash');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoLanding={() => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      theme={theme}
      onToggleTheme={onToggleTheme}
    />
  );
}

// -------------------------------------------------------------
// Main Workspace Container (Connects URL params to Steps & Tabs)
// -------------------------------------------------------------
interface WorkspaceContainerProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  projectConfig: ProjectConfig;
  setProjectConfig: (cfg: ProjectConfig) => void;
  isDatasetLoaded: boolean;
  datasetCount: number;
  handleDatasetLoaded: (count: number) => void;
  handleDatasetCleared: () => void;
  stepStatuses: Record<string, StepStatus>;
  isIsolated: boolean;
  setIsIsolated: (val: boolean) => void;
  providers: ModelProvider[];
  handleToggleProvider: (id: string) => void;
  handleAddProvider: (prov: ModelProvider) => void;
  extractedLabels: LabelItem[];
  setExtractedLabels: (labels: LabelItem[]) => void;
  isModelRunCompleted: boolean;
  setIsModelRunCompleted: (val: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (val: boolean) => void;
  guideActive: boolean;
  setGuideActive: (val: boolean) => void;
  guideMode: 'banner' | 'floating' | 'minimized';
  setGuideMode: (mode: 'banner' | 'floating' | 'minimized') => void;
  currentGuideIndex: number;
  setCurrentGuideIndex: (idx: number) => void;
  shortcutsModalOpen: boolean;
  setShortcutsModalOpen: (val: boolean) => void;
  isExpertRoute: boolean;
}

function WorkspaceContainer({
  theme,
  onToggleTheme,
  role,
  setRole,
  projectConfig,
  setProjectConfig,
  isDatasetLoaded,
  datasetCount,
  handleDatasetLoaded,
  handleDatasetCleared,
  stepStatuses,
  isIsolated,
  setIsIsolated,
  providers,
  handleToggleProvider,
  handleAddProvider,
  extractedLabels,
  setExtractedLabels,
  isModelRunCompleted,
  setIsModelRunCompleted,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  guideActive,
  setGuideActive,
  guideMode,
  setGuideMode,
  currentGuideIndex,
  setCurrentGuideIndex,
  shortcutsModalOpen,
  setShortcutsModalOpen,
  isExpertRoute,
}: WorkspaceContainerProps) {
  const navigate = useNavigate();
  const { step, tab, part } = useParams<{ step?: string; tab?: string; part?: string }>();

  // Determine current step and tab based on URL params
  let currentStep: MainStepKey = 'dash';
  let activeTab: string = '';

  if (isExpertRoute) {
    currentStep = 'expert';
    activeTab = part === 'review' ? 'review' : 'work';
  } else {
    currentStep = (step as MainStepKey) || 'dash';
    activeTab = tab || DEFAULT_SUBTABS[currentStep] || '';
  }

  // Handle URL-driven navigation for steps and tabs
  const handleSelectStep = (targetStep: MainStepKey, targetTab?: string) => {
    if (role === 'expert' && targetStep === 'expert') {
      const modePart = targetTab === 'review' ? 'review' : 'reference';
      navigate(`/expert/${modePart}`);
    } else {
      const finalTab = targetTab || DEFAULT_SUBTABS[targetStep] || '';
      navigate(`/app/${targetStep}${finalTab ? `/${finalTab}` : ''}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubTabChange = (newTab: string) => {
    if (isExpertRoute) {
      navigate(`/expert/${newTab === 'review' ? 'review' : 'reference'}`);
    } else {
      navigate(`/app/${currentStep}/${newTab}`);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'expert') {
      navigate('/expert/reference');
    } else {
      navigate('/app/dash');
    }
  };

  const handleLogout = () => {
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuideNavigate = (index: number) => {
    setCurrentGuideIndex(index);
    const target = OPERATOR_WALKTHROUGH_STEPS[index]?.target;
    if (target) {
      const [stepKey, tabKey] = target.split(':') as [MainStepKey, string];
      handleSelectStep(stepKey, tabKey);
    }
  };

  const extFlag = isIsolated && providers.some((p) => p.active && p.isExternal);
  const isCurrentLocked = stepStatuses[currentStep] === 'locked';
  const lockInfo = getStepPrerequisites(currentStep);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans" dir="rtl">
      {/* Top Enterprise Header */}
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        role={role}
        onChangeRole={handleRoleChange}
        projectName={projectConfig.persianName}
        isIsolated={isIsolated}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        guideActive={guideActive}
        onToggleGuide={() => {
          setGuideActive(!guideActive);
          if (!guideActive) setGuideMode('banner');
        }}
        onNavigate={(s) => handleSelectStep(s as MainStepKey)}
        onLogout={handleLogout}
        isMobileMenuOpen={mobileSidebarOpen}
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Rail */}
        <Sidebar
          currentStep={currentStep}
          onSelectStep={(s, t) => handleSelectStep(s, t)}
          stepStatuses={stepStatuses}
          role={role}
          onChangeRole={handleRoleChange}
          onLogout={handleLogout}
          extFlag={extFlag}
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          projectName={projectConfig.persianName}
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
        />

        {/* Main Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 min-w-0 max-w-6xl w-full">
          {/* 6-stage lifecycle stepper: Only visible in Admin / Lead role on pipeline steps */}
          {role === 'admin' && currentStep !== 'settings' && currentStep !== 'project' && (
            <PipelineStepper
              currentStep={currentStep}
              onSelectStep={(s) => handleSelectStep(s)}
              stepStatuses={stepStatuses}
            />
          )}

          {/* Guide Banner */}
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

          {/* Locked Step Guard with real step prerequisites (User Request Item 6) */}
          {isCurrentLocked ? (
            <LockedStepView
              title={MAIN_STEPS.find((s) => s.key === currentStep)?.title || ''}
              stepNumber={MAIN_STEPS.find((s) => s.key === currentStep)?.stepNumber || 1}
              prerequisites={lockInfo.prerequisites}
              unlockTarget={lockInfo.unlockTarget}
              onGoPrerequisite={(s, t) => handleSelectStep(s, t)}
            />
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              {/* Step 0: Project Definition */}
              {currentStep === 'project' && (
                <ProjectStep
                  project={projectConfig}
                  onUpdateProject={setProjectConfig}
                  onProceedToData={() => handleSelectStep('data', 'import')}
                />
              )}

              {/* Dashboard */}
              {currentStep === 'dash' && (
                <Dashboard
                  onNavigate={(s, t) => handleSelectStep(s, t)}
                  stepStatuses={stepStatuses}
                  role={role}
                  onStartGuide={() => {
                    setGuideActive(true);
                    setGuideMode('banner');
                    handleGuideNavigate(0);
                  }}
                  isDatasetLoaded={isDatasetLoaded}
                  datasetCount={datasetCount}
                  labelsCount={extractedLabels.length}
                  isModelRunCompleted={isModelRunCompleted}
                />
              )}

              {/* Step 1: Data Preprocessing & Masking */}
              {currentStep === 'data' && (
                <DataStep
                  activeTab={activeTab || 'import'}
                  onChangeTab={handleSubTabChange}
                  onDatasetLoaded={handleDatasetLoaded}
                  onDatasetCleared={handleDatasetCleared}
                  isInitialLoaded={isDatasetLoaded}
                />
              )}

              {/* Step 2: Labels Taxonomy */}
              {currentStep === 'labels' && (
                <LabelsStep
                  activeTab={activeTab || 'extract'}
                  onChangeTab={handleSubTabChange}
                  onOpenSettings={() => handleSelectStep('settings', 'providers')}
                  labels={extractedLabels}
                  onLabelsChange={setExtractedLabels}
                  isDatasetLoaded={isDatasetLoaded}
                  datasetCount={datasetCount}
                />
              )}

              {/* Step 3: Model Dual Run */}
              {currentStep === 'model' && (
                <ModelStep
                  activeTab={activeTab || 'runs'}
                  onChangeTab={handleSubTabChange}
                  providers={providers}
                  labels={extractedLabels}
                  onGoToLabels={() => handleSelectStep('labels', 'extract')}
                  isRunCompleted={isModelRunCompleted}
                  onRunComplete={() => setIsModelRunCompleted(true)}
                  datasetCount={datasetCount}
                />
              )}

              {/* Step 4: Expert Annotation & Adjudication */}
              {currentStep === 'expert' && (
                <ExpertStep
                  activeTab={activeTab || 'work'}
                  onChangeTab={handleSubTabChange}
                  onOpenShortcuts={() => setShortcutsModalOpen(true)}
                  role={role}
                  datasetCount={datasetCount}
                />
              )}

              {/* Step 5: Keyword Rule Baseline */}
              {currentStep === 'keyword' && (
                <KeywordStep
                  labels={extractedLabels}
                  onGoToLabels={() => handleSelectStep('labels', 'extract')}
                />
              )}

              {/* Step 6: Golden Dataset Results & Paper */}
              {currentStep === 'results' && (
                <ResultsStep
                  activeTab={activeTab || 'paper'}
                  onChangeTab={handleSubTabChange}
                  onGoFineTune={() => handleSelectStep('tune')}
                  datasetCount={datasetCount}
                />
              )}

              {/* Phase 2: Fine-Tuning Module */}
              {currentStep === 'tune' && <FineTuneStep />}

              {/* Settings */}
              {currentStep === 'settings' && (
                <SettingsStep
                  activeTab={activeTab || 'mode'}
                  onChangeTab={handleSubTabChange}
                  isIsolated={isIsolated}
                  onToggleIsolated={setIsIsolated}
                  providers={providers}
                  onToggleProvider={handleToggleProvider}
                  onAddProvider={handleAddProvider}
                />
              )}
            </Suspense>
          )}
        </main>
      </div>

      {/* Floating / minimized guide mode */}
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
