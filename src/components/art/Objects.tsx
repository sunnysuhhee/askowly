import { C, OUTLINE } from './ArtDefs'

/* Shapes that sit inside other drawings (no own <svg>). */

export function BookShape({ x, y, w, h, open = false }: { x: number; y: number; w: number; h: number; open?: boolean }) {
  const mid = x + w / 2
  if (open) {
    return (
      <g>
        <g filter="url(#ao-crayon)">
          <path
            d={`M${mid} ${y + 4} C${mid - w * 0.2} ${y - 2} ${x + 6} ${y} ${x} ${y + 4} L${x} ${y + h} C${x + 6} ${y + h - 4} ${mid - w * 0.2} ${y + h - 6} ${mid} ${y + h} Z`}
            fill={C.cream}
            {...OUTLINE}
          />
          <path
            d={`M${mid} ${y + 4} C${mid + w * 0.2} ${y - 2} ${x + w - 6} ${y} ${x + w} ${y + 4} L${x + w} ${y + h} C${x + w - 6} ${y + h - 4} ${mid + w * 0.2} ${y + h - 6} ${mid} ${y + h} Z`}
            fill={C.cream}
            {...OUTLINE}
          />
        </g>
        <path
          d={`M${x + 7} ${y + 13} h${w * 0.3} M${x + 7} ${y + 21} h${w * 0.26} M${mid + 6} ${y + 13} h${w * 0.3} M${mid + 6} ${y + 21} h${w * 0.24}`}
          stroke={C.amber}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      </g>
    )
  }
  return (
    <g>
      <g filter="url(#ao-crayon)">
        <rect x={x} y={y} width={w} height={h} rx={5} fill={C.amber} {...OUTLINE} />
        <path d={`M${x + w * 0.18} ${y} v${h}`} stroke={C.ink} strokeWidth={3} />
        <rect x={x + w * 0.35} y={y + h * 0.22} width={w * 0.45} height={h * 0.2} rx={3} fill={C.orange} stroke={C.ink} strokeWidth={2.6} />
      </g>
    </g>
  )
}

export function ShieldShape({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const cx = x + w / 2
  return (
    <g>
      <g filter="url(#ao-crayon)">
        <path
          d={`M${cx} ${y} L${x + w} ${y + h * 0.14} C${x + w} ${y + h * 0.55} ${x + w * 0.8} ${y + h * 0.84} ${cx} ${y + h} C${x + w * 0.2} ${y + h * 0.84} ${x} ${y + h * 0.55} ${x} ${y + h * 0.14} Z`}
          fill={C.white}
          {...OUTLINE}
        />
      </g>
      <path
        d={`M${x + w * 0.3} ${y + h * 0.5} L${x + w * 0.45} ${y + h * 0.65} L${x + w * 0.72} ${y + h * 0.36}`}
        fill="none"
        {...OUTLINE}
        strokeWidth={5}
      />
    </g>
  )
}

/* Stand-alone decorative drawings. */

type ArtProps = { className?: string }

export function Book({ className = 'art' }: ArtProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#ao-wobble)">
        <BookShape x={14} y={22} w={52} h={40} />
      </g>
    </svg>
  )
}

export function Shield({ className = 'art' }: ArtProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#ao-wobble)">
        <ShieldShape x={16} y={10} w={48} h={60} />
      </g>
    </svg>
  )
}

export function Mug({ className = 'art' }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#ao-wobble)">
        <path d="M38 14 q-6 7 0 14 q6 7 0 14 M54 10 q-6 7 0 14 q6 7 0 14" fill="none" stroke={C.amber} strokeWidth={3.5} strokeLinecap="round" />
        <g filter="url(#ao-crayon)">
          <path d="M70 52 c14 0 16 22 0 22" fill="none" {...OUTLINE} strokeWidth={6} />
          <path d="M22 46 h52 v28 c0 10 -8 16 -18 16 h-16 c-10 0 -18 -6 -18 -16 Z" fill={C.orange} {...OUTLINE} />
          <path d="M22 58 h52" stroke={C.blush} strokeWidth={8} />
        </g>
        <path d="M22 46 h52 v28 c0 10 -8 16 -18 16 h-16 c-10 0 -18 -6 -18 -16 Z" fill="none" {...OUTLINE} />
      </g>
    </svg>
  )
}

export function Leaf({ className = 'art', tone = 'amber' }: ArtProps & { tone?: 'amber' | 'orange' | 'blush' }) {
  const fill = { amber: C.amber, orange: C.orange, blush: C.blush }[tone]
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#ao-wobble)">
        <g filter="url(#ao-crayon)">
          <path d="M10 50 C10 24 26 10 52 8 C52 34 36 50 10 50 Z" fill={fill} {...OUTLINE} strokeWidth={3.5} />
        </g>
        <path d="M10 50 C22 38 32 28 44 16" fill="none" {...OUTLINE} strokeWidth={3} />
      </g>
    </svg>
  )
}
