import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  School, 
  ShieldCheck, 
  Building2, 
  User, 
  CheckCircle2, 
  Mail, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { SchoolProfile } from '../types';
import { saveSchoolProfile } from '../services/schoolService';

interface Props {
  isOpen: boolean;
  currentSchool: SchoolProfile;
  onClose: () => void;
  onSchoolAuthenticated: (profile: SchoolProfile) => void;
}

export const SchoolLoginModal: React.FC<Props> = ({
  isOpen,
  currentSchool,
  onClose,
  onSchoolAuthenticated,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [schoolName, setSchoolName] = useState(currentSchool.name);
  const [teacherName, setTeacherName] = useState(currentSchool.teacherName);
  const [email, setEmail] = useState('kiran.patil@kitcoek.in');
  const [password, setPassword] = useState('••••••••');
  const [campus, setCampus] = useState(currentSchool.campus);

  if (!isOpen) return null;

  const handleGoogleEduLogin = () => {
    // Instant mock sign-in with Google Workspace for Education
    const updated: SchoolProfile = {
      ...currentSchool,
      teacherName: 'Dr. Kiran Patil (Google Workspace)',
      teacherEmail: 'kiran.patil@kitcoek.in',
    };
    saveSchoolProfile(updated);
    onSchoolAuthenticated(updated);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolProfile = {
      ...currentSchool,
      name: schoolName.trim() || currentSchool.name,
      teacherName: teacherName.trim() || currentSchool.teacherName,
      teacherEmail: email.trim(),
      campus: campus.trim() || currentSchool.campus,
    };
    saveSchoolProfile(updated);
    onSchoolAuthenticated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {activeTab === 'login' ? 'Teacher & School Portal Login' : 'Register New Institution'}
              </h3>
              <p className="text-xs text-slate-500">CyberVerse Institutional Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Institutional Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-lg transition-colors ${
              activeTab === 'register' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register School
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Google Workspace Button */}
          <button
            type="button"
            onClick={handleGoogleEduLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 transition-colors flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Workspace for Education</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              Or with credentials
            </span>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                School / College Official Name
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Oakridge International STEM Academy"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Teacher / Principal In-Charge Name
              </label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Dr. Alistair Vance"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Campus / Branch
                </label>
                <input
                  type="text"
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  placeholder="e.g. Senior Wing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Teacher Official Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>{activeTab === 'login' ? 'Sign In to Dashboard' : 'Register & Enter Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center leading-tight">
            Institutional credentials link the Unity 3D game client to this teacher evaluation dashboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
