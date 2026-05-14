/**
 * Dev: dùng đường dẫn tương đối + proxy Vite → cookie session giỏ hàng cùng origin với app.
 * Prod: có thể set VITE_API_BASE=https://api.example.com/ecommerce/api
 */
export const API_BASE = (import.meta.env.VITE_API_BASE || '/ecommerce/api').replace(/\/$/, '')
