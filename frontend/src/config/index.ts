const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate required environment variables
if (!SUPABASE_URL && import.meta.env.PROD) {
  throw new Error('VITE_SUPABASE_URL is required in production')
}

if (!SUPABASE_ANON_KEY && import.meta.env.PROD) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required in production')
}

export const config = {
  apiUrl: API_URL,
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Leave-Optix',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
