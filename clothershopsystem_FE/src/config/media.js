/** Ảnh mặc định (SVG inline, không phụ thuộc domain bên ngoài) */
export const BAG_PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#eee" width="200" height="200"/><text x="100" y="104" text-anchor="middle" fill="#999" font-size="13" font-family="system-ui,sans-serif">No image</text></svg>',
  )


function ensureEcommerceContextPath(path) {
  if (path == null || typeof path !== 'string') return path
  const p = path.trim()
  if (!p) return p
  const normalized = p.startsWith('/') ? p : `/${p.replace(/^\/+/, '')}`
  if (normalized.startsWith('/ecommerce/') || normalized === '/ecommerce') {
    return normalized
  }
  if (normalized.startsWith('/api/')) {
    return `/ecommerce${normalized}`
  }
  return normalized
}

export function resolveProductImageUrl(url) {
  if (url == null) return null
  let u = String(url).trim()
  if (!u) return null
  u = u.replace(/^['"\s]+|['"\s]+$/g, '')

  if (/^https?:\/\//i.test(u)) {
    try {
      const parsed = new URL(u)
      const host = parsed.hostname.toLowerCase()
      const isLocalBackend =
        (host === 'localhost' || host === '127.0.0.1') &&
        (parsed.port === '8080' || parsed.port === '' || parsed.port === '80')
      if (isLocalBackend) {
        let path = `${parsed.pathname}${parsed.search}${parsed.hash}`
        if (!path.startsWith('/')) path = `/${path}`
        return ensureEcommerceContextPath(path)
      }
    } catch {
      return u
    }
    return u
  }

  if (u.startsWith('//')) {
    return `https:${u}`
  }

  const path = u.startsWith('/') ? u : `/${u.replace(/^\/+/, '')}`
  return ensureEcommerceContextPath(path)
}
