
import React, { useState } from 'react';
import { HelpCircle, X, Mouse, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const GestureTestingHelper: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <>
      {/* Help Toggle Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/20 text-white"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Help Overlay */}
      {isVisible && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <Mouse className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Desktop Testing Mode</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Simulating Mobile Touch Gestures</span>
                </div>
                <p className="text-blue-800 text-sm">
                  Use your mouse and keyboard to test mobile touch interactions without switching devices.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Basic Gestures</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Single Tap:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Click</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Double Tap:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Double Click</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Long Press:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Right Click + Hold</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Advanced Gestures</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Pan/Rotate:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Drag</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Precise Rotation:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Shift + Drag Horizontal</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pinch Zoom:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Ctrl + Scroll Wheel</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Swipe Left/Right:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Alt + Drag Horizontal</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Reset (3-finger tap):</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">Ctrl + Alt + Click</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Card Actions</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• <strong>Click:</strong> Flip card</div>
                    <div>• <strong>Double Click:</strong> Zoom in/out</div>
                    <div>• <strong>Right Click + Hold:</strong> Auto-rotate toggle</div>
                    <div>• <strong>Drag:</strong> Manual rotation</div>
                    <div>• <strong>Alt + Drag Left/Right:</strong> Navigate between cards</div>
                    <div>• <strong>Ctrl + Alt + Click:</strong> Reset all (zoom, rotation, flip)</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>Tip:</strong> These mouse gestures simulate the exact same touch interactions 
                  that work on mobile devices, making it easy to test the full mobile experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
