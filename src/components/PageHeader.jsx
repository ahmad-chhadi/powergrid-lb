// Shared heading block used at the top of inner pages.
export default function PageHeader({ title, intro, children }) {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-page py-12 sm:py-16">
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{intro}</p>}
        {children}
      </div>
    </section>
  )
}