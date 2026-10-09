import { Link } from 'react-router-dom'
import { PhoneCall, Ruler, Timer } from 'lucide-react'
import { categories, inCategory, products } from '../lib/catalogue'
import { gbp } from '../lib/pricing'
import { useStore } from '../lib/store'
import { Board } from '../components/Board'
import { Button, Eyebrow } from '../components/ui'

export function Home() {
  const { incVat } = useStore()
  const show = (p: number) => (incVat ? Math.round(p * 1.2) : p)
  const popular = [products[0], products[6], products[3], products[8]]

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="shell grid gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:py-14">
          <div>
            <Eyebrow>Trade supplier, Greater Manchester</Eyebrow>
            <h1 className="mt-3 max-w-xl text-display font-bold leading-[1.1]">
              Your mark, burned into the board it is served on
            </h1>
            <p className="mt-5 max-w-lg text-body">
              Pizza boards, serving boards, coasters and menu holders for
              restaurants, cafés and bars. Volume pricing on every line, setup
              charged once per design, and never again on a repeat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/c/pizza-boards" variant="ember">Shop pizza boards</Button>
              <Button to="/bulk-enquiry" variant="ghost">New venue, talk to us</Button>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[[Timer, '8 to 14 days', 'from artwork approval'],
                [Ruler, 'Proof first', 'nothing is cut without sign off'],
                [PhoneCall, 'Callback in 24h', 'on any bulk enquiry']].map(([Icon, h, s]) => {
                const I = Icon as typeof Timer
                return (
                  <li key={h as string}>
                    <I className="size-5 text-accent" aria-hidden="true" />
                    <p className="mt-2 text-sm font-bold text-ink">{h as string}</p>
                    <p className="text-xs text-muted">{s as string}</p>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="rounded-sm border border-line bg-paper p-6">
            <Board product={products[0]} text="Trattoria Vero" initials="TV" className="mx-auto h-auto w-full max-w-sm" />
            <p className="mt-3 text-center text-xs text-muted">Round pizza board, 320 mm, oak, engraved centre</p>
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="cats">
        <div className="shell py-10">
          <h2 id="cats" className="sr-only">Categories</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map(c => {
              const sample = inCategory(c.slug)[0]
              return (
                <li key={c.slug}>
                  <Link to={`/c/${c.slug}`} className="group block rounded-sm border border-line bg-paper p-4 transition-colors hover:border-ink">
                    <Board product={sample} text="" initials="" showEngraving={false} className="h-20 w-full" />
                    <p className="mt-3 text-sm font-bold text-ink group-hover:text-accent">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{inCategory(c.slug).length} lines</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-paper" aria-labelledby="pop">
        <div className="shell py-12">
          <h2 id="pop" className="text-h2">Ordered most often</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map(p => (
              <li key={p.id} className="rounded-sm border border-line bg-paper p-4">
                <Link to={`/p/${p.slug}`} className="group block">
                  <Board product={p} text="" initials="TV" className="h-32 w-full" />
                  <h3 className="mt-3 font-display text-base font-bold leading-snug group-hover:text-accent">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted">{p.timber}</p>
                  <p className="money mt-2 text-sm font-bold text-ink">
                    from {gbp(show(p.tiers[p.tiers.length-1].unitPence))}
                    <span className="font-normal text-muted"> a piece {incVat ? 'inc' : 'ex'} VAT</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-ink text-ondark" aria-labelledby="how">
        <div className="shell grid gap-8 py-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <Eyebrow tone="light">How trade pricing works here</Eyebrow>
            <h2 id="how" className="mt-3 text-h2 text-ondark">Three numbers, stated plainly</h2>
          </div>
          <dl className="grid gap-6 md:col-span-2 sm:grid-cols-3">
            {[['The band', 'Price per piece falls as the quantity rises. Every band is on the product page, and you can press one to jump to it.'],
              ['The setup', 'A one off charge to prepare your artwork for the laser. Charged once per design, never again on a reorder of the same mark.'],
              ['The landed price', 'What one piece actually costs once the setup is shared across the run. It is the only number worth comparing.']].map(([h, b]) => (
              <div key={h}>
                <dt className="font-display text-base font-bold text-ondark">{h}</dt>
                <dd className="mt-2 text-sm text-dimmed">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
