import { API_BASE } from '../../config/api.js'
import { BAG_PLACEHOLDER_IMAGE, resolveProductImageUrl } from '../../config/media.js'

async function parseResponseJson(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: text.slice(0, 200) }
  }
}

const cartFetch = (path, options = {}) => {
  const { body, headers, ...rest } = options
  const init = {
    credentials: 'include',
    ...rest,
    headers: {
      ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
  }
  if (body != null) init.body = body
  return fetch(`${API_BASE}${path}`, init)
}

export function syncBagCountFromCart(cart) {
  const count = Array.isArray(cart?.items)
    ? cart.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : 0
  localStorage.setItem('bagCount', String(count))
  window.dispatchEvent(new CustomEvent('bag-count-change', { detail: count }))
}

async function fetchSkuDetail(skuId) {
  const response = await fetch(`${API_BASE}/sku/${skuId}`)
  const data = await parseResponseJson(response)
  return data.result || null
}

async function fetchFirstProductGalleryImage(productId) {
  if (productId == null) return null
  const response = await fetch(`${API_BASE}/img/${productId}`)
  const data = await parseResponseJson(response)
  if (!response.ok || !Array.isArray(data.result) || data.result.length === 0) {
    return null
  }
  return data.result[0]?.imageUrl ?? null
}

function hasText(s) {
  return String(s ?? '')
    .trim()
    .length > 0
}

/** GET /cart — tạo giỏ theo session cookie nếu chưa có */
export async function fetchCartRaw() {
  const response = await cartFetch('/cart')
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Unable to load cart')
  }
  return data.result
}

export async function addToCart(skuId, quantity = 1) {
  const response = await cartFetch('/cart/addItems', {
    method: 'POST',
    body: JSON.stringify({ skuId, quantity }),
  })
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add item to cart')
  }
  return data.result
}

export async function updateCartLineQuantity(skuId, quantity) {
  const response = await cartFetch('/cart/updateItems', {
    method: 'PUT',
    body: JSON.stringify({ skuId, quantity }),
  })
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update quantity')
  }
  return data.result
}

export async function removeCartLine(cartItemId) {
  const id = Number(cartItemId)
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('Invalid cart line ID')
  }
  const response = await cartFetch(`/cart/items/${id}`, {
    method: 'DELETE',
  })
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove item')
  }
  return data.result
}

export async function fetchBagItems() {
  const cart = await fetchCartRaw()
  const rawItems = Array.isArray(cart?.items) ? cart.items : []

  if (rawItems.length === 0) {
    syncBagCountFromCart(cart)
    return []
  }

  const items = await Promise.all(
    rawItems.map(async (item) => {
      const skuId = item.skuId ?? item.sku_id
      const cartItemId = item.cartItemId ?? item.cart_item_id
      const quantity = item.quantity ?? 0
      const sku = skuId != null ? await fetchSkuDetail(skuId) : null
      const priceValue = sku?.price ?? 0
      const name = sku?.productName || 'Product'
      let imageRaw = sku?.productImageUrl
      if (!hasText(imageRaw) && sku?.productId != null) {
        imageRaw = await fetchFirstProductGalleryImage(sku.productId)
      }
      const resolved = resolveProductImageUrl(imageRaw)
      const imageUrl = resolved || BAG_PLACEHOLDER_IMAGE
      const size = sku?.size || 'N/A'
      const color = sku?.color

      return {
        id: cartItemId,
        cartItemId,
        skuId,
        quantity,
        name,
        subtitle: color ? `${color}` : '',
        price: `${Number(priceValue).toLocaleString()}₫`,
        priceValue,
        imageUrl,
        size,
      }
    }),
  )

  syncBagCountFromCart(cart)
  return items
}
