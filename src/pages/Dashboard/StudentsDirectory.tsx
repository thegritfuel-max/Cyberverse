import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  Eye, 
  ChevronRight,
  FileSpreadsheet,
  Users,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { StudentRecord, SchoolProfile, GradeLevel, RiskCategory } from '../../types';
import { exportStudentsToCSV } from '../../services/schoolService';
import { StudentDetailModal } from '../../components/StudentDetailModal';
import { CertificateModal } from '../../components/CertificateModal';

interface Props {
  students: StudentRecord[];
  school: SchoolProfile;
  onRefresh: () => void;
  onNavigateToEnroll: () => void;
}

export const StudentsDirectory: React.FC<Props> = ({
  students,
  school,
  onRefresh,
  onNavigateToEnroll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<StudentRecord | null>(null);

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.gameId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesRisk = selectedRisk === 'all' || student.riskCategory === selectedRisk;
    return matchesSearch && matchesGrade && matchesRisk;
  });

  const grades: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];

  const getRiskBadge = (category: RiskCategory) => {
    switch (category) {
      case 'Security Champion':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Vigilant':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Vulnerable':
        return 'bg-orange-50 text-orange-700 border-orange-300';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-300';
    }
  };

  const handleExportCSV = () => {
    exportStudentsToCSV(filteredStudents, school.name);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            Institutional Student Directory
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enrolled Students Telemetry Roster
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive telemetry, biometric attention rates, and cybersecurity competence profiles across Grades 6 to 12.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Class to Sheet
          </button>
          <button
            onClick={onNavigateToEnroll}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Enroll Student &amp; Assign ID
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or Game ID (e.g. CV-G9-1042)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Risk Levels</option>
              <option value="Security Champion">Security Champion</option>
              <option value="Vigilant">Vigilant</option>
              <option value="Moderate">Moderate</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>
        </div>

        {/* Grade 6-12 Quick Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mr-2">Grade Filter:</span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedGrade === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Grades ({students.length})
          </button>
          {grades.map(g => {
            const count = students.filter(s => s.grade === g).length;
            return (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  selectedGrade === g
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Grade {g} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3.5 px-4">Student &amp; ID</th>
                <th className="py-3.5 px-4">Grade &amp; Section</th>
                <th className="py-3.5 px-4">Awareness Score</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Accuracy</th>
                <th className="py-3.5 px-4">Decision Time</th>
                <th className="py-3.5 px-4">Eye-Tracking Attention</th>
                <th className="py-3.5 px-4">Risk Category</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No students match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {/* Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border ${student.badgeColor}`}>
                          {student.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {student.name}
                            </span>
                            {student.isLiveActive && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Active live in Unity Game" />
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            {student.gameId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Grade & Section */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">
                        Grade {student.grade} - Sec {student.section}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Roll #{student.rollNumber}</span>
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{student.cyberAwarenessScore}</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.cyberAwarenessScore >= 75 ? 'bg-blue-600' : (student.cyberAwarenessScore >= 60 ? 'bg-amber-500' : 'bg-rose-500')
                            }`}
                            style={{ width: `${student.cyberAwarenessScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-700">Level {student.currentLevel}/10</span>
                      <span className="text-[10px] text-slate-400 block">{student.scenariosCompleted} scenes done</span>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      {student.accuracy}%
                    </td>

                    {/* Decision Time */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.avgDecisionTimeSec}s
                    </td>

                    {/* Eye Tracking Attention */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-700">
                        {student.behavioural.eyeTrackingAttentionScore}/100
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                        {student.behavioural.visualScanPath}
                      </span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getRiskBadge(student.riskCategory)}`}>
                        {student.riskCategory}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                        >
                          Telemetry
                        </button>
                        <button
                          onClick={() => setCertificateStudent(student)}
                          className="p-1 text-slate-400 hover:text-amber-600 rounded-lg transition-colors"
                          title="Generate Certificate"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Deep Profiler Modal (4-Section structure) */}
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
