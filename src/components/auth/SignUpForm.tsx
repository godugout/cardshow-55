
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/features/auth';
import { AuthFormContainer } from './components/AuthFormContainer';
import { EmailField } from './components/EmailField';
import { PasswordFields } from './components/PasswordFields';
import { UserInfoFields } from './components/UserInfoFields';
import { useSignUpForm } from './hooks/useSignUpForm';

interface SignUpFormProps {
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'magic-link') => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onModeChange }) => {
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const { formData, handleInputChange, handleSubmit } = useSignUpForm({
    onSubmit: async (data) => {
      const { error } = await signUp(data.email, data.password, {
        username: data.username,
        full_name: data.fullName,
      });
      
      if (!error) {
        navigate('/');
      }
    },
  });

  return (
    <AuthFormContainer>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UserInfoFields
          username={formData.username}
          fullName={formData.fullName}
          onUsernameChange={(value) => handleInputChange('username', value)}
          onFullNameChange={(value) => handleInputChange('fullName', value)}
        />

        <EmailField
          email={formData.email}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        <PasswordFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onPasswordChange={(value) => handleInputChange('password', value)}
          onConfirmPasswordChange={(value) => handleInputChange('confirmPassword', value)}
        />

        <CRDButton
          type="submit"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.email || !formData.password || !formData.username}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </CRDButton>
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Already have an account? </span>
        <button
          type="button"
          onClick={() => onModeChange?.('signin')}
          className="text-crd-lightGray hover:text-crd-white underline"
        >
          Sign in
        </button>
      </div>
    </AuthFormContainer>
  );
};
