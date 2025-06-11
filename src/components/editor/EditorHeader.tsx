
import React from 'react';
import { Topbar } from './Topbar';
import { useCardEditor } from '@/hooks/useCardEditor';

interface EditorHeaderProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EditorHeader = ({ cardEditor }: EditorHeaderProps) => {
  return <Topbar cardEditor={cardEditor} />;
};
