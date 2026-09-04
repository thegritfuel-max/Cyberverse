import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  School,
  FileCheck
} from 'lucide-react';
import { StudentRecord, SchoolProfile, GradeLevel } from '../../types';
import { CertificateModal } from '../../components/CertificateModal';

interface Props {
  students: StudentRecord[];
  school: SchoolProfile;
}

export const CertificatesHub: React.FC<Props> = ({ students, school }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [certifiedOnly, setCertifiedOnly] = useState(true);
  const [activeCertStudent, setActiveCertStudent] = useState<StudentRecord | null>(null);

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.gameId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || s.grade === selectedGrade;
    const matchesCert = !certifiedOnly || s.cyberAwarenessScore >= 75;
    return matchesSearch && matchesGrade && matchesCert;
  });

  const grades: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            Official Certification Center
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CyberVerse Certified Competence Diplomas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate verifiable PDF certificates featuring official school branding ({school.name}), teacher signature ({school.teacherName}), and cryptographic verification codes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Passing Criterion: Score &ge; 75/100</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student for certificate issuance..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="all">All Grades</option>
            {grades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 whitespace-nowrap">
            <input
              type="checkbox"
              checked={certifiedOnly}
              onChange={(e) => setCertifiedOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            Eligible (&ge;75 Score) Only
          </label>
        </div>
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(student => {
          const isEligible = student.cyberAwarenessScore >= 75;
          return (
            <div
              key={student.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${student.badgeColor}`}>
                      {student.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{student.name}</h3>
                      <span className="text-[11px] font-mono text-slate-400">{student.gameId}</span>
                    </div>
                  </div>
                  {isEligible ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Eligible
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      Incomplete
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Grade &amp; Section</span>
                    <span className="font-semibold text-slate-800">Grade {student.grade}-{student.section}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Awareness Score</span>
                    <span className={`font-bold text-sm ${isEligible ? 'text-blue-700' : 'text-slate-600'}`}>
                      {student.cyberAwarenessScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  Cert ID: {student.certificateId}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {isEligible ? 'Ready to Print / PDF' : 'Score must reach 75'}
                </span>
                <button
                  onClick={() => setActiveCertStudent(student)}
                  disabled={!isEligible}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                    isEligible
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  View &amp; Export
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        student={activeCertStudent}
        school={school}
        onClose={() => setActiveCertStudent(null)}
      />
    </div>
  );
};
