import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CRDStudioLayout } from '@/components/crd-studio/CRDStudioLayout';
import { CRDStudioDashboard } from '@/components/crd-studio/CRDStudioDashboard';
import { CRDStudioCreate } from '@/components/crd-studio/CRDStudioCreate';
import { CRDStudioEdit } from '@/components/crd-studio/CRDStudioEdit';
import { CRDStudioGallery } from '@/components/crd-studio/CRDStudioGallery';

const CRDStudio = () => {
  return (
    <CRDStudioLayout>
      <Routes>
        <Route path="/" element={<CRDStudioDashboard />} />
        <Route path="/create" element={<CRDStudioCreate />} />
        <Route path="/edit/:cardId" element={<CRDStudioEdit />} />
        <Route path="/gallery" element={<CRDStudioGallery />} />
      </Routes>
    </CRDStudioLayout>
  );
};

export default CRDStudio;