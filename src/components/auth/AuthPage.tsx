
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './AuthForm';
import { useAuth } from '@/features/auth/providers/AuthProvider';

export const AuthPage: React.FC = () => {
  const { user } = useAuth();

  // If user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/*" element={<AuthForm />} />
    </Routes>
  );
};
