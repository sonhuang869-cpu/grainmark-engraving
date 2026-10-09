import { Button, Eyebrow } from '../components/ui'
export function NotFound() {
  return (
    <div className="shell py-24 md:py-32">
      <Eyebrow>Not found</Eyebrow>
      <h1 className="mt-3 max-w-2xl text-h1">We do not have that one</h1>
      <p className="mt-4 max-w-xl text-body">The line may have been renamed. Everything we make is in the catalogue above.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button to="/">Back to the catalogue</Button>
        <Button to="/bulk-enquiry" variant="ghost">Ask us for it</Button>
      </div>
    </div>
  )
}
