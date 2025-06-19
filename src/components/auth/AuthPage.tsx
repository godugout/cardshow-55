
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { MagicLinkForm } from './MagicLinkForm';
import { AuthLayout } from './AuthLayout';

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'magic-link';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signin');

  // Detect auth mode from URL path or search params
  useEffect(() => {
    const path = location.pathname;
    const urlMode = searchParams.get('mode');
    
    // Check if we have reset password tokens in URL
    const hasResetTokens = searchParams.get('access_token') && searchParams.get('refresh_token');
    
    if (hasResetTokens || path.includes('reset-password')) {
      setMode('reset-password');
    } else if (path.includes('forgot-password') || urlMode === 'forgot-password') {
      setMode('forgot-password');
    } else if (path.includes('magic-link') || urlMode === 'magic-link') {
      setMode('magic-link');
    } else if (path.includes('signup') || urlMode === 'signup') {
      setMode('signup');
    } else {
      setMode('signin');
    }
  }, [location.pathname, searchParams]);

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Create Account';
      case 'forgot-password':
        return 'Reset Password';
      case 'reset-password':
        return 'Set New Password';
      case 'magic-link':
        return 'Magic Link';
      default:
        return 'Welcome Back';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup':
        return 'Join the community and start creating amazing cards';
      case 'forgot-password':
        return 'Enter your email to receive a password reset link';
      case 'reset-password':
        return 'Enter your new password below';
      case 'magic-link':
        return 'Sign in with a magic link sent to your email';
      default:
        return 'Sign in to your account to continue';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return <SignUpForm onModeChange={setMode} />;
      case 'forgot-password':
        return <ForgotPasswordForm onModeChange={setMode} />;
      case 'reset-password':
        return <ResetPasswordForm onModeChange={setMode} />;
      case 'magic-link':
        return <MagicLinkForm onModeChange={setMode} />;
      default:
        return <SignInForm onModeChange={setMode} />;
    }
  };

  return (
    <AuthLayout title={getTitle()} description={getDescription()}>
      {renderForm()}
    </AuthLayout>
  );
};
