import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { getStoredSchoolProfile, getStoredStudents } from '../../services/schoolService';
import { SchoolProfile, StudentRecord } from '../../types';
import { 
  Building2, 
  Search, 
  FileSpreadsheet, 
  Eye, 
  UserPlus, 
  ShieldCheck,
  Bell
} from 'lucide-react';
import { exportStudentsToCSV } from '../../services/schoolService';

export const DashboardLayout: React.FC = () => {
  const [school, setSchool] = useState<SchoolProfile>(getStoredSchoolProfile());
  const [students, setStudents] = useState<StudentRecord[]>(getStoredStudents());
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current tab from pathname
  const path = location.pathname;
  let currentTab = 'overview';
  if (path.includes('/students')) currentTab = 'students';
  else if (path.includes('/eye-tracking')) currentTab = 'eye-tracking';
  else if (path.includes('/enroll')) currentTab = 'enroll';
  else if (path.includes('/rankers')) currentTab = 'rankers';
  else if (path.includes('/certificates')) currentTab = 'certificates';
  else if (path.includes('/settings')) currentTab = 'settings';

  useEffect(() => {
    const handleSchoolUpdate = () => {
      setSchool(getStoredSchoolProfile());
    };
    const handleStudentsUpdate = () => {
      setStudents(getStoredStudents());
    };

    window.addEventListener('cyberverse-school-updated', handleSchoolUpdate);
    window.addEventListener('cyberverse-students-updated', handleStudentsUpdate);

    return () => {
      window.removeEventListener('cyberverse-school-updated', handleSchoolUpdate);
      window.removeEventListener('cyberverse-students-updated', handleStudentsUpdate);
    };
  }, []);

  const handleSelectTab = (tab: string) => {
    if (tab === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${tab}`);
  };

  const handleExportAllCSV = () => {
    exportStudentsToCSV(students, school.name);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Institutional Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        school={school}
        onNavigateHome={() => navigate('/')}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Top ERP Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              {school.code}
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
              Teacher In-Charge: <strong>{school.teacherName}</strong> ({school.teacherTitle})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAllCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Export 75 Students to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Export School Sheet</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/eye-tracking')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Eye-Tracking Lab</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/enroll')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        </header>

        {/* Page View Outlet */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ school, students }} />
        </main>
      </div>
    </div>
  );
};
