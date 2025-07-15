
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { MatrixDigital } from '@/components/ui/MatrixDigital';
import { RansomNote } from '@/components/ui/RansomNote';
import { GlitchyArt } from '@/components/ui/GlitchyArt';

export const CreatePageHero: React.FC = () => {
  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title={
        <>
          <span className="font-light">From paper scraps to <GlitchyArt>digital art</GlitchyArt></span><br />
          <span>
            <RansomNote>craft</RansomNote> cards that <span className="gradient-text-green-blue-purple">come alive</span>
          </span>
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
