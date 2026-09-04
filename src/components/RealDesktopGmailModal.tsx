import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Download, 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  Clock, 
  Tag, 
  Folder, 
  MoreVertical, 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Settings, 
  Grid, 
  Star, 
  Reply, 
  Forward, 
  Paperclip, 
  FileText, 
  CheckSquare, 
  ChevronDown, 
  RotateCw, 
  X, 
  Maximize2, 
  Minimize2, 
  Minus, 
  Lock, 
  Globe, 
  Crosshair, 
  Eye, 
  Zap, 
  AlertCircle
} from 'lucide-react';
import { ScreenGazeCoordinate, ScreenMissedCoordinate } from '../types';

interface Props {
  isOpen: boolean;
  timeLeft: number;
  liveGaze: { x: number; y: number }; // In viewport pixels
  activeTrackingMode: 'webcam' | 'synthetic';
  onDecision: (
    decision: 'reported' | 'clicked_link' | 'downloaded_attachment' | 'timeout',
    lookedAt: ScreenGazeCoordinate[],
    missed: ScreenMissedCoordinate[]
  ) => void;
  onClose: () => void;
}

interface TargetElementInfo {
  id: string;
  name: string;
  category: 'Security Indicator' | 'Urgency Prompt' | 'Deceptive Payload' | 'General Content';
  isCriticalThreatIndicator: boolean;
  dangerLevel: 'Critical' | 'High' | 'Moderate';
  reasonMissed: string;
  consequence: string;
}

export const RealDesktopGmailModal: React.FC<Props> = ({
  isOpen,
  timeLeft,
  liveGaze,
  activeTrackingMode,
  onDecision,
  onClose,
}) => {
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [gazeHistory, setGazeHistory] = useState<{ x: number; y: number; time: number; targetId: string }[]>([]);
  const dwellMapRef = useRef<Record<string, { durationMs: number; lastCoord: { x: number; y: number } }>>({});
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Defined critical target zones on the Gmail screen
  const criticalTargets: Record<string, TargetElementInfo> = {
    'sender_fake_domain': {
      id: 'sender_fake_domain',
      name: 'Deceptive Sender Domain (.fake-auth.site)',
      category: 'Security Indicator',
      isCriticalThreatIndicator: true,
      dangerLevel: 'Critical',
      reasonMissed: 'Iris gaze skipped sender address; failed to spot fake domain replacing authentic @kitcoek.in.',
      consequence: 'Would trust unauthorized cyber adversary impersonating KIT Autonomous Exam Cell.'
    },
    'gmail_security_warning': {
      id: 'gmail_security_warning',
      name: 'Google Phishing Security Banner',
      category: 'Security Indicator',
      isCriticalThreatIndicator: true,
      dangerLevel: 'Critical',
      reasonMissed: 'Ignored prominent red warning banner: "Google could not verify that it actually came from kitcoek.in".',
      consequence: 'Overlooked automated mail-gateway threat detection warning.'
    },
    'spf_dkim_failure': {
      id: 'spf_dkim_failure',
      name: 'SPF Authentication Failure & Russia Reply-To Address',
      category: 'Security Indicator',
      isCriticalThreatIndicator: true,
      dangerLevel: 'High',
      reasonMissed: 'Did not inspect security drop-down details containing mismatched reply-to node (@untrusted-network.ru).',
      consequence: 'Missed covert exfiltration route in email headers.'
    },
    'phishing_action_url': {
      id: 'phishing_action_url',
      name: 'Typosquatted Exam Verification URL (kitcoek-exam-verification.online)',
      category: 'Deceptive Payload',
      isCriticalThreatIndicator: true,
      dangerLevel: 'Critical',
      reasonMissed: 'Did not hover or scan verification button URL before taking action; overlooked non-.in TLD.',
      consequence: 'Would submit autonomous student seat credentials to adversary credential harvester.'
    },
    'malicious_attachment_exe': {
      id: 'malicious_attachment_exe',
      name: 'Disguised Executable (.pdf.exe) Payload',
      category: 'Deceptive Payload',
      isCriticalThreatIndicator: true,
      dangerLevel: 'Critical',
      reasonMissed: 'Failed to inspect file extension syntax; mistook dangerous Windows .exe binary for genuine PDF.',
      consequence: 'Would execute campus network malware backdoor on student workstation.'
    },
    'urgency_timer_threat': {
      id: 'urgency_timer_threat',
      name: 'Psychological Urgency Prompt ("15 Minutes Deadline")',
      category: 'Urgency Prompt',
      isCriticalThreatIndicator: false,
      dangerLevel: 'Moderate',
      reasonMissed: 'Did not recognize psychological manipulation tactic forcing quick uncalculated clicks.',
      consequence: 'Vulnerable to emotional pressure tactics during high-stress exam periods.'
    },
    'subject_line': {
      id: 'subject_line',
      name: 'Subject Line & Autonomous Hall Ticket Pretext',
      category: 'General Content',
      isCriticalThreatIndicator: false,
      dangerLevel: 'Moderate',
      reasonMissed: 'Did not analyze context of why an autonomous exam cell would ask for password re-verification.',
      consequence: 'Vulnerable to campus authority impersonation.'
    }
  };

  // Check collision between live gaze coordinates (X, Y) and DOM elements
  useEffect(() => {
    if (!isOpen) return;

    // Detect which element is currently intersected by live gaze
    let activeTargetId = 'general_screen';
    const targetElements = document.querySelectorAll('[data-gaze-target]');
    
    targetElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Add a generous 15px bounding threshold for eye-tracking saccades
      if (
        liveGaze.x >= rect.left - 15 &&
        liveGaze.x <= rect.right + 15 &&
        liveGaze.y >= rect.top - 15 &&
        liveGaze.y <= rect.bottom + 15
      ) {
        const id = el.getAttribute('data-gaze-target');
        if (id) {
          activeTargetId = id;
        }
      }
    });

    // Record dwell time
    if (!dwellMapRef.current[activeTargetId]) {
      dwellMapRef.current[activeTargetId] = {
        durationMs: 100,
        lastCoord: { x: liveGaze.x, y: liveGaze.y }
      };
    } else {
      dwellMapRef.current[activeTargetId].durationMs += 100;
      dwellMapRef.current[activeTargetId].lastCoord = { x: liveGaze.x, y: liveGaze.y };
    }

    setGazeHistory(prev => [
      ...prev.slice(-30), // keep recent trail for visual saccade path
      { x: liveGaze.x, y: liveGaze.y, time: Date.now(), targetId: activeTargetId }
    ]);
  }, [liveGaze, isOpen]);

  // Handle finalize test on click or timeout
  const handleCompleteDecision = (decisionType: 'reported' | 'clicked_link' | 'downloaded_attachment' | 'timeout') => {
    const lookedAtList: ScreenGazeCoordinate[] = [];
    const missedList: ScreenMissedCoordinate[] = [];

    // Evaluate each critical target
    Object.entries(criticalTargets).forEach(([key, info]) => {
      const dwell = dwellMapRef.current[key];
      const durationSec = dwell ? Number((dwell.durationMs / 1000).toFixed(2)) : 0;
      const coord = dwell ? dwell.lastCoord : { x: 450 + (Math.random() * 80), y: 220 + (Math.random() * 120) };

      if (durationSec >= 0.2) {
        lookedAtList.push({
          id: info.id,
          x: Math.round(coord.x),
          y: Math.round(coord.y),
          targetName: info.name,
          dwellDurationSec: durationSec,
          fixated: durationSec >= 0.8,
          category: info.category
        });
      } else {
        if (info.isCriticalThreatIndicator) {
          missedList.push({
            id: info.id,
            x: Math.round(coord.x),
            y: Math.round(coord.y),
            targetName: info.name,
            dangerLevel: info.dangerLevel,
            reasonMissed: info.reasonMissed,
            consequence: info.consequence
          });
        }
      }
    });

    onDecision(decisionType, lookedAtList, missedList);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
    >
      {/* Real Computer Screen Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-[1240px] h-[92vh] max-h-[860px] bg-[#F6F8FC] rounded-2xl border-2 border-slate-700 shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* TOP OS BROWSER BAR: Google Chrome Style */}
        <div className="bg-[#DFE1E5] border-b border-[#C1C4CA] pt-2 px-3 flex flex-col shrink-0">
          
          {/* Tabs row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              
              {/* Active Tab: Gmail */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F6F8FC] rounded-t-xl text-xs font-semibold text-slate-800 shadow-xs border-t border-x border-slate-300 min-w-[200px] max-w-[260px]">
                {/* Gmail icon */}
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.691 2.279 24 3.434 24 5.457z"/>
                  </svg>
                </div>
                <span className="truncate text-[11px]">Inbox (1) - kiran.patil@kitcoek.in - Gmail</span>
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 ml-auto shrink-0" />
              </div>

              {/* Inactive Tab 1 */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-200/60 rounded-t-lg text-[11px] font-medium min-w-[140px] max-w-[180px] truncate">
                <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">KITCoEK Moodle Portal</span>
              </div>

              {/* Inactive Tab 2 */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-200/60 rounded-t-lg text-[11px] font-medium min-w-[140px] max-w-[180px] truncate">
                <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">Autonomous Exam Cell</span>
              </div>
            </div>

            {/* Window Controls (macOS / Windows style) */}
            <div className="flex items-center gap-2 pl-4">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity" 
                title="Exit Trial"
              />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
          </div>

          {/* Omnibox / URL navigation bar */}
          <div className="py-1.5 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500">
              <button className="p-1 hover:bg-slate-200 rounded transition-colors"><ArrowLeft className="w-3.5 h-3.5" /></button>
              <button className="p-1 hover:bg-slate-200 rounded transition-colors rotate-180"><ArrowLeft className="w-3.5 h-3.5" /></button>
              <button className="p-1 hover:bg-slate-200 rounded transition-colors"><RotateCw className="w-3.5 h-3.5" /></button>
            </div>

            {/* URL input field */}
            <div className="flex-1 bg-white border border-slate-300 rounded-full px-3.5 py-1 flex items-center gap-2 shadow-2xs">
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-mono text-slate-700 truncate">
                https://mail.google.com/mail/u/0/#inbox/KITCoEK-Autonomous-Exam-2026-Alert
              </span>
              <span className="text-[10px] text-slate-400 ml-auto font-mono shrink-0 hidden md:inline">
                Verified SSL / TLS 1.3
              </span>
            </div>

            {/* Profile badge in Chrome */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                KP
              </div>
            </div>
          </div>
        </div>

        {/* GMAIL AUTHENTIC TOP HEADER */}
        <div className="h-14 bg-[#F6F8FC] border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger */}
            <button className="p-2 hover:bg-slate-200/70 rounded-full text-slate-600 transition-colors">
              <div className="w-4 h-0.5 bg-slate-600 mb-1" />
              <div className="w-4 h-0.5 bg-slate-600 mb-1" />
              <div className="w-4 h-0.5 bg-slate-600" />
            </button>

            {/* Gmail Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 12.713L1.636 4.91c.28-.564.86-.91 1.5-.91h17.728c.64 0 1.22.346 1.5.91L12 12.713z"/>
                <path fill="#4285F4" d="M22.364 4.91c.28.564.455 1.196.455 1.865v12.274c0 1.205-.977 2.182-2.182 2.182h-3.818V11.73L12 15.636l-4.818-3.906V21.23H3.364c-1.205 0-2.182-.977-2.182-2.182V6.775c0-.669.175-1.301.455-1.865L12 12.713l10.364-7.803z"/>
              </svg>
              <span className="text-xl font-normal text-slate-700 font-sans tracking-tight">Gmail</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="w-full bg-[#EAF1FB] hover:bg-[#E2EBF8] hover:shadow-xs transition-all rounded-full px-4 py-2 flex items-center gap-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white">
              <Search className="w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                readOnly
                value="from:exam-verification@kitcoek-portal-exam-gov.ac.in.fake-auth.site"
                className="bg-transparent text-xs text-slate-800 w-full focus:outline-none font-mono"
              />
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Right utility icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-200/70 rounded-full text-slate-600"><HelpCircle className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-200/70 rounded-full text-slate-600"><Settings className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-200/70 rounded-full text-slate-600"><Grid className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center ml-2 border border-blue-950">
              KP
            </div>
          </div>
        </div>

        {/* GMAIL BODY VIEW (SIDEBAR + EMAIL WORKSPACE) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* GMAIL LEFT SIDEBAR */}
          <div className="w-56 bg-[#F6F8FC] border-r border-slate-200/80 p-3 flex flex-col justify-between shrink-0 hidden sm:flex">
            <div className="space-y-3">
              {/* Compose Button */}
              <button className="flex items-center gap-3 px-6 py-3.5 bg-[#C2E7FF] hover:bg-[#B3E1FF] text-[#001D35] rounded-2xl text-xs font-bold shadow-xs transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M11 5v6H5v2h6v6h2v-6h6v-2h-6V5z"/>
                </svg>
                <span>Compose</span>
              </button>

              {/* Folders Navigation */}
              <div className="space-y-0.5 text-xs font-medium text-slate-700">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#D3E3FD] text-[#041E49] font-bold rounded-r-full">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span>Inbox</span>
                  </div>
                  <span className="text-[11px] font-bold">1</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/60 rounded-r-full text-slate-600">
                  <Star className="w-4 h-4 text-slate-400" />
                  <span>Starred</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/60 rounded-r-full text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Snoozed</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/60 rounded-r-full text-slate-600">
                  <SendIcon className="w-4 h-4 text-slate-400" />
                  <span>Sent</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/60 rounded-r-full text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Drafts</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-200/60 rounded-r-full text-rose-700 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Spam</span>
                </div>
              </div>
            </div>

            {/* Meet / Institutional quick info */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700">KIT Kolhapur Domain</div>
              <p>Google Workspace for Education | Dr. Kiran Patil</p>
            </div>
          </div>

          {/* MAIN EMAIL CONTAINER */}
          <div className="flex-1 bg-white overflow-y-auto flex flex-col relative">
            
            {/* Action Bar */}
            <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-3 text-slate-600">
                <button className="p-1 hover:bg-slate-100 rounded" title="Back to Inbox"><ArrowLeft className="w-4 h-4" /></button>
                <div className="h-4 w-px bg-slate-200" />
                <button className="p-1 hover:bg-slate-100 rounded" title="Archive"><Archive className="w-4 h-4" /></button>
                <button 
                  onClick={() => handleCompleteDecision('reported')}
                  className="p-1 hover:bg-slate-100 rounded text-amber-700" 
                  title="Report spam / phishing"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                <div className="h-4 w-px bg-slate-200" />
                <button className="p-1 hover:bg-slate-100 rounded" title="Mark as unread"><Mail className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-slate-100 rounded" title="Snooze"><Clock className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-slate-100 rounded" title="Labels"><Tag className="w-4 h-4" /></button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                1 of 1
              </div>
            </div>

            {/* EMAIL MESSAGE WORKSPACE */}
            <div className="p-6 space-y-4 max-w-4xl">
              
              {/* Subject Title */}
              <div 
                data-gaze-target="subject_line"
                className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4"
              >
                <div className="space-y-2">
                  <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    URGENT: KITCoEK Autonomous Examination Hall Ticket &amp; Mandatory Cloud Verification
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-md">
                      Inbox
                    </span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-md">
                      Important
                    </span>
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-xs font-bold rounded-md">
                      Security Alert
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-500"><Star className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Reply className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* SENDER INFO ROW */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Sender Avatar */}
                  <div className="w-12 h-12 rounded-full bg-rose-100 border-2 border-rose-300 text-rose-800 font-bold flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-rose-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-base text-slate-900">
                        KIT Autonomous Examination Cell Kolhapur
                      </span>
                      {/* SENDER ADDRESS TARGET */}
                      <span 
                        data-gaze-target="sender_fake_domain"
                        className="text-sm font-mono text-rose-700 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-md font-bold cursor-pointer"
                        title="Notice the suspicious typosquatted domain: .fake-auth.site"
                      >
                        &lt;exam-verification@kitcoek-portal-exam-gov.ac.in.fake-auth.site&gt;
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 flex items-center gap-1.5">
                      <span>to me (Dr. Kiran Patil &lt;kiran.patil@kitcoek.in&gt;)</span>
                      <button 
                        onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 inline-flex items-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SPF/DKIM Security details drop-down */}
                    {showSecurityDetails && (
                      <div 
                        data-gaze-target="spf_dkim_failure"
                        className="p-3.5 mt-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono space-y-1 text-slate-800"
                      >
                        <div><strong>From:</strong> exam-verification@kitcoek-portal-exam-gov.ac.in.fake-auth.site</div>
                        <div className="text-rose-600 font-bold"><strong>Reply-To:</strong> attacker-stealer@untrusted-network.ru</div>
                        <div><strong>To:</strong> kiran.patil@kitcoek.in</div>
                        <div><strong>Date:</strong> Today, 10:42 AM (3 mins ago)</div>
                        <div className="text-rose-600 font-bold"><strong>Security:</strong> Standard TLS - SPF Verification FAILED (unauthorized host IP)</div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs text-slate-500 shrink-0 font-mono">
                  10:42 AM (3 mins ago)
                </span>
              </div>

              {/* AUTHENTIC GMAIL PHISHING WARNING BANNER */}
              <div 
                data-gaze-target="gmail_security_warning"
                className="p-4 bg-[#FFF4E5] border-2 border-[#FFCC80] rounded-xl flex items-start gap-3.5 text-sm text-[#663C00]"
              >
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <div className="font-bold text-base text-amber-950">
                    Be careful with this message.
                  </div>
                  <p className="text-sm leading-relaxed text-amber-900">
                    Google could not verify that this message actually came from <strong>kitcoek.in</strong>. Avoid clicking links or downloading attachments from unverified senders. Similar messages were used to steal student passwords and university credentials.
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <button 
                      onClick={() => handleCompleteDecision('reported')}
                      className="text-sm font-bold text-blue-700 hover:underline"
                    >
                      Report spam
                    </button>
                    <button className="text-sm text-slate-600 hover:underline">
                      Looks safe
                    </button>
                  </div>
                </div>
              </div>

              {/* OFFICIAL EMAIL BODY: Tailored specifically to KIT's College of Engineering Kolhapur */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                
                {/* Official College Header Letterhead */}
                <div className="bg-[#1E293B] text-white p-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shrink-0">
                      <img 
                        src="https://i.postimg.cc/5yYw8KNq/kit-logo.png" 
                        alt="KIT College of Engineering Kolhapur" 
                        className="h-10 w-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight uppercase text-white">
                        Kolhapur Institute of Technology's College of Engineering (Autonomous)
                      </h4>
                      <p className="text-xs text-slate-300">
                        Office of the Controller of Examinations | Gokul Shirgaon, Kolhapur
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body text */}
                <div className="p-6 text-base text-slate-800 leading-relaxed space-y-4">
                  <p className="font-bold text-slate-900">Dear Student / Faculty Member of KIT Kolhapur,</p>
                  
                  <p>
                    This is an automated notification from the <strong>Autonomous Examination Seating &amp; Hall Ticket Allocation System</strong> for the upcoming Semester Examinations (Session Winter 2026).
                  </p>

                  {/* Urgency Prompt Target */}
                  <div 
                    data-gaze-target="urgency_timer_threat"
                    className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl text-rose-950 space-y-1.5 font-medium"
                  >
                    <div className="font-bold text-base flex items-center gap-2 text-rose-900">
                      <Clock className="w-5 h-5 text-rose-600" />
                      CRITICAL COMPLIANCE NOTICE: 15 MINUTES DEADLINE
                    </div>
                    <p className="text-sm leading-relaxed">
                      A severe database seating discrepancy has been identified regarding your PRN Number. If identity verification is not confirmed within <strong>15 minutes</strong>, your examination hall ticket will be permanently deactivated.
                    </p>
                  </div>

                  <p>
                    You are directed to click the autonomous server link below and authenticate your student portal credentials immediately:
                  </p>

                  {/* DECEPTIVE VERIFICATION LINK BUTTON */}
                  <div className="py-2 space-y-1.5">
                    <a
                      data-gaze-target="phishing_action_url"
                      href="#auth"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCompleteDecision('clicked_link');
                      }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-sm rounded-xl shadow-xs transition-colors group"
                      title="Deceptive Link: http://kitcoek-exam-verification.online/login?session=KT-2026-ENG-AUTONOMOUS"
                    >
                      <span>AUTHENTICATE AUTONOMOUS SEAT ALLOCATION</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <span className="block text-xs text-slate-500 font-mono">
                      Target URL: http://kitcoek-exam-verification.online/auth/login?token=KT-2026-EXAM-VERIFY
                    </span>
                  </div>

                  {/* MALICIOUS ATTACHMENT TARGET */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="font-bold text-sm text-slate-800 block mb-2">
                      1 Attachment (Scanned Document):
                    </span>

                    <div 
                      data-gaze-target="malicious_attachment_exe"
                      onClick={() => handleCompleteDecision('downloaded_attachment')}
                      className="max-w-md p-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                          PDF
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block truncate group-hover:text-blue-600">
                            KITCoEK_HallTicket_Verification.pdf.exe
                          </span>
                          <span className="text-xs font-mono text-rose-600 font-bold">
                            480 KB • Executable Binary File (.exe)
                          </span>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 pt-3">
                    Regards,<br />
                    <strong className="text-slate-900">Controller of Examinations</strong><br />
                    KIT's College of Engineering (Autonomous), Kolhapur
                  </p>
                </div>
              </div>

              {/* Bottom Quick Actions inside Gmail */}
              <div className="pt-4 flex items-center gap-3">
                <button className="px-5 py-2.5 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button className="px-5 py-2.5 border border-slate-300 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM TACTICAL TOOLBAR FOR THE TEACHER & STUDENT */}
        <div className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between border-t border-slate-800 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-300 hidden sm:inline">
              Candidate Action:
            </span>
            <button
              onClick={() => handleCompleteDecision('reported')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Flag as Phishing (Safe)</span>
            </button>
            <button
              onClick={() => handleCompleteDecision('clicked_link')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors hidden md:inline-flex"
            >
              Simulate Clicking Phishing Link
            </button>
          </div>

          <div className="flex items-center gap-4 font-mono text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <span className={`w-2.5 h-2.5 rounded-full ${activeTrackingMode === 'webcam' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className={activeTrackingMode === 'webcam' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {activeTrackingMode === 'webcam' ? 'REAL WEBCAM IRIS ACTIVE' : 'PRECISION TRACKER'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors"
            >
              Exit Trial
            </button>
          </div>
        </div>

        {/* FLOATING TOP-RIGHT EYE-TRACKING TELEMETRY HUD */}
        <div className="absolute top-16 right-4 z-40 bg-slate-950/90 text-white px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-400">TRIAL RUNNING</span>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          <div>
            <span className="text-slate-400 text-[10px] block">TIME LEFT</span>
            <span className="font-bold text-amber-400 text-sm">{timeLeft}s</span>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          <div>
            <span className="text-slate-400 text-[10px] block">IRIS GAZE (X, Y)</span>
            <span className="font-bold text-blue-400">
              X:{Math.round(liveGaze.x)}px Y:{Math.round(liveGaze.y)}px
            </span>
          </div>
        </div>

        {/* LIVE OCULAR GAZE RETICLE OVERLAY (Following gaze across the Gmail screen!) */}
        <div 
          className="fixed pointer-events-none z-50 transition-all duration-75 ease-out"
          style={{
            left: `${liveGaze.x}px`,
            top: `${liveGaze.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Outer pulsed ring */}
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/80 bg-emerald-500/10 flex items-center justify-center animate-pulse">
            {/* Crosshairs */}
            <div className="w-5 h-0.5 bg-emerald-400" />
            <div className="h-5 w-0.5 bg-emerald-400 absolute" />
            {/* Center pupil dot */}
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// Simple Send icon replacement
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
