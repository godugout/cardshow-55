
import React from 'react';
import { StandardHero } from '@/components/shared/StandardHero';

export const CreatePageHero: React.FC = () => {
  return (
    <StandardHero
      label="CUT, CRAFT & CREATE DIGITALLY"
      title={
        <>
          From paper scraps to digital art<br />craft cards that <span className="gradient-text-green-blue-purple">come alive</span>
        </>
      }
      description="Experience the freedom of digital crafting where every cut, layer, and blend creates immersive cards that viewers can explore from every angle. No glue required."
      primaryCta={{
        text: "Create your first CRD",
        link: "/create"
      }}
      showDecorations={true}
    />
  );
};
