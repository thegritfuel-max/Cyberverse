import { StudentRecord, SchoolProfile, GradeLevel, RiskCategory } from '../types';
import { initialStudents, initialSchoolProfile } from '../data/mockCyberData';

const STUDENTS_KEY = 'cyberverse_students_kitcoek_v2';
const SCHOOL_KEY = 'cyberverse_school_profile_kitcoek_v2';

export function getStoredSchoolProfile(): SchoolProfile {
  try {
    const saved = localStorage.getItem(SCHOOL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.name === 'string' && (parsed.name.includes("KIT") || parsed.name.includes("Kolhapur"))) {
        if (!parsed.logoUrl) {
          parsed.logoUrl = initialSchoolProfile.logoUrl;
          saveSchoolProfile(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load school profile', e);
  }
  saveSchoolProfile(initialSchoolProfile);
  return initialSchoolProfile;
}

export function saveSchoolProfile(profile: SchoolProfile): void {
  try {
    localStorage.setItem(SCHOOL_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('cyberverse-school-updated'));
  } catch (e) {
    console.error('Failed to save school profile', e);
  }
}

export function getStoredStudents(): StudentRecord[] {
  try {
    const saved = localStorage.getItem(STUDENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name.includes("Patil")) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load students', e);
  }
  // Initialize with the 75 students
  saveStudents(initialStudents);
  return initialStudents;
}

export function saveStudents(students: StudentRecord[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event('cyberverse-students-updated'));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

export function createNewStudent(data: {
  name: string;
  grade: GradeLevel;
  section: 'A' | 'B' | 'C';
  rollNumber: number;
}): StudentRecord {
  const currentList = getStoredStudents();
  const nextIdNum = 1100 + currentList.length + 1;
  const gameId = `CV-G${data.grade}-${nextIdNum}`;
  const pin = `${Math.floor(1000 + Math.random() * 9000)}`;
  const initials = data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const newStudent: StudentRecord = {
    id: `std-${nextIdNum}`,
    gameId,
    accessPin: pin,
    name: data.name,
    grade: data.grade,
    section: data.section,
    rollNumber: data.rollNumber,
    initials,
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    cyberAwarenessScore: 68,
    currentLevel: 4,
    totalPlaytimeMinutes: 45,
    sessionsCompleted: 1,
    scenariosCompleted: 2,
    accuracy: 74,
    avgDecisionTimeSec: 3.8,
    riskCategory: 'Moderate',
    isLiveActive: false,
    behavioural: {
      avgReactionTimeSec: 1.9,
      avgDecisionTimeSec: 3.8,
      hesitationTimeSec: 2.3,
      clickCount: 84,
      misclickCount: 11,
      retryCount: 2,
      eyeTrackingAttentionScore: 72,
      timeSpentOnCriticalInfoSec: 19,
      percentageRelevantInfoViewed: 76,
      suspiciousElementFixationSec: 3.1,
      visualScanPath: 'Skimming',
      avgDialogueReadingTimeSec: 5.1,
      instructionsSkipped: 2,
      importantInfoViewed: 11,
      reReadingFrequency: 3,
    },
    skills: {
      phishingDetection: 65,
      passwordSecurity: 82,
      socialEngineering: 58,
      urlVerification: 44,
      informationPrivacy: 70,
      threatRecognition: 62,
    },
    identifiedWeaknesses: [
      {
        id: `w-new-1`,
        category: 'URL Verification',
        title: 'Needs URL inspection drill',
        observation: 'Initial baseline shows tendency to click fast before reading hostnames.',
        impact: 'Susceptible to credential harvest pages.',
        severity: 'High',
      },
      {
        id: `w-new-2`,
        category: 'Social Engineering',
        title: 'Authority Pressure Susceptibility',
        observation: 'Responds promptly to urgency keywords without secondary check.',
        impact: 'NPC manipulation vulnerability.',
        severity: 'Medium',
      }
    ],
    progressHistory: [
      {
        sessionId: `SES-${nextIdNum}-1`,
        sessionNumber: 1,
        date: new Date().toISOString().split('T')[0],
        score: 68,
        scenarioName: "Scene 1 — First Day Induction & Workstation Security",
        durationMinutes: 24,
        decisionTimeSec: 3.8,
        result: 'Survived',
      }
    ],
    recommendation: {
      focusArea: "URL Verification & Attention Anchoring",
      description: "Assign Scene 3 (Phishing Mailbox) with eye-tracking calibration to develop deliberate hovering habits.",
      recommendedScenario: "Scene 3.1 — Email Header & Domain Analysis Lab",
      urgency: 'Medium',
      adaptiveObjective: "Play → Measure → Identify → Adapt → Improve",
    },
    certificateId: `CERT-CV-2026-${nextIdNum}`,
    isCertified: false,
  };

  const updated = [newStudent, ...currentList];
  saveStudents(updated);
  return newStudent;
}

export function exportStudentsToCSV(students: StudentRecord[], schoolName: string): void {
  const headers = [
    "Game ID",
    "Student Name",
    "Grade",
    "Section",
    "Roll No",
    "Cyber Awareness Score",
    "Current Level",
    "Total Playtime (Mins)",
    "Accuracy (%)",
    "Avg Decision Time (s)",
    "Risk Category",
    "Phishing Detection (%)",
    "Password Security (%)",
    "Social Engineering (%)",
    "URL Verification (%)",
    "Info Privacy (%)",
    "Threat Recognition (%)",
    "Eye Tracking Attention",
    "Certified"
  ];

  const rows = students.map(s => [
    s.gameId,
    `"${s.name.replace(/"/g, '""')}"`,
    s.grade,
    s.section,
    s.rollNumber,
    s.cyberAwarenessScore,
    s.currentLevel,
    s.totalPlaytimeMinutes,
    `${s.accuracy}%`,
    s.avgDecisionTimeSec,
    s.riskCategory,
    `${s.skills.phishingDetection}%`,
    `${s.skills.passwordSecurity}%`,
    `${s.skills.socialEngineering}%`,
    `${s.skills.urlVerification}%`,
    `${s.skills.informationPrivacy}%`,
    `${s.skills.threatRecognition}%`,
    `${s.behavioural.eyeTrackingAttentionScore}/100`,
    s.isCertified ? 'YES' : 'NO'
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + `# School: ${schoolName} - CyberVerse Telemetry Roster\n`
    + `# Exported on: ${new Date().toLocaleDateString()}\n`
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CyberVerse_${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_Students.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
