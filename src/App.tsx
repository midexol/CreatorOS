import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AmbientBackground } from './components/AmbientBackground';
import { NotificationBell } from './components/NotificationBell';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { CoordinatorPage } from './pages/CoordinatorPage';
import { GrowthPage } from './pages/GrowthPage';
import { ContentPage } from './pages/ContentPage';
import { PlannerPage } from './pages/PlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { SettingsPage } from './pages/SettingsPage';

function DashboardShell() {
  const { notifications, user, logout } = useDashboard();

  return (
    <div className="min-h-screen text-slate-100 flex relative font-body">
      <AmbientBackground />
      <Sidebar />

      <main className="flex-1 min-w-0">
        <div className="relative h-16 border-b border-border2 sticky top-0 bg-panel/65 backdrop-blur-md z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono2 text-slate-400">Account:</span>
            <span className="text-xs font-semibold text-amber bg-amber/10 px-2.5 py-1 rounded-full border border-amber/20">
              {user?.name || user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell notifications={notifications} />

            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-slate-100 px-3 py-1.5 rounded-lg border border-border2 hover:bg-white/[0.05] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-8 py-10 bg-panel/88 backdrop-blur-lg min-h-[calc(100vh-4rem)] overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(36,52,58,0) 0%, rgba(36,52,58,0.6) 100%)' }}
          />
          <div className="relative">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="coordinator" element={<CoordinatorPage />} />
              <Route path="growth" element={<GrowthPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="connections" element={<ConnectionsPage />} />
              <Route path="settings" element={<SettingsPage />} />
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
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}
