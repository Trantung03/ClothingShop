import { useEffect, useMemo, useState } from 'react'
import { fetchBagItems } from './service'

export default function Bag() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      const bagItems = await fetchBagItems()
      setItems(bagItems)
      const count = bagItems.length
      localStorage.setItem('bagCount', String(count))
      window.dispatchEvent(new CustomEvent('bag-count-change', { detail: count }))
    }
    load()
  }, [])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0), [items])
  const delivery = subtotal > 5000000 ? 0 : 30000
  const total = subtotal + delivery

  return (
    <section className="bag-page">
      <div className="bag-banner">
        <p>
          <strong>FREE DELIVERY</strong> Applies to orders of 5.000.000₫ or more. <span>View details.</span>
        </p>
      </div>

      <div className="bag-layout">
        <div className="bag-left">
          <div className="bag-head">
            <h1>Bag</h1>
          </div>

          {items.map((item) => (
            <article key={item.id} className="bag-card">
              <img className="bag-image" src={item.imageUrl} alt={item.name} />
              <div className="bag-card-content">
                <div className="bag-card-top">
                  <div>
                    <p className="bag-card-title">{item.name}</p>
                    <p className="bag-card-subtitle">{item.subtitle}</p>
                    <p className="bag-card-detail">Size {item.size}</p>
                  </div>
                  <p className="bag-card-price">{item.price}</p>
                </div>
                <div className="bag-card-actions">
                  <button type="button" className="icon-button">🗑️</button>
                  <div className="quantity-control">
                    <button type="button" className="qty-button">−</button>
                    <span>{item.quantity}</span>
                    <button type="button" className="qty-button">＋</button>
                  </div>
                  <button type="button" className="icon-button">♡</button>
                </div>
                <p className="bag-card-note">Just a few left. Order soon.</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="bag-summary">
          <div className="summary-card">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="summary-row">
              <span>Estimated Delivery & Handling</span>
              <span>{delivery === 0 ? 'Free' : `${delivery.toLocaleString()}₫`}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <button type="button" className="button button-primary summary-button">
              Guest Checkout
            </button>
            <button type="button" className="button button-outline summary-button">
              Member Checkout
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
