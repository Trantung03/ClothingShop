
// src/config/api.js
const envUrl = import.meta.env.VITE_API_URL
function defaultApiBase() {
	if (envUrl) return envUrl
	if (typeof window === 'undefined') return 'https://ecommerce-service-production-d273.up.railway.app/ecommerce/api'
	const host = window.location.hostname
	// During local development (localhost) we expect Vite dev server proxy to map /ecommerce
	if (host === 'localhost' || host === '127.0.0.1') return '/ecommerce/api'
	// In production the nginx config proxies `/api/*` -> backend `/ecommerce/api/*`
	return '/api'
}

export const API_BASE = defaultApiBase()