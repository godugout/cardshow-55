
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileCreateHero } from './MobileCreateHero';
import { DesktopCreateHero } from './DesktopCreateHero';
import { MobileStudioSection } from './MobileStudioSection';

export const ResponsiveCreatePageHero: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <MobileCreateHero />
        <MobileStudioSection />
      </div>
    );
  }

  return <DesktopCreateHero />;
};
