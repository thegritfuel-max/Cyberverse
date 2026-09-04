export type GradeLevel = '6' | '7' | '8' | '9' | '10' | '11' | '12';

export type RiskCategory = 
  | 'Security Champion' 
  | 'Vigilant' 
  | 'Moderate' 
  | 'Vulnerable' 
  | 'High Risk';

export interface IdentifiedWeakness {
  id: string;
  category: 'URL Verification' | 'Social Engineering' | 'Phishing Detection' | 'Password Security' | 'Information Privacy' | 'Threat Recognition';
  title: string;
  observation: string;
  impact: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface SessionHistoryItem {
  sessionId: string;
  sessionNumber: number;
  date: string;
  score: number;
  scenarioName: string;
  durationMinutes: number;
  decisionTimeSec: number;
  result: 'Survived' | 'Compromised' | 'Neutralized' | 'Safe Exit';
}

export interface RecommendedTraining {
  focusArea: string;
  description: string;
  recommendedScenario: string;
  urgency: 'High' | 'Medium' | 'Low';
  adaptiveObjective: string;
}

export interface BehaviouralTelemetry {
  // Decision Behaviour
  avgReactionTimeSec: number;
  avgDecisionTimeSec: number;
  hesitationTimeSec: number;
  clickCount: number;
  misclickCount: number;
  retryCount: number;

  // Attention
  eyeTrackingAttentionScore: number; // 0-100
  timeSpentOnCriticalInfoSec: number;
  percentageRelevantInfoViewed: number; // 0-100
  suspiciousElementFixationSec: number;
  visualScanPath: 'Orderly Linear' | 'Target Focused' | 'Skimming' | 'Chaotic Erratic';

  // Reading
  avgDialogueReadingTimeSec: number;
  instructionsSkipped: number;
  importantInfoViewed: number;
  reReadingFrequency: number;
}

export interface CybersecuritySkillScores {
  phishingDetection: number;     // 0-100
  passwordSecurity: number;      // 0-100
  socialEngineering: number;     // 0-100
  urlVerification: number;       // 0-100
  informationPrivacy: number;    // 0-100
  threatRecognition: number;     // 0-100
}

export interface StudentRecord {
  id: string;
  gameId: string; // e.g. "CV-G9-1042"
  accessPin: string; // 4-digit Unity login PIN
  name: string;
  grade: GradeLevel;
  section: 'A' | 'B' | 'C';
  rollNumber: number;
  initials: string;
  badgeColor: string;
  
  // Section 1: Overview
  cyberAwarenessScore: number; // 0-100
  currentLevel: number; // 1-10
  totalPlaytimeMinutes: number;
  sessionsCompleted: number;
  scenariosCompleted: number;
  accuracy: number; // 0-100%
  avgDecisionTimeSec: number;
  riskCategory: RiskCategory;
  isLiveActive?: boolean;
  currentScenario?: string;

  // Section 2: Behavioural Analytics
  behavioural: BehaviouralTelemetry;

  // Section 3: Skill Profile
  skills: CybersecuritySkillScores;
  identifiedWeaknesses: IdentifiedWeakness[];

  // Section 4: Progress & Recommendations
  progressHistory: SessionHistoryItem[];
  recommendation: RecommendedTraining;

  // Certification
  certificateId: string;
  certifiedDate?: string;
  isCertified: boolean;
}

export interface SchoolProfile {
  name: string;
  code: string;
  campus: string;
  logoUrl?: string;
  logoPreset: 'shield' | 'crest' | 'tech' | 'cyber';
  teacherName: string;
  teacherTitle: string;
  teacherEmail: string;
  academicYear: string;
  totalLicensedSeats: number;
  unityServerStatus: 'Online' | 'Syncing' | 'Offline';
}

export interface EyeTrackingTelemetryFrame {
  timestamp: number;
  gazeX: number; // 0-100%
  gazeY: number; // 0-100%
  targetZone: 'Sender Header' | 'Suspicious URL Link' | 'Body Urgency Text' | 'Action Button' | 'Security Seal' | 'Distraction Area';
  isFixatedOnSuspicious: boolean;
  fixationDurationMs: number;
  cursorSpeedPxPerSec: number;
  typingHesitationMs: number;
  patienceLevel: 'Optimal' | 'Hurried' | 'Impulsive' | 'Careful';
}

export interface ScreenGazeCoordinate {
  id: string;
  x: number;
  y: number;
  targetName: string;
  dwellDurationSec: number;
  fixated: boolean;
  category: 'Security Indicator' | 'Urgency Prompt' | 'Deceptive Payload' | 'General Content';
}

export interface ScreenMissedCoordinate {
  id: string;
  x: number;
  y: number;
  targetName: string;
  dangerLevel: 'Critical' | 'High' | 'Moderate';
  reasonMissed: string;
  consequence: string;
}

export interface EyeTrackingTestResult {
  completedAt: string;
  durationSeconds: number;
  attentionScore: number;
  criticalInfoViewedPercent: number;
  suspiciousFixationSeconds: number;
  scanPathPattern: string;
  cursorHesitationIndex: number;
  patienceScore: number;
  misclicksDuringTest: number;
  threatIdentified: boolean;
  threatIdentificationTimeSec: number;
  verdict: 'Vigilant Inspector' | 'Impulsive Clicker' | 'Cautious Observer' | 'At-Risk Skimmer';
  recommendations: string[];
  lookedAtCoordinates: ScreenGazeCoordinate[];
  missedCoordinates: ScreenMissedCoordinate[];
}

