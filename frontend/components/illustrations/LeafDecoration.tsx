// Reusable leaf/botanical decorations
interface LeafProps { className?: string; variant?: "left" | "right" | "top" | "corner"; color?: string; }

export function LeafCluster({ className = "", color = "#7FB77E" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M60 130 Q20 90 40 40 Q60 70 60 130Z" fill={color} opacity="0.8"/>
      <path d="M60 130 Q100 90 80 40 Q60 70 60 130Z" fill={color} opacity="0.5"/>
      <path d="M30 100 Q5 65 20 20 Q35 50 30 100Z" fill={color} opacity="0.4"/>
      <path d="M90 100 Q115 65 100 20 Q85 50 90 100Z" fill={color} opacity="0.4"/>
      <line x1="60" y1="40" x2="60" y2="130" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <line x1="20" y1="20" x2="30" y2="100" stroke={color} strokeWidth="1" opacity="0.3"/>
      <line x1="100" y1="20" x2="90" y2="100" stroke={color} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

export function SingleLeaf({ className = "", color = "#5F8D4E" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M40 115 Q5 75 15 20 Q40 50 40 115Z" fill={color} opacity="0.7"/>
      <path d="M40 115 Q75 75 65 20 Q40 50 40 115Z" fill={color} opacity="0.4"/>
      <line x1="40" y1="20" x2="40" y2="115" stroke={color} strokeWidth="1.2" opacity="0.4"/>
    </svg>
  );
}

export function FloatingDots({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="40"  cy="40"  r="6" fill="#5F8D4E" opacity="0.3"/>
      <circle cx="160" cy="30"  r="4" fill="#7FB77E" opacity="0.4"/>
      <circle cx="80"  cy="160" r="5" fill="#5F8D4E" opacity="0.25"/>
      <circle cx="170" cy="150" r="7" fill="#DCEFD8" opacity="0.6"/>
      <circle cx="20"  cy="120" r="4" fill="#7FB77E" opacity="0.35"/>
      <circle cx="140" cy="90"  r="3" fill="#5F8D4E" opacity="0.3"/>
    </svg>
  );
}

export function SubtleFlower({ className = "", color = "#7FB77E" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Center */}
      <circle cx="50" cy="50" r="12" fill={color} opacity="0.3" />
      {/* Petals */}
      <circle cx="50" cy="25" r="16" fill={color} opacity="0.15" />
      <circle cx="50" cy="75" r="16" fill={color} opacity="0.15" />
      <circle cx="25" cy="50" r="16" fill={color} opacity="0.15" />
      <circle cx="75" cy="50" r="16" fill={color} opacity="0.15" />
      <circle cx="32" cy="32" r="16" fill={color} opacity="0.1" />
      <circle cx="68" cy="68" r="16" fill={color} opacity="0.1" />
      <circle cx="68" cy="32" r="16" fill={color} opacity="0.1" />
      <circle cx="32" cy="68" r="16" fill={color} opacity="0.1" />
    </svg>
  );
}


export default function LeafDecoration({ className = "", variant = "left", color = "#7FB77E" }: LeafProps) {
  return (
    <svg viewBox="0 0 160 260" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M80 240 Q20 180 35 80 Q80 130 80 240Z" fill={color} opacity="0.65"/>
      <path d="M80 240 Q140 180 125 80 Q80 130 80 240Z" fill={color} opacity="0.4"/>
      <path d="M50 200 Q10 150 20 70 Q50 110 50 200Z" fill={color} opacity="0.35"/>
      <path d="M110 200 Q150 150 140 70 Q110 110 110 200Z" fill={color} opacity="0.35"/>
      <line x1="80" y1="80" x2="80" y2="240" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      <line x1="35" y1="85" x2="50" y2="198" stroke={color} strokeWidth="1" opacity="0.25"/>
      <line x1="125" y1="85" x2="110" y2="198" stroke={color} strokeWidth="1" opacity="0.25"/>
    </svg>
  );
}
