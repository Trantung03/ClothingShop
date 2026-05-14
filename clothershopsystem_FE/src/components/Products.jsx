import { Link } from 'react-router-dom'

export default function Products({ products, onViewDetail }) {
  return (
    <section className="products" id="products">
      <div className="section-head">
        <div>
          <p className="eyebrow">Featured styles</p>
          <h2>Shop the drop</h2>
        </div>
        <Link className="link-secondary" to="/shop">
          Explore all
        </Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-image" aria-hidden="true">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px' }} />}
            </div>
            <div className="product-body">
              <span className="product-badge">{product.badge}</span>
              <h3>{product.name}</h3>
              <p>{product.sub}</p>
            </div>
            <div className="product-footer">
              <span className="price">{product.price}</span>
              <button
                className="button button-sm button-outline"
                type="button"
                onClick={() => onViewDetail?.(product.id)}
              >
                View Detail
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
