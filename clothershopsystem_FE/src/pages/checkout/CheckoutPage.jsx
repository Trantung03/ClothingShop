import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchBagItems, syncBagCountFromCart } from '../bag/service'
import { createOrder, prepareCheckout } from './service'
import './CheckoutPage.css'

const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/

function fieldError(form, touched, key, message) {
  if (!touched[key]) return null
  const v = form[key]
  if (key === 'customerPhone' && v && !PHONE_REGEX.test(v.trim())) {
    return 'Số điện thoại: dùng 0xxxxxxxxx hoặc +84xxxxxxxxx (9–10 số sau mã vùng).'
  }
  if (!v || !String(v).trim()) return message
  return null
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loadingBag, setLoadingBag] = useState(true)
  const [prepareNote, setPrepareNote] = useState('')
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

  const loadBag = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    loadBag()
  }, [loadBag])

  useEffect(() => {
    if (loadingBag || items.length === 0) return
    let cancelled = false
      ; (async () => {
        try {
          await prepareCheckout()
          if (!cancelled) setPrepareNote('')
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

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const errors = useMemo(
    () => ({
      customerName: fieldError(form, touched, 'customerName', 'Vui lòng nhập họ và tên.'),
      customerPhone: fieldError(form, touched, 'customerPhone', 'Vui lòng nhập số điện thoại.'),
      customerEmail:
        touched.customerEmail &&
          (!form.customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim()))
          ? 'Email không hợp lệ.'
          : null,
      shippingAddress: fieldError(form, touched, 'shippingAddress', 'Vui lòng nhập địa chỉ giao hàng.'),
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
      setSubmitError('Vui lòng kiểm tra lại thông tin.')
      return
    }

    if (items.length === 0) {
      setSubmitError('Giỏ hàng trống.')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
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
      setSubmitError(err?.message || 'Đặt hàng thất bại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (successOrder) {
    return (
      <section className="checkout-page">
        <div className="checkout-success">
          <h2>Đặt hàng thành công</h2>
          <p>
            Mã đơn: <strong>#{successOrder.orderId ?? '—'}</strong>
          </p>
          <p>Tổng thanh toán: {Number(successOrder.totalAmount ?? 0).toLocaleString()}₫</p>
          <p>Chúng tôi đã ghi nhận phương thức: {successOrder.paymentMethod}. Bạn có thể nhận email xác nhận (nếu cấu hình SMTP đang bật).</p>
          <div className="checkout-success-actions">
            <Link to="/" className="button button-primary">
              Tiếp tục mua sắm
            </Link>
            <Link to="/bag" className="button button-outline">
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="checkout-banner">
        <p>
          <strong>CHECKOUT</strong> — Điền thông tin giao hàng. Miễn phí vận chuyển từ 5.000.000₫.
        </p>
      </div>

      <button style={{ marginBottom: '50px' }} type="button" className="button button-outline checkout-back" onClick={() => navigate('/bag')}>
        Back to bag
      </button>

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-head">
            <h1 style={{ marginBottom: '50px' }}>Shipping & payment</h1>
            <p className="checkout-sub">Your information will only be used for delivery and contact purposes.</p>
          </div>

          {loadingBag ? (
            <p className="checkout-sub">Loading Cart…</p>
          ) : items.length === 0 ? (
            <div className="checkout-form-card">
              <p className="checkout-sub" style={{ marginBottom: 16 }}>
                Your shopping cart is empty. Add more products before checkout.              </p>
              <Link to="/" className="button button-primary">
                Về cửa hàng
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
                <label htmlFor="customerName">Fullname</label>
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
                  placeholder="0912345678 hoặc +84912345678"
                  value={form.customerPhone}
                  onChange={(e) => setField('customerPhone', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, customerPhone: true }))}
                />
                <p className="checkout-field-hint">Format: 0xxxxxxxxx or +84xxxxxxxxx (correct backend rules).</p>
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
                <label htmlFor="shippingAddress">Delivery address</label>
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
                      <small>Delivery, cash on delivery.</small>
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
                      <small>You will receive transfer instructions via email (if email notifications are enabled).</small>
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
