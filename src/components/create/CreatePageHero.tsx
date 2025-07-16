
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';

export const CreatePageHero: React.FC = () => {
  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title={
        <>
          <div className="flex justify-center items-center mb-2">
            <span className="text-gray-400">From paper scraps and cardboard</span>
          </div>
          <div className="flex justify-center items-center">
            <span>
              <span className="text-white">to </span>
              <span className="text-[#00C851]">digital art</span>
              <span className="text-white"> that comes alive!</span>
            </span>
          </div>
        </>
      }
      tagline="No glue needed."
      description="Transform your ideas into interactive 3D collectibles."
      primaryCta={{
        text: "Start Creating",
        link: "/create/new"
      }}
      secondaryCta={{
        text: "Browse Templates",
        link: "/templates"
      }}
      showDecorations={true}
      fullWidth={true}
      heroVariant="hero"
      />
  );
};
