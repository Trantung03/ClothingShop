import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import { fetchProductDetail, fetchProductImg } from './service'
import { addToCart, syncBagCountFromCart } from '../bag/service'
import sizeGuideImg from '../../assets/ShoesSize.png'
import './detailPage.css'

function norm(s) {
  return (s ?? '').toString().trim()
}

function colorKey(c) {
  return norm(c).toLowerCase()
}

/** Màu tên phổ biến → mã màu; còn lại dùng HSL theo chuỗi */
function swatchBackground(colorName) {
  const key = colorKey(colorName)
  const named = {
    red: '#c41e3a',
    crimson: '#dc143c',
    maroon: '#800000',
    'neon green': '#39ff14',
    lime: '#32cd32',
    green: '#228b22',
    white: '#f5f5f5',
    black: '#1a1a1a',
    blue: '#2563eb',
    navy: '#1e3a5f',
    yellow: '#facc15',
    orange: '#ea580c',
    pink: '#ec4899',
    purple: '#9333ea',
    grey: '#9ca3af',
    gray: '#9ca3af',
  }
  if (named[key]) return named[key]
  let h = 0
  for (let i = 0; i < key.length; i++) h = key.charCodeAt(i) + ((h << 5) - h)
  const hue = Math.abs(h) % 360
  return `hsl(${hue}, 50%, 45%)`
}

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [productImg, setProductImg] = useState([])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [activeThumb, setActiveThumb] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => {
    if (!id) return

    const loadProductData = async () => {
      try {
        const [detailData, imagesData] = await Promise.all([
          fetchProductDetail(id),
          fetchProductImg(id),
        ])

        setProduct(detailData)
        setProductImg(imagesData || [])
        setSelectedColor('')
        setSelectedSize('')
        setActiveThumb(0)
      } catch (error) {
        console.error('Lỗi khi load dữ liệu sản phẩm:', error)
      }
    }

    loadProductData()
  }, [id])

  const thumbnails = [product?.imageUrl, ...(productImg?.map((img) => img.imageUrl) || [])].filter(Boolean)

  const finalGallery = thumbnails.length > 0 ? thumbnails : [heroImage]

  const colorOptions = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const s of product?.skus || []) {
      const c = norm(s.color)
      if (!c) continue
      const k = colorKey(c)
      if (seen.has(k)) continue
      seen.add(k)
      out.push(c)
    }
    return out
  }, [product])

  const hasColorDimension = colorOptions.length > 0

  const skusForSizePick = useMemo(() => {
    const skus = product?.skus || []
    if (!hasColorDimension) return skus
    if (!norm(selectedColor)) return []
    return skus.filter((s) => colorKey(s.color) === colorKey(selectedColor))
  }, [product, hasColorDimension, selectedColor])

  const sizeOptions = useMemo(() => {
    const sizes = [...new Set(skusForSizePick.map((s) => norm(s.size)).filter(Boolean))]
    return sizes
  }, [skusForSizePick])

  const selectedSku = useMemo(() => {
    const skus = product?.skus || []
    if (!skus.length) return null
    const sizeOk = norm(selectedSize)
    if (!sizeOk) return null
    if (hasColorDimension) {
      if (!norm(selectedColor)) return null
      return (
        skus.find(
          (s) => colorKey(s.color) === colorKey(selectedColor) && norm(s.size) === sizeOk,
        ) || null
      )
    }
    return skus.find((s) => norm(s.size) === sizeOk) || null
  }, [product, hasColorDimension, selectedColor, selectedSize])

  const selectColor = useCallback(
    (color) => {
      setSelectedColor(color)
      setSelectedSize((prev) => {
        const nextSkus = (product?.skus || []).filter((s) => colorKey(s.color) === colorKey(color))
        const ok = nextSkus.some((s) => norm(s.size) === norm(prev))
        return ok ? prev : ''
      })
    },
    [product],
  )

  const displayPrice = selectedSku?.price ?? product?.basePrice

  async function handleAddToBag() {
    setAddError('')
    if (hasColorDimension && !norm(selectedColor)) {
      setAddError('Select a color before adding to cart.')
      return
    }
    if (!norm(selectedSize)) {
      setAddError('Select a size before adding to cart.')
      return
    }
    if (!selectedSku?.skuId) {
      setAddError('The selected color and size do not match an available variant.')
      return
    }
    setAdding(true)
    try {
      const cart = await addToCart(selectedSku.skuId, 1)
      syncBagCountFromCart(cart)
    } catch (e) {
      setAddError(e?.message || 'Unable to add to cart.')
    } finally {
      setAdding(false)
    }
  }

  const canAdd = Boolean(selectedSku?.skuId) && !adding

  return (
    <section className="detail-page">
      {showSizeGuide && (
        <div className="modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowSizeGuide(false)}>
              &times;
            </button>
            <div className="size-guide-container">
              <img src={sizeGuideImg} alt="Nike Size Guide" />
            </div>
          </div>
        </div>
      )}

      <button type="button" className="button button-outline detail-back" onClick={() => navigate('/')}>
        Back to catalog
      </button>

      {!product ? (
        <div className="detail-loading">Loading product...</div>
      ) : (
        <div className="detail-grid">
          <div className="detail-gallery">
            <div className="detail-thumbs">
              {finalGallery.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumb-button ${activeThumb === index ? 'active' : ''}`}
                  onClick={() => setActiveThumb(index)}
                >
                  <img src={src} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="detail-main-image">
              <img src={finalGallery[activeThumb]} alt={product?.name} />
            </div>
          </div>

          <div className="detail-info">
            <span className="detail-label">{product?.categoryName || 'Collection'}</span>
            <h1>{product?.name}</h1>
            <p className="detail-subtitle">{product?.description || 'No description available.'}</p>

            <strong className="detail-price">
              {displayPrice != null ? `${Number(displayPrice).toLocaleString()} VND` : 'Contact for price'}
            </strong>

            {hasColorDimension ? (
              <>
                <div className="detail-size-row detail-swatch-heading">
                  <p className="label-text">Select Color</p>
                </div>
                <div className="detail-swatches" role="group" aria-label="Product colors">
                  {colorOptions.map((color) => {
                    const isSelected = colorKey(selectedColor) === colorKey(color)
                    return (
                      <button
                        key={colorKey(color)}
                        type="button"
                        className={`size-button ${isSelected ? 'selected' : ''}`}
                        title={color}
                        aria-label={`Color ${color}`}
                        aria-pressed={isSelected}
                        onClick={() => selectColor(color)}
                      >
                        {color}
                      </button>
                    )
                  })}
                  <button type="button" className="size-button" disabled aria-disabled="true" title="Customize">
                    Customize
                  </button>
                </div>
                <p className="detail-selected-variant">
                  {norm(selectedColor) ? `Selected color: ${selectedColor}` : 'Select a color to see matching sizes.'}
                </p>
              </>
            ) : null}

            <div className="detail-size-row">
              <p className="label-text">Select Size</p>
              <p className="label-text size-guide-link">
                <button type="button" className="size-guide-link-btn" onClick={() => setShowSizeGuide(true)}>
                  Size Guide
                </button>
              </p>
            </div>

            <div className="detail-size-grid">
              {hasColorDimension && !norm(selectedColor) ? (
                <p className="label-text" style={{ gridColumn: '1 / -1', fontWeight: 400 }}>
                  Select a color first to choose a size.
                </p>
              ) : sizeOptions.length > 0 ? (
                sizeOptions.map((size) => {
                  const skuRow = skusForSizePick.find((s) => norm(s.size) === norm(size))
                  const outOfStock = (skuRow?.stockAvailable ?? 0) <= 0
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`size-button ${norm(selectedSize) === norm(size) ? 'selected' : ''}`}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  )
                })
              ) : (
                <p>No sizes available</p>
              )}
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className="button button-primary detail-add"
                disabled={!canAdd}
                onClick={handleAddToBag}
              >
                {adding ? 'Adding…' : 'Add to Bag'}
              </button>
              <button type="button" className="button button-outline detail-fav">
                Favorite ♡
              </button>
            </div>
            {addError ? (
              <p className="detail-note" style={{ color: '#c00' }}>
                {addError}
              </p>
            ) : null}

            <p className="detail-note">Free delivery and returns for members. Exclusions apply.</p>
          </div>
        </div>
      )}
    </section>
  )
}
