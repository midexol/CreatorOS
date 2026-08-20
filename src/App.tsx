import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AmbientBackground } from './components/AmbientBackground';
import { PanelTexture } from './components/PanelTexture';
import { NotificationBell } from './components/NotificationBell';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { CoordinatorPage } from './pages/CoordinatorPage';
import { GrowthPage } from './pages/GrowthPage';
import { ContentPage } from './pages/ContentPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';

function DashboardShell() {
  const { notifications } = useDashboard();
  return (
    <div className="min-h-screen text-slate-100 flex relative font-body">
      <AmbientBackground />
      <Sidebar />

      <main className="flex-1 min-w-0">
        <div className="relative h-16 border-b border-border2 sticky top-0 bg-panel/65 backdrop-blur-md z-10 flex items-center justify-end px-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <PanelTexture opacity={0.06} />
          </div>
          <div className="relative">
            <NotificationBell notifications={notifications} />
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-8 py-10 bg-panel/88 backdrop-blur-lg min-h-[calc(100vh-4rem)] overflow-hidden">
          {/* Soft fade at the very top instead of a hard edge into the panel below */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(36,52,58,0) 0%, rgba(36,52,58,0.6) 100%)' }}
          />
          <PanelTexture opacity={0.05} />
          <div className="relative">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="coordinator" element={<CoordinatorPage />} />
              <Route path="growth" element={<GrowthPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="connections" element={<ConnectionsPage />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard/*"
          element={
            <DashboardProvider>
              <DashboardShell />
            </DashboardProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
