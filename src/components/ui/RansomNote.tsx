import React, { useEffect, useState } from 'react';

interface RansomNoteProps {
  children: string;
  className?: string;
}

interface LetterStyle {
  color: string;
  fontFamily: string;
  fontSize: string;
  rotation: number;
  skew: number;
  backgroundColor: string;
  textShadow: string;
}

export const RansomNote: React.FC<RansomNoteProps> = ({ 
  children, 
  className = "" 
}) => {
  const [letterStyles, setLetterStyles] = useState<LetterStyle[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Brand colors from CRD design system
  const colors = [
    'hsl(var(--crd-green))',
    'hsl(var(--crd-blue))', 
    'hsl(var(--crd-purple))',
    'hsl(var(--crd-orange))',
    'hsl(var(--crd-white))',
    'hsl(var(--crd-lightGray))'
  ];

  // Random font families for variety
  const fontFamilies = [
    'Arial', 'Helvetica', 'Times', 'Courier', 'Impact', 'Georgia',
    'Verdana', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black'
  ];

  // Background colors for cut-out effect
  const backgroundColors = [
    'transparent', '#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0',
    '#ffeeee', '#eeffee', '#eeeeff', '#ffffee', '#ffeeff', '#eeffff'
  ];

  const generateLetterStyle = (): LetterStyle => ({
    color: Math.random() > 0.4 ? '#ffffff' : '#000000',
    fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
    fontSize: `${0.7 + Math.random() * 0.6}em`, // 0.7em to 1.3em for more height variation
    rotation: (Math.random() - 0.5) * 25, // -12.5 to 12.5 degrees
    skew: (Math.random() - 0.5) * 10, // slight skew
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    textShadow: 'none'
  });

  useEffect(() => {
    const updateStyles = () => {
      const newStyles = children.split('').map(() => generateLetterStyle());
      setLetterStyles(newStyles);
      setAnimationKey(prev => prev + 1);
    };

    // Initial styles
    updateStyles();

    // Update every 3 seconds for continuous animation
    const interval = setInterval(updateStyles, 3000);

    return () => clearInterval(interval);
  }, [children]);

  return (
    <span className={`inline-block mt-8 ${className}`} style={{ letterSpacing: '0.1em' }}>
      {children.split('').map((char, index) => {
        const style = letterStyles[index];
        if (!style) return char;

        return (
          <span
            key={`${index}-${animationKey}`}
            className="inline-block transition-all duration-1000 ease-in-out"
            style={{
              color: style.color,
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              transform: `rotate(${style.rotation}deg) skew(${style.skew}deg)`,
              backgroundColor: style.backgroundColor,
              textShadow: style.textShadow,
              padding: char === ' ' ? '0' : '6px 8px',
              margin: char === ' ' ? '0 0.3em' : '0 3px',
              borderRadius: '4px',
              opacity: char === ' ' ? 1 : 0.85,
              display: char === ' ' ? 'inline' : 'inline-block',
              fontWeight: Math.random() > 0.5 ? 'bold' : 'normal',
              fontStyle: Math.random() > 0.8 ? 'italic' : 'normal',
              textDecoration: Math.random() > 0.9 ? 'underline' : 'none',
              position: 'relative',
              top: `${(Math.random() - 0.5) * 4}px`, // slight vertical offset
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};