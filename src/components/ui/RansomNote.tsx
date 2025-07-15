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

  // Random color palette for ransom note effect
  const colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff6600', '#6600ff', '#ff0066', '#00ff66', '#6600ff', '#ff9900',
    '#9900ff', '#ff0099', '#0099ff', '#99ff00', '#ff3366', '#33ff66',
    '#ffffff', '#000000', '#888888'
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
    color: colors[Math.floor(Math.random() * colors.length)],
    fontFamily: fontFamilies[Math.floor(Math.random() * fontFamilies.length)],
    fontSize: `${0.8 + Math.random() * 0.4}em`, // 0.8em to 1.2em
    rotation: (Math.random() - 0.5) * 20, // -10 to 10 degrees
    skew: (Math.random() - 0.5) * 10, // slight skew
    backgroundColor: backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    textShadow: Math.random() > 0.5 ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
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
    <span className={`inline-block ${className}`}>
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
              padding: char === ' ' ? '0' : '1px 2px',
              margin: char === ' ' ? '0 0.2em' : '0 1px',
              borderRadius: '2px',
              border: style.backgroundColor !== 'transparent' ? '1px solid rgba(0,0,0,0.1)' : 'none',
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