
import { supabase } from '@/lib/supabase-client';
import type { User } from '@/types/user';

export const followUser = async (followerId: string, followedId: string): Promise<void> => {
  // Return mock success for now - database schema mismatch
  console.log('Follow user disabled - database schema mismatch');
};

export const unfollowUser = async (followerId: string, followedId: string): Promise<void> => {
  // Return mock success for now - database schema mismatch
  console.log('Unfollow user disabled - database schema mismatch');
};

export const isFollowingUser = async (followerId: string, followedId: string): Promise<boolean> => {
  // Return mock false for now - database schema mismatch
  console.log('Is following user disabled - database schema mismatch');
  return false;
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  // Return empty array for now - database schema mismatch
  console.log('Get user followers disabled - database schema mismatch');
  return [];
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  // Return empty array for now - database schema mismatch
  console.log('Get user following disabled - database schema mismatch');
  return [];
};
