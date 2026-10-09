import { C, OUTLINE } from './ArtDefs'
import { BookShape, ShieldShape } from './Objects'

export type OwlyPose = 'hello' | 'book' | 'stretch' | 'shield' | 'listening'

interface OwlyProps {
  pose?: OwlyPose
  /** Gentle bob while actually listening (disabled for reduced motion in CSS). */
  active?: boolean
  className?: string
  /** Decorative by default. Pass a label only when the picture adds meaning. */
  label?: string
}

/**
 * Owly: a small round orange owl with a pale-gold belly, red-orange beak,
 * big friendly eyes and pink cheeks, drawn like the logo. One drawing, a few poses.
 */
export function Owly({ pose = 'hello', active = false, className = 'art', label }: OwlyProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  const tilt = pose === 'listening' ? 'rotate(-7 80 96)' : undefined

  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y} focusable="false">
      <g filter="url(#ao-wobble)" className={active ? 'owly-listening' : undefined}>
        {pose === 'stretch' && <Sparkles />}
        {pose === 'listening' && <SoundArcs />}
        <g transform={tilt}>
          <g filter="url(#ao-crayon)">
            {/* ear tufts */}
            <path d="M48 52 L40 22 L68 38 Z" fill={C.amber} {...OUTLINE} />
            <path d="M112 52 L120 22 L92 38 Z" fill={C.amber} {...OUTLINE} />
            {/* body */}
            <path
              d="M80 30 C113 30 129 58 129 93 C129 125 108 143 80 143 C52 143 31 125 31 93 C31 58 47 30 80 30 Z"
              fill={C.orange}
              {...OUTLINE}
            />
            {/* belly */}
            <ellipse cx="80" cy="116" rx="30" ry="23" fill={C.belly} />
          </g>
          {/* belly feathers */}
          <path d="M68 108 q4 4 8 0 M84 114 q4 4 8 0 M70 124 q4 4 8 0" fill="none" stroke={C.amber} strokeWidth={3.5} strokeLinecap="round" />
          {/* cheeks */}
          <circle cx="47" cy="89" r="7" fill={C.blush} />
          <circle cx="113" cy="89" r="7" fill={C.blush} />
          {/* eyes */}
          <circle cx="62" cy="70" r="17" fill={C.white} {...OUTLINE} />
          <circle cx="98" cy="70" r="17" fill={C.white} {...OUTLINE} />
          <g className="owly-eyes">
            <circle cx="64" cy="72" r="8.5" fill={C.ink} />
            <circle cx="100" cy="72" r="8.5" fill={C.ink} />
            <circle cx="67" cy="68.5" r="3" fill={C.white} />
            <circle cx="103" cy="68.5" r="3" fill={C.white} />
          </g>
          {/* beak */}
          <path d="M74 85 L86 85 L80 95 Z" fill={C.beak} {...OUTLINE} strokeWidth={3.5} />
          {/* feet */}
          <path d="M64 142 q3 6 6 0 q3 6 6 0 M84 142 q3 6 6 0 q3 6 6 0" fill={C.amber} {...OUTLINE} strokeWidth={3.5} />
          <Wings pose={pose} />
        </g>
      </g>
    </svg>
  )
}

function Wings({ pose }: { pose: OwlyPose }) {
  const wing = { fill: C.wing, ...OUTLINE }
  switch (pose) {
    case 'stretch':
      return (
        <g filter="url(#ao-crayon)">
          <path d="M40 82 C24 66 18 44 24 26 C40 36 48 58 48 80 Z" {...wing} />
          <path d="M120 82 C136 66 142 44 136 26 C120 36 112 58 112 80 Z" {...wing} />
        </g>
      )
    case 'book':
      return (
        <g>
          <BookShape x={46} y={106} w={68} h={34} open />
          <g filter="url(#ao-crayon)">
            <path d="M36 88 C30 102 34 118 50 126 C56 116 52 100 36 88 Z" {...wing} />
            <path d="M124 88 C130 102 126 118 110 126 C104 116 108 100 124 88 Z" {...wing} />
          </g>
        </g>
      )
    case 'shield':
      return (
        <g>
          <g filter="url(#ao-crayon)">
            <path d="M36 86 C26 102 30 124 46 132 C50 116 48 98 36 86 Z" {...wing} />
          </g>
          <ShieldShape x={84} y={92} w={46} h={52} />
          <g filter="url(#ao-crayon)">
            <path d="M126 96 C132 108 128 122 116 128 C110 120 112 106 126 96 Z" {...wing} />
          </g>
        </g>
      )
    case 'listening':
      return (
        <g filter="url(#ao-crayon)">
          <path d="M36 86 C26 102 30 124 46 132 C50 116 48 98 36 86 Z" {...wing} />
          {/* wing cupped to the ear */}
          <path d="M124 80 C138 70 142 52 132 42 C122 52 116 66 124 80 Z" {...wing} />
        </g>
      )
    default:
      return (
        <g filter="url(#ao-crayon)">
          <path d="M36 86 C26 102 30 124 46 132 C50 116 48 98 36 86 Z" {...wing} />
          <path d="M124 86 C134 102 130 124 114 132 C110 116 112 98 124 86 Z" {...wing} />
        </g>
      )
  }
}

function Sparkles() {
  const s = { stroke: C.ink, strokeWidth: 3.5, strokeLinecap: 'round' as const, fill: 'none' }
  return (
    <g>
      <path d="M14 46 l-8 -4 M16 58 l-9 1 M146 46 l8 -4 M144 58 l9 1" {...s} />
      <path d="M80 8 v10 M75 13 h10" {...s} stroke={C.amber} />
    </g>
  )
}

function SoundArcs() {
  const s = { stroke: C.amber, strokeWidth: 3.5, strokeLinecap: 'round' as const, fill: 'none' }
  return (
    <g>
      <path d="M142 30 q8 8 0 16" {...s} />
      <path d="M150 24 q13 14 0 28" {...s} />
    </g>
  )
}

/**
 * The logo: Owly's face as a speech bubble ("Just ask."), drawn on the logo's own grid.
 * `circle` adds the soft sand disc behind it, as in the app icon.
 */
export function OwlyFace({ className, label, circle = false }: { className?: string; label?: string; circle?: boolean }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  const line = { stroke: C.ink, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="140 150 320 340" className={className} {...a11y} focusable="false">
      {circle && <circle cx="300" cy="320" r="168" fill={C.sand} />}
      {/* ears */}
      <path d="M192 168 L246 196 L202 232 Z" fill={C.amber} />
      <path d="M408 168 L354 196 L398 232 Z" fill={C.amber} />
      {/* head, with a speech-bubble tail at the lower left */}
      <path
        d="M300 186 C398 186 442 236 442 326 C442 418 392 464 300 464 C270 464 248 459 228 449 L170 478 L191 421 C166 396 158 364 158 326 C158 236 202 186 300 186 Z"
        fill={C.orange}
        {...line}
        strokeWidth={12}
      />
      <ellipse cx="300" cy="396" rx="72" ry="50" fill={C.belly} />
      <path d="M270 388 q12 10 24 0 M306 408 q12 10 24 0 M276 424 q12 10 24 0" fill="none" stroke={C.amber} strokeWidth={7} strokeLinecap="round" />
      <circle cx="213" cy="356" r="16" fill={C.blush} />
      <circle cx="387" cy="356" r="16" fill={C.blush} />
      <circle cx="250" cy="304" r="43" fill={C.white} {...line} strokeWidth={11} />
      <circle cx="350" cy="304" r="43" fill={C.white} {...line} strokeWidth={11} />
      <g className="owly-eyes">
        <circle cx="255" cy="312" r="22" fill={C.ink} />
        <circle cx="355" cy="312" r="22" fill={C.ink} />
        <circle cx="262" cy="302" r="8" fill={C.white} />
        <circle cx="362" cy="302" r="8" fill={C.white} />
      </g>
      <path d="M283 343 L317 343 L300 368 Z" fill={C.beak} {...line} strokeWidth={7} />
    </svg>
  )
}
