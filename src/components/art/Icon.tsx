import type { ReactNode } from 'react'
import { C } from './ArtDefs'

/**
 * Hand-drawn icons in the same outline style as Owly. Icons are always
 * decorative (aria-hidden): every control that uses one also has a text label.
 */
export type IconName =
  | 'mic' | 'send' | 'speaker' | 'stop' | 'pause' | 'home' | 'back' | 'next' | 'settings'
  | 'check' | 'warning' | 'danger' | 'search' | 'info' | 'plus' | 'camera' | 'clock'
  | 'print' | 'share' | 'phone' | 'chat' | 'pin' | 'trash' | 'sun' | 'moon' | 'sunmoon'
  | 'smile' | 'meh' | 'frown' | 'star' | 'books' | 'cloud-off' | 'pill' | 'restart' | 'bell'

const S = { fill: 'none', stroke: C.ink, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const PATHS: Record<IconName, ReactNode> = {
  mic: (
    <>
      <rect x="11" y="4" width="10" height="16" rx="5" {...S} fill={C.orange} />
      <path d="M7 15 a9 9 0 0 0 18 0 M16 24 v4 M11 28 h10" {...S} />
    </>
  ),
  send: <path d="M4 15 L28 5 L20 28 L15 18 Z M15 18 L28 5" {...S} fill={C.orange} />,
  speaker: (
    <>
      <path d="M5 12 h5 l7 -6 v20 l-7 -6 h-5 Z" {...S} fill={C.orange} />
      <path d="M21 11 q4 5 0 10 M24 7 q8 9 0 18" {...S} />
    </>
  ),
  stop: <rect x="7" y="7" width="18" height="18" rx="4" {...S} fill={C.blush} />,
  pause: (
    <>
      <rect x="8" y="6" width="6" height="20" rx="2" {...S} fill={C.orange} />
      <rect x="18" y="6" width="6" height="20" rx="2" {...S} fill={C.orange} />
    </>
  ),
  home: <path d="M4 15 L16 5 L28 15 M8 13 V27 H24 V13 M13 27 V19 H19 V27" {...S} />,
  back: <path d="M27 16 H6 M13 8 L5 16 L13 24" {...S} />,
  next: <path d="M5 16 H26 M19 8 L27 16 L19 24" {...S} />,
  settings: (
    <>
      <path d="M5 9 H27 M5 16 H27 M5 23 H27" {...S} />
      <circle cx="11" cy="9" r="3.2" {...S} fill={C.orange} />
      <circle cx="21" cy="16" r="3.2" {...S} fill={C.orange} />
      <circle cx="13" cy="23" r="3.2" {...S} fill={C.orange} />
    </>
  ),
  check: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.oliveSoft} />
      <path d="M10 16.5 L14.5 21 L22.5 11.5" {...S} strokeWidth={3.5} />
    </>
  ),
  warning: (
    <>
      <path d="M16 4 L29 27 H3 Z" {...S} fill={C.orange} />
      <path d="M16 12 V19" {...S} strokeWidth={3.5} />
      <circle cx="16" cy="23.2" r="1.8" fill={C.ink} />
    </>
  ),
  danger: (
    <>
      <path d="M11 3 H21 L29 11 V21 L21 29 H11 L3 21 V11 Z" {...S} fill={C.brick} />
      <path d="M16 9 V18" stroke={C.cream} strokeWidth={3.6} strokeLinecap="round" />
      <circle cx="16" cy="23" r="2" fill={C.cream} />
    </>
  ),
  search: (
    <>
      <circle cx="13.5" cy="13.5" r="8.5" {...S} fill={C.paleOrange} />
      <path d="M20 20 L28 28" {...S} strokeWidth={3.6} />
    </>
  ),
  info: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.paleOrange} />
      <path d="M16 15 V23" {...S} strokeWidth={3.5} />
      <circle cx="16" cy="10" r="1.9" fill={C.ink} />
    </>
  ),
  plus: <path d="M16 6 V26 M6 16 H26" {...S} strokeWidth={3.6} />,
  camera: (
    <>
      <path d="M4 10 H10 L12 6 H20 L22 10 H28 V26 H4 Z" {...S} fill={C.orange} />
      <circle cx="16" cy="17" r="5" {...S} fill={C.cream} />
    </>
  ),
  clock: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.cream} />
      <path d="M16 9 V16 L21 19" {...S} />
    </>
  ),
  print: (
    <>
      <path d="M9 12 V4 H23 V12" {...S} />
      <rect x="4" y="12" width="24" height="11" rx="3" {...S} fill={C.orange} />
      <path d="M9 19 H23 V28 H9 Z" {...S} fill={C.cream} />
    </>
  ),
  share: <path d="M16 20 V4 M10 10 L16 4 L22 10 M9 14 H6 V28 H26 V14 H23" {...S} />,
  phone: (
    <path
      d="M9 4 L13 4 L15 11 L12 13 C13.5 17 15 18.5 19 20 L21 17 L28 19 V23 C28 26 26 28 23 28 C13 27 5 19 4 9 C4 6 6 4 9 4 Z"
      {...S}
      fill={C.orange}
    />
  ),
  chat: <path d="M5 7 H27 V21 H14 L8 27 V21 H5 Z" {...S} fill={C.paleOrange} />,
  pin: (
    <>
      <path d="M16 29 C16 29 6 19 6 12 a10 10 0 0 1 20 0 C26 19 16 29 16 29 Z" {...S} fill={C.blush} />
      <circle cx="16" cy="12" r="3.5" {...S} fill={C.cream} />
    </>
  ),
  trash: <path d="M5 8 H27 M12 8 V5 H20 V8 M8 8 L9.5 28 H22.5 L24 8 M13 13 V23 M19 13 V23" {...S} />,
  sun: (
    <>
      <circle cx="16" cy="16" r="6" {...S} fill={C.orange} />
      <path d="M16 3 V6 M16 26 V29 M3 16 H6 M26 16 H29 M7 7 L9 9 M23 23 L25 25 M7 25 L9 23 M23 9 L25 7" {...S} />
    </>
  ),
  moon: <path d="M21 4 A12 12 0 1 0 28 21 A10 10 0 0 1 21 4 Z" {...S} fill={C.orange} />,
  sunmoon: (
    <>
      <circle cx="11" cy="12" r="5" {...S} fill={C.orange} />
      <path d="M11 3 V4.5 M2 12 H3.5 M4.5 5.5 L5.6 6.6 M17.5 5.5 L16.4 6.6" {...S} strokeWidth={2.6} />
      <path d="M24 14 A8 8 0 1 0 29 26 A6.5 6.5 0 0 1 24 14 Z" {...S} fill={C.blush} />
    </>
  ),
  smile: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.orange} />
      <circle cx="11.5" cy="13" r="1.8" fill={C.ink} />
      <circle cx="20.5" cy="13" r="1.8" fill={C.ink} />
      <path d="M10.5 19 Q16 24 21.5 19" {...S} />
    </>
  ),
  meh: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.paleOrange} />
      <circle cx="11.5" cy="13" r="1.8" fill={C.ink} />
      <circle cx="20.5" cy="13" r="1.8" fill={C.ink} />
      <path d="M11 20.5 H21" {...S} />
    </>
  ),
  frown: (
    <>
      <circle cx="16" cy="16" r="12" {...S} fill={C.blush} />
      <circle cx="11.5" cy="13" r="1.8" fill={C.ink} />
      <circle cx="20.5" cy="13" r="1.8" fill={C.ink} />
      <path d="M10.5 22 Q16 17 21.5 22" {...S} />
    </>
  ),
  star: <path d="M16 3 L19.8 11.5 L29 12.4 L22 18.6 L24 27.6 L16 22.9 L8 27.6 L10 18.6 L3 12.4 L12.2 11.5 Z" {...S} fill={C.orange} />,
  books: (
    <>
      <rect x="4" y="7" width="7" height="21" rx="1.5" {...S} fill={C.blush} />
      <rect x="11" y="4" width="7" height="24" rx="1.5" {...S} fill={C.orange} />
      <path d="M19 9 L25 7.5 L29.5 26.5 L23.5 28 Z" {...S} fill={C.cream} />
    </>
  ),
  'cloud-off': (
    <>
      <path d="M9 25 H23 a6 6 0 0 0 0 -12 a8 8 0 0 0 -15 2 a5 5 0 0 0 1 10 Z" {...S} fill={C.cream} />
      <path d="M5 5 L27 27" {...S} strokeWidth={3.4} />
    </>
  ),
  pill: (
    <>
      <path d="M6.5 17.5 L17.5 6.5 a6 6 0 0 1 8 8 L14.5 25.5 a6 6 0 0 1 -8 -8 Z" {...S} fill={C.cream} />
      {/* Takes the medicine's group color where one is set (--med), blush elsewhere. */}
      <path d="M6.5 17.5 L12 12 L20 20 L14.5 25.5 a6 6 0 0 1 -8 -8 Z" style={{ fill: `var(--med, ${C.blush})` }} />
      <path d="M6.5 17.5 L17.5 6.5 a6 6 0 0 1 8 8 L14.5 25.5 a6 6 0 0 1 -8 -8 Z M12 12 L20 20" {...S} />
    </>
  ),
  restart: <path d="M7 16 a9 9 0 1 0 3 -7 M7 4 V10 H13" {...S} />,
  bell: (
    <>
      <path d="M8 22 V15 a8 8 0 0 1 16 0 V22 L26 25 H6 Z" {...S} fill={C.orange} />
      <path d="M13 28 a3 3 0 0 0 6 0" {...S} />
    </>
  ),
}

export function Icon({ name, className = 'icon' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g filter="url(#ao-wobble-sm)">{PATHS[name]}</g>
    </svg>
  )
}
