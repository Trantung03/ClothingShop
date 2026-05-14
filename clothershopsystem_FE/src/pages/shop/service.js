const API_BASE = 'http://localhost:8080/ecommerce/api'

export async function fetchShopCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const data = await response.json()
    return data.result || [] 
  } catch (error) {
    console.error('Fetch categories failed:', error)
    return []
  }
}

/** Shop lọc theo cây category trên client — cần tải đủ SP (API mặc định size=20). */
const SHOP_PRODUCT_PAGE_SIZE = 2000

/**
 * @param {number|undefined} categoryId - undefined = tất cả; số = lọc theo category + nhánh (server).
 */
export async function fetchShopProducts(categoryId) {
  try {
    const params = new URLSearchParams({
      page: '0',
      size: String(SHOP_PRODUCT_PAGE_SIZE),
    })
    if (categoryId != null && !Number.isNaN(categoryId)) {
      params.set('categoryId', String(categoryId))
    }
    const response = await fetch(`${API_BASE}/products?${params.toString()}`)
    const data = await response.json()
    if (data.result) {
      return data.result.map((prod) => ({
        id: prod.productId,
        name: prod.name,
        sub: prod.categoryName || 'No category',
        categoryName: prod.categoryName || 'No category',
        categoryId: prod.categoryId,
        categoryIds:
          prod.categories?.length > 0
            ? prod.categories.map((c) => c.categoryId)
            : prod.categoryId != null
              ? [prod.categoryId]
              : [],
        priceValue: prod.price || 0,
        price: prod.price != null ? `${prod.price.toLocaleString()}₫` : 'N/A',
        badge: 'New',
        imageUrl: prod.imageUrl,
      }))
    }
    return []
  } catch (error) {
    console.error('Fetch products failed:', error)
    return []
  }
}