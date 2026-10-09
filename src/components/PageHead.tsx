import { Link } from 'react-router-dom'
import { Icon } from './art/Icon'
import { Owly, type OwlyPose } from './art/Owly'

/**
 * Every inner screen starts the same way: a labeled Back link, then the title
 * with a small Owly. Home is always in the top bar.
 */
export function PageHead({ title, back, owly }: { title: string; back?: { to: string; label: string }; owly?: OwlyPose }) {
  return (
    <>
      {back && <BackLink to={back.to} label={back.label} />}
      <div className="page-head">
        {owly && <Owly pose={owly} />}
        <h1 tabIndex={-1}>{title}</h1>
      </div>
    </>
  )
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <div className="crumbs no-print">
      <Link to={to} className="btn btn-secondary">
        <Icon name="back" /> Back<span className="visually-hidden"> to {label}</span>
      </Link>
    </div>
  )
}
