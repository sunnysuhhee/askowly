import type { Pose } from '../data/routines'
import { C } from './art/ArtDefs'

/**
 * Simple, high-contrast stick figure illustrations for each exercise pose.
 * Drawn on a 200x200 grid in the AskOwly style: navy figure, orange chair, amber motion marks.
 */
const STROKE = { stroke: C.ink, strokeWidth: 7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
const MOTION = { stroke: C.amber, strokeWidth: 5, strokeLinecap: 'round' as const, fill: 'none', strokeDasharray: '2 10' }

function Chair({ x = 60, behind = false }: { x?: number; behind?: boolean }) {
  // Side-view chair. `behind` draws a chair back to hold on to while standing.
  return behind ? (
    <g stroke={C.amber} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x} 80 V170 M${x} 120 H${x + 40} V170`} />
    </g>
  ) : (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x={x - 6} y={112} width={67} height={12} rx={5} fill={C.orange} stroke={C.ink} strokeWidth={4} />
      <path d={`M${x} 60 V170 M${x + 55} 124 V170`} stroke={C.amber} strokeWidth={7} fill="none" />
    </g>
  )
}

function Head({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={14} fill={C.blush} stroke={C.ink} strokeWidth={4.5} />
}

function Seated({ arms = 'knees', leg = 'down', twist = false, ankle = false }: { arms?: 'knees' | 'up' | 'forward'; leg?: 'down' | 'out'; twist?: boolean; ankle?: boolean }) {
  return (
    <g>
      <Chair />
      <Head cx={78} cy={50} />
      <path {...STROKE} d="M78 66 V115" />
      <path {...STROKE} d="M78 115 H115" />
      {leg === 'down' ? <path {...STROKE} d="M115 115 V165 H130" /> : <path {...STROKE} d="M115 115 L165 105" />}
      <path {...STROKE} d="M110 115 V165 H125" opacity={leg === 'out' ? 1 : 0} />
      {arms === 'knees' && <path {...STROKE} d="M78 78 L100 100 L112 112" />}
      {arms === 'up' && <path {...STROKE} d="M78 76 L90 45 L95 20" />}
      {arms === 'forward' && <path {...STROKE} d="M78 78 L120 78" />}
      {arms === 'up' && <path {...MOTION} d="M120 70 V25" />}
      {leg === 'out' && <path {...MOTION} d="M170 150 Q180 125 170 110" />}
      {twist && <path {...MOTION} d="M50 75 Q78 55 106 75" />}
      {ankle && <circle {...MOTION} cx={140} cy={165} r={14} />}
    </g>
  )
}

function Standing({ variant }: { variant: 'tall' | 'one-leg' | 'heels' | 'march' | 'side' | 'heel-toe' }) {
  const lift = variant === 'heels' ? -8 : 0
  return (
    <g>
      <Chair x={40} behind />
      <Head cx={110} cy={35 + lift} />
      <path {...STROKE} d={`M110 50 V${115 + lift}`} />
      {/* arms reaching to the chair */}
      <path {...STROKE} d={`M110 ${65 + lift} L80 ${80} L60 ${82}`} />
      {variant === 'one-leg' && <path {...STROKE} d={`M110 115 V172 M110 115 L125 140 L120 158`} />}
      {variant === 'march' && <path {...STROKE} d={`M110 115 V172 M110 115 L135 125 L135 150`} />}
      {variant === 'side' && <path {...STROKE} d={`M110 115 L100 172 M110 115 L140 172`} />}
      {variant === 'heel-toe' && <path {...STROKE} d={`M110 115 L104 172 M110 115 L118 172`} />}
      {(variant === 'tall' || variant === 'heels') && <path {...STROKE} d={`M110 ${115 + lift} L100 ${172 + lift} M110 ${115 + lift} L120 ${172 + lift}`} />}
      {variant === 'heels' && <path {...MOTION} d="M150 175 V140" />}
      {variant === 'march' && <path {...MOTION} d="M150 160 V120" />}
      {variant === 'side' && <path {...MOTION} d="M140 185 H175" />}
      <path stroke={C.ink} strokeWidth={3} strokeLinecap="round" d="M20 180 H190" />
    </g>
  )
}

function SitToStand() {
  return (
    <g>
      <Chair x={30} />
      <Head cx={105} cy={45} />
      <path {...STROKE} d="M100 60 L85 110" />
      <path {...STROKE} d="M85 110 L120 130 L120 170" />
      <path {...STROKE} d="M100 72 L120 100" />
      <path {...MOTION} d="M150 150 Q165 100 140 55" />
    </g>
  )
}

export function PoseArt({ pose, title }: { pose: Pose; title: string }) {
  let body
  switch (pose) {
    case 'sit': body = <Seated />; break
    case 'sit-arms-up': body = <Seated arms="up" />; break
    case 'sit-leg-lift': body = <Seated leg="out" />; break
    case 'sit-ankle': body = <Seated ankle />; break
    case 'sit-twist': body = <Seated twist />; break
    case 'sit-to-stand': body = <SitToStand />; break
    case 'stand-chair': body = <Standing variant="tall" />; break
    case 'stand-one-leg': body = <Standing variant="one-leg" />; break
    case 'heel-raise': body = <Standing variant="heels" />; break
    case 'march': body = <Standing variant="march" />; break
    case 'side-step': body = <Standing variant="side" />; break
    case 'heel-toe': body = <Standing variant="heel-toe" />; break
  }
  return (
    <svg className="step-art" viewBox="0 0 200 200" role="img" aria-label={`Picture: ${title}`}>
      <g filter="url(#ao-wobble)">{body}</g>
    </svg>
  )
}
