const API_BASE = 'http://localhost:8080/ecommerce/api'

export async function fetchBagItems() {
  try {
    const response = await fetch(`${API_BASE}/products`)
    const data = await response.json()
    if (data.result && data.result.length > 0) {
      const items = data.result.slice(0, 2).map((prod, index) => ({
        id: prod.productId,
        name: prod.name,
        subtitle: prod.categoryName || 'No category',
        description: prod.description || '',
        size: index === 0 ? '40' : '40.5',
        quantity: 1,
        priceValue: prod.price || 0,
        price: prod.price != null ? `${prod.price.toLocaleString()}₫` : 'N/A',
        imageUrl: prod.imageUrl,
      }))
      return items
    }
    return []
  } catch (error) {
    console.error('Fetch bag items failed:', error)
    return []
  }
}
