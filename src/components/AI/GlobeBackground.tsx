import React from 'react';

interface GlobeBackgroundProps {
  globeFieldRef: React.RefObject<HTMLDivElement>;
  globeTint: { from: string; to: string; opacity: string };
  globeNodes: Array<{
    nodeStyle: React.CSSProperties;
    spriteStyle: React.CSSProperties;
  }>;
  isMounted: boolean;
}

export default function GlobeBackground({ 
  globeFieldRef, 
  globeTint, 
  globeNodes, 
  isMounted 
}: GlobeBackgroundProps) {
  return (
    <div
      className="globe-field"
      ref={globeFieldRef}
      data-force-motion="true"
      style={{ 
        '--tintFrom': globeTint.from, 
        '--tintTo': globeTint.to, 
        '--tintOpacity': globeTint.opacity 
      } as React.CSSProperties}
    >
      {isMounted && globeNodes.map((n, idx) => (
        <div key={idx} className="globe-node" style={n.nodeStyle}>
          <div className="globe-sprite" style={n.spriteStyle} />
        </div>
      ))}
    </div>
  );
}
