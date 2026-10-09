import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

export function Eyebrow({ children, tone = 'accent' }: { children: ReactNode; tone?: 'accent' | 'muted' | 'light' }) {
  const cls = tone === 'accent' ? 'text-accent' : tone === 'light' ? 'text-accent-lt' : 'text-muted'
  return <p className={`eyebrow ${cls}`}>{children}</p>
}

export function Button({ to, onClick, children, variant = 'solid', type = 'button', full = false }: {
  to?: string; onClick?: () => void; children: ReactNode
  variant?: 'solid' | 'ghost' | 'ember'; type?: 'button' | 'submit'; full?: boolean
}) {
  const look = variant === 'solid' ? 'bg-ink text-paper hover:bg-accent'
    : variant === 'ember' ? 'bg-ember text-white hover:bg-ink'
    : 'border border-line-strong text-ink hover:border-ink'
  const cls = `group inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-bold transition-colors ${look} ${full ? 'w-full' : ''}`
  return to
    ? <Link to={to} className={cls}>{children}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link>
    : <button type={type} onClick={onClick} className={cls}>{children}</button>
}

export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'ok' | 'warn' | 'ember' }) {
  const look = tone === 'ok' ? 'border-ok/35 bg-ok-bg text-ok'
    : tone === 'warn' ? 'border-warn/35 bg-warn-bg text-warn'
    : tone === 'ember' ? 'border-ember/35 bg-lose-bg text-ember'
    : 'border-line bg-surface text-body'
  return <span className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-semibold ${look}`}>{children}</span>
}

export function Field({ id, label, hint, error, children }: {
  id: string; label: string; hint?: string; error?: string; children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-sm font-semibold text-lose">{error}</p>}
    </div>
  )
}

export const field =
  'w-full rounded-sm border border-line-strong bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none'
