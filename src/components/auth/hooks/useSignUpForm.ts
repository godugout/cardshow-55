
import { useState } from 'react';

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
}

interface UseSignUpFormOptions {
  onSubmit: (data: SignUpFormData) => Promise<void>;
}

export const useSignUpForm = ({ onSubmit }: UseSignUpFormOptions) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
  });

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
  };
};
