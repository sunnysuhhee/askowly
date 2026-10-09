import { useOnline } from '../hooks/useOnline'
import { Icon } from './art/Icon'

export function OfflineBanner() {
  const online = useOnline()
  if (online) return null
  return (
    <div className="offline-banner" role="status">
      <Icon name="cloud-off" />
      <span>No internet right now. Your medicines, exercises and message checks still work. Owly can chat more once you are back online.</span>
    </div>
  )
}
