import { VAT_RATE, type Product, type Tier } from './catalogue'

/**
 * Every figure on the site comes from here. Money is integer pence end to end,
 * because a trade order of 250 coasters at a tier price is exactly the kind of
 * arithmetic that goes wrong by a penny a unit in floating point and then by
 * two pounds fifty on the invoice.
 */

export type Finish = 'unoiled' | 'oiled'

export interface LineInput {
  product: Product
  qty: number
  finish: Finish
  /** a saved design the buyer has ordered before, so setup is already paid */
  reusedDesignId: string | null
}

export interface LinePrice {
  /** the band the quantity falls into */
  tier: Tier
  /** next band up, and how many more pieces to reach it */
  nextTier: Tier | null
  toNextTier: number
  /** ex VAT, pence */
  unitBasePence: number
  finishPence: number
  unitPence: number
  goodsPence: number
  setupPence: number
  setupWaived: boolean
  exVatPence: number
  vatPence: number
  incVatPence: number
  /** what one piece really costs once setup is shared across the run, ex VAT */
  landedUnitExPence: number
  landedUnitIncPence: number
}

export function tierFor(p: Product, qty: number): Tier {
  let found = p.tiers[0]
  for (const t of p.tiers) if (qty >= t.from) found = t
  return found
}

export function nextTierFor(p: Product, qty: number): Tier | null {
  return p.tiers.find(t => t.from > qty) ?? null
}

/** Rounds half up, which is what an invoice does. */
const vatOn = (pence: number) => Math.round(pence * VAT_RATE)

export function priceLine({ product, qty, finish, reusedDesignId }: LineInput): LinePrice {
  const safeQty = Math.max(0, Math.floor(qty))
  const tier = tierFor(product, safeQty)
  const nextTier = nextTierFor(product, safeQty)
  const finishPence = finish === 'oiled' ? product.oilPence : 0
  const unitPence = tier.unitPence + finishPence
  const goodsPence = unitPence * safeQty

  const setupWaived = reusedDesignId !== null
  const setupPence = setupWaived || safeQty === 0 ? 0 : product.setupPence

  const exVatPence = goodsPence + setupPence
  const vatPence = vatOn(exVatPence)

  return {
    tier, nextTier,
    toNextTier: nextTier ? nextTier.from - safeQty : 0,
    unitBasePence: tier.unitPence,
    finishPence, unitPence, goodsPence,
    setupPence, setupWaived,
    exVatPence, vatPence,
    incVatPence: exVatPence + vatPence,
    landedUnitExPence: safeQty ? Math.round(exVatPence / safeQty) : 0,
    landedUnitIncPence: safeQty ? Math.round((exVatPence + vatPence) / safeQty) : 0,
  }
}

/** Every band for a product, priced at its own minimum, for the ladder. */
export function ladder(p: Product, finish: Finish, reusedDesignId: string | null) {
  return p.tiers.map(t => {
    const line = priceLine({ product: p, qty: t.from, finish, reusedDesignId })
    return {
      tier: t,
      unitExPence: line.unitPence,
      landedUnitExPence: line.landedUnitExPence,
      savingVsFirstPence: p.tiers[0].unitPence - t.unitPence,
    }
  })
}

/* ------------------------------------------------------------------ basket */

export interface BasketLine extends LineInput { key: string; designName: string }

export function basketTotals(lines: BasketLine[]) {
  const priced = lines.map(l => ({ line: l, price: priceLine(l) }))
  const goodsPence = priced.reduce((n, x) => n + x.price.goodsPence, 0)
  const setupPence = priced.reduce((n, x) => n + x.price.setupPence, 0)
  const exVatPence = goodsPence + setupPence
  const vatPence = vatOn(exVatPence)
  return {
    priced,
    pieces: lines.reduce((n, l) => n + l.qty, 0),
    goodsPence, setupPence, exVatPence, vatPence,
    incVatPence: exVatPence + vatPence,
    setupsWaived: priced.filter(x => x.price.setupWaived).length,
  }
}

/* ------------------------------------------------------------------ format */

export const gbp = (pence: number) =>
  `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Unit prices are quoted to the penny in trade, never rounded to the pound. */
export const gbpUnit = (pence: number) => gbp(pence)
