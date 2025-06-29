
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { ProcessingJob, ProcessingJobStatus } from '@/types/crdmkr';
import { toast } from 'sonner';

export const useCRDMKRProcessing = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createProcessingJob = useCallback(async (
    fileUrl: string, 
    fileName?: string, 
    fileSize?: number
  ): Promise<string | null> => {
    if (!user) {
      toast.error('Authentication required');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('crdmkr_processing_jobs')
        .insert({
          user_id: user.id,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          status: 'pending' as ProcessingJobStatus
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Processing job created');
      return data.id;
    } catch (error) {
      console.error('Error creating processing job:', error);
      toast.error('Failed to create processing job');
      return null;
    }
  }, [user]);

  const updateJobStatus = useCallback(async (
    jobId: string, 
    status: ProcessingJobStatus, 
    progress?: number,
    result?: any,
    errorMessage?: string
  ) => {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (progress !== undefined) updateData.progress = progress;
      if (result !== undefined) updateData.result = result;
      if (errorMessage !== undefined) updateData.error_message = errorMessage;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('crdmkr_processing_jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, ...updateData }
          : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update processing status');
    }
  }, []);

  const getUserJobs = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crdmkr_processing_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database column names to TypeScript interface property names and convert dates
      const mappedJobs: ProcessingJob[] = (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        fileUrl: row.file_url,
        fileName: row.file_name,
        fileSize: row.file_size,
        status: row.status as ProcessingJobStatus,
        progress: row.progress,
        result: row.result,
        errorMessage: row.error_message,
        startedAt: row.started_at ? new Date(row.started_at) : undefined,
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));

      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error fetching processing jobs:', error);
      toast.error('Failed to load processing jobs');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    jobs,
    isLoading,
    createProcessingJob,
    updateJobStatus,
    getUserJobs
  };
};
