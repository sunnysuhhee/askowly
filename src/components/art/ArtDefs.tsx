/**
 * Shared SVG filters for every AskOwly illustration, rendered once at the app root.
 *
 *  - ao-wobble:    slightly uneven, hand-drawn outlines (displaces the whole drawing a little)
 *  - ao-wobble-sm: a gentler wobble for small icons, so they stay crisp
 *  - ao-crayon:    soft colored-pencil grain inside fills (never applied to text or controls)
 */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="ao-wobble" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ao-wobble-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ao-crayon" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="11" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 0.96  0 0 0 0 0.88  0 0 0 1.5 -0.92"
            result="specks"
          />
          <feComposite in="specks" in2="SourceGraphic" operator="in" result="grainInside" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grainInside" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}

/** Palette for artwork (mirrors tokens.css and the logo). */
export const INK = '#1F2A44'
export const C = {
  ink: INK,
  cream: '#FFF7EB',
  sand: '#FFE9C7',
  amber: '#E08A1E',
  orange: '#F5A742',
  wing: '#E08A1E',
  belly: '#FDD592',
  beak: '#E4632C',
  blush: '#F4A99A',
  paleOrange: '#FFEFD6',
  white: '#FFFFFF',
  brick: '#8E2A1E',
  olive: '#3D5A26',
  oliveSoft: '#E4ECD2',
}

/** Common outline props: one weight everywhere. */
export const OUTLINE = { stroke: INK, strokeWidth: 4.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
