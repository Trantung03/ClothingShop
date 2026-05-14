const API_BASE = 'http://localhost:8080/ecommerce/api'

export async function fetchAllCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    const data = await response.json()
    if (data.result) {
      return data.result
    }
    return null
  } catch (error) {
    console.error('Fetch category list failed:', error)
    return null
  }
}