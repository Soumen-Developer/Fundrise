/**
 * Robust image fallback utility for FundRise
 * Guarantees that every image loads cleanly even on slow/offline networks,
 * preventing broken image icons or blank rectangles.
 */

export const categoryFallbacks: Record<string, string> = {
  education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
  startup: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
  environment: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
  creative: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80',
  social: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=1200&auto=format&fit=crop&q=80',
};

export const defaultImage = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=1200&auto=format&fit=crop&q=80';

/**
 * Generates a zero-network, high-res SVG data URI for instant rendering
 */
export const getCategorySvgPlaceholder = (category: string = 'social', title: string = 'Fundraiser'): string => {
  const cat = category.toLowerCase();
  
  const colors: Record<string, [string, string, string]> = {
    education: ['#1e40af', '#3b82f6', '#93c5fd'],
    medical: ['#065f46', '#10b981', '#6ee7b7'],
    startup: ['#5b21b6', '#8b5cf6', '#c4b5fd'],
    environment: ['#14532d', '#22c55e', '#86efac'],
    creative: ['#831843', '#ec4899', '#fbcfe8'],
    social: ['#9a3412', '#f97316', '#fdba74'],
  };

  const [c1, c2, c3] = colors[cat] || ['#1e293b', '#475569', '#94a3b8'];
  const sanitizedTitle = (title || 'FundRise Campaign').replace(/[<>&"']/g, '');
  const categoryLabel = (cat.charAt(0).toUpperCase() + cat.slice(1)).replace(/[<>&"']/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="50%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <linearGradient id="overlay" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <circle cx="700" cy="80" r="140" fill="#ffffff" opacity="0.08"/>
    <circle cx="100" cy="380" r="180" fill="#ffffff" opacity="0.06"/>
    <rect width="800" height="450" fill="url(#overlay)"/>
    <g transform="translate(48, 220)">
      <rect width="110" height="32" rx="16" fill="#ffffff" opacity="0.2"/>
      <text x="55" y="21" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">${categoryLabel}</text>
      <text x="0" y="70" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="28" font-weight="700">${sanitizedTitle.slice(0, 38)}${sanitizedTitle.length > 38 ? '...' : ''}</text>
      <text x="0" y="100" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="15" opacity="0.85">Verified Cause • FundRise Platform</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Handle image error safely:
 * 1. First fallback: try category Unsplash image
 * 2. Second fallback: try zero-network inline SVG
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category: string = 'social',
  title: string = 'Fundraiser'
) => {
  const target = e.currentTarget;
  const unsplashFallback = categoryFallbacks[category?.toLowerCase()] || defaultImage;
  const svgFallback = getCategorySvgPlaceholder(category, title);

  if (target.src !== unsplashFallback && !target.src.startsWith('data:image/svg+xml')) {
    target.src = unsplashFallback;
  } else if (target.src !== svgFallback) {
    target.src = svgFallback;
  }
};
