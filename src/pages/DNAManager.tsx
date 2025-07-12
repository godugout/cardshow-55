import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDDNASystem } from '@/components/dna/CRDDNASystem';
import { DNAUploader } from '@/components/dna/DNAUploader';
import { Code2, Upload, Database, Palette } from 'lucide-react';

const DNAManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-crd-blue/10 to-crd-purple/10 px-4 py-2 rounded-full border border-crd-blue/20">
            <Code2 size={16} className="text-crd-blue" />
            <span className="text-sm font-semibold text-crd-blue uppercase tracking-wide">CRD:DNA Management</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-crd-white via-crd-blue to-crd-purple bg-clip-text text-transparent">
            Cardshow Brand DNA System
          </h1>
          
          <p className="text-lg text-crd-lightGray max-w-3xl mx-auto">
            Upload, organize, and manage team-based visual identities using the CRD:DNA system. 
            Each logo contains genetic information for building consistent brand experiences across the platform.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="browser" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-crd-darkGray border border-crd-mediumGray/30">
            <TabsTrigger 
              value="browser" 
              className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              <Database size={16} />
              <span>DNA Browser</span>
            </TabsTrigger>
            <TabsTrigger 
              value="uploader"
              className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              <Upload size={16} />
              <span>Upload DNA</span>
            </TabsTrigger>
            <TabsTrigger 
              value="themes"
              className="flex items-center space-x-2 data-[state=active]:bg-crd-blue data-[state=active]:text-white"
            >
              <Palette size={16} />
              <span>Theme Builder</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="mt-6">
            <CRDDNASystem />
          </TabsContent>

          <TabsContent value="uploader" className="mt-6">
            <DNAUploader 
              onFilesProcessed={setUploadedFiles}
              maxFiles={100}
            />
          </TabsContent>

          <TabsContent value="themes" className="mt-6">
            <div className="text-center py-12">
              <Palette className="mx-auto mb-4 text-crd-blue" size={48} />
              <h3 className="text-xl font-semibold text-crd-white mb-2">Theme Builder</h3>
              <p className="text-crd-lightGray">
                Create custom CRD themes based on uploaded DNA entries. Coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DNAManager;