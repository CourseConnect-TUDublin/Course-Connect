'use client';

import { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import AccountDetails from './AccountDetails';
import DepartmentSelection from './DepartmentSelection';
import CourseSelection from './CourseSelection';
import StudyDetails from './StudyDetails';
import ModuleSelection from './ModuleSelection';
import Confirmation from './Confirmation';
import { useRouter } from 'next/navigation';
import { Alert, Snackbar } from '@mui/material';

const STEPS = {
  WELCOME: 'WELCOME',
  ACCOUNT_DETAILS: 'ACCOUNT_DETAILS',
  DEPARTMENT_SELECTION: 'DEPARTMENT_SELECTION',
  COURSE_SELECTION: 'COURSE_SELECTION',
  STUDY_DETAILS: 'STUDY_DETAILS',
  MODULE_SELECTION: 'MODULE_SELECTION',
  CONFIRMATION: 'CONFIRMATION'
};

const RegistrationController = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    department: null,
    course: null,
    year: null,
    semester: null,
    group: null,
    selectedModules: []
  });
  const [modules, setModules] = useState([]); // Store full module list
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    setCurrentStep(STEPS.ACCOUNT_DETAILS);
  };

  const handleAccountDetailsSubmit = async (accountData) => {
    // Store the account details
    setRegistrationData(prev => ({
      ...prev,
      ...accountData
    }));

    // Move to department selection step
    setCurrentStep(STEPS.DEPARTMENT_SELECTION);
  };

  const handleDepartmentSelect = async (departmentData) => {
    // Store the department selection
    setRegistrationData(prev => ({
      ...prev,
      ...departmentData
    }));

    // Move to course selection step
    setCurrentStep(STEPS.COURSE_SELECTION);
  };

  const handleCourseSelect = async (courseData) => {
    // Store the course selection and discipline ID
    setRegistrationData(prev => ({
      ...prev,
      course: courseData.course,
      disciplineId: courseData.disciplineId // Store the discipline ID
    }));

    // Move to study details step
    setCurrentStep(STEPS.STUDY_DETAILS);
  };

  const handleStudyDetailsSubmit = async (studyData) => {
    // Store the study details
    setRegistrationData(prev => ({
      ...prev,
      ...studyData,
      courseId: studyData.courseId // Ensure courseId is included
    }));

    // Move to module selection step
    setCurrentStep(STEPS.MODULE_SELECTION);
  };

  const handleModuleSelect = (selectedModuleIds, allModules) => {
    // Store both selected module IDs and full module list
    setRegistrationData(prev => ({
      ...prev,
      selectedModules: selectedModuleIds
    }));
    setModules(allModules);
    setCurrentStep(STEPS.CONFIRMATION);
  };

  const handleBack = () => {
    switch (currentStep) {
      case STEPS.MODULE_SELECTION:
        setCurrentStep(STEPS.STUDY_DETAILS);
        break;
      case STEPS.STUDY_DETAILS:
        setCurrentStep(STEPS.COURSE_SELECTION);
        break;
      case STEPS.COURSE_SELECTION:
        setCurrentStep(STEPS.DEPARTMENT_SELECTION);
        break;
      case STEPS.DEPARTMENT_SELECTION:
        setCurrentStep(STEPS.ACCOUNT_DETAILS);
        break;
      case STEPS.ACCOUNT_DETAILS:
        setCurrentStep(STEPS.WELCOME);
        break;
      case STEPS.CONFIRMATION:
        setCurrentStep(STEPS.MODULE_SELECTION);
        break;
      default:
        break;
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Registration failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Registration successful:', result);

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to complete registration. Please try again.');
      throw err; // Re-throw to let Confirmation component handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case STEPS.ACCOUNT_DETAILS:
        return <AccountDetails onNext={handleAccountDetailsSubmit} />;
      case STEPS.DEPARTMENT_SELECTION:
        return <DepartmentSelection onNext={handleDepartmentSelect} />;
      case STEPS.COURSE_SELECTION:
        return (
          <CourseSelection
            onNext={handleCourseSelect}
            onBack={handleBack}
            discipline={registrationData.discipline}
          />
        );
      case STEPS.STUDY_DETAILS:
        return (
          <StudyDetails
            onNext={handleStudyDetailsSubmit}
            onBack={handleBack}
            course={registrationData.course}
          />
        );
      case STEPS.MODULE_SELECTION:
        return (
          <ModuleSelection
            registrationData={registrationData}
            onNext={handleModuleSelect}
            onBack={handleBack}
          />
        );
      case STEPS.CONFIRMATION:
        return (
          <Confirmation
            registrationData={registrationData}
            modules={modules}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress indicator could go here */}
      <div className="relative">
        {renderStep()}
      </div>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegistrationController; 