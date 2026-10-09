# Grainmark

A trade storefront for laser engraved timber: pizza boards, serving boards, coasters,
menu holders and table signage, sold to restaurants, cafes and bars.

Built as a working prototype of the two things this kind of shop actually turns on:
**personalisation that the buyer can see before they commit**, and **volume pricing
that is honest about what a piece really costs**.

## What it does

**Live engraving preview.** Type initials and a line of text on any product page and the
mark is drawn onto the board as you type, in the grain of the timber that product is cut
from. The alt text names what is engraved, so the preview is not lost on a screen reader.

**Volume pricing, with the landed price shown.** Every product has a price ladder. Next
to each band the page also shows the *landed* unit price, which is the band price plus
the one off setup fee shared across the run. A 320 mm board is £14.50 a piece at one,
but £59.50 landed, because the £45 setup sits on that single piece. At 100 it is £9.30
a piece and £9.75 landed. That second number is the one a venue owner is actually deciding on.

**Setup charged once per design.** Choosing a design already on file removes the setup
fee and the page says why. This is what makes a repeat trade order different from a
first order, and most storefronts hide it.

**Ex VAT / inc VAT toggle.** Trade buyers quote ex VAT, consumers see inc. The toggle is
in the utility bar on every page and every price on screen follows it.

**The tier boundary prompt.** At quantity 9 the page says: add one more and the whole
order costs less, not more. This is not a nudge, it is arithmetic. There are 44 points
in this catalogue where ordering one extra piece lowers the total. Nine 320 mm boards
total £175.50; ten total £173.00.

## Running it

```
npm install
npm run dev
```

## Stack

Vite, React, TypeScript, Tailwind v4, React Router. No backend: the catalogue is a
typed module and the basket persists to localStorage. Money is integer pence throughout
and VAT is computed on the order total rather than per line, so the pennies close.

## Checks

A headless sweep runs every route at 390 px and 1366 px in both VAT modes and asserts
the pricing behaviour end to end, including the ladder, the setup waiver, basket
arithmetic, form validation and the first tab stop. Contrast is probed against the
composited background of each surface rather than the declared token.

Prototype. Representative brand, products and prices.
