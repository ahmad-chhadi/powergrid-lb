import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../i18n/useData'

const empty = { name: '', email: '', phone: '', area: '', topic: 'general', message: '' }
const topics = ['general', 'solar', 'provider', 'business']

// returns an object with the translation key of the error for every invalid field
function validate(v) {
  const errors = {}
  if (v.name.trim().length < 2) errors.name = 'contact.errors.name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'contact.errors.email'
  if (v.phone && !/^\+?[\d\s-]{7,15}$/.test(v.phone)) errors.phone = 'contact.errors.phone'
  if (!v.area) errors.area = 'contact.errors.area'
  if (v.message.trim().length < 10) errors.message = 'contact.errors.message'
  return errors
}

export default function Contact() {
  const { t } = useLang()
  const { areas } = useData()
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

  // errors are saved as keys, so they switch language together with the page
  const errorText = (field) => (errors[field] ? t(errors[field]) : null)

  return (
    <>
      <PageHeader title={t('contact.title')} intro={t('contact.intro')} />

      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-solar text-white">
                <Icon name="check" className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-2xl font-bold">{t('contact.sentTitle')}</h2>
              <p className="mt-2 text-mute">
                {t('contact.sentText', { name: values.name.split(' ')[0], email: values.email })}
              </p>
              <button
                type="button"
                className="btn-ghost mt-8"
                onClick={() => {
                  setValues(empty)
                  setSent(false)
                }}
              >
                {t('contact.another')}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label={t('contact.fullName')} name="name" error={errorText('name')}>
                <input id="name" name="name" value={values.name} onChange={onChange} className="field" autoComplete="name" />
              </Field>
              <Field label={t('contact.email')} name="email" error={errorText('email')}>
                <input id="email" name="email" type="email" dir="ltr" value={values.email} onChange={onChange} className="field" autoComplete="email" />
              </Field>
              <Field label={t('contact.phone')} name="phone" error={errorText('phone')}>
                <input id="phone" name="phone" type="tel" dir="ltr" value={values.phone} onChange={onChange} className="field" placeholder={t('contact.phonePlaceholder')} autoComplete="tel" />
              </Field>
              <Field label={t('contact.area')} name="area" error={errorText('area')}>
                <select id="area" name="area" value={values.area} onChange={onChange} className="field">
                  <option value="">{t('contact.chooseArea')}</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="label">{t('contact.topic')}</legend>
                <div className="flex flex-wrap gap-2">
                  {topics.map((value) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium ${
                        values.topic === value ? 'border-ink bg-ink text-white' : 'border-line hover:border-ink'
                      }`}
                    >
                      <input type="radio" name="topic" value={value} checked={values.topic === value} onChange={onChange} className="sr-only" />
                      {t(`contact.topics.${value}`)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="sm:col-span-2">
                <Field label={t('contact.message')} name="message" error={errorText('message')}>
                  <textarea id="message" name="message" rows="5" value={values.message} onChange={onChange} className="field resize-y" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-sun w-full sm:w-auto">
                  <Icon name="mail" className="h-4 w-4" />
                  {t('contact.send')}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-8">
          <div className="space-y-4 rounded-lg bg-night p-6 text-white">
            <p className="flex items-start gap-3">
              <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-sun" />
              <span>{t('contact.address')}</span>
            </p>
            <p className="flex items-center gap-3">
              <Icon name="mail" className="h-5 w-5 shrink-0 text-sun" />
              <a href="mailto:hello@powergrid.lb" className="hover:underline">hello@powergrid.lb</a>
            </p>
            <p className="flex items-center gap-3">
              <Icon name="clock" className="h-5 w-5 shrink-0 text-sun" />
              <span>{t('contact.hours')}</span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold">{t('contact.faqTitle')}</h2>
            <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
              {t('contact.faqs').map((f) => (
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
