import { API_BASE } from '../../config/api.js'

async function parseResponseJson(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { message: text.slice(0, 200) }
  }
}

function sessionFetch(path, options = {}) {
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

/** Giữ tồn kho tạm theo session (cùng luồng backend checkout). */
export async function prepareCheckout() {
  const response = await sessionFetch('/checkout', { method: 'POST' })
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Không chuẩn bị được thanh toán')
  }
  return data.result
}

export async function createOrder(payload) {
  const response = await sessionFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data = await parseResponseJson(response)
  if (!response.ok) {
    throw new Error(data.message || 'Đặt hàng thất bại')
  }
  return data.result
}
