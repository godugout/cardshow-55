
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/features/auth';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { EmailField } from './components/EmailField';
import { useAuthForm } from './hooks/useAuthForm';

interface MagicLinkFormData {
  email: string;
}

interface MagicLinkFormProps {
  onModeChange?: (mode: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'magic-link') => void;
}

export const MagicLinkForm: React.FC<MagicLinkFormProps> = ({ onModeChange }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { signInWithMagicLink, isLoading } = useAuth();

  const { formData, handleInputChange, handleSubmit } = useAuthForm<MagicLinkFormData>({
    initialValues: { email: '' },
    onSubmit: async (data) => {
      const { error } = await signInWithMagicLink(data.email);
      if (!error) {
        setIsEmailSent(true);
      }
    },
  });

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="h-8 w-8 text-crd-green" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-crd-white">Check your email</h3>
          <p className="text-crd-lightGray">
            We've sent a magic link to <strong>{formData.email}</strong>
          </p>
        </div>
        <div className="space-y-3">
          <CRDButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setIsEmailSent(false)}
          >
            Try another email
          </CRDButton>
          <CRDButton 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => onModeChange?.('signin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </CRDButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-crd-green" />
        </div>
        <h3 className="text-lg font-semibold text-crd-white">Magic Link Sign In</h3>
        <p className="text-crd-lightGray">
          Enter your email and we'll send you a magic link to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <EmailField
          email={formData.email}
          onEmailChange={(value) => handleInputChange('email', value)}
        />

        <CRDButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || !formData.email}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </CRDButton>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onModeChange?.('signin')}
          className="text-crd-lightGray hover:text-crd-white text-sm flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};
