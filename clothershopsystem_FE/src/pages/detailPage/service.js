const API_BASE = 'http://localhost:8080/ecommerce/api'

export async function fetchProductDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`)
    const data = await response.json()
    if (data.result) {
      return data.result
    }
    return null
  } catch (error) {
    console.error('Fetch product detail failed:', error)
    return null
  }
}
export async function fetchProductImg(id) {
  try {
    const response = await fetch(`${API_BASE}/img/${id}`)
    const data = await response.json()
    if (data.result) {
      return data.result
    }
    return null
  } catch (error) {
    console.error('Fetch product image failed:', error)
    return null
  }
}