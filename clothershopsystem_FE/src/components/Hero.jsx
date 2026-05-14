import { useEffect, useState } from 'react'
import heroImage from '../assets/hero.png'
import heroImage2 from '../assets/hero2.png'
import heroImage3 from '../assets/hero3.png'

const slideImages = [heroImage, heroImage2, heroImage3]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideImages.length)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slideImages.map((src, index) => (
          <div
            key={index}
            className={`hero-slide ${activeIndex === index ? 'active' : ''}`}>
            <img src={src} alt={`Hero slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="hero-copy">
        <span className="eyebrow">MAD 90 PACK</span>
        <h1>Rediscover Nike Football’s most iconic eras</h1>
        <p>Rediscover Nike Football’s most iconic eras through the Air Max 90.</p>
        <div className="hero-actions">
          <button className="button button-primary">Shop the Collection</button>
        </div>
        <div className="hero-dots">
          {slideImages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={activeIndex === index ? 'dot active' : 'dot'}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
