import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { bySlug, type Product } from './catalogue'
import { basketTotals, type BasketLine, type Finish } from './pricing'

/** A design the buyer has already paid setup on. */
export interface SavedDesign { id: string; name: string; usedOn: string[] }

interface StoredLine { key: string; slug: string; qty: number; finish: Finish; reusedDesignId: string | null; designName: string }

interface Ctx {
  /** whether prices are shown with VAT added. UK trade buyers work ex VAT. */
  incVat: boolean
  setIncVat: (v: boolean) => void
  lines: BasketLine[]
  add: (p: Product, qty: number, finish: Finish, reusedDesignId: string | null, designName: string) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  totals: ReturnType<typeof basketTotals>
  savedDesigns: SavedDesign[]
}

const C = createContext<Ctx | null>(null)
const KEY = 'grainmark'

/** The account already has one design on file, which is what makes the waiver demonstrable. */
export const SAVED_DESIGNS: SavedDesign[] = [
  { id: 'd1', name: 'Trattoria Vero, round mark', usedOn: ['round-pizza-board-320', 'round-coaster-95'] },
  { id: 'd2', name: 'Trattoria Vero, wordmark', usedOn: ['a5-menu-holder'] },
]

function readLines(): StoredLine[] {
  try {
    const raw = localStorage.getItem(KEY + '.basket')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(l => l && typeof l.slug === 'string' && bySlug(l.slug) && Number.isFinite(l.qty))
  } catch { return [] }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [incVat, setIncVat] = useState(() => {
    try { return localStorage.getItem(KEY + '.incVat') === 'true' } catch { return false }
  })
  const [stored, setStored] = useState<StoredLine[]>(readLines)

  useEffect(() => {
    try {
      localStorage.setItem(KEY + '.incVat', String(incVat))
      localStorage.setItem(KEY + '.basket', JSON.stringify(stored))
    } catch { /* private mode */ }
  }, [incVat, stored])

  const lines: BasketLine[] = useMemo(
    () => stored.map(l => ({ ...l, product: bySlug(l.slug)! })).filter(l => l.product),
    [stored]
  )

  const value = useMemo<Ctx>(() => ({
    incVat, setIncVat,
    lines,
    add: (p, qty, finish, reusedDesignId, designName) => setStored(xs => {
      const key = `${p.slug}|${finish}|${reusedDesignId ?? 'new'}`
      const found = xs.find(x => x.key === key)
      return found
        ? xs.map(x => x.key === key ? { ...x, qty: x.qty + qty } : x)
        : [...xs, { key, slug: p.slug, qty, finish, reusedDesignId, designName }]
    }),
    setQty: (key, qty) => setStored(xs => qty <= 0 ? xs.filter(x => x.key !== key) : xs.map(x => x.key === key ? { ...x, qty } : x)),
    remove: key => setStored(xs => xs.filter(x => x.key !== key)),
    clear: () => setStored([]),
    totals: basketTotals(lines),
    savedDesigns: SAVED_DESIGNS,
  }), [incVat, lines, stored])

  return <C.Provider value={value}>{children}</C.Provider>
}

export function useStore(): Ctx {
  const c = useContext(C)
  if (!c) throw new Error('useStore must be used inside StoreProvider')
  return c
}
