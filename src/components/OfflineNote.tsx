import type { AskResult } from '../ai/types'
import { Icon } from './art/Icon'

/** Marks an answer that came from the on-device fallback instead of the online AI (Gemini). */
export function OfflineNote({ result }: { result: AskResult }) {
  if (result.source !== 'offline') return null
  const noInternet = result.offlineReason === 'no-internet'
  return (
    <div className="note" style={{ marginTop: 12 }} data-testid="offline-note">
      <Icon name={noInternet ? 'cloud-off' : 'info'} />
      <p>
        {noInternet
          ? 'No internet, so Owly answered with what it knows on this device. Owly can chat more freely once you are back online.'
          : 'Limited mode: Owly could not reach its chat helper, so it answered with what it knows on this device.'}
        {import.meta.env.DEV && result.diagnostic && <small> (Developer note: {result.diagnostic})</small>}
      </p>
    </div>
  )
}
