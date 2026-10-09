import { Icon } from './art/Icon'

export function Disclaimer() {
  return (
    <div className="note">
      <Icon name="info" />
      <p>
        AskOwly gives general information, not medical advice. Always ask your doctor or pharmacist before you start, stop,
        or change a medicine.
      </p>
    </div>
  )
}
