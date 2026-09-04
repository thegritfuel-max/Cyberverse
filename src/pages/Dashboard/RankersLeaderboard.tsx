import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Crown, 
  Zap, 
  Target, 
  ShieldCheck, 
  Download, 
  Eye, 
  Sparkles,
  Search
} from 'lucide-react';
import { StudentRecord, SchoolProfile, GradeLevel } from '../../types';
import { CertificateModal } from '../../components/CertificateModal';
import { StudentDetailModal } from '../../components/StudentDetailModal';

interface Props {
  students: StudentRecord[];
  school: SchoolProfile;
}

export const RankersLeaderboard: React.FC<Props> = ({ students, school }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [certificateStudent, setCertificateStudent] = useState<StudentRecord | null>(null);

  // Sort students descending by cyber awareness score
  const sortedStudents = [...students]
    .filter(s => selectedGrade === 'all' || s.grade === selectedGrade)
    .sort((a, b) => b.cyberAwarenessScore - a.cyberAwarenessScore);

  const topThree = sortedStudents.slice(0, 3);
  const restOfList = sortedStudents.slice(3);

  const grades: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            School Cyber Honor Roll
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Top Student Rankers &amp; Cyber Champions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Celebrating the fastest threat mitigators, highest scenario accuracies, and elite cybersecurity defenders.
          </p>
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedGrade === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Grades
          </button>
          {grades.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedGrade === g
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Cards for Top 3 */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Rank 2 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm relative overflow-hidden text-center space-y-3 order-2 md:order-1">
            <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded-full flex items-center justify-center font-black text-slate-700 mx-auto text-lg shadow-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{topThree[1].name}</h3>
              <p className="text-xs text-slate-500">Grade {topThree[1].grade}-{topThree[1].section} • {topThree[1].gameId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-bold uppercase block">Awareness Score</span>
              <span className="text-3xl font-black text-blue-700">{topThree[1].cyberAwarenessScore}</span>
              <span className="text-xs text-slate-500 block mt-1">Accuracy: {topThree[1].accuracy}%</span>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setSelectedStudent(topThree[1])}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Telemetry
              </button>
              <button
                onClick={() => setCertificateStudent(topThree[1])}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                Certificate
              </button>
            </div>
          </div>

          {/* Rank 1 - Champion */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white p-6 rounded-2xl border-2 border-amber-400 shadow-md relative overflow-hidden text-center space-y-3 order-1 md:order-2 md:-translate-y-3">
            <div className="w-16 h-16 bg-amber-400 border-2 border-amber-500 rounded-full flex items-center justify-center font-black text-amber-950 mx-auto text-2xl shadow-sm">
              <Crown className="w-8 h-8 fill-amber-950" />
            </div>
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-3 py-0.5 rounded-full">
              School Champion Defender
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">{topThree[0].name}</h3>
              <p className="text-xs text-slate-500">Grade {topThree[0].grade}-{topThree[0].section} • {topThree[0].gameId}</p>
            </div>
            <div className="p-4 bg-amber-100/60 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold uppercase block">Awareness Score</span>
              <span className="text-4xl font-black text-amber-950">{topThree[0].cyberAwarenessScore}</span>
              <span className="text-xs text-amber-800 font-semibold block mt-1">Accuracy: {topThree[0].accuracy}% • Time: {topThree[0].avgDecisionTimeSec}s</span>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setSelectedStudent(topThree[0])}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Telemetry
              </button>
              <button
                onClick={() => setCertificateStudent(topThree[0])}
                className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                Issue Gold Certificate
              </button>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm relative overflow-hidden text-center space-y-3 order-3">
            <div className="w-12 h-12 bg-amber-100/60 border-2 border-amber-300 rounded-full flex items-center justify-center font-black text-amber-800 mx-auto text-lg shadow-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{topThree[2].name}</h3>
              <p className="text-xs text-slate-500">Grade {topThree[2].grade}-{topThree[2].section} • {topThree[2].gameId}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 font-bold uppercase block">Awareness Score</span>
              <span className="text-3xl font-black text-blue-700">{topThree[2].cyberAwarenessScore}</span>
              <span className="text-xs text-slate-500 block mt-1">Accuracy: {topThree[2].accuracy}%</span>
            </div>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={() => setSelectedStudent(topThree[2])}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Telemetry
              </button>
              <button
                onClick={() => setCertificateStudent(topThree[2])}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Ranked Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Leaderboard Standings ({sortedStudents.length} Students)
          </h2>
          <span className="text-xs text-slate-500">Sorted by Awareness Score &amp; Accuracy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Student &amp; Game ID</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Decision Time</th>
                <th className="py-3 px-4">Eye Attention</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((student, idx) => (
                <tr 
                  key={student.id}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black' :
                      idx === 1 ? 'bg-slate-200 text-slate-800' :
                      idx === 2 ? 'bg-amber-50 text-amber-800' :
                      'text-slate-400 font-normal'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{student.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">{student.gameId}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    Grade {student.grade}-{student.section}
                  </td>
                  <td className="py-3 px-4 font-black text-blue-700 text-sm">
                    {student.cyberAwarenessScore}/100
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">
                    {student.accuracy}%
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {student.avgDecisionTimeSec}s
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {student.behavioural.eyeTrackingAttentionScore}/100
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setCertificateStudent(student)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Generate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StudentDetailModal
        student={selectedStudent}
        school={school}
        onClose={() => setSelectedStudent(null)}
        onOpenCertificate={(std) => {
          setSelectedStudent(null);
          setCertificateStudent(std);
        }}
      />

      <CertificateModal
        student={certificateStudent}
        school={school}
        onClose={() => setCertificateStudent(null)}
      />
    </div>
  );
};
