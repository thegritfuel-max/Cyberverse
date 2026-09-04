import { StudentRecord, SchoolProfile, GradeLevel, RiskCategory } from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: "Kolhapur Institute of Technology's College of Engineering Kolhapur (Empowered Autonomous)",
  code: "KITCOEK-AUTONOMOUS-2026",
  campus: "Gokul Shirgaon, Kolhapur, Maharashtra 416234, India",
  logoUrl: "https://i.postimg.cc/5yYw8KNq/kit-logo.png",
  logoPreset: "shield",
  teacherName: "Dr. Kiran Patil",
  teacherTitle: "Dean & Professor of Computer Science & Cybersecurity",
  teacherEmail: "kiran.patil@kitcoek.in",
  academicYear: "2025 - 2026",
  totalLicensedSeats: 150,
  unityServerStatus: "Online",
};

// Generates 75 realistic student records for Grades 6 through 12 with Kolhapur / Maharashtra regional names
const studentNames: { name: string; grade: GradeLevel; section: 'A' | 'B' | 'C' }[] = [
  // Grade 6 (10 students)
  { name: "Rohan Patil", grade: "6", section: "A" },
  { name: "Sneha Deshmukh", grade: "6", section: "A" },
  { name: "Omkar Kulkarni", grade: "6", section: "A" },
  { name: "Tanvi Jadhav", grade: "6", section: "B" },
  { name: "Prathamesh Shinde", grade: "6", section: "B" },
  { name: "Shreya Bhosale", grade: "6", section: "B" },
  { name: "Aditya Chougule", grade: "6", section: "A" },
  { name: "Rutuja Powar", grade: "6", section: "C" },
  { name: "Yashvardhan Sawant", grade: "6", section: "C" },
  { name: "Ananya Mane", grade: "6", section: "B" },

  // Grade 7 (11 students)
  { name: "Digvijay Salokhe", grade: "7", section: "A" },
  { name: "Sanika Kadam", grade: "7", section: "A" },
  { name: "Abhishek Ghatage", grade: "7", section: "B" },
  { name: "Sakshi Kamble", grade: "7", section: "A" },
  { name: "Harshavardhan Mohite", grade: "7", section: "B" },
  { name: "Tejas Gaikwad", grade: "7", section: "C" },
  { name: "Priyanka Naik", grade: "7", section: "C" },
  { name: "Sourabh Magdum", grade: "7", section: "A" },
  { name: "Mrunmayi Korane", grade: "7", section: "B" },
  { name: "Vaibhav Chavan", grade: "7", section: "C" },
  { name: "Neha More", grade: "7", section: "A" },

  // Grade 8 (11 students)
  { name: "Parth Joshi", grade: "8", section: "A" },
  { name: "Dhanashree Shingade", grade: "8", section: "A" },
  { name: "Shardul Yadav", grade: "8", section: "B" },
  { name: "Manasi Todkar", grade: "8", section: "B" },
  { name: "Atharva Khot", grade: "8", section: "C" },
  { name: "Samruddhi Shete", grade: "8", section: "A" },
  { name: "Swapnil Methe", grade: "8", section: "B" },
  { name: "Pooja Bandekar", grade: "8", section: "C" },
  { name: "Sanket Patil", grade: "8", section: "A" },
  { name: "Shruti Deshmukh", grade: "8", section: "B" },
  { name: "Nilesh Kulkarni", grade: "8", section: "C" },

  // Grade 9 (11 students)
  { name: "Pallavi Jadhav", grade: "9", section: "A" },
  { name: "Siddhesh Shinde", grade: "9", section: "A" },
  { name: "Isha Bhosale", grade: "9", section: "B" },
  { name: "Mayur Chougule", grade: "9", section: "B" },
  { name: "Krushna Powar", grade: "9", section: "C" },
  { name: "Sayali Sawant", grade: "9", section: "A" },
  { name: "Rushikesh Mane", grade: "9", section: "B" },
  { name: "Riya Salokhe", grade: "9", section: "C" },
  { name: "Pratik Kadam", grade: "9", section: "A" },
  { name: "Radhika Ghatage", grade: "9", section: "B" },
  { name: "Rohit Kamble", grade: "9", section: "C" },

  // Grade 10 (11 students)
  { name: "Aditi Mohite", grade: "10", section: "A" },
  { name: "Sahil Gaikwad", grade: "10", section: "A" },
  { name: "Ketaki Naik", grade: "10", section: "B" },
  { name: "Darshan Magdum", grade: "10", section: "B" },
  { name: "Asmita Korane", grade: "10", section: "C" },
  { name: "Kunal Chavan", grade: "10", section: "A" },
  { name: "Revati More", grade: "10", section: "B" },
  { name: "Shubham Joshi", grade: "10", section: "C" },
  { name: "Purva Shingade", grade: "10", section: "A" },
  { name: "Chetan Yadav", grade: "10", section: "B" },
  { name: "Tejashree Todkar", grade: "10", section: "C" },

  // Grade 11 (11 students)
  { name: "Vinayak Khot", grade: "11", section: "A" },
  { name: "Madhuri Shete", grade: "11", section: "A" },
  { name: "Avadhoot Methe", grade: "11", section: "B" },
  { name: "Nikita Bandekar", grade: "11", section: "B" },
  { name: "Aniket Patil", grade: "11", section: "C" },
  { name: "Bhagyashree Deshmukh", grade: "11", section: "A" },
  { name: "Sumit Kulkarni", grade: "11", section: "B" },
  { name: "Prachi Jadhav", grade: "11", section: "C" },
  { name: "Onkar Shinde", grade: "11", section: "A" },
  { name: "Divya Bhosale", grade: "11", section: "B" },
  { name: "Akshay Chougule", grade: "11", section: "C" },

  // Grade 12 (10 students)
  { name: "Meera Powar", grade: "12", section: "A" },
  { name: "Shrikant Sawant", grade: "12", section: "A" },
  { name: "Komal Mane", grade: "12", section: "B" },
  { name: "Hrishikesh Salokhe", grade: "12", section: "B" },
  { name: "Namrata Kadam", grade: "12", section: "C" },
  { name: "Sagar Ghatage", grade: "12", section: "A" },
  { name: "Amol Kamble", grade: "12", section: "B" },
  { name: "Sonali Mohite", grade: "12", section: "C" },
  { name: "Rohit Gaikwad", grade: "12", section: "A" },
  { name: "Ashwini Naik", grade: "12", section: "B" },
];

const badgeColors = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-slate-100 text-slate-700 border-slate-200",
];

export const initialStudents: StudentRecord[] = studentNames.map((s, idx) => {
  const roll = idx + 1;
  const numId = 1000 + idx;
  const gameId = `CV-KIT-${s.grade}-${numId}`;
  const pin = `${Math.floor(1000 + Math.random() * 9000)}`;

  // Derive score distribution based on grades with variance
  const baseScore = 58 + Math.floor(parseInt(s.grade, 10) * 3.2) + ((idx % 7) * 3) - ((idx % 5) * 2);
  const score = Math.min(98, Math.max(48, baseScore));

  let riskCategory: RiskCategory = 'Moderate';
  if (score >= 88) riskCategory = 'Security Champion';
  else if (score >= 76) riskCategory = 'Vigilant';
  else if (score >= 65) riskCategory = 'Moderate';
  else if (score >= 54) riskCategory = 'Vulnerable';
  else riskCategory = 'High Risk';

  const currentLevel = Math.min(10, Math.max(3, Math.round(score / 10)));
  const totalPlaytimeMinutes = 65 + (idx * 7) % 180 + Math.floor(score * 1.2);
  const sessionsCompleted = 3 + (idx % 6);
  const scenariosCompleted = Math.min(6, Math.max(2, Math.round(currentLevel * 0.7)));
  const accuracy = Math.min(96, Math.max(52, Math.round(score * 0.95 + ((idx % 4) * 2))));
  const avgDecisionTimeSec = Number((2.1 + ((100 - score) / 25) + (idx % 3) * 0.4).toFixed(1));

  // Initials
  const initials = s.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const badgeColor = badgeColors[idx % badgeColors.length];

  // Specific highlighted weaknesses
  const weaknessPool = [
    {
      id: `w-${idx}-1`,
      category: 'URL Verification' as const,
      title: "Autonomous Exam Portal Domain Inspection Deficit",
      observation: "Frequently clicks suspicious subdomains or lookalike exam domains without inspecting the complete protocol and authentic kitcoek.in TLD.",
      impact: "High risk of redirecting to credential harvesting clones in Unity Scene 3.",
      severity: 'High' as const,
    },
    {
      id: `w-${idx}-2`,
      category: 'Social Engineering' as const,
      title: "Urgency & Exam Authority Bias",
      observation: "Highly influenced by urgency cues ('Hall Ticket Cancellation Within 15 Min') and university administrative impersonation.",
      impact: "Vulnerable to bypass protocol during NPC security guard dialogues in Scene 2.",
      severity: 'High' as const,
    },
    {
      id: `w-${idx}-3`,
      category: 'Information Privacy' as const,
      title: "Oversharing in Dialogue Prompts",
      observation: "Discloses internal student PRN and seat numbers when questioned by unverified external vendors in simulation.",
      impact: "Triggers credential leak flag during NPC interaction.",
      severity: 'Medium' as const,
    },
    {
      id: `w-${idx}-4`,
      category: 'Threat Recognition' as const,
      title: "Attachment Sandbox Neglect",
      observation: "Attempts to open .exe or macro-enabled documents before running sandbox integrity verification.",
      impact: "System infection simulation triggers lockdown state.",
      severity: 'High' as const,
    }
  ];

  // Pick 1 to 2 weaknesses
  const studentWeaknesses = idx % 2 === 0 
    ? [weaknessPool[0], weaknessPool[1]] 
    : [weaknessPool[1], weaknessPool[2]];

  // Skill profile
  const phishingDetection = Math.min(99, Math.max(38, score + ((idx % 5) * 3) - 6));
  const passwordSecurity = Math.min(98, Math.max(45, score + 12 - ((idx % 4) * 3)));
  const socialEngineering = Math.min(95, Math.max(35, score - ((idx % 3) * 8) - 4));
  const urlVerification = Math.min(92, Math.max(30, score - 16 + ((idx % 4) * 4)));
  const informationPrivacy = Math.min(97, Math.max(42, score + 4 - ((idx % 3) * 3)));
  const threatRecognition = Math.min(96, Math.max(40, score - 3 + ((idx % 5) * 2)));

  // Progress history sessions
  const s1 = Math.max(42, score - 24);
  const s2 = Math.max(50, score - 15);
  const s3 = Math.max(58, score - 8);
  const s4 = score;

  const progressHistory = [
    {
      sessionId: `SES-${numId}-1`,
      sessionNumber: 1,
      date: "2026-02-14",
      score: s1,
      scenarioName: "Scene 1 — Campus Wi-Fi & Terminal Induction",
      durationMinutes: 28,
      decisionTimeSec: Number((avgDecisionTimeSec + 1.8).toFixed(1)),
      result: s1 > 60 ? 'Safe Exit' as const : 'Compromised' as const,
    },
    {
      sessionId: `SES-${numId}-2`,
      sessionNumber: 2,
      date: "2026-02-21",
      score: s2,
      scenarioName: "Scene 2 — Social Engineering in College Laboratory Corridor",
      durationMinutes: 34,
      decisionTimeSec: Number((avgDecisionTimeSec + 1.1).toFixed(1)),
      result: s2 > 65 ? 'Neutralized' as const : 'Compromised' as const,
    },
    {
      sessionId: `SES-${numId}-3`,
      sessionNumber: 3,
      date: "2026-02-28",
      score: s3,
      scenarioName: "Scene 3 — Phishing Mailbox & Domain Triage",
      durationMinutes: 39,
      decisionTimeSec: Number((avgDecisionTimeSec + 0.4).toFixed(1)),
      result: 'Survived' as const,
    },
    {
      sessionId: `SES-${numId}-4`,
      sessionNumber: 4,
      date: "2026-03-03",
      score: s4,
      scenarioName: "Scene 4 — Autonomous Cloud Verification Sandbox",
      durationMinutes: 42,
      decisionTimeSec: avgDecisionTimeSec,
      result: s4 >= 75 ? 'Safe Exit' as const : 'Neutralized' as const,
    }
  ];

  const focusArea = urlVerification < 60 ? "URL Verification & Domain Syntax" : "Social Engineering Resistance";
  const recommendedScenario = urlVerification < 60 
    ? "Scene 3.2 — Advanced Typosquatting & SSL Certificate Verification Lab"
    : "Scene 2.3 — High-Urgency Administrative Impersonation & Dual-Channel Verification";

  const isLive = idx % 8 === 2;
  const liveScenarios = [
    "Scene 3: Inspecting Suspicious Autonomous Hall Ticket Mail",
    "Scene 2: NPC Vendor Dialogue at Server Room",
    "Scene 1: Initial Day USB Drive Choice",
    "Scene 4: Rogue Hotspot Connection Attempt"
  ];

  return {
    id: `std-${numId}`,
    gameId,
    accessPin: pin,
    name: s.name,
    grade: s.grade,
    section: s.section,
    rollNumber: roll,
    initials,
    badgeColor,

    // Overview
    cyberAwarenessScore: score,
    currentLevel,
    totalPlaytimeMinutes,
    sessionsCompleted,
    scenariosCompleted,
    accuracy,
    avgDecisionTimeSec,
    riskCategory,
    isLiveActive: isLive,
    currentScenario: isLive ? liveScenarios[idx % liveScenarios.length] : undefined,

    // Behavioural
    behavioural: {
      avgReactionTimeSec: Number((1.4 + (idx % 6) * 0.25).toFixed(1)),
      avgDecisionTimeSec,
      hesitationTimeSec: Number((1.2 + ((100 - score) / 30) + (idx % 4) * 0.3).toFixed(1)),
      clickCount: 110 + (idx * 5) % 90,
      misclickCount: Math.max(2, Math.round((100 - accuracy) * 0.45)),
      retryCount: score < 70 ? 4 : (score < 85 ? 2 : 1),

      eyeTrackingAttentionScore: Math.min(99, Math.max(50, score + 4 - ((idx % 3) * 5))),
      timeSpentOnCriticalInfoSec: 16 + (idx % 18) + Math.round(score * 0.18),
      percentageRelevantInfoViewed: Math.min(98, Math.max(58, Math.round(score * 0.96))),
      suspiciousElementFixationSec: Number((2.4 + (score / 35)).toFixed(1)),
      visualScanPath: score >= 80 ? 'Target Focused' : (score >= 68 ? 'Orderly Linear' : 'Skimming'),

      avgDialogueReadingTimeSec: Number((4.5 + (idx % 5) * 0.8).toFixed(1)),
      instructionsSkipped: score < 70 ? 3 : (score < 85 ? 1 : 0),
      importantInfoViewed: 10 + (idx % 8) + Math.round(score * 0.1),
      reReadingFrequency: score < 75 ? 4 : 2,
    },

    // Skills
    skills: {
      phishingDetection,
      passwordSecurity,
      socialEngineering,
      urlVerification,
      informationPrivacy,
      threatRecognition,
    },
    identifiedWeaknesses: studentWeaknesses,

    // Progress & Recommendations
    progressHistory,
    recommendation: {
      focusArea,
      description: urlVerification < 60 
        ? "Student consistently opens links without hovering to verify root domain structures. Recommend targeted phishing sandbox drills."
        : "Student responds with haste when dialogue contains urgency tags ('Immediate Action Required'). Recommend psychological pre-texting resistance modules.",
      recommendedScenario,
      urgency: score < 65 ? 'High' : (score < 80 ? 'Medium' : 'Low'),
      adaptiveObjective: "Play → Measure → Identify → Adapt → Improve",
    },

    // Certificate
    certificateId: `CERT-KIT-${numId}`,
    certifiedDate: score >= 75 ? "2026-03-01" : undefined,
    isCertified: score >= 75,
  };
});
