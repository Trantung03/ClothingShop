import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BAG_PLACEHOLDER_IMAGE } from '../../config/media.js'
import { fetchBagItems, removeCartLine, updateCartLineQuantity } from './service'
import './Bag.css'

export default function Bag() {
  const location = useLocation()
  const [items, setItems] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')

  const reload = useCallback(async () => {
    setLoadError('')
    try {
      const bagItems = await fetchBagItems()
      setItems(bagItems)
    } catch (e) {
      console.error(e)
      setLoadError(e?.message || 'Unable to load your cart.')
      setItems([])
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload, location.key])

  useEffect(() => {
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [reload])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0), [items])
  const delivery = subtotal > 5000000 ? 0 : 30000
  const total = subtotal + delivery

  function openNotice(message) {
    setNoticeMessage(message)
  }

  function closeNotice() {
    setNoticeMessage('')
  }

  async function changeQty(item, nextQty) {
    if (nextQty < 1) return
    setBusyId(item.cartItemId)
    try {
      await updateCartLineQuantity(item.skuId, nextQty)
      await reload()
    } catch (e) {
      console.error(e)
      openNotice(e?.message || 'Unable to update quantity.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleRemove(item) {
    setBusyId(item.cartItemId)
    try {
      await removeCartLine(item.cartItemId)
      await reload()
    } catch (e) {
      console.error(e)
      openNotice(e?.message || 'Unable to remove the item.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="bag-page">
      {noticeMessage ? (
        <div className="modal-overlay" onClick={closeNotice} role="presentation">
          <div className="modal-content bag-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeNotice} aria-label="Close notification">
              &times;
            </button>
            <div className="bag-modal-body">
              <h2>Notice</h2>
              <p>{noticeMessage}</p>
              <button type="button" className="bag-modal-button" onClick={closeNotice}>
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bag-banner">
        <p>
          <strong>FREE DELIVERY</strong> Applies to orders of 5.000.000₫ or more. <span>View details.</span>
        </p>
      </div>

      <div className="bag-layout">
        <div className="bag-left">
          <div className="bag-head" style={{ marginBottom: '50px' }}>
            <h1>Cart</h1>
          </div>

          {loadError ? (
            <p className="bag-load-error" style={{ color: '#b91c1c', marginBottom: '16px' }}>
              {loadError}
            </p>
          ) : null}

          {!loadError && items.length === 0 ? (
            <p className="bag-empty" style={{ color: '#666', marginBottom: '16px' }}>
              Your cart is empty. Please add products to your cart.
            </p>
          ) : null}

          {items.map((item) => (
            <article key={item.cartItemId} className="bag-card">
              <img
                className="bag-image"
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const ph = BAG_PLACEHOLDER_IMAGE
                  if (e.currentTarget.src !== ph) {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = ph
                  }
                }}
              />
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
                  <button
                    type="button"
                    className="icon-button"
                    disabled={busyId === item.cartItemId}
                    onClick={() => handleRemove(item)}
                    aria-label="Remove item"
                  >
                    🗑️
                  </button>
                  <div className="quantity-control">
                    <button
                      type="button"
                      className="qty-button"
                      disabled={busyId === item.cartItemId || item.quantity <= 1}
                      onClick={() => changeQty(item, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-button"
                      disabled={busyId === item.cartItemId}
                      onClick={() => changeQty(item, item.quantity + 1)}
                    >
                      ＋
                    </button>
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
            {items.length === 0 ? (
              <button type="button" className="button button-primary summary-button" disabled>
                Guest Checkout
              </button>
            ) : (
              <Link to="/checkout" className="button button-primary summary-button">
                Guest Checkout
              </Link>
            )}
            {items.length === 0 ? (
              <button type="button" className="button button-outline summary-button" disabled>
                Member Checkout
              </button>
            ) : (
              <Link to="/checkout" className="button button-outline summary-button">
                Member Checkout
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
