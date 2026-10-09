import { useId } from 'react'
import type { Product } from '../lib/catalogue'

const GRAIN: Record<Product['grain'], { base: string; dark: string; light: string }> = {
  oak:    { base: '#C79A62', dark: '#A87B45', light: '#DCB782' },
  walnut: { base: '#7A5334', dark: '#5E3E26', light: '#996C47' },
  beech:  { base: '#DDB98B', dark: '#C29D71', light: '#EFD2AA' },
  acacia: { base: '#B57F49', dark: '#8E6132', light: '#D09C66' },
}

/**
 * The board is drawn, not photographed, so the engraving can actually be burned
 * into it from the buyer's own text and the grain can show through the mark.
 */
export function Board({
  product, text, initials, className = '', showEngraving = true,
}: { product: Product; text: string; initials: string; className?: string; showEngraving?: boolean }) {
  const id = useId().replace(/:/g, '')
  const g = GRAIN[product.grain]
  const round = product.ratio === 1 && product.slug.includes('round')
  const W = 400, H = Math.round(W / product.ratio)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img"
      aria-label={`${product.timber} ${product.name}${showEngraving && (text || initials) ? `, engraved with ${initials || text}` : ', unengraved'}`}>
      <defs>
        <linearGradient id={`face${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g.light} />
          <stop offset="0.5" stopColor={g.base} />
          <stop offset="1" stopColor={g.dark} />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          {round
            ? <circle cx={W/2} cy={H/2} r={Math.min(W,H)/2 - 4} />
            : <rect x="4" y="4" width={W-8} height={H-8} rx="10" />}
        </clipPath>
      </defs>

      <g clipPath={`url(#clip${id})`}>
        <rect width={W} height={H} fill={`url(#face${id})`} />
        {Array.from({ length: 16 }).map((_, i) => {
          const y = (i + 0.5) * (H / 16)
          const wob = 6 + (i % 4) * 3
          return (
            <path key={i}
              d={`M-10 ${y} C ${W*0.25} ${y - wob}, ${W*0.55} ${y + wob}, ${W+10} ${y - wob/2}`}
              fill="none" stroke={g.dark} strokeOpacity={i % 3 === 0 ? 0.22 : 0.12} strokeWidth={i % 5 === 0 ? 2 : 1} />
          )
        })}
        {[0.18, 0.62].map((f, i) => (
          <ellipse key={i} cx={W*f} cy={H*(i ? 0.68 : 0.3)} rx="13" ry="6"
            fill="none" stroke={g.dark} strokeOpacity="0.3" strokeWidth="1.4" />
        ))}
      </g>

      {round
        ? <circle cx={W/2} cy={H/2} r={Math.min(W,H)/2 - 4} fill="none" stroke={g.dark} strokeOpacity="0.55" strokeWidth="3" />
        : <rect x="4" y="4" width={W-8} height={H-8} rx="10" fill="none" stroke={g.dark} strokeOpacity="0.55" strokeWidth="3" />}

      {showEngraving && (initials || text) && (
        <g opacity="0.88">
          {initials && (
            <text x={W/2} y={H/2 + (text ? -6 : 8)} textAnchor="middle"
              fontFamily="Bitter, Georgia, serif" fontWeight="700"
              fontSize={Math.min(W, H) * (text ? 0.2 : 0.26)} fill="#3A2415">
              {initials.slice(0, 3).toUpperCase()}
            </text>
          )}
          {text && (
            <text x={W/2} y={H/2 + (initials ? Math.min(W,H)*0.14 : 6)} textAnchor="middle"
              fontFamily="Figtree, sans-serif" fontWeight="600"
              letterSpacing={Math.min(W,H) * 0.012}
              fontSize={Math.min(W, H) * 0.075} fill="#3A2415">
              {text.slice(0, 28).toUpperCase()}
            </text>
          )}
        </g>
      )}
    </svg>
  )
}
