import React from 'react';

interface PixelDigitalProps {
  children: string;
  className?: string;
  animationType?: 'scanning' | 'matrix' | 'construction' | 'datastream';
}

export const PixelDigital: React.FC<PixelDigitalProps> = ({ 
  children, 
  className = "",
  animationType = "scanning"
}) => {

  const getBaseStyle = (): React.CSSProperties => {
    return {
      fontFamily: 'monospace',
      letterSpacing: '0.2em',
      fontWeight: '900',
      fontSize: '1em',
      color: 'transparent',
      imageRendering: 'pixelated' as any,
      display: 'inline-block',
      position: 'relative' as const,
    };
  };

  const getPatternStyle = () => {
    const basePatternStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontFamily: 'monospace',
      letterSpacing: '0.2em',
      fontWeight: '900',
      fontSize: '1em',
      color: 'transparent',
      imageRendering: 'pixelated' as any,
      overflow: 'hidden',
      WebkitMask: `linear-gradient(black, black)`,
      mask: `linear-gradient(black, black)`,
      WebkitMaskComposite: 'source-in',
      maskComposite: 'intersect',
    };

    switch (animationType) {
      case 'scanning':
        return {
          ...basePatternStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 100%',
          animation: 'scanning-sweep 3s ease-in-out infinite',
        };
        
      case 'matrix':
        return {
          ...basePatternStyle,
          background: `
            repeating-linear-gradient(
              0deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '100% 4px',
          animation: 'matrix-cascade 2s linear infinite',
        };
        
      case 'construction':
        return {
          ...basePatternStyle,
          background: `
            repeating-linear-gradient(
              45deg,
              #00e6ff 0px,
              #00e6ff 2px,
              #00b8e6 2px,
              #00b8e6 4px
            )
          `,
          backgroundSize: '8px 8px',
          animation: 'construction-build 1.5s ease-in-out infinite',
        };
        
      case 'datastream':
        return {
          ...basePatternStyle,
          background: `
            repeating-linear-gradient(
              45deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px,
              #00b8e6 2px,
              #00b8e6 3px,
              transparent 3px,
              transparent 4px
            )
          `,
          backgroundSize: '8px 8px',
          animation: 'datastream-flow 2.5s linear infinite',
        };
        
      default:
        return {
          ...basePatternStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 100%',
        };
    }
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className="font-mono tracking-wider select-none"
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.2em',
          fontWeight: '900',
          fontSize: '1em',
          color: 'transparent',
          imageRendering: 'pixelated' as any,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          backgroundAttachment: 'local',
          ...(() => {
            switch (animationType) {
              case 'scanning':
                return {
                  background: `
                    repeating-linear-gradient(
                      90deg,
                      #00e6ff 0px,
                      #00e6ff 1px,
                      transparent 1px,
                      transparent 2px
                    )
                  `,
                  backgroundSize: '4px 100%',
                  animation: 'scanning-sweep 3s ease-in-out infinite',
                };
              case 'matrix':
                return {
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      #00e6ff 0px,
                      #00e6ff 1px,
                      transparent 1px,
                      transparent 2px
                    )
                  `,
                  backgroundSize: '100% 4px',
                  animation: 'matrix-cascade 2s linear infinite',
                };
              case 'construction':
                return {
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      #00e6ff 0px,
                      #00e6ff 2px,
                      #00b8e6 2px,
                      #00b8e6 4px
                    )
                  `,
                  backgroundSize: '8px 8px',
                  animation: 'construction-build 1.5s ease-in-out infinite',
                };
              case 'datastream':
                return {
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      #00e6ff 0px,
                      #00e6ff 1px,
                      transparent 1px,
                      transparent 2px,
                      #00b8e6 2px,
                      #00b8e6 3px,
                      transparent 3px,
                      transparent 4px
                    )
                  `,
                  backgroundSize: '8px 8px',
                  animation: 'datastream-flow 2.5s linear infinite',
                };
              default:
                return {
                  background: `
                    repeating-linear-gradient(
                      90deg,
                      #00e6ff 0px,
                      #00e6ff 1px,
                      transparent 1px,
                      transparent 2px
                    )
                  `,
                  backgroundSize: '4px 100%',
                };
            }
          })(),
        }}
      >
        {children}
      </span>
    </span>
  );
};