import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Eye, 
  UserPlus, 
  Trophy, 
  Award, 
  Settings, 
  Globe, 
  Shield, 
  Server,
  ChevronRight
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  school: SchoolProfile;
  onNavigateHome: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  school,
  onNavigateHome,
}) => {
  const menuItems = [
    { id: 'overview', label: 'School Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students Roster', icon: Users, badge: '75' },
    { id: 'eye-tracking', label: 'Eye-Tracking Lab', icon: Eye, highlight: true },
    { id: 'enroll', label: 'Enroll Student', icon: UserPlus },
    { id: 'rankers', label: 'Rankers & Honors', icon: Trophy },
    { id: 'certificates', label: 'Certificates Hub', icon: Award },
    { id: 'settings', label: 'School Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40 select-none">
      {/* School Brand Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="space-y-2">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 flex items-center justify-center">
            <img 
              src="https://i.postimg.cc/5yYw8KNq/kit-logo.png" 
              alt="Kolhapur Institute of Technology's College of Engineering Kolhapur" 
              className="h-12 w-auto max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-sm tracking-tight leading-tight line-clamp-2" title={school.name}>
              KIT's College of Engineering (Autonomous)
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-mono text-slate-500 font-semibold truncate">
                {school.code}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          Teacher ERP Suite
        </div>

        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs font-bold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Status & Back to Landing */}
      <div className="p-4 border-t border-slate-200 space-y-3 bg-slate-50/70">
        {/* Unity Server Status */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-600" />
              Unity Simulator
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Supervisor: <strong>{school.teacherName}</strong>
          </p>
        </div>

        {/* Back to Home / Mission */}
        <button
          onClick={onNavigateHome}
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Globe className="w-4 h-4 text-slate-500" />
          <span>Exit to CyberVerse Portal</span>
        </button>
      </div>
    </aside>
  );
};
