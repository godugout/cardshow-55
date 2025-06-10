
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, X } from 'lucide-react';

export interface ExportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  isExporting: boolean;
  exportProgress: number;
  cardTitle: string;
}

export const ExportOptionsDialog: React.FC<ExportOptionsDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting,
  exportProgress,
  cardTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export {cardTitle}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {isExporting ? (
            <div className="space-y-2">
              <p className="text-gray-300">Exporting card...</p>
              <Progress value={exportProgress} className="w-full" />
              <p className="text-xs text-gray-400">{exportProgress}% complete</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300">Choose export format:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={onExport} className="bg-blue-600 hover:bg-blue-700">
                  PNG Image
                </Button>
                <Button onClick={onExport} variant="outline" className="border-gray-600">
                  JPG Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
