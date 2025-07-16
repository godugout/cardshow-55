
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { MatrixDigital } from '@/components/ui/MatrixDigital';
import { ThemedRansomNote } from '@/components/ui/ThemedRansomNote';
import { GlitchyArt } from '@/components/ui/GlitchyArt';

export const CreatePageHero: React.FC = () => {
  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title={
        <>
          <div className="flex justify-center items-center h-16 mb-2">
            <span className="font-light text-center">From paper scraps to <GlitchyArt>digital art</GlitchyArt></span>
          </div>
          <div className="flex justify-center items-center h-16">
            <span>
              <ThemedRansomNote theme="craft">craft</ThemedRansomNote> cards that <span className="gradient-text-green-blue-purple">come alive</span>
            </span>
          </div>
        </>
      }
      tagline="No glue required."
      description="Experience the freedom of digital crafting where every cut, layer, and blend creates immersive cards that viewers can explore from every angle."
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
