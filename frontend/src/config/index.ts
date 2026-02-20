const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const config = {
  apiUrl: API_URL,
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Workload360',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
}
