
import React from 'react';
import { Text } from '@react-three/drei';

interface CardTextProps {
  title: string;
  rarity?: string;
  cardWidth: number;
  cardHeight: number;
  cardDepth: number;
}

export const CardText: React.FC<CardTextProps> = ({
  title,
  rarity,
  cardWidth,
  cardHeight,
  cardDepth
}) => {
  return (
    <>
      {/* Card title text floating above */}
      <Text
        position={[0, cardHeight/2 + 0.3, cardDepth/2 + 0.01]}
        fontSize={0.2}
        color="white"
        anchorY="bottom"
        anchorX="center"
        maxWidth={cardWidth * 0.9}
        textAlign="center"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {title}
      </Text>

      {/* Card rarity indicator with enhanced styling */}
      {rarity && (
        <Text
          position={[0, -cardHeight/2 - 0.2, cardDepth/2 + 0.01]}
          fontSize={0.15}
          color="#ffd700"
          anchorY="top"
          anchorX="center"
          textAlign="center"
          outlineWidth={0.01}
          outlineColor="black"
        >
          ★ {rarity.toUpperCase()} ★
        </Text>
      )}
    </>
  );
};
