import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchBagItems, syncBagCountFromCart } from '../bag/service'
import { createOrder, prepareCheckout, verifyReservation } from './service'
import './CheckoutPage.css'

const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/

function fieldError(form, touched, key, message) {
  if (!touched[key]) return null
  const v = form[key]
  if (key === 'customerPhone' && v && !PHONE_REGEX.test(v.trim())) {
    return 'Phone number: use 0xxxxxxxxx or +84xxxxxxxxx (9–10 digits after the area code).'
  }
  if (!v || !String(v).trim()) return message
  return null
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loadingBag, setLoadingBag] = useState(true)
  const [prepareNote, setPrepareNote] = useState('')
  const [stockModalMessage, setStockModalMessage] = useState('')
  const [reservationSessionId, setReservationSessionId] = useState(null)
  const [reservationExpiresAt, setReservationExpiresAt] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successOrder, setSuccessOrder] = useState(null)

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    paymentMethod: 'COD',
  })
  const [touched, setTouched] = useState({})

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoadingBag(true)
      setSubmitError('')
      try {
        const bagItems = await fetchBagItems()
        if (!cancelled) setItems(bagItems)
      } catch (e) {
        console.error(e)
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoadingBag(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onFocus = () => {
      void (async () => {
        setLoadingBag(true)
        setSubmitError('')
        try {
          const bagItems = await fetchBagItems()
          setItems(bagItems)
        } catch (e) {
          console.error(e)
          setItems([])
        } finally {
          setLoadingBag(false)
        }
      })()
    }

    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  useEffect(() => {
    if (loadingBag || items.length === 0) return
    let cancelled = false
      ; (async () => {
        try {
          const res = await prepareCheckout()
          if (!cancelled) {
            setPrepareNote('')
            setReservationSessionId(res?.sessionId || null)
            setReservationExpiresAt(res?.expiresAt || null)
          }
        } catch (e) {
          if (!cancelled) setPrepareNote(e?.message || '')
        }
      })()
    return () => {
      cancelled = true
    }
  }, [loadingBag, items.length])

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.priceValue * i.quantity, 0), [items])
  const delivery = subtotal > 5000000 ? 0 : 30000
  const total = subtotal + delivery
  const reservationExpiresText = reservationExpiresAt ? new Date(reservationExpiresAt).toLocaleString() : ''

  function openStockModal(message) {
    setStockModalMessage(message)
  }

  function closeStockModal() {
    setStockModalMessage('')
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const errors = useMemo(
    () => ({
      customerName: fieldError(form, touched, 'customerName', 'Please enter your full name.'),
      customerPhone: fieldError(form, touched, 'customerPhone', 'Please enter your phone number.'),
      customerEmail:
        touched.customerEmail &&
          (!form.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim()))
          ? 'Invalid email address.'
          : null,
      shippingAddress: fieldError(form, touched, 'shippingAddress', 'Please enter your shipping address.'),
    }),
    [form, touched],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      shippingAddress: true,
      paymentMethod: true,
    })

    const nameOk = form.customerName.trim()
    const phoneOk = PHONE_REGEX.test(form.customerPhone.trim())
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())
    const addrOk = form.shippingAddress.trim()

    if (!nameOk || !phoneOk || !emailOk || !addrOk) {
      setSubmitError('Please check your information again.')
      return
    }

    if (items.length === 0) {
      setSubmitError('Your cart is empty.')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      // verify reservation before creating order
      if (reservationSessionId) {
        const ok = await verifyReservation(reservationSessionId)
        if (!ok) {
          const message = 'Insufficient stock in the warehouse or the reservation has expired.'
          setSubmitError(message)
          openStockModal(message)
          setSubmitting(false)
          return
        }
      }
      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim(),
        shippingAddress: form.shippingAddress.trim(),
        paymentMethod: form.paymentMethod,
      }
      const order = await createOrder(payload)
      setSuccessOrder(order)
      syncBagCountFromCart({ items: [] })
    } catch (err) {
      const msg = err?.message || 'Order failed.'
      setSubmitError(msg)
      if (msg.toLowerCase().includes('out of stock') || msg.toLowerCase().includes('out_of_stock')) {
        openStockModal('Insufficient stock in the warehouse.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (successOrder) {
    // If bank transfer, show transfer instructions
    if ((successOrder.paymentMethod || '').toUpperCase() === 'BANK_TRANSFER' && (successOrder.paymentStatus || '').toUpperCase() === 'PENDING') {
      const bankDetails = {
        bankName: 'ACME Bank',
        accountName: 'ClotherShop Demo',
        accountNumber: '0123456789',
        notePrefix: 'ORDER',
        expireHours: 24,
      }
      return (
        <section className="checkout-page">
          <div className="checkout-success">
            <h2>Order created — Bank Transfer</h2>
            <p>
              Order ID: <strong>#{successOrder.orderId ?? '—'}</strong>
            </p>
            <p>Total payment: {Number(successOrder.totalAmount ?? 0).toLocaleString()}₫</p>
            <div className="bank-instructions" style={{ textAlign: 'left', marginTop: 16 }}>
              <p>Please transfer the total amount within <strong>{bankDetails.expireHours} hours</strong> to the following bank account:</p>
              <ul>
                <li><strong>Bank:</strong> {bankDetails.bankName}</li>
                <li><strong>Account name:</strong> {bankDetails.accountName}</li>
                <li><strong>Account number:</strong> {bankDetails.accountNumber}</li>
                <li><strong>Transfer note:</strong> {`${bankDetails.notePrefix}-${successOrder.orderId}`}</li>
              </ul>
              <p>After payment, please notify us or an admin will confirm the payment manually.</p>
            </div>
            <div className="checkout-success-actions">
              <Link to="/" className="button button-primary">
                Continue shopping
              </Link>
              <Link to="/bag" className="button button-outline">
                View cart
              </Link>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="checkout-page">
        <div className="checkout-success">
          <h2>Order placed successfully</h2>
          <p>
            Order ID: <strong>#{successOrder.orderId ?? '—'}</strong>
          </p>
          <p>Total payment: {Number(successOrder.totalAmount ?? 0).toLocaleString()}₫</p>
          <p>Payment method: {successOrder.paymentMethod}. You may receive a confirmation email if SMTP is enabled.</p>
          <div className="checkout-success-actions">
            <Link to="/" className="button button-primary">
              Continue shopping
            </Link>
            <Link to="/bag" className="button button-outline">
              View cart
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      {stockModalMessage ? (
        <div className="modal-overlay" onClick={closeStockModal} role="presentation">
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeStockModal} aria-label="Close notification">
              &times;
            </button>
            <div className="checkout-modal-body">
              <h2>Notice</h2>
              <p>{stockModalMessage}</p>
              <button type="button" className="checkout-modal-button" onClick={closeStockModal}>
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="checkout-banner">
        <p>
          <strong>CHECKOUT</strong> — Enter your shipping information. Free shipping on orders over 5,000,000₫.
        </p>
      </div>

      <button style={{ marginBottom: '50px' }} type="button" className="button button-outline checkout-back" onClick={() => navigate('/bag')}>
        Back to bag
      </button>

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-head">
            <h1 style={{ marginBottom: '50px' }}>Shipping & Payment</h1>
            <p className="checkout-sub">Your information will only be used for delivery and contact purposes.</p>
          </div>

          {reservationExpiresText ? (
            <p className="checkout-sub" style={{ marginTop: -12 }}>
              Reservation expires at <strong>{reservationExpiresText}</strong>.
            </p>
          ) : null}

          {loadingBag ? (
            <p className="checkout-sub">Loading cart…</p>
          ) : items.length === 0 ? (
            <div className="checkout-form-card">
              <p className="checkout-sub" style={{ marginBottom: 16 }}>
                Your shopping cart is empty. Add more products before checkout.
              </p>
              <Link to="/" className="button button-primary">
                Go to store
              </Link>
            </div>
          ) : (
            <form className="checkout-form-card" onSubmit={handleSubmit} noValidate>
              {prepareNote ? (
                <p className="checkout-field-error" style={{ marginBottom: 16 }}>
                  {prepareNote}
                </p>
              ) : null}

              <div className="checkout-field">
                <label htmlFor="customerName">Full name</label>
                <input
                  id="customerName"
                  name="customerName"
                  autoComplete="name"
                  value={form.customerName}
                  onChange={(e) => setField('customerName', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, customerName: true }))}
                />
                {errors.customerName ? <p className="checkout-field-error">{errors.customerName}</p> : null}
              </div>

              <div className="checkout-field">
                <label htmlFor="customerPhone">Phone Number</label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0912345678 or +84912345678"
                  value={form.customerPhone}
                  onChange={(e) => setField('customerPhone', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, customerPhone: true }))}
                />
                <p className="checkout-field-hint">Format: 0xxxxxxxxx or +84xxxxxxxxx (matches backend rules).</p>
                {errors.customerPhone ? <p className="checkout-field-error">{errors.customerPhone}</p> : null}
              </div>

              <div className="checkout-field">
                <label htmlFor="customerEmail">Email</label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  value={form.customerEmail}
                  onChange={(e) => setField('customerEmail', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, customerEmail: true }))}
                />
                {errors.customerEmail ? <p className="checkout-field-error">{errors.customerEmail}</p> : null}
              </div>

              <div className="checkout-field">
                <label htmlFor="shippingAddress">Shipping address</label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  autoComplete="street-address"
                  rows={4}
                  value={form.shippingAddress}
                  onChange={(e) => setField('shippingAddress', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, shippingAddress: true }))}
                />
                {errors.shippingAddress ? <p className="checkout-field-error">{errors.shippingAddress}</p> : null}
              </div>

              <div className="checkout-field">
                <label>Payment Method</label>
                <div className="checkout-pay-options">
                  <label className={`checkout-pay-option ${form.paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={() => setField('paymentMethod', 'COD')}
                    />
                    <span>
                      COD — Pay when you receive the order
                      <small>Cash on delivery.</small>
                    </span>
                  </label>
                  <label className={`checkout-pay-option ${form.paymentMethod === 'BANK_TRANSFER' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={form.paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setField('paymentMethod', 'BANK_TRANSFER')}
                    />
                    <span>
                      Bank Transfer
                      <small>You will receive transfer instructions by email if notifications are enabled.</small>
                    </span>
                  </label>
                </div>
              </div>

              {submitError ? (
                <p className="checkout-field-error" style={{ marginTop: 8 }}>
                  {submitError}
                </p>
              ) : null}

              <div className="checkout-actions">
                <button type="submit" className="checkout-submit" disabled={submitting}>
                  {submitting ? 'Đang xử lý…' : 'Đặt hàng'}
                </button>
              </div>
            </form>
          )}
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
            <p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>
              {items.length} line{items.length !== 1 ? 's' : ''} in your bag
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
