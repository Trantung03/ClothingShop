import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllCategories } from './service'
import logoImg from '../assets/logo.png'
import './Header.css'

const getBagCount = () => Number(localStorage.getItem('bagCount') || 0)

export default function Header() {
  const [bagCount, setBagCount] = useState(getBagCount())
  const [categories, setCategories] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories()
        if (data && Array.isArray(data)) {
          setCategories(data)
          console.log("Categories loaded:", data)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error)
      }
    }
    loadCategories()

    const updateCount = (event) => {
      setBagCount(event?.detail ?? getBagCount())
    }
    window.addEventListener('bag-count-change', updateCount)
    return () => window.removeEventListener('bag-count-change', updateCount)
  }, [])

  return (
    <header className="site-header" onMouseLeave={() => setActiveMenu(null)}>
      <div className="brand">
        <Link to="/">
          <img src={logoImg} alt="Nike Logo" className="logo-image" height={60} width={60} />
        </Link>
      </div>
      <nav className="site-nav" aria-label="Primary navigation">
        {categories.map((cat) => (
          <div
            key={cat.categoryId}
            className="nav-item-container"
            onMouseEnter={() => setActiveMenu(cat)}
          >
            <Link to={`/shop/${cat.categoryId}`} className="nav-link">
              {cat.name}
            </Link>
          </div>
        ))}
      </nav>

      <div className="header-actions">
        <button className="button button-ghost">Join</button>
        <Link to="/bag" className="bag-action" aria-label="View bag">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20">
            <path d="M0 72C0 58.7 10.7 48 24 48L69.3 48C96.4 48 119.6 67.4 124.4 94L124.8 96L312 96L312 198.1L281 167.1C271.6 157.7 256.4 157.7 247.1 167.1C237.8 176.5 237.7 191.7 247.1 201L319.1 273C328.5 282.4 343.7 282.4 353 273L425 201C434.4 191.6 434.4 176.4 425 167.1C415.6 157.8 400.4 157.7 391.1 167.1L360.1 198.1L360.1 96L537.5 96C557.5 96 572.6 114.2 568.9 133.9L537.8 299.8C532.1 330.1 505.7 352 474.9 352L171.3 352L176.4 380.3C178.5 391.7 188.4 400 200 400L456 400C469.3 400 480 410.7 480 424C480 437.3 469.3 448 456 448L200.1 448C165.3 448 135.5 423.1 129.3 388.9L77.2 102.6C76.5 98.8 73.2 96 69.3 96L24 96C10.7 96 0 85.3 0 72zM160 528C160 501.5 181.5 480 208 480C234.5 480 256 501.5 256 528C256 554.5 234.5 576 208 576C181.5 576 160 554.5 160 528zM384 528C384 501.5 405.5 480 432 480C458.5 480 480 501.5 480 528C480 554.5 458.5 576 432 576C405.5 576 384 554.5 384 528z" />
          </svg>
          {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
        </Link>
      </div>

      <div className={`mega-menu ${activeMenu?.children?.length > 0 ? 'is-active' : ''}`}>
        <div className="mega-menu-content">
          {activeMenu?.children?.map((level2) => (
            <div key={level2.categoryId} className="menu-column">
              <h4>{level2.name}</h4>
              <ul>
                {level2.children?.map((level3) => (
                  <li key={level3.categoryId}>
                    <Link to={`/shop/${level3.categoryId}`}>
                      {level3.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {activeMenu?.children?.length > 0 && <div className="menu-overlay" />}
    </header>
  )
}