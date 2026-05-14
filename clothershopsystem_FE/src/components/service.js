import { API_BASE } from '../config/api.js'

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