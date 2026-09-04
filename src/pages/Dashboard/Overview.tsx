import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Award, 
  AlertTriangle, 
  Clock, 
  BrainCircuit, 
  TrendingUp, 
  ChevronRight, 
  FileSpreadsheet, 
  Activity, 
  Eye, 
  Target, 
  CheckCircle2, 
  ArrowUpRight, 
  UserPlus,
  Compass,
  Zap
} from 'lucide-react';
import { StudentRecord, SchoolProfile, GradeLevel } from '../../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { exportStudentsToCSV } from '../../services/schoolService';
import { StudentDetailModal } from '../../components/StudentDetailModal';
import { CertificateModal } from '../../components/CertificateModal';

interface Props {
  students: StudentRecord[];
  school: SchoolProfile;
  onNavigateToStudents: () => void;
  onNavigateToEyeTracking: () => void;
  onNavigateToEnroll: () => void;
}

export const Overview: React.FC<Props> = ({
  students,
  school,
  onNavigateToStudents,
  onNavigateToEyeTracking,
  onNavigateToEnroll,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<StudentRecord | null>(null);

  // Compute school-wide cumulative stats
  const totalStudents = students.length;
  const avgSchoolScore = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.cyberAwarenessScore, 0) / totalStudents)
    : 75;
  const avgAccuracy = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.accuracy, 0) / totalStudents)
    : 81;
  const avgDecisionTime = totalStudents > 0
    ? (students.reduce((acc, s) => acc + s.avgDecisionTimeSec, 0) / totalStudents).toFixed(1)
    : '3.4';
  const certifiedCount = students.filter(s => s.cyberAwarenessScore >= 75).length;
  const highRiskCount = students.filter(s => s.riskCategory === 'High Risk' || s.riskCategory === 'Vulnerable').length;

  // Grade-wise cumulative comparison
  const grades: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];
  const gradeData = grades.map(g => {
    const classStudents = students.filter(s => s.grade === g);
    const count = classStudents.length;
    const avgScore = count > 0
      ? Math.round(classStudents.reduce((acc, s) => acc + s.cyberAwarenessScore, 0) / count)
      : 0;
    const avgAcc = count > 0
      ? Math.round(classStudents.reduce((acc, s) => acc + s.accuracy, 0) / count)
      : 0;
    return {
      grade: `Grade ${g}`,
      averageScore: avgScore,
      accuracy: avgAcc,
      studentCount: count,
    };
  });

  // Risk Distribution Pie Data
  const riskCounts = {
    'Security Champion': students.filter(s => s.riskCategory === 'Security Champion').length,
    'Vigilant': students.filter(s => s.riskCategory === 'Vigilant').length,
    'Moderate': students.filter(s => s.riskCategory === 'Moderate').length,
    'Vulnerable': students.filter(s => s.riskCategory === 'Vulnerable').length,
    'High Risk': students.filter(s => s.riskCategory === 'High Risk').length,
  };

  const riskPieData = [
    { name: 'Security Champion', value: riskCounts['Security Champion'], color: '#10B981' },
    { name: 'Vigilant', value: riskCounts['Vigilant'], color: '#2563EB' },
    { name: 'Moderate', value: riskCounts['Moderate'], color: '#F59E0B' },
    { name: 'Vulnerable', value: riskCounts['Vulnerable'], color: '#F97316' },
    { name: 'High Risk', value: riskCounts['High Risk'], color: '#EF4444' },
  ];

  // School Domain Skill Competencies
  const skillAverages = [
    { 
      domain: 'Password Security', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.passwordSecurity, 0) / totalStudents) 
    },
    { 
      domain: 'Information Privacy', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.informationPrivacy, 0) / totalStudents) 
    },
    { 
      domain: 'Phishing Detection', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.phishingDetection, 0) / totalStudents) 
    },
    { 
      domain: 'Threat Recognition', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.threatRecognition, 0) / totalStudents) 
    },
    { 
      domain: 'Social Engineering', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.socialEngineering, 0) / totalStudents) 
    },
    { 
      domain: 'URL Verification', 
      score: Math.round(students.reduce((acc, s) => acc + s.skills.urlVerification, 0) / totalStudents) 
    },
  ];

  // Top 5 Rankers
  const topRankers = [...students]
    .sort((a, b) => b.cyberAwarenessScore - a.cyberAwarenessScore)
    .slice(0, 5);

  const handleExportCSV = () => {
    exportStudentsToCSV(students, school.name);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Institutional Status Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {school.name} • Institutional Cybersecurity ERP
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Full School Cumulative Telemetry &amp; Readiness Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Live evaluation metrics from CyberVerse 3D Unity sessions. Tracking cognitive attention, ocular scan patterns, decision hesitation, and domain vulnerability across all enrolled classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export School Telemetry (CSV)
          </button>
          <button
            onClick={onNavigateToEyeTracking}
            className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            Eye-Tracking Lab
          </button>
          <button
            onClick={onNavigateToEnroll}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Student
          </button>
        </div>
      </div>

      {/* 4 Cumulative Macro Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>School Cyber Awareness</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{avgSchoolScore}</span>
            <span className="text-xs font-bold text-slate-400">/100 avg</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${avgSchoolScore}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block mt-2 font-medium">
            Benchmark: <strong>Vigilant Campus Level</strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{totalStudents}</span>
            <span className="text-xs font-bold text-slate-400">active players</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-4 font-medium">
            Across Grades 6–12 • <strong>75 unity sessions logged</strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Avg Threat Decision Speed</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{avgDecisionTime}s</span>
            <span className="text-xs font-bold text-emerald-600">+0.4s reflection</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-4 font-medium">
            Overall Accuracy: <strong className="text-emerald-700">{avgAccuracy}%</strong>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Certified Defenders</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-600">{certifiedCount}</span>
            <span className="text-xs font-bold text-slate-400">of {totalStudents} (&ge;75)</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-4 font-medium">
            <strong className="text-rose-600">{highRiskCount}</strong> students in High Risk tier
          </span>
        </div>
      </div>

      {/* Primary Analytics Section: Grade Progress Comparison & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Grade-wise Average Score Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grade-Wise Cybersecurity Readiness (Grades 6 to 12)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cumulative comparison of mean awareness score and decision accuracy per grade cohort.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Grades 6–12
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="grade" tick={{ fontSize: 11 }} stroke="#64748B" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#64748B" />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value}%`, 
                    name === 'averageScore' ? 'Avg Awareness Score' : 'Scenario Accuracy'
                  ]}
                />
                <Bar dataKey="averageScore" fill="#2563EB" radius={[4, 4, 0, 0]} name="averageScore" />
                <Bar dataKey="accuracy" fill="#10B981" radius={[4, 4, 0, 0]} name="accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span>Mean Awareness Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span>Scenario Accuracy %</span>
            </div>
          </div>
        </div>

        {/* Student Risk Category Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Campus Risk Classification
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of 75 students across behavioral risk tiers.
            </p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} Students`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs mt-2">
            {riskPieData.map(item => (
              <div key={item.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: School Domain Competencies & Top Rankers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* School Skill Averages & Vulnerability Hotspots */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                School-Wide Threat Vector Competency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Performance across core cybersecurity attack surfaces.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">6 Core Vectors</span>
          </div>

          <div className="space-y-3">
            {skillAverages.map(skill => (
              <div key={skill.domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{skill.domain}</span>
                  <span className={`font-bold ${
                    skill.score >= 75 ? 'text-blue-700' : (skill.score >= 60 ? 'text-amber-700' : 'text-rose-600')
                  }`}>
                    {skill.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      skill.score >= 75 ? 'bg-blue-600' : (skill.score >= 60 ? 'bg-amber-500' : 'bg-rose-500')
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Insights Box */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Campus Vulnerability Alert: URL Verification Deficit (52%)</span>
            </div>
            <p className="leading-relaxed">
              Students across Grades 6–8 show high susceptibility to spoofed subdomains (e.g. <code>secure-google.auth-login.com</code>). Recommend assigning <strong>Scene 3.1 Domain Inspection Lab</strong> before next week's session.
            </p>
          </div>
        </div>

        {/* Top 5 Rankers Podium Snippet */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                School Cyber Rankers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Top-performing student defenders</p>
            </div>
            <button
              onClick={onNavigateToStudents}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View Roster <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topRankers.map((student, idx) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200/70 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-amber-400 text-amber-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-slate-800' :
                    idx === 2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Grade {student.grade}-{student.section} • {student.gameId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-blue-700 block">
                      {student.cyberAwarenessScore}/100
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {student.accuracy}% Acc
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Adaptive Feedback Loop Active:
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              Play → Measure → Identify → Adapt → Improve
            </span>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        school={school}
        onClose={() => setSelectedStudent(null)}
        onOpenCertificate={(std) => {
          setSelectedStudent(null);
          setCertificateStudent(std);
        }}
      />

      {/* Certificate Modal */}
      <CertificateModal
        student={certificateStudent}
        school={school}
        onClose={() => setCertificateStudent(null)}
      />
    </div>
  );
};
