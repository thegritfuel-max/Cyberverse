import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Award, Download, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StudentRecord, SchoolProfile } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  student: StudentRecord | null;
  school: SchoolProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ student, school, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!student) return null;

  const issueDate = student.certifiedDate || new Date().toISOString().split('T')[0];
  const isHighHonors = student.cyberAwarenessScore >= 85;

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`CyberVerse_Certificate_${student.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* Header Actions */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Official Cybersecurity Awareness Certificate</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Exporting PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center items-center bg-slate-100">
          <div
            ref={certRef}
            className="w-full max-w-[840px] aspect-[1.414/1] bg-white border-12 border-slate-800 p-8 sm:p-10 relative flex flex-col justify-between shadow-xl text-center select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #FAFCFF 0%, #FFFFFF 100%)',
            }}
          >
            {/* Inner Guilloche Ornamental Border */}
            <div className="absolute inset-2 border-2 border-amber-600/60 pointer-events-none" />
            <div className="absolute inset-3.5 border border-dashed border-slate-300 pointer-events-none" />

            {/* Corner Badges */}
            <div className="absolute top-5 left-5 text-[10px] font-mono text-slate-400 font-semibold">
              ID: {student.certificateId}
            </div>
            <div className="absolute top-5 right-5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              SECURE VERIFIED
            </div>

            {/* Header: School Logo & CyberVerse Seal */}
            <div className="mt-2">
              <div className="flex items-center justify-center gap-6 mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl border-2 border-amber-500 shadow-xs">
                  {school.name[0] || 'C'}
                </div>
                <div className="text-center">
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-500 font-extrabold block">
                    {school.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Department of Digital Safety & Cybersecurity Literacy
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase mt-4">
                Certificate of Cybersecurity Competence
              </h1>
              <p className="text-xs uppercase tracking-widest text-blue-800 font-bold mt-1">
                CyberVerse Interactive Simulation & Threat Detection Assessment
              </p>
            </div>

            {/* Recipient Details */}
            <div className="my-4">
              <p className="text-xs text-slate-500 italic">This certifies that</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight my-1 border-b-2 border-slate-200 pb-1 inline-block px-8">
                {student.name}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-2">
                Game Identifier: <span className="font-mono text-slate-900">{student.gameId}</span> • Grade {student.grade}, Section {student.section}
              </p>
              <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                has successfully executed all 3D Unity threat scenarios, demonstrating robust tactical awareness against phishing campaigns, social engineering traps, rogue networks, and credential exploitation.
              </p>
            </div>

            {/* Score & Honors Badge */}
            <div className="flex items-center justify-center gap-6 my-2">
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Awareness Score</span>
                <span className="text-xl font-black text-blue-700">{student.cyberAwarenessScore}/100</span>
              </div>
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Threat Accuracy</span>
                <span className="text-xl font-black text-emerald-600">{student.accuracy}%</span>
              </div>
              {isHighHonors && (
                <div className="px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Distinction</span>
                  <span className="text-xs font-black text-amber-900 uppercase">Cyber Defender Honors</span>
                </div>
              )}
            </div>

            {/* Signatures & Footer */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 items-end text-center">
              <div>
                <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 mb-1 mx-4">
                  {school.teacherName}
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{school.teacherTitle}</p>
                <p className="text-[9px] text-slate-400">{school.name}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-600/80 flex items-center justify-center p-1 bg-amber-50/50">
                  <ShieldCheck className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">Official CyberVerse Seal</span>
              </div>

              <div>
                <div className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 mb-1 mx-4">
                  Dr. Marcus Sterling
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Director of Unity Simulation</p>
                <p className="text-[9px] text-slate-400">CyberVerse Global Initiative • {issueDate}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
