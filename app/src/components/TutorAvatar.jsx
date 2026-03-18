// Geometric cartoon avatar illustrations for each AI tutor.
// Style: modern, clean, friendly — think Notion/Linear aesthetic.
// Each tutor has a distinct look that reflects their personality.

function AdaAvatar({ size }) {
  // Ada: AI Basics — warm, approachable, curious. Short dark hair, glasses, friendly smile.
  const s = size / 48
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Background */}
      <rect width="48" height="48" rx="14" fill="#7C3AED" />
      {/* Hair back */}
      <ellipse cx="24" cy="18" rx="15" ry="13" fill="#2D1B4E" />
      {/* Face */}
      <ellipse cx="24" cy="26" rx="12" ry="13" fill="#F5D0B0" />
      {/* Hair front - short bob with bangs */}
      <path d="M12 20C12 14 17 10 24 10C31 10 36 14 36 20C36 20 34 17 24 17C14 17 12 20 12 20Z" fill="#2D1B4E" />
      <path d="M12 20C12 18 13 15 16 13L14 21Z" fill="#2D1B4E" />
      <path d="M36 20C36 18 35 15 32 13L34 21Z" fill="#2D1B4E" />
      {/* Glasses */}
      <circle cx="19.5" cy="25" r="4" stroke="#4A3070" strokeWidth="1.5" fill="white" fillOpacity="0.15" />
      <circle cx="28.5" cy="25" r="4" stroke="#4A3070" strokeWidth="1.5" fill="white" fillOpacity="0.15" />
      <path d="M23.5 25H24.5" stroke="#4A3070" strokeWidth="1.5" />
      <line x1="15.5" y1="24" x2="13" y2="23" stroke="#4A3070" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32.5" y1="24" x2="35" y2="23" stroke="#4A3070" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes behind glasses */}
      <circle cx="19.5" cy="25" r="1.5" fill="#2D1B4E" />
      <circle cx="28.5" cy="25" r="1.5" fill="#2D1B4E" />
      {/* Eye shine */}
      <circle cx="20.2" cy="24.3" r="0.6" fill="white" />
      <circle cx="29.2" cy="24.3" r="0.6" fill="white" />
      {/* Friendly smile */}
      <path d="M20 31C20 31 22 33.5 24 33.5C26 33.5 28 31 28 31" stroke="#C4876E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Blush */}
      <circle cx="16.5" cy="29" r="2" fill="#F0A0A0" fillOpacity="0.35" />
      <circle cx="31.5" cy="29" r="2" fill="#F0A0A0" fillOpacity="0.35" />
    </svg>
  )
}

function SageAvatar({ size }) {
  // Sage: Prompting — clever, playful, creative. Tousled light hair, confident smirk, earring.
  const s = size / 48
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Background */}
      <rect width="48" height="48" rx="14" fill="#14B8A6" />
      {/* Hair back */}
      <ellipse cx="24" cy="17" rx="14" ry="12" fill="#E8D5A3" />
      {/* Face */}
      <ellipse cx="24" cy="26" rx="11.5" ry="12.5" fill="#F5D0B0" />
      {/* Hair front - tousled, slightly messy, creative look */}
      <path d="M11 19C11 13 16 9 24 9C32 9 37 13 37 19C37 19 35 15 30 14C25 13 22 16 18 15C14 14 11 19 11 19Z" fill="#E8D5A3" />
      <path d="M11 19C10 17 11 14 14 12L12 20Z" fill="#E8D5A3" />
      <path d="M37 19C38 16 36 13 33 11L36 19Z" fill="#E8D5A3" />
      {/* Strand falling over forehead */}
      <path d="M19 14C18 12 20 10 23 10" stroke="#D4C090" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Eyes - slightly narrowed, confident */}
      <ellipse cx="19" cy="25" rx="2" ry="1.8" fill="#2D4A44" />
      <ellipse cx="29" cy="25" rx="2" ry="1.8" fill="#2D4A44" />
      {/* Eye shine */}
      <circle cx="19.7" cy="24.3" r="0.7" fill="white" />
      <circle cx="29.7" cy="24.3" r="0.7" fill="white" />
      {/* Raised eyebrow (playful) */}
      <path d="M26.5 21.5C27.5 20.5 30 20 31.5 21" stroke="#D4C090" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M16.5 22C17.5 21 19.5 20.8 21 21.5" stroke="#D4C090" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* Smirk */}
      <path d="M20 31C22 33 26.5 33 28.5 30.5" stroke="#C4876E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Small earring */}
      <circle cx="12.5" cy="28" r="1.2" fill="#FFD700" />
    </svg>
  )
}

function MaxAvatar({ size }) {
  // Max: AI at Work — direct, practical, professional. Short neat hair, strong jaw, focused.
  const s = size / 48
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Background */}
      <rect width="48" height="48" rx="14" fill="#3B82F6" />
      {/* Hair back */}
      <ellipse cx="24" cy="17" rx="14" ry="12" fill="#3D2B1F" />
      {/* Face - slightly more angular */}
      <path d="M12.5 24C12.5 18 17 14 24 14C31 14 35.5 18 35.5 24C35.5 30 32 38 24 38C16 38 12.5 30 12.5 24Z" fill="#E8C49A" />
      {/* Hair front - short, neat, professional */}
      <path d="M12 18C12 12 17 8 24 8C31 8 36 12 36 18C36 18 35 14 31 13C27 12 24 14 21 13C17 12 12 18 12 18Z" fill="#3D2B1F" />
      {/* Subtle sideburns */}
      <path d="M13 18L12.5 23" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 18L35.5 23" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes - focused, direct */}
      <ellipse cx="19" cy="24.5" rx="2" ry="2" fill="#1E2A3A" />
      <ellipse cx="29" cy="24.5" rx="2" ry="2" fill="#1E2A3A" />
      {/* Eye shine */}
      <circle cx="19.8" cy="23.8" r="0.7" fill="white" />
      <circle cx="29.8" cy="23.8" r="0.7" fill="white" />
      {/* Strong eyebrows */}
      <path d="M16 21.5C17 20.5 19.5 20 21.5 20.8" stroke="#3D2B1F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M26.5 20.8C28.5 20 31 20.5 32 21.5" stroke="#3D2B1F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Confident smile */}
      <path d="M20 30.5C21.5 32.5 26.5 32.5 28 30.5" stroke="#B5785A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Subtle stubble dots */}
      <circle cx="20" cy="33" r="0.3" fill="#3D2B1F" fillOpacity="0.2" />
      <circle cx="24" cy="34" r="0.3" fill="#3D2B1F" fillOpacity="0.2" />
      <circle cx="28" cy="33" r="0.3" fill="#3D2B1F" fillOpacity="0.2" />
      <circle cx="22" cy="34.5" r="0.3" fill="#3D2B1F" fillOpacity="0.2" />
      <circle cx="26" cy="34.5" r="0.3" fill="#3D2B1F" fillOpacity="0.2" />
    </svg>
  )
}

// Coming-soon tutors get simpler silhouette avatars
function PlaceholderAvatar({ size, color, initial }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill={color} />
      {/* Silhouette */}
      <circle cx="24" cy="22" r="8" fill="white" fillOpacity="0.2" />
      <ellipse cx="24" cy="38" rx="11" ry="8" fill="white" fillOpacity="0.2" />
      {/* Initial */}
      <text x="24" y="27" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="16" fontWeight="600" fontFamily="Inter, sans-serif">{initial}</text>
    </svg>
  )
}

const TUTOR_AVATARS = {
  Ada: AdaAvatar,
  Sage: SageAvatar,
  Max: MaxAvatar,
}

export default function TutorAvatar({ name, color, size = 28 }) {
  const AvatarComponent = TUTOR_AVATARS[name]

  if (AvatarComponent) {
    return (
      <div className="shrink-0" style={{ width: size, height: size }}>
        <AvatarComponent size={size} />
      </div>
    )
  }

  // Fallback for coming-soon tutors
  return (
    <div className="shrink-0" style={{ width: size, height: size }}>
      <PlaceholderAvatar size={size} color={color} initial={name?.[0] || '?'} />
    </div>
  )
}
