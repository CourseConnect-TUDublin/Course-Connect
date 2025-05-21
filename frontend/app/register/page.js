'use client';

import RegistrationController from '../components/registration/RegistrationController';

// This is a public page - no authentication required
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RegistrationController />
    </div>
  );
} 