import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  Shield, 
  KeyRound, 
  Printer, 
  CheckCircle2, 
  Gamepad2, 
  FileText, 
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';
import { GradeLevel, StudentRecord, SchoolProfile } from '../../types';
import { createNewStudent } from '../../services/schoolService';

interface Props {
  school: SchoolProfile;
  onStudentCreated: (student: StudentRecord) => void;
}

export const EnrollStudent: React.FC<Props> = ({ school, onStudentCreated }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('9');
  const [section, setSection] = useState<'A' | 'B' | 'C'>('A');
  const [rollNumber, setRollNumber] = useState<number>(1);
  const [createdStudent, setCreatedStudent] = useState<StudentRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent = createNewStudent({
      name: name.trim(),
      grade,
      section,
      rollNumber: Number(rollNumber) || 1,
    });

    setCreatedStudent(newStudent);
    onStudentCreated(newStudent);
  };

  const handleReset = () => {
    setName('');
    setCreatedStudent(null);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
          <UserPlus className="w-4 h-4 text-blue-600" />
          Enrollment &amp; Game ID Provisioning
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Enroll New Student &amp; Generate Unity Game ID
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Assign an automated CyberVerse Game ID and unique login PIN for any student in Grades 6 through 12. Students use these credentials to log in to the 3D Unity simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Enrollment Form */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Student Academic Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma or Emma Watson"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Roll Number</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
              <span className="font-bold block">Automated Provisioning:</span>
              <p className="text-blue-800">
                The ERP assigns a secure Game ID prefix matching Grade {grade} and auto-provisions a 4-digit PIN mapped to school: <strong>{school.name}</strong>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              Generate Unity Game Credentials
            </button>
          </form>
        </div>

        {/* Right: Credentials Card Preview & Print */}
        <div className="md:col-span-6 space-y-4">
          {createdStudent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Credentials Successfully Generated!
                </div>
                <button
                  onClick={handlePrintCard}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Card
                </button>
              </div>

              {/* Printable Access Slip */}
              <div className="border-2 border-dashed border-slate-300 p-5 rounded-xl bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    CyberVerse Student Access Pass
                  </span>
                  <span className="text-[10px] font-bold text-blue-700">Unity 3D Simulation</span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">{createdStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Grade {createdStudent.grade}-{createdStudent.section} • Roll #{createdStudent.rollNumber} • {school.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Game ID</span>
                    <span className="text-sm font-mono font-black text-blue-700 block">
                      {createdStudent.gameId}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Access PIN</span>
                    <span className="text-sm font-mono font-black text-slate-900 block">
                      {createdStudent.accessPin}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 leading-tight">
                  <strong>Student Instructions:</strong> Launch the CyberVerse desktop/web Unity application, select "Enter School Session", enter your Game ID and 4-digit PIN, then begin Scene 1 First Day Induction.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                >
                  Enroll Another Student
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Awaiting Student Submission</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Fill in the student name, grade, and section to generate a physical game credentials card that can be handed directly to the learner.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
