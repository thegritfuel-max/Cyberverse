import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Check, 
  Save, 
  Upload, 
  Sparkles, 
  Award, 
  RotateCcw,
  CheckCircle2,
  Server
} from 'lucide-react';
import { SchoolProfile } from '../../types';
import { saveSchoolProfile } from '../../services/schoolService';

interface Props {
  school: SchoolProfile;
  onUpdateSchool: (profile: SchoolProfile) => void;
}

export const SchoolSettings: React.FC<Props> = ({ school, onUpdateSchool }) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...school });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    { id: 'shield', label: 'Academic Shield', desc: 'Traditional crest with security shield' },
    { id: 'crest', label: 'Institutional Seal', desc: 'Formal university / school crest' },
    { id: 'tech', label: 'STEM Circuit', desc: 'Modern high-tech computing icon' },
    { id: 'cyber', label: 'Cyber Defense', desc: 'Symmetric lock & guardian emblem' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolProfile(formData);
    onUpdateSchool(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            logoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            School &amp; Institutional Configuration
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            School Branding &amp; Teacher Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Customize the school name, emblem, and associated teacher signature. These changes instantly reflect across student certificates, exports, and dashboard headers.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
            School Details Saved &amp; Applied!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic School Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            1. Institutional Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                School / College Official Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Oakridge International STEM Academy"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                This exact name will be stamped onto all student certificates and telemetry sheets.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Campus or Department
              </label>
              <input
                type="text"
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                placeholder="e.g. Senior Cyber Wing, Block C"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Accreditation / School License Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. OAK-CYBER-2026"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Associated Teacher & Signatory Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            2. Associated Teacher &amp; Signatory Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Teacher In-Charge Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                placeholder="e.g. Dr. Alistair Vance"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Teacher Title / Designation
              </label>
              <input
                type="text"
                value={formData.teacherTitle}
                onChange={(e) => setFormData({ ...formData, teacherTitle: e.target.value })}
                placeholder="e.g. Head of Cyber Safety"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={formData.teacherEmail}
                onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                placeholder="e.g. teacher@school.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* School Logo & Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            3. School Logo &amp; Certificate Emblem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Select Logo Emblem Style
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {presets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, logoPreset: p.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.logoPreset === p.id 
                        ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold">{p.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{p.desc}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Or Upload Custom School Crest (PNG / JPG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Branding Preview */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center text-center space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Certificate Header Preview
              </span>
              <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-2xl border-2 border-amber-500 shadow-sm overflow-hidden">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  formData.name[0] || 'C'
                )}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{formData.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{formData.campus}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Cert Signed By: {formData.teacherName} ({formData.teacherTitle})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Unity Server Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">CyberVerse Unity Server Bridge</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-700">Connected (24ms)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live synchronization with 3D client game sessions across school computer labs.
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-slate-400 block">Active Licensed Seats</span>
            <span className="font-bold text-slate-800 text-sm">75 / {formData.totalLicensedSeats} Seats</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Apply Changes Across ERP &amp; Certificates
          </button>
        </div>
      </form>
    </div>
  );
};
