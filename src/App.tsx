import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './pages/Dashboard/DashboardLayout';
import { 
  OverviewRoute, 
  StudentsRoute, 
  EyeTrackingRoute, 
  EnrollRoute, 
  RankersRoute, 
  CertificatesRoute, 
  SettingsRoute 
} from './pages/Dashboard/DashboardRoutes';
import { SchoolLoginModal } from './components/SchoolLoginModal';
import { getStoredSchoolProfile } from './services/schoolService';
import { SchoolProfile } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

const LandingRouteWrapper: React.FC = () => {
  const [school, setSchool] = useState<SchoolProfile>(getStoredSchoolProfile());
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSchoolUpdate = () => {
      setSchool(getStoredSchoolProfile());
    };
    window.addEventListener('cyberverse-school-updated', handleSchoolUpdate);
    return () => window.removeEventListener('cyberverse-school-updated', handleSchoolUpdate);
  }, []);

  return (
    <>
      <LandingPage
        school={school}
        onEnterDashboard={() => navigate('/dashboard')}
        onOpenEyeTracking={() => navigate('/dashboard/eye-tracking')}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      <SchoolLoginModal
        isOpen={loginModalOpen}
        currentSchool={school}
        onClose={() => setLoginModalOpen(false)}
        onSchoolAuthenticated={(updated) => {
          setSchool(updated);
          navigate('/dashboard');
        }}
      />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingRouteWrapper />} />
          
          {/* Teacher ERP Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewRoute />} />
            <Route path="students" element={<StudentsRoute />} />
            <Route path="eye-tracking" element={<EyeTrackingRoute />} />
            <Route path="enroll" element={<EnrollRoute />} />
            <Route path="rankers" element={<RankersRoute />} />
            <Route path="certificates" element={<CertificatesRoute />} />
            <Route path="settings" element={<SettingsRoute />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
