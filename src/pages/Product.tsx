import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Info, Minus, Plus, TrendingDown, Upload } from 'lucide-react'
import { bySlug, categoryBySlug, inCategory, minQty } from '../lib/catalogue'
import { gbp, ladder, priceLine, type Finish } from '../lib/pricing'
import { useStore } from '../lib/store'
import { Board } from '../components/Board'
import { Button, Eyebrow, Tag, field } from '../components/ui'
import { NotFound } from './NotFound'

export function ProductPage() {
  const { slug } = useParams()
  const p = slug ? bySlug(slug) : undefined
  const { incVat, add, savedDesigns } = useStore()
  const [qty, setQty] = useState(() => (p ? minQty(p) : 1))
  const [finish, setFinish] = useState<Finish>('unoiled')
  const [designId, setDesignId] = useState<string | null>(null)
  const [initials, setInitials] = useState('TV')
  const [text, setText] = useState('Trattoria Vero')
  const [added, setAdded] = useState(false)

  const usable = useMemo(() => p ? savedDesigns.filter(d => d.usedOn.includes(p.slug)) : [], [p, savedDesigns])
  const price = useMemo(() => p ? priceLine({ product: p, qty, finish, reusedDesignId: designId }) : null, [p, qty, finish, designId])
  const rows = useMemo(() => p ? ladder(p, finish, designId) : [], [p, finish, designId])
  const oneMore = useMemo(() => {
    if (!p || !price?.nextTier) return null
    const at = priceLine({ product: p, qty: price.nextTier.from, finish, reusedDesignId: designId })
    return at.exVatPence < price.exVatPence
      ? { to: price.nextTier.from, saves: price.exVatPence - at.exVatPence, extra: price.nextTier.from - qty }
      : null
  }, [p, price, qty, finish, designId])

  if (!p || !price) return <NotFound />
  const cat = categoryBySlug(p.category)!
  const show = (ex: number, inc: number) => (incVat ? inc : ex)
  const suffix = incVat ? 'inc VAT' : 'ex VAT'

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-line bg-surface">
        <ol className="shell flex flex-wrap items-center gap-2 py-2.5 text-xs text-muted">
          <li><Link to="/" className="hover:text-accent">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/c/${cat.slug}`} className="hover:text-accent">{cat.name}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-ink">{p.name}</li>
        </ol>
      </nav>

      <div className="shell grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-10 lg:py-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="rounded-sm border border-line bg-surface p-6 md:p-10">
            <Board product={p} text={text} initials={initials} className="mx-auto h-auto w-full max-w-md" />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Live preview from what you type. On the real store this sits over your uploaded artwork at engraving scale, so you see the mark before it is burned.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <Eyebrow>{cat.name}</Eyebrow>
          <h1 className="mt-2 text-h1">{p.name}</h1>
          <p className="mt-3 text-body">{p.summary}</p>

          <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="money text-3xl font-bold text-ink">{gbp(show(price.unitPence, Math.round(price.unitPence * 1.2)))}</span>
            <span className="text-sm text-muted">per piece at {qty}, {suffix}</span>
          </p>
          <p className="mt-1 money text-sm text-accent">
            {gbp(show(price.landedUnitExPence, price.landedUnitIncPence))} a piece once setup is shared across the run
          </p>

          {/* the ladder, as a control rather than a footnote */}
          <section className="mt-7" aria-labelledby="ladder">
            <h2 id="ladder" className="eyebrow text-muted">Volume pricing</h2>
            <ul className="mt-2.5 overflow-hidden rounded-sm border border-line">
              {rows.map((r, i) => {
                const active = price.tier.from === r.tier.from
                return (
                  <li key={r.tier.from}>
                    <button onClick={() => setQty(r.tier.from)} aria-pressed={active}
                      className={`flex w-full items-baseline gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                        i ? 'border-t border-line' : ''} ${active ? 'bg-ink text-paper' : 'bg-paper hover:bg-surface'}`}>
                      <span className="w-20 font-semibold tnum">
                        {r.tier.from}{rows[i+1] ? ` to ${rows[i+1].tier.from - 1}` : ' +'}
                      </span>
                      <span className="money font-bold">{gbp(show(r.unitExPence, Math.round(r.unitExPence * 1.2)))}</span>
                      <span className={`ms-auto money text-xs ${active ? 'text-accent-lt' : 'text-muted'}`}>
                        {gbp(show(r.landedUnitExPence, Math.round(r.landedUnitExPence * 1.2)))} landed
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          {oneMore && (
            <p className="mt-3 flex items-start gap-2 rounded-sm border border-ok/40 bg-ok-bg p-3 text-sm text-ok">
              <TrendingDown className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Add {oneMore.extra} more to reach {oneMore.to} and the whole order costs{' '}
                <strong className="money font-bold">{gbp(oneMore.saves)} less</strong>, not more.
              </span>
            </p>
          )}

          <section className="mt-7" aria-labelledby="qty">
            <h2 id="qty" className="eyebrow text-muted">Quantity</h2>
            <div className="mt-2.5 flex items-center gap-2">
              <button onClick={() => setQty(q => Math.max(minQty(p), q - 1))} aria-label="One fewer"
                className="grid size-11 place-items-center rounded-sm border border-line-strong hover:border-ink">
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <label htmlFor="qtyin" className="sr-only">Quantity</label>
              <input id="qtyin" type="number" min={minQty(p)} value={qty}
                onChange={e => setQty(Math.max(minQty(p), Number(e.target.value) || minQty(p)))}
                className={`${field} w-24 text-center money text-base font-bold`} />
              <button onClick={() => setQty(q => q + 1)} aria-label="One more"
                className="grid size-11 place-items-center rounded-sm border border-line-strong hover:border-ink">
                <Plus className="size-4" aria-hidden="true" />
              </button>
              <span className="ms-2 text-xs text-muted">minimum {minQty(p)}</span>
            </div>
          </section>

          <fieldset className="mt-7">
            <legend className="eyebrow text-muted">Finish</legend>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {([['unoiled', 'Unoiled', 'Sanded, ready to oil yourself', 0],
                 ['oiled', 'Oiled', 'Food safe oil, two coats', p.oilPence]] as const).map(([v, name, note, add]) => (
                <label key={v} className={`cursor-pointer rounded-sm border p-3 transition-colors ${
                  finish === v ? 'border-accent bg-surface' : 'border-line hover:border-line-strong'}`}>
                  <span className="flex items-start gap-2.5">
                    <input type="radio" name="finish" value={v} checked={finish === v}
                      onChange={() => setFinish(v)} className="mt-1 accent-[#8A4B14]" />
                    <span>
                      <span className="block text-sm font-bold text-ink">
                        {name}{add ? <span className="money font-semibold text-accent"> +{gbp(add)}</span> : ''}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">{note}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="eyebrow text-muted">Artwork</legend>
            <div className="mt-2.5 space-y-2">
              <label className={`flex cursor-pointer items-start gap-2.5 rounded-sm border p-3 transition-colors ${
                designId === null ? 'border-accent bg-surface' : 'border-line hover:border-line-strong'}`}>
                <input type="radio" name="design" checked={designId === null} onChange={() => setDesignId(null)} className="mt-1 accent-[#8A4B14]" />
                <span className="grow">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
                    <Upload className="size-3.5" aria-hidden="true" /> New design
                    <Tag tone="warn">setup {gbp(p.setupPence)} once</Tag>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">Upload a logo and we set the file up for the laser.</span>
                </span>
              </label>
              {usable.map(d => (
                <label key={d.id} className={`flex cursor-pointer items-start gap-2.5 rounded-sm border p-3 transition-colors ${
                  designId === d.id ? 'border-accent bg-surface' : 'border-line hover:border-line-strong'}`}>
                  <input type="radio" name="design" checked={designId === d.id} onChange={() => setDesignId(d.id)} className="mt-1 accent-[#8A4B14]" />
                  <span className="grow">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
                      {d.name}
                      <Tag tone="ok"><Check className="size-3" aria-hidden="true" /> setup already paid</Tag>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">On file from a previous order, so no setup fee.</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="initials" className="text-xs font-semibold text-ink">Initials or monogram</label>
                <input id="initials" value={initials} maxLength={3} onChange={e => setInitials(e.target.value)} className={`${field} mt-1`} />
              </div>
              <div>
                <label htmlFor="line" className="text-xs font-semibold text-ink">Line of text</label>
                <input id="line" value={text} maxLength={28} onChange={e => setText(e.target.value)} className={`${field} mt-1`} />
              </div>
            </div>
          </fieldset>

          <div className="mt-8 rounded-sm border border-line bg-surface p-5">
            <dl className="space-y-2 text-sm">
              <Row label={`${qty} at ${gbp(price.unitPence)}`} value={gbp(price.goodsPence)} />
              {price.setupPence > 0
                ? <Row label="One off setup for a new design" value={gbp(price.setupPence)} />
                : <Row label="Setup" value="waived, design on file" ok />}
              <div className="flex justify-between border-t border-line pt-2 text-base">
                <dt className="font-bold text-ink">Total {suffix}</dt>
                <dd className="money font-bold text-ink">{gbp(incVat ? price.incVatPence : price.exVatPence)}</dd>
              </div>
              <p className="text-xs text-muted">
                {incVat
                  ? `${gbp(price.exVatPence)} ex VAT plus ${gbp(price.vatPence)} VAT`
                  : `plus ${gbp(price.vatPence)} VAT, ${gbp(price.incVatPence)} inc`}
              </p>
            </dl>
            <div className="mt-4">
              <Button variant="ember" full onClick={() => { add(p, qty, finish, designId, designId ? (usable.find(d => d.id === designId)?.name ?? 'Saved design') : (text || initials || 'New design')); setAdded(true); setTimeout(() => setAdded(false), 2500) }}>
                {added ? 'Added to basket' : 'Add to basket'}
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Artwork proof emailed before anything is cut.
            </p>
          </div>
        </div>

        <section className="lg:col-start-1 lg:row-start-2">
          <h2 className="text-h2">Specification</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[['Timber', p.timber], ['Size', p.dimensions], ['Engraving area', p.engraveArea],
              ['Lead time', `${p.leadDays} working days from artwork approval`]].map(([k, v]) => (
              <div key={k} className="border-t border-line pt-3">
                <dt className="eyebrow text-muted">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="border-t border-line bg-surface" aria-labelledby="more">
        <div className="shell py-12">
          <h2 id="more" className="text-h2">More in {cat.name.toLowerCase()}</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inCategory(p.category).filter(x => x.id !== p.id).map(x => (
              <li key={x.id} className="rounded-sm border border-line bg-paper p-4">
                <Link to={`/p/${x.slug}`} className="group block">
                  <Board product={x} text="" initials="" showEngraving={false} className="h-28 w-full" />
                  <h3 className="mt-3 font-display text-base font-bold group-hover:text-accent">{x.name}</h3>
                  <p className="money mt-1 text-sm text-body">from {gbp(x.tiers[x.tiers.length-1].unitPence)} a piece</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={ok ? 'text-ok' : 'text-body'}>{label}</dt>
      <dd className={`money ${ok ? 'font-semibold text-ok' : 'text-ink'}`}>{value}</dd>
    </div>
  )
}
