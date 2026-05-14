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

export async function fetchShopProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`)
    const data = await response.json()
    if (data.result) {
      return data.result.map((prod) => ({
        id: prod.productId,
        name: prod.name,
        sub: prod.categoryName || 'No category',
        categoryName: prod.categoryName || 'No category',
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