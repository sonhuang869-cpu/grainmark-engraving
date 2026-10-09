import { Link } from 'react-router-dom'
import { Check, Minus, Plus, Trash2 } from 'lucide-react'
import { gbp } from '../lib/pricing'
import { useStore } from '../lib/store'
import { Board } from '../components/Board'
import { Button, Eyebrow, Tag } from '../components/ui'

export function Basket() {
  const { lines, totals, setQty, remove, clear, incVat } = useStore()

  if (lines.length === 0) {
    return (
      <div className="shell py-20 md:py-28">
        <Eyebrow>Basket</Eyebrow>
        <h1 className="mt-3 text-h1">Nothing in it yet</h1>
        <p className="mt-4 max-w-xl text-body">
          Pick a line, set the quantity against the volume bands, and the setup fee
          only appears if the design is new to us.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button to="/c/pizza-boards">Pizza boards</Button>
          <Button to="/c/coasters" variant="ghost">Coasters</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="shell grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <div>
        <Eyebrow>Basket</Eyebrow>
        <h1 className="mt-2 text-h1">{totals.pieces} pieces across {lines.length} {lines.length === 1 ? 'line' : 'lines'}</h1>

        <ul className="mt-7 divide-y divide-line border-y border-line">
          {totals.priced.map(({ line, price }) => (
            <li key={line.key} className="grid gap-4 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <Link to={`/p/${line.product.slug}`} className="rounded-sm bg-surface p-2">
                <Board product={line.product} text="" initials="TV" className="h-20 w-full" />
              </Link>
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-bold">
                      <Link to={`/p/${line.product.slug}`} className="hover:text-accent">{line.product.name}</Link>
                    </h2>
                    <p className="mt-0.5 text-xs text-muted">
                      {line.finish === 'oiled' ? 'Oiled' : 'Unoiled'} · {line.designName}
                    </p>
                  </div>
                  <p className="money text-base font-bold text-ink">
                    {gbp(incVat ? price.incVatPence : price.exVatPence)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => setQty(line.key, line.qty - 1)} aria-label={`One fewer ${line.product.name}`}
                    className="grid size-9 place-items-center rounded-sm border border-line hover:border-ink">
                    <Minus className="size-3.5" aria-hidden="true" />
                  </button>
                  <span className="money w-14 text-center text-sm font-bold">{line.qty}</span>
                  <button onClick={() => setQty(line.key, line.qty + 1)} aria-label={`One more ${line.product.name}`}
                    className="grid size-9 place-items-center rounded-sm border border-line hover:border-ink">
                    <Plus className="size-3.5" aria-hidden="true" />
                  </button>
                  <button onClick={() => remove(line.key)} aria-label={`Remove ${line.product.name}`}
                    className="ms-1 grid size-9 place-items-center rounded-sm border border-line text-muted hover:border-lose hover:text-lose">
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                  <span className="money ms-2 text-xs text-muted">
                    {gbp(price.unitPence)} each in the {price.tier.from}+ band
                  </span>
                </div>

                <p className="mt-2.5">
                  {price.setupWaived
                    ? <Tag tone="ok"><Check className="size-3" aria-hidden="true" /> setup waived, design on file</Tag>
                    : <Tag tone="warn">setup {gbp(price.setupPence)} once for this design</Tag>}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={clear} className="mt-4 text-sm text-muted underline underline-offset-4 hover:text-lose">
          Empty the basket
        </button>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-sm border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <dl className="mt-5 space-y-2.5 text-sm">
            <Row label={`Goods, ${totals.pieces} pieces`} value={gbp(totals.goodsPence)} />
            <Row label="Setup fees" value={totals.setupPence === 0 ? 'none' : gbp(totals.setupPence)} />
            {totals.setupsWaived > 0 && (
              <p className="text-xs text-ok">
                {totals.setupsWaived} {totals.setupsWaived === 1 ? 'line uses' : 'lines use'} a design already on file, so no setup is charged on {totals.setupsWaived === 1 ? 'it' : 'them'}.
              </p>
            )}
            <div className="flex justify-between border-t border-line pt-2.5">
              <dt className="font-semibold text-ink">Subtotal ex VAT</dt>
              <dd className="money font-semibold text-ink">{gbp(totals.exVatPence)}</dd>
            </div>
            <Row label="VAT at 20 per cent" value={gbp(totals.vatPence)} />
            <div className="flex justify-between border-t-2 border-ink pt-2.5 text-lg">
              <dt className="font-display font-bold text-ink">Total inc VAT</dt>
              <dd className="money font-bold text-ink">{gbp(totals.incVatPence)}</dd>
            </div>
          </dl>
          <div className="mt-5"><Button variant="ember" full>Request a proforma</Button></div>
          <p className="mt-3 text-center text-xs text-muted">
            Nothing is charged here. A proof goes out before anything is cut.
          </p>
        </div>

        <div className="mt-5 rounded-sm border border-line p-5">
          <h2 className="eyebrow text-muted">Delivery</h2>
          <p className="mt-2 text-sm text-body">
            {totals.exVatPence >= 15000
              ? 'Free delivery, this order is over the 150 pound trade threshold.'
              : `Add ${gbp(15000 - totals.exVatPence)} ex VAT for free delivery.`}
          </p>
        </div>
      </aside>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-body">{label}</dt>
      <dd className="money text-ink">{value}</dd>
    </div>
  )
}
