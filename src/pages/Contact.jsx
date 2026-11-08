import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { areas } from '../data/areas'

const empty = { name: '', email: '', phone: '', area: '', topic: 'general', message: '' }

const faqs = [
  {
    q: 'Is PowerGrid LB a power provider?',
    a: 'No. We list providers and help you compare them. Your contract and bill stay with the provider you choose.',
  },
  {
    q: 'How accurate is the solar estimate?',
    a: 'It is a planning figure based on average sun hours. Installers confirm the final size after a site survey.',
  },
  {
    q: 'Can I list my generator network?',
    a: 'Yes. Choose “List my business” in the form and we will contact you to add your plans and coverage area.',
  },
]

// returns an object with an error message for every invalid field
function validate(v) {
  const errors = {}
  if (v.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Enter an email like name@example.com.'
  if (v.phone && !/^\+?[\d\s-]{7,15}$/.test(v.phone)) errors.phone = 'Enter a phone number with 7 to 15 digits.'
  if (!v.area) errors.area = 'Choose your area.'
  if (v.message.trim().length < 10) errors.message = 'Write at least 10 characters so we can help.'
  return errors
}

export default function Contact() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length === 0) {
      setSent(true) // Phase 1 has no back end, so the message is not stored
    }
  }

  return (
    <>
      <PageHeader
        title="Contact us"
        intro="Questions about a provider, a solar estimate or listing your business. We reply within one working day."
      />

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-solar text-white">
                <Icon name="check" className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-bold">Message sent</h2>
              <p className="mt-2 text-mute">
                Thanks, {values.name.split(' ')[0]}. We’ll reply to {values.email} within one working day.
              </p>
              <button
                type="button"
                className="btn-ghost mt-8"
                onClick={() => {
                  setValues(empty)
                  setSent(false)
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" error={errors.name}>
                <input id="name" name="name" value={values.name} onChange={onChange} className="field" autoComplete="name" />
              </Field>
              <Field label="Email" name="email" error={errors.email}>
                <input id="email" name="email" type="email" value={values.email} onChange={onChange} className="field" autoComplete="email" />
              </Field>
              <Field label="Phone (optional)" name="phone" error={errors.phone}>
                <input id="phone" name="phone" type="tel" value={values.phone} onChange={onChange} className="field" placeholder="+961 70 000 000" autoComplete="tel" />
              </Field>
              <Field label="Area" name="area" error={errors.area}>
                <select id="area" name="area" value={values.area} onChange={onChange} className="field">
                  <option value="">Choose your area</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="label">Topic</legend>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['general', 'General question'],
                    ['solar', 'Solar estimate'],
                    ['provider', 'Problem with a provider'],
                    ['business', 'List my business'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium ${
                        values.topic === value ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
                      }`}
                    >
                      <input type="radio" name="topic" value={value} checked={values.topic === value} onChange={onChange} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="sm:col-span-2">
                <Field label="Message" name="message" error={errors.message}>
                  <textarea id="message" name="message" rows="5" value={values.message} onChange={onChange} className="field resize-y" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-sun w-full sm:w-auto">
                  <Icon name="mail" className="h-4 w-4" />
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-8">
          <div className="space-y-4 rounded-lg bg-night p-6 text-white">
            <p className="flex items-start gap-3">
              <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
              <span>LIU Nabatieh Campus, Nabatieh, Lebanon</span>
            </p>
            <p className="flex items-center gap-3">
              <Icon name="mail" className="h-5 w-5 shrink-0 text-sun" />
              <a href="mailto:hello@powergrid.lb" className="hover:underline">hello@powergrid.lb</a>
            </p>
            <p className="flex items-center gap-3">
              <Icon name="clock" className="h-5 w-5 shrink-0 text-sun" />
              <span>Monday to Friday, 9:00 to 17:00</span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold">Common questions</h2>
            <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
              {faqs.map((f) => (
                <details key={f.q} className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                    {f.q}
                    <span className="text-xl leading-none text-mute transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  )
}

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-cut" role="alert">{error}</p>
      )}
    </div>
  )
}