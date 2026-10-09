import { Link, useParams } from 'react-router-dom'
import { categoryBySlug, inCategory, minQty } from '../lib/catalogue'
import { gbp } from '../lib/pricing'
import { useStore } from '../lib/store'
import { Board } from '../components/Board'
import { Eyebrow } from '../components/ui'
import { NotFound } from './NotFound'

export function Collection() {
  const { slug } = useParams()
  const cat = slug ? categoryBySlug(slug) : undefined
  const { incVat } = useStore()
  if (!cat) return <NotFound />
  const items = inCategory(cat.slug)
  const show = (p: number) => (incVat ? Math.round(p * 1.2) : p)

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="shell py-10">
          <Eyebrow>{items.length} lines</Eyebrow>
          <h1 className="mt-2 text-h1">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-body">{cat.blurb}</p>
        </div>
      </header>

      <div className="shell py-10">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(p => (
            <li key={p.id} className="flex flex-col rounded-sm border border-line bg-paper p-5">
              <Link to={`/p/${p.slug}`} className="group">
                <div className="rounded-sm bg-surface p-4">
                  <Board product={p} text="" initials="TV" className="mx-auto h-36 w-full" />
                </div>
                <h2 className="mt-4 font-display text-lg font-bold leading-snug group-hover:text-accent">{p.name}</h2>
              </Link>
              <p className="mt-1 text-xs text-muted">{p.timber} · {p.dimensions}</p>
              <p className="mt-3 grow text-sm text-body">{p.summary}</p>
              <table className="mt-4 w-full border-collapse text-xs">
                <caption className="sr-only">Volume pricing for {p.name}</caption>
                <thead>
                  <tr className="border-b border-line text-left">
                    <th scope="col" className="py-1 font-semibold text-muted">Qty</th>
                    {p.tiers.map(t => <th key={t.from} scope="col" className="py-1 text-right font-semibold text-muted tnum">{t.from}+</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="py-1.5 text-left font-semibold text-muted">Each</th>
                    {p.tiers.map(t => (
                      <td key={t.from} className="money py-1.5 text-right font-bold text-ink">{gbp(show(t.unitPence))}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
                Minimum {minQty(p)}. Setup {gbp(show(p.setupPence))} once per design. Prices {incVat ? 'inc' : 'ex'} VAT.
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
