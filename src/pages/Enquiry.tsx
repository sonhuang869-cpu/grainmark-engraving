import { useState, type FormEvent } from 'react'
import { Check, PhoneCall } from 'lucide-react'
import { categories } from '../lib/catalogue'
import { Button, Eyebrow, Field, field } from '../components/ui'

export function Enquiry() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<{ name: string; when: string } | null>(null)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const get = (k: string) => String(d.get(k) ?? '').trim()
    const next: Record<string, string> = {}
    if (!get('venue')) next.venue = 'Which venue is this for?'
    if (!get('name')) next.name = 'Who should we ask for?'
    const phone = get('phone').replace(/\s/g, '')
    if (!phone) next.phone = 'We are calling you back, so this one matters.'
    else if (!/^0\d{9,10}$/.test(phone)) next.phone = 'That does not look like a UK number.'
    const email = get('email')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'That address looks incomplete.'
    if (!get('needs') || get('needs').length < 10) next.needs = 'A sentence is enough. What are you opening with?'
    setErrors(next)
    if (Object.keys(next).length === 0) setSent({ name: get('name'), when: get('when') || 'any time' })
  }

  if (sent) {
    return (
      <div className="shell py-20 md:py-28">
        <div className="max-w-xl">
          <div className="grid size-12 place-items-center rounded-full bg-ok"><Check className="size-6 text-white" aria-hidden="true" /></div>
          <h1 className="mt-6 text-h1">We will ring you, {sent.name.split(' ')[0]}</h1>
          <p className="mt-4 text-body">
            Someone from the workshop calls within one working day, {sent.when === 'any time' ? 'whenever suits' : `in the ${sent.when}`}.
            Bring your logo in any format you have, even a photograph of a menu, and we will tell you honestly whether it will engrave well.
          </p>
          <p className="mt-4 text-sm text-muted">Nothing is stored in this prototype.</p>
          <div className="mt-7"><Button to="/">Back to the catalogue</Button></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="shell py-10">
          <Eyebrow>New venue or bulk order</Eyebrow>
          <h1 className="mt-2 max-w-2xl text-h1">Tell us what you are opening with and we will call you</h1>
          <p className="mt-4 max-w-2xl text-body">
            For a full fit out it is usually quicker to talk. We will price the
            whole list in one go, and if a different board does the job for less
            we will say so.
          </p>
        </div>
      </header>

      <div className="shell grid gap-10 py-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-14">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <Field id="venue" label="Venue name" error={errors.venue}>
            <input id="venue" name="venue" className={field} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Your name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" className={field} />
            </Field>
            <Field id="phone" label="Phone" hint="We ring, we do not add you to a list" error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
            </Field>
          </div>
          <Field id="email" label="Email (optional)" error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" className={field} />
          </Field>
          <Field id="when" label="Best time to call">
            <select id="when" name="when" defaultValue="" className={field}>
              <option value="">Any time</option>
              <option value="morning">Morning, before service</option>
              <option value="afternoon">Afternoon, between services</option>
              <option value="late">After 9pm</option>
            </select>
          </Field>
          <fieldset>
            <legend className="text-sm font-semibold text-ink">What are you likely to need?</legend>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {categories.map(c => (
                <li key={c.slug}>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line px-3 py-1.5 text-sm text-body has-checked:border-accent has-checked:bg-surface has-checked:font-semibold has-checked:text-ink">
                    <input type="checkbox" name="lines" value={c.slug} className="accent-[#8A4B14]" />
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <Field id="needs" label="Anything useful to know" hint="Opening date, rough numbers, whether you have a logo yet" error={errors.needs}>
            <textarea id="needs" name="needs" rows={4} className={field} />
          </Field>
          <Button type="submit" variant="ember">Request a callback</Button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-sm border border-line bg-surface p-6">
            <PhoneCall className="size-5 text-accent" aria-hidden="true" />
            <h2 className="mt-3 font-display text-lg font-bold">Or just ring the workshop</h2>
            <p className="money mt-2 text-xl font-bold text-ink">0161 800 0000</p>
            <p className="mt-3 text-sm text-body">
              Monday to Friday, eight until five. Ask for whoever is on the laser,
              they will know whether your logo works better engraved or cut.
            </p>
          </div>
          <div className="mt-5 rounded-sm border border-line p-6">
            <h2 className="eyebrow text-muted">What happens to the setup fee</h2>
            <p className="mt-2 text-sm text-body">
              Charged once, the first time we prepare a design. Every reorder of
              that same mark carries no setup at all, on any product it fits.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
