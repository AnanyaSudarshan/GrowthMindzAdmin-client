function GrowthMindzIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Growth Icon - Tree/Brain/Growth Symbol */}
      <circle cx="20" cy="20" r="18" fill="url(#gradient)"/>
      <path d="M20 8 L20 32 M12 20 L28 20 M16 12 L24 12 M16 28 L24 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="6" fill="white" opacity="0.3"/>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#667eea"/>
          <stop offset="100%" stopColor="#764ba2"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default GrowthMindzIcon;


