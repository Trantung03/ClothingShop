import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Products from '../../components/Products'
import { fetchShopCategories, fetchShopProducts } from './service'
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

/**
 * Hàm làm phẳng cây danh mục và lưu lại mối quan hệ cha-con
 */
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

export default function Shop() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('All') // Lưu ID của category đang chọn
    const [priceRange, setPriceRange] = useState('all')
    const [sortBy, setSortBy] = useState('priceAsc')
    const navigate = useNavigate()

    // 1. Tải dữ liệu ban đầu
    useEffect(() => {
        const load = async () => {
            try {
                const [catsData, prodsData] = await Promise.all([
                    fetchShopCategories(),
                    fetchShopProducts()
                ]);

                if (catsData) {
                    setCategories(flattenCategories(catsData));
                }
                setProducts(prodsData || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu shop:", error);
            }
        }
        load()
    }, [])

    // 2. Logic lọc và sắp xếp sản phẩm
    const filteredProducts = useMemo(() => {
        // Thu thập ID của category hiện tại và toàn bộ con/cháu của nó
        let allowedCategoryIds = [category];

        if (category !== 'All') {
            const findChildrenIds = (parentId) => {
                const children = categories.filter(c => c.parentId === parentId);
                children.forEach(child => {
                    allowedCategoryIds.push(child.id);
                    findChildrenIds(child.id); 
                });
            };
            findChildrenIds(category);
        }

        return products
            .filter((product) => {
                // Lọc theo Category (So khớp ID của sản phẩm với danh sách ID được phép)
                if (category !== 'All') {
                    // Tìm category object tương ứng với tên sản phẩm trả về
                    const productCat = categories.find(c => c.name === product.categoryName);
                    if (!productCat || !allowedCategoryIds.includes(productCat.id)) {
                        return false;
                    }
                }

                // Lọc theo Giá
                switch (priceRange) {
                    case 'under1m': return product.priceValue < 1000000;
                    case '1m-3m': return product.priceValue >= 1000000 && product.priceValue <= 3000000;
                    case '3m-5m': return product.priceValue > 3000000 && product.priceValue <= 5000000;
                    case 'above5m': return product.priceValue > 5000000;
                    default: return true;
                }
            })
            .sort((a, b) => {
                // Sắp xếp
                if (sortBy === 'priceAsc') return a.priceValue - b.priceValue;
                if (sortBy === 'priceDesc') return b.priceValue - a.priceValue;
                if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
                if (sortBy === 'nameDesc') return b.name.localeCompare(a.name);
                return 0;
            });
    }, [products, category, categories, priceRange, sortBy]);

    return (
        <section className="shop-page">
            <div className="shop-header">
                <div>
                    <p className="eyebrow">Browse products</p>
                    <h1>Find your next item</h1>
                    <p className="shop-summary">Filter by category, price, and sort order to find the best fit.</p>
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
            <option key={`${cat.id}-${index}`} value={cat.id}>
                {cat.label} 
            </option>
        ))}
    </select>
</div>

                {/* Bộ lọc Giá */}
                <div className="filter-group">
                    <label htmlFor="price-select">Price</label>
                    <select 
                        id="price-select" 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(e.target.value)}
                    >
                        {priceFilters.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Bộ lọc Sắp xếp */}
                <div className="filter-group">
                    <label htmlFor="sort-select">Sort by</label>
                    <select 
                        id="sort-select" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="shop-meta">
                <p>
                    Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                </p>
            </div>

            {/* Danh sách sản phẩm */}
            <Products 
                products={filteredProducts} 
                onViewDetail={(id) => navigate(`/detail/${id}`)} 
            />
        </section>
    )
}