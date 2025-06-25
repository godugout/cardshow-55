
import React from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { useProfilePage } from '@/hooks/useProfilePage';

const ProfilePage: React.FC = () => {
  const {
    user,
    profile,
    isLoading,
    activeTab,
    setActiveTab,
    memories,
    memoriesLoading,
    hasMore,
    handleLoadMore,
    followers,
    following
  } = useProfilePage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">Please sign in to view your profile</h2>
          <p className="text-crd-lightGray">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const displayName = user.full_name || user.username || 'User';
  const bioText = profile?.bio || user.bio || 'No bio available';
  const avatarUrl = user.avatar_url || user.profileImage || '';

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ProfileHeader 
        user={user}
        profile={profile}
        displayName={displayName}
        bioText={bioText}
        avatarUrl={avatarUrl}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          memories={memories}
          memoriesLoading={memoriesLoading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
