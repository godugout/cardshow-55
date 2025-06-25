
import React from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <ProfileHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileTabs />
      </div>
    </div>
  );
};

export default ProfilePage;
