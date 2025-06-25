
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/providers/AuthProvider';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm">Email</label>
                <p className="text-white">{user?.email}</p>
              </div>
              <Button variant="outline" className="border-crd-mediumGray text-crd-lightGray hover:text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-white">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-crd-lightGray">Application preferences and customization options will be available here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
