import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { SchoolProfile, StudentRecord } from '../../types';
import { Overview } from './Overview';
import { StudentsDirectory } from './StudentsDirectory';
import { EyeTrackingLab } from './EyeTrackingLab';
import { EnrollStudent } from './EnrollStudent';
import { RankersLeaderboard } from './RankersLeaderboard';
import { CertificatesHub } from './CertificatesHub';
import { SchoolSettings } from './SchoolSettings';

interface DashboardContext {
  school: SchoolProfile;
  students: StudentRecord[];
}

export const OverviewRoute: React.FC = () => {
  const { school, students } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  return (
    <Overview
      school={school}
      students={students}
      onNavigateToStudents={() => navigate('/dashboard/students')}
      onNavigateToEyeTracking={() => navigate('/dashboard/eye-tracking')}
      onNavigateToEnroll={() => navigate('/dashboard/enroll')}
    />
  );
};

export const StudentsRoute: React.FC = () => {
  const { school, students } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  return (
    <StudentsDirectory
      school={school}
      students={students}
      onRefresh={() => {}}
      onNavigateToEnroll={() => navigate('/dashboard/enroll')}
    />
  );
};

export const EyeTrackingRoute: React.FC = () => {
  const { school } = useOutletContext<DashboardContext>();
  return <EyeTrackingLab school={school} />;
};

export const EnrollRoute: React.FC = () => {
  const { school } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  return (
    <EnrollStudent
      school={school}
      onStudentCreated={() => {
        // Automatically updates via service event
      }}
    />
  );
};

export const RankersRoute: React.FC = () => {
  const { school, students } = useOutletContext<DashboardContext>();
  return <RankersLeaderboard school={school} students={students} />;
};

export const CertificatesRoute: React.FC = () => {
  const { school, students } = useOutletContext<DashboardContext>();
  return <CertificatesHub school={school} students={students} />;
};

export const SettingsRoute: React.FC = () => {
  const { school } = useOutletContext<DashboardContext>();
  return (
    <SchoolSettings
      school={school}
      onUpdateSchool={() => {}}
    />
  );
};
