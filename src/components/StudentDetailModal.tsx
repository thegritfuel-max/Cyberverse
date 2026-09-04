import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Shield, 
  Clock, 
  Eye, 
  BookOpen, 
  MousePointer, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Printer, 
  Target, 
  Sparkles, 
  TrendingUp,
  BrainCircuit,
  FileSpreadsheet
} from 'lucide-react';
import { StudentRecord, SchoolProfile } from '../types';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Props {
  student: StudentRecord | null;
  school: SchoolProfile;
  onClose: () => void;
  onOpenCertificate?: (student: StudentRecord) => void;
}

export const StudentDetailModal: React.FC<Props> = ({
  student,
  school,
  onClose,
  onOpenCertificate
}) => {
  if (!student) return null;

  const skillData = [
    { skill: 'Phishing Detection', score: student.skills.phishingDetection, fullMark: 100 },
    { skill: 'Password Security', score: student.skills.passwordSecurity, fullMark: 100 },
    { skill: 'Social Engineering', score: student.skills.socialEngineering, fullMark: 100 },
    { skill: 'URL Verification', score: student.skills.urlVerification, fullMark: 100 },
    { skill: 'Info Privacy', score: student.skills.informationPrivacy, fullMark: 100 },
    { skill: 'Threat Recognition', score: student.skills.threatRecognition, fullMark: 100 },
  ];

  const progressData = student.progressHistory.map(p => ({
    session: `Session ${p.sessionNumber}`,
    score: p.score,
    decisionTime: p.decisionTimeSec,
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleExportStudentCSV = () => {
    const data = [
      ["Metric", "Value"],
      ["Student Name", student.name],
      ["Game ID", student.gameId],
      ["Grade & Section", `Grade ${student.grade}-${student.section}`],
      ["Cyber Awareness Score", `${student.cyberAwarenessScore}/100`],
      ["Current Level", `Level ${student.currentLevel}/10`],
      ["Total Playtime", `${Math.floor(student.totalPlaytimeMinutes / 60)}h ${student.totalPlaytimeMinutes % 60}m`],
      ["Accuracy", `${student.accuracy}%`],
      ["Average Decision Time", `${student.avgDecisionTimeSec}s`],
      ["Risk Category", student.riskCategory],
      ["---", "---"],
      ["Reaction Time", `${student.behavioural.avgReactionTimeSec}s`],
      ["Hesitation Time", `${student.behavioural.hesitationTimeSec}s`],
      ["Click Count", student.behavioural.clickCount],
      ["Misclick Count", student.behavioural.misclickCount],
      ["Retry Count", student.behavioural.retryCount],
      ["Eye Tracking Attention Score", `${student.behavioural.eyeTrackingAttentionScore}/100`],
      ["Time on Critical Info", `${student.behavioural.timeSpentOnCriticalInfoSec}s`],
      ["Relevant Info Viewed", `${student.behavioural.percentageRelevantInfoViewed}%`],
      ["Suspicious Element Fixation", `${student.behavioural.suspiciousElementFixationSec}s`],
      ["Visual Scan Path", student.behavioural.visualScanPath],
      ["Dialogue Reading Time", `${student.behavioural.avgDialogueReadingTimeSec}s`],
      ["Instructions Skipped", student.behavioural.instructionsSkipped],
      ["Important Info Viewed", student.behavioural.importantInfoViewed],
      ["Re-reading Frequency", student.behavioural.reReadingFrequency],
      ["---", "---"],
      ["Phishing Detection", `${student.skills.phishingDetection}%`],
      ["Password Security", `${student.skills.passwordSecurity}%`],
      ["Social Engineering", `${student.skills.socialEngineering}%`],
      ["URL Verification", `${student.skills.urlVerification}%`],
      ["Information Privacy", `${student.skills.informationPrivacy}%`],
      ["Threat Recognition", `${student.skills.threatRecognition}%`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_${student.gameId}_Telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (category: string) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border ${student.badgeColor}`}>
              {student.initials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md">
                  {student.gameId}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskBadge(student.riskCategory)}`}>
                  {student.riskCategory}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Grade {student.grade} - Section {student.section} • Roll No. {student.rollNumber} • {school.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStudentCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              title="Download CSV Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Sheet
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              title="Print Telemetry Report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print
            </button>
            {onOpenCertificate && (
              <button
                onClick={() => onOpenCertificate(student)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                Certificate
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/40">
          
          {/* 1. Student Overview Section */}
          <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>1. Student Overview</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">In-Game Unity Real-time Telemetry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Cyber Awareness</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-700">{student.cyberAwarenessScore}</span>
                  <span className="text-xs font-bold text-slate-400">/100</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${student.cyberAwarenessScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Simulation Level</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">Level {student.currentLevel}</span>
                  <span className="text-xs font-bold text-slate-400">/10</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block mt-2">
                  {student.scenariosCompleted} scenarios completed
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Total Playtime</span>
                <div className="text-2xl font-bold text-slate-900">
                  {Math.floor(student.totalPlaytimeMinutes / 60)}h {student.totalPlaytimeMinutes % 60}m
                </div>
                <span className="text-[11px] text-slate-500 font-medium block mt-2">
                  Across {student.sessionsCompleted} active sessions
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Scenario Accuracy</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-600">{student.accuracy}%</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block mt-2">
                  Avg Decision: <strong className="text-slate-800">{student.avgDecisionTimeSec}s</strong>
                </span>
              </div>
            </div>
          </section>

          {/* 2. Behavioural Analytics Section */}
          <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <span>2. Behavioural Analytics (Game Engine & Eye-Tracking Backend)</span>
              </div>
              <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
                Biometric Telemetry Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Decision Behaviour */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm pb-2 border-b border-slate-200">
                  <MousePointer className="w-4 h-4 text-slate-600" />
                  <span>Decision Behaviour</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average Reaction Time:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.avgReactionTimeSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Average Decision Time:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.avgDecisionTimeSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Hesitation Time:</span>
                    <span className="font-semibold text-amber-700">{student.behavioural.hesitationTimeSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Click Count:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.clickCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Misclick Count:</span>
                    <span className={`font-semibold ${student.behavioural.misclickCount > 8 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {student.behavioural.misclickCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Scenario Retry Count:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.retryCount}</span>
                  </div>
                </div>
              </div>

              {/* Attention Analytics */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm pb-2 border-b border-slate-200">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Attention (Eye-Tracking)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Eye-Tracking Attention Score:</span>
                    <span className="font-bold text-blue-700">{student.behavioural.eyeTrackingAttentionScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Time on Critical Information:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.timeSpentOnCriticalInfoSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Relevant Info Viewed:</span>
                    <span className="font-semibold text-emerald-700">{student.behavioural.percentageRelevantInfoViewed}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Suspicious-Element Fixation:</span>
                    <span className="font-semibold text-amber-700">{student.behavioural.suspiciousElementFixationSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Visual Scan Path:</span>
                    <span className="font-semibold px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">
                      {student.behavioural.visualScanPath}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reading Analytics */}
              <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm pb-2 border-b border-slate-200">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  <span>Reading & Patience</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Avg Dialogue Reading Time:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.avgDialogueReadingTimeSec}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Instructions Skipped:</span>
                    <span className={`font-semibold ${student.behavioural.instructionsSkipped > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {student.behavioural.instructionsSkipped} {student.behavioural.instructionsSkipped > 0 ? '(Patience alert)' : '(Diligent)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Important Information Viewed:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.importantInfoViewed} items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Re-reading Frequency:</span>
                    <span className="font-semibold text-slate-900">{student.behavioural.reReadingFrequency} passes</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cybersecurity Skill Profile Section */}
          <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>3. Cybersecurity Skill Profile (Actionable Assessment)</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Domain Competency Benchmarks</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Radar & Bar Chart */}
              <div className="lg:col-span-7 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Skill Breakdown Bar Analysis
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={125} />
                      <Tooltip formatter={(val: any) => [`${val}%`, 'Proficiency']} />
                      <Bar dataKey="score" fill="#2563EB" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Phishing</span>
                    <span className="text-sm font-bold text-blue-700">{student.skills.phishingDetection}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">URL Verification</span>
                    <span className="text-sm font-bold text-amber-700">{student.skills.urlVerification}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Social Eng.</span>
                    <span className="text-sm font-bold text-indigo-700">{student.skills.socialEngineering}%</span>
                  </div>
                </div>
              </div>

              {/* Identified Weaknesses Box */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Identified Weaknesses & Behavioral Traps
                </h4>
                
                {student.identifiedWeaknesses.map((w, i) => (
                  <div key={w.id || i} className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">
                        {i + 1}. {w.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded">
                        {w.severity} Deficit
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {w.observation}
                    </p>
                    <p className="text-[11px] text-amber-800 italic">
                      Impact: {w.impact}
                    </p>
                  </div>
                ))}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <span className="font-bold block mb-1">Teacher Actionable Note:</span>
                  Students with URL verification &lt; 50% must be required to complete the interactive sandbox link inspector module before advancement.
                </div>
              </div>
            </div>
          </section>

          {/* 4. Progress & Adaptive Recommendations Section */}
          <section className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>4. Progress & Recommendations (Adaptive Engine Loop)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span>Play → Measure → Identify → Adapt → Improve</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Progress Line Chart */}
              <div className="lg:col-span-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Awareness Performance Over Time
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                      <YAxis domain={[30, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val: any) => [`${val}/100`, 'Awareness Score']} />
                      <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mt-2 px-2">
                  <span>Session 1: {student.progressHistory[0]?.score || 52}</span>
                  <span>→</span>
                  <span>Session 2: {student.progressHistory[1]?.score || 61}</span>
                  <span>→</span>
                  <span>Session 3: {student.progressHistory[2]?.score || 68}</span>
                  <span>→</span>
                  <span className="text-blue-700 font-bold">Session 4: {student.cyberAwarenessScore}</span>
                </div>
              </div>

              {/* Recommended Training Card */}
              <div className="lg:col-span-6 p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Recommended Adaptive Training
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded">
                    {student.recommendation.urgency} Priority
                  </span>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-indigo-950">
                    Focus Area: {student.recommendation.focusArea}
                  </h5>
                  <p className="text-xs text-indigo-900/90 mt-1 leading-relaxed">
                    {student.recommendation.description}
                  </p>
                </div>

                <div className="p-3 bg-white border border-indigo-200 rounded-lg text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">Suggested Unity Replay Scenario:</span>
                  <span className="font-bold text-blue-700 block">
                    {student.recommendation.recommendedScenario}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-indigo-100/50 p-2 rounded border border-indigo-200/60 font-medium">
                  <strong>Adaptive AI Closing the Loop:</strong> Student will receive extra dynamic NPC branching traps in their next Unity session to test if they verify sender authority before executing instructions.
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Student Game PIN: <strong className="text-slate-800 font-mono text-sm">{student.accessPin}</strong> (For Unity client login)</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};
