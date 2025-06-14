
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(mode === 'signin' ? false : true); // Default to signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update mode when URL params change
  useEffect(() => {
    if (mode === 'signin') {
      setIsSignUp(false);
    } else if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully! Please check your email for verification.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    // Update URL without causing navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('mode', newMode ? 'signup' : 'signin');
    navigate(`/auth?${newSearchParams.toString()}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-crd-dark border-crd-mediumGray">
        <CardHeader className="text-center">
          <CardTitle className="text-crd-white text-2xl">
            {isSignUp ? 'Join CRD' : 'Welcome Back'}
          </CardTitle>
          <p className="text-crd-lightGray text-sm mt-2">
            {isSignUp 
              ? 'Create your account and start making epic trading cards' 
              : 'Sign in to continue creating amazing cards'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-crd-lightGray">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-crd-lightGray">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-crd-green hover:bg-crd-green/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-crd-mediumGray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-crd-dark text-crd-lightGray">or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={toggleMode}
              className="mt-4 text-crd-green hover:text-crd-green/80 text-sm font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
