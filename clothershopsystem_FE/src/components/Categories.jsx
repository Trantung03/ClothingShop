export default function Categories({ categories }) {
  return (
    <section className="category-row" aria-label="Browse categories">
      {categories.map((item) => (
        <article key={item.name} className="category-card">
          <p>{item.label}</p>
          <h3>{item.name}</h3>
        </article>
      ))}
    </section>
  )
}
