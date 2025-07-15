
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';
import { Typography } from '@/components/ui/design-system';
import { CreateHeroDecorations } from './CreateHeroDecorations';

export const CreatePageHero: React.FC = () => {
  // Custom title with different sizing for each line
  const customTitle = (
    <>
      <Typography variant="section" className="block mb-2 text-crd-white">
        From paper scraps to digital art
      </Typography>
      <Typography variant="display" className="block">
        craft cards that <span className="gradient-text-green-blue-purple">come alive</span>
      </Typography>
    </>
  );

  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title={customTitle}
      description="Experience the freedom of digital crafting where every cut, layer, and blend creates immersive cards that viewers can explore from every angle. No glue required."
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
    >
      <CreateHeroDecorations />
    </StandardHero>
  );
};
