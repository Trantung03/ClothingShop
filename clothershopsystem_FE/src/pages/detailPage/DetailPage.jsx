import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import heroImage from '../../assets/hero.png'
import { fetchProductDetail, fetchProductImg } from './service'
import sizeGuideImg from '../../assets/ShoesSize.png'
import './DetailPage.css'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  

  const [product, setProduct] = useState(null)
  const [productImg, setProductImg] = useState([]) 
  const [selectedSize, setSelectedSize] = useState('')
  const [activeThumb, setActiveThumb] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadProductData = async () => {
      try {
        setProduct(null)
        const [detailData, imagesData] = await Promise.all([
          fetchProductDetail(id),
          fetchProductImg(id)
        ])

        setProduct(detailData)
        setProductImg(imagesData || [])

        if (detailData?.skus?.length > 0) {
          setSelectedSize(detailData.skus[0].size)
        }
      } catch (error) {
        console.error("Lỗi khi load dữ liệu sản phẩm:", error)    
      }
    }

    loadProductData()
  }, [id])

  const thumbnails = [
    product?.imageUrl, 
    ...(productImg?.map(img => img.imageUrl) || []) 
  ].filter(Boolean) 

  const finalGallery = thumbnails.length > 0 ? thumbnails : [heroImage]

  const sizes = product?.skus?.map((sku) => sku.size).filter(Boolean) || []

  return (
    <section className="detail-page">
      {showSizeGuide && (
        <div className="modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSizeGuide(false)}>&times;</button>
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
              {product?.price ? `${product.price.toLocaleString()}₫` : 'Contact for price'}
            </strong>

            <div className="detail-swatches">
              {finalGallery.slice(0, 4).map((src, index) => (
                <button 
                  key={index} 
                  type="button" 
                  className={`swatch-button ${activeThumb === index ? 'selected' : ''}`}
                  onClick={() => setActiveThumb(index)}
                >
                  <img src={src} alt={`Color option ${index + 1}`} />
                </button>
              ))}
              <button type="button" className="swatch-button design-button">
                <span>Customize</span>
              </button>
            </div>

    
            <div className="detail-size-row">
              <p className="label-text">Select Size</p>
              <p 
                className="label-text size-guide-link"
                onClick={() => setShowSizeGuide(true)}
              >
                Size Guide
              </p>
            </div>

            <div className="detail-size-grid">
              {sizes.length > 0 ? (
                sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p>Out of stock</p>
              )}
            </div>

            <div className="detail-actions">
              <button className="button button-primary detail-add">Add to Bag</button>
              <button className="button button-outline detail-fav">Favourite ♡</button>
            </div>

            <p className="detail-note">
              Free delivery and returns for members. Exclusions apply.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}