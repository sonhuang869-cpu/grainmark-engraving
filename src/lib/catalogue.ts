/**
 * Grainmark: laser engraved wood for hospitality.
 *
 * Trade pricing here is not a single number. Four things move it at once: the
 * quantity band, the one-off setup fee for a new design, the finish, and
 * whether the buyer is looking at prices with or without VAT. The catalogue
 * holds the inputs; src/lib/pricing.ts does the arithmetic in one place.
 */

export interface Tier { from: number; unitPence: number }

export type CategorySlug = 'pizza-boards' | 'serving-boards' | 'coasters' | 'menu-holders' | 'table-signage'

export interface Category {
  slug: CategorySlug
  name: string
  blurb: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: CategorySlug
  /** what the piece is, in a sentence a chef would use */
  summary: string
  timber: string
  dimensions: string
  /** laser engraving area in mm, which limits how big a logo can go */
  engraveArea: string
  /** price bands, ex VAT, in pence per piece */
  tiers: Tier[]
  /** one off charge to set up a new engraving file, ex VAT, pence */
  setupPence: number
  /** added per piece when oiled, ex VAT, pence */
  oilPence: number
  leadDays: number
  /** drawn board proportions for the preview, width to height */
  ratio: number
  grain: 'oak' | 'walnut' | 'beech' | 'acacia'
}

export const VAT_RATE = 0.20

export const categories: Category[] = [
  { slug: 'pizza-boards', name: 'Pizza boards', blurb: 'Round and paddle boards for service, engraved with your mark.' },
  { slug: 'serving-boards', name: 'Serving and cutting boards', blurb: 'Sharing boards, chopping blocks and platters for the pass.' },
  { slug: 'coasters', name: 'Coasters', blurb: 'Engraved coasters in oak, walnut and beech, from fifty up.' },
  { slug: 'menu-holders', name: 'Menu holders', blurb: 'Freestanding and clip holders for A4, A5 and tent cards.' },
  { slug: 'table-signage', name: 'Table signage', blurb: 'Table numbers, reserved signs and wayfinding for the floor.' },
]

export const products: Product[] = [
  {
    id: 'p1', slug: 'round-pizza-board-320', name: 'Round pizza board, 320 mm', category: 'pizza-boards',
    summary: 'The standard twelve inch service board. Engraved centre or rim, your choice.',
    timber: 'European oak', dimensions: '320 mm diameter, 18 mm', engraveArea: '180 x 180 mm',
    tiers: [{ from: 1, unitPence: 1450 }, { from: 10, unitPence: 1280 }, { from: 25, unitPence: 1140 }, { from: 50, unitPence: 1020 }, { from: 100, unitPence: 930 }],
    setupPence: 4500, oilPence: 120, leadDays: 10, ratio: 1, grain: 'oak',
  },
  {
    id: 'p2', slug: 'paddle-pizza-board-400', name: 'Paddle pizza board, 400 mm', category: 'pizza-boards',
    summary: 'Handled paddle for table service. The handle takes a logo neatly.',
    timber: 'Acacia', dimensions: '400 x 250 mm, 15 mm', engraveArea: '140 x 90 mm',
    tiers: [{ from: 1, unitPence: 1690 }, { from: 10, unitPence: 1520 }, { from: 25, unitPence: 1380 }, { from: 50, unitPence: 1250 }, { from: 100, unitPence: 1150 }],
    setupPence: 4500, oilPence: 140, leadDays: 10, ratio: 1.6, grain: 'acacia',
  },
  {
    id: 'p3', slug: 'rectangular-pizza-board-350', name: 'Rectangular pizza board, 350 mm', category: 'pizza-boards',
    summary: 'For square and Roman style. Deep enough to carry two slices clear of the edge.',
    timber: 'Beech', dimensions: '350 x 250 mm, 18 mm', engraveArea: '200 x 120 mm',
    tiers: [{ from: 1, unitPence: 1550 }, { from: 10, unitPence: 1390 }, { from: 25, unitPence: 1260 }, { from: 50, unitPence: 1140 }, { from: 100, unitPence: 1050 }],
    setupPence: 4500, oilPence: 130, leadDays: 10, ratio: 1.4, grain: 'beech',
  },
  {
    id: 'p4', slug: 'sharing-board-500', name: 'Sharing board, 500 mm', category: 'serving-boards',
    summary: 'Long board for charcuterie and mezze. Engraving sits well on the short edge.',
    timber: 'European oak', dimensions: '500 x 200 mm, 20 mm', engraveArea: '160 x 80 mm',
    tiers: [{ from: 1, unitPence: 2190 }, { from: 10, unitPence: 1980 }, { from: 25, unitPence: 1810 }, { from: 50, unitPence: 1660 }, { from: 100, unitPence: 1540 }],
    setupPence: 4500, oilPence: 180, leadDays: 12, ratio: 2.5, grain: 'oak',
  },
  {
    id: 'p5', slug: 'chopping-block-300', name: 'Chopping block, 300 mm', category: 'serving-boards',
    summary: 'End grain block for the kitchen. Heavier, and it takes a deeper burn.',
    timber: 'Walnut', dimensions: '300 x 300 mm, 40 mm', engraveArea: '120 x 120 mm',
    tiers: [{ from: 1, unitPence: 3850 }, { from: 10, unitPence: 3540 }, { from: 25, unitPence: 3290 }, { from: 50, unitPence: 3060 }, { from: 100, unitPence: 2870 }],
    setupPence: 4500, oilPence: 260, leadDays: 14, ratio: 1, grain: 'walnut',
  },
  {
    id: 'p6', slug: 'steak-platter-280', name: 'Steak platter, 280 mm', category: 'serving-boards',
    summary: 'Grooved platter that keeps the juices off the cloth. Popular with grill rooms.',
    timber: 'Acacia', dimensions: '280 x 200 mm, 18 mm', engraveArea: '110 x 70 mm',
    tiers: [{ from: 1, unitPence: 1790 }, { from: 10, unitPence: 1620 }, { from: 25, unitPence: 1480 }, { from: 50, unitPence: 1350 }, { from: 100, unitPence: 1250 }],
    setupPence: 4500, oilPence: 150, leadDays: 12, ratio: 1.4, grain: 'acacia',
  },
  {
    id: 'p7', slug: 'round-coaster-95', name: 'Round coaster, 95 mm', category: 'coasters',
    summary: 'The everyday coaster. Minimum fifty, because the setup is the same for one or a hundred.',
    timber: 'European oak', dimensions: '95 mm diameter, 8 mm', engraveArea: '70 x 70 mm',
    tiers: [{ from: 50, unitPence: 340 }, { from: 100, unitPence: 295 }, { from: 250, unitPence: 255 }, { from: 500, unitPence: 220 }, { from: 1000, unitPence: 195 }],
    setupPence: 3500, oilPence: 35, leadDays: 8, ratio: 1, grain: 'oak',
  },
  {
    id: 'p8', slug: 'square-coaster-100', name: 'Square coaster, 100 mm', category: 'coasters',
    summary: 'Square cut with a chamfered edge. Takes a wordmark better than a round one.',
    timber: 'Walnut', dimensions: '100 x 100 mm, 8 mm', engraveArea: '75 x 75 mm',
    tiers: [{ from: 50, unitPence: 395 }, { from: 100, unitPence: 345 }, { from: 250, unitPence: 300 }, { from: 500, unitPence: 262 }, { from: 1000, unitPence: 235 }],
    setupPence: 3500, oilPence: 40, leadDays: 8, ratio: 1, grain: 'walnut',
  },
  {
    id: 'p9', slug: 'a5-menu-holder', name: 'A5 menu holder, freestanding', category: 'menu-holders',
    summary: 'Slotted base that holds one or two A5 cards upright without tipping.',
    timber: 'Beech', dimensions: '160 x 60 mm base, 20 mm', engraveArea: '120 x 40 mm',
    tiers: [{ from: 1, unitPence: 980 }, { from: 10, unitPence: 880 }, { from: 25, unitPence: 800 }, { from: 50, unitPence: 730 }, { from: 100, unitPence: 670 }],
    setupPence: 3500, oilPence: 70, leadDays: 9, ratio: 2.6, grain: 'beech',
  },
  {
    id: 'p10', slug: 'a4-clip-holder', name: 'A4 clip holder', category: 'menu-holders',
    summary: 'For wine lists and specials that change. The clip is steel, the body is timber.',
    timber: 'European oak', dimensions: '230 x 90 mm, 22 mm', engraveArea: '150 x 50 mm',
    tiers: [{ from: 1, unitPence: 1340 }, { from: 10, unitPence: 1210 }, { from: 25, unitPence: 1110 }, { from: 50, unitPence: 1020 }, { from: 100, unitPence: 940 }],
    setupPence: 3500, oilPence: 90, leadDays: 9, ratio: 2.5, grain: 'oak',
  },
  {
    id: 'p11', slug: 'table-number-block', name: 'Table number block', category: 'table-signage',
    summary: 'Numbered both faces so the floor can read it from either side.',
    timber: 'Beech', dimensions: '70 x 90 mm, 18 mm', engraveArea: '55 x 70 mm',
    tiers: [{ from: 10, unitPence: 620 }, { from: 25, unitPence: 560 }, { from: 50, unitPence: 510 }, { from: 100, unitPence: 465 }, { from: 250, unitPence: 425 }],
    setupPence: 3500, oilPence: 45, leadDays: 8, ratio: 0.8, grain: 'beech',
  },
  {
    id: 'p12', slug: 'reserved-sign', name: 'Reserved sign, folded', category: 'table-signage',
    summary: 'A frame sign that folds flat for storage. Engraved on the outer face.',
    timber: 'Acacia', dimensions: '120 x 70 mm, 8 mm', engraveArea: '100 x 45 mm',
    tiers: [{ from: 10, unitPence: 740 }, { from: 25, unitPence: 670 }, { from: 50, unitPence: 610 }, { from: 100, unitPence: 560 }, { from: 250, unitPence: 515 }],
    setupPence: 3500, oilPence: 50, leadDays: 8, ratio: 1.7, grain: 'acacia',
  },
]

export const bySlug = (s: string) => products.find(p => p.slug === s)
export const inCategory = (c: CategorySlug) => products.filter(p => p.category === c)
export const categoryBySlug = (s: string) => categories.find(c => c.slug === s)
export const minQty = (p: Product) => p.tiers[0].from
