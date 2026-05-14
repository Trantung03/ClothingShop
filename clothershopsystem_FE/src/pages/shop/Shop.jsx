import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Products from '../../components/Products'
import { fetchShopCategories, fetchShopProducts } from './service'
import { useParams } from 'react-router-dom';
import './Shop.css'
const priceFilters = [
    { value: 'all', label: 'All prices' },
    { value: 'under1m', label: 'Under 1,000,000₫' },
    { value: '1m-3m', label: '1,000,000₫ - 3,000,000₫' },
    { value: '3m-5m', label: '3,000,000₫ - 5,000,000₫' },
    { value: 'above5m', label: 'Above 5,000,000₫' },
]

const sortOptions = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'nameAsc', label: 'Name: A → Z' },
    { value: 'nameDesc', label: 'Name: Z → A' },
]

const flattenCategories = (items) => {
    let flat = [{ name: 'All', label: 'All Categories', id: 'All', parentId: null }];

    const extract = (list, prefix = '', parentId = null) => {
        list.forEach(item => {
            flat.push({
                name: item.name,
                label: prefix + item.name,
                id: item.categoryId,
                parentId: parentId
            });
            if (item.children && item.children.length > 0) {
                extract(item.children, prefix + '— ', item.categoryId);
            }
        });
    };

    if (items && Array.isArray(items)) {
        extract(items);
    }
    return flat;
};

const categoryOptionValue = (cat) => (cat.id === 'All' ? 'All' : String(cat.id));

export default function Shop() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(categoryId || 'All')
    const [priceRange, setPriceRange] = useState('all')
    const [sortBy, setSortBy] = useState('priceAsc')
    const navigate = useNavigate()

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const catsData = await fetchShopCategories()
                    if (!cancelled && catsData) {
                        setCategories(flattenCategories(catsData))
                    }
                } catch (error) {
                    console.error('Lỗi tải danh mục shop:', error)
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const categoryId =
                        category === 'All' ? undefined : Number.parseInt(category, 10)
                    const id =
                        category === 'All' || Number.isNaN(categoryId)
                            ? undefined
                            : categoryId
                    const prodsData = await fetchShopProducts(id)
                    if (!cancelled) {
                        setProducts(prodsData || [])
                    }
                } catch (error) {
                    console.error('Lỗi tải sản phẩm shop:', error)
                    if (!cancelled) setProducts([])
                }
            })()
        return () => {
            cancelled = true
        }
    }, [category])

    const filteredProducts = useMemo(() => {
        return products
            .filter((product) => {
                switch (priceRange) {
                    case 'under1m':
                        return product.priceValue < 1000000
                    case '1m-3m':
                        return product.priceValue >= 1000000 && product.priceValue <= 3000000
                    case '3m-5m':
                        return product.priceValue > 3000000 && product.priceValue <= 5000000
                    case 'above5m':
                        return product.priceValue > 5000000
                    default:
                        return true
                }
            })
            .sort((a, b) => {
                if (sortBy === 'priceAsc') return a.priceValue - b.priceValue
                if (sortBy === 'priceDesc') return b.priceValue - a.priceValue
                if (sortBy === 'nameAsc') return a.name.localeCompare(b.name)
                if (sortBy === 'nameDesc') return b.name.localeCompare(a.name)
                return 0
            })
    }, [products, priceRange, sortBy])

    return (
        <section className="shop-page">
            <div className="shop-header">
                <div>
                    <p className="eyebrow">Products</p>
                    <h1>Find your next item</h1>
                    <p className="shop-summary">Filter to find the best fit.</p>
                </div>
            </div>

            <div className="shop-controls">
                <div className="filter-group">
                    <label htmlFor="category-select">Category</label>
                    <select
                        id="category-select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        {categories.map((cat, index) => (
                            <option key={`${cat.id}-${index}`} value={categoryOptionValue(cat)}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="price-select">Price</label>
                    <select
                        id="price-select"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >
                        {priceFilters.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort-select">Sort by</label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="shop-meta">
                <p>
                    Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                </p>
            </div>

            <Products
                products={filteredProducts}
                onViewDetail={(id) => navigate(`/detail/${id}`)}
            />
        </section>
    )
}
