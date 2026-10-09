import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Phone, Search, ShoppingBag, X } from 'lucide-react'
import { categories } from '../lib/catalogue'
import { useStore } from '../lib/store'
import { gbp } from '../lib/pricing'

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Grainmark home">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="5" fill="#241A12" />
        <path d="M6 20c3-1.2 5-3.4 6.5-6.2M11 23c4-1.6 6.8-4.6 8.8-8.6M17 24.5c3.4-1.6 5.8-4 7.6-7.2"
          fill="none" stroke="#E8B882" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="22" cy="10" r="3.2" fill="#A3360E" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-ink">Grainmark</span>
    </Link>
  )
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { incVat, setIncVat, totals, lines } = useStore()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper">
        Skip to content
      </a>

      <div className="bg-ink text-ondark">
        <div className="shell flex flex-wrap items-center gap-x-5 gap-y-1.5 py-2 text-xs">
          <span className="font-semibold">Free delivery on trade orders over {gbp(15000)} ex VAT</span>
          <a href="tel:01618000000" className="ms-auto inline-flex items-center gap-1.5 font-semibold hover:text-accent-lt">
            <Phone className="size-3.5" aria-hidden="true" />
            0161 800 0000
          </a>
          <fieldset className="inline-flex items-center gap-1 rounded-sm border border-dimmed/40 p-0.5">
            <legend className="sr-only">Show prices with or without VAT</legend>
            {([[false, 'ex VAT'], [true, 'inc VAT']] as const).map(([v, label]) => (
              <button key={label} onClick={() => setIncVat(v)} aria-pressed={incVat === v}
                className={`rounded-sm px-2 py-0.5 font-semibold transition-colors ${
                  incVat === v ? 'bg-accent-lt text-ink' : 'text-dimmed hover:text-ondark'}`}>
                {label}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="shell flex h-16 items-center gap-4">
          <Wordmark />
          <div className="ms-auto hidden min-w-0 max-w-sm flex-1 items-center gap-2 rounded-sm border border-line-strong px-3 py-2 lg:flex">
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="q" className="sr-only">Search the catalogue</label>
            <input id="q" placeholder="Pizza boards, coasters, menu holders" className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none" />
          </div>
          <Link to="/basket" className="relative ms-auto rounded-sm border border-line px-3 py-2 hover:border-ink lg:ms-0">
            <ShoppingBag className="size-4 text-ink" aria-hidden="true" />
            <span className="sr-only">Basket</span>
            {lines.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ember text-[11px] font-bold text-white tnum">
                {totals.pieces > 99 ? '99+' : totals.pieces}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="catnav"
            aria-label={open ? 'Close menu' : 'Open menu'} className="rounded-sm border border-line p-2 md:hidden">
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        <nav aria-label="Categories" className={`border-t border-line bg-surface ${open ? '' : 'hidden md:block'}`} id="catnav">
          <div className="shell flex flex-col gap-0 md:flex-row md:items-center md:gap-1 md:py-1">
            {categories.map(c => (
              <NavLink key={c.slug} to={`/c/${c.slug}`}
                className={({ isActive }) => `border-b border-line px-1 py-3 text-sm md:border-0 md:px-3 md:py-2 ${
                  isActive ? 'font-bold text-accent' : 'font-medium text-body hover:text-ink'}`}>
                {c.name}
              </NavLink>
            ))}
            <NavLink to="/bulk-enquiry"
              className={({ isActive }) => `border-b border-line px-1 py-3 text-sm md:ms-auto md:border-0 md:px-3 md:py-2 ${
                isActive ? 'font-bold text-ember' : 'font-bold text-ember hover:text-ink'}`}>
              New venue or bulk order
            </NavLink>
          </div>
        </nav>
      </header>

      <main id="main" className="grow"><Outlet /></main>

      <footer className="border-t border-line bg-ink text-ondark">
        <div className="shell grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-lg font-bold text-ondark">Grainmark</span>
            <p className="mt-3 max-w-xs text-sm text-dimmed">
              Laser engraved timber for restaurants, cafés and bars. Cut, engraved and finished in Greater Manchester.
            </p>
          </div>
          <nav aria-label="Footer catalogue">
            <p className="eyebrow text-dimmed">Catalogue</p>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map(c => (
                <li key={c.slug}><Link to={`/c/${c.slug}`} className="text-dimmed hover:text-accent-lt">{c.name}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-dimmed">Trade</p>
            <ul className="mt-3 space-y-2 text-sm text-dimmed">
              <li><Link to="/bulk-enquiry" className="hover:text-accent-lt">Request a callback</Link></li>
              <li>Volume pricing on every line</li>
              <li>Setup charged once per design</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-dimmed">VAT</p>
            <p className="mt-3 text-sm text-dimmed">
              Prices shown {incVat ? 'include' : 'exclude'} VAT at 20 per cent. Switch at the top of any page. VAT number GB 000 0000 00.
            </p>
          </div>
        </div>
        <div className="border-t border-dimmed/20">
          <p className="shell py-4 text-xs text-dimmed">
            Prototype. Representative brand, products and prices.
          </p>
        </div>
      </footer>
    </div>
  )
}
