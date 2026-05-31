import axios, { AxiosInstance } from 'axios'

const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 0, // No timeout for long graph downloads
})

export interface RouteData {
  success: boolean
  distance_km: number
  node_count: number
  coordinates: [number, number][]
  source_coords: [number, number]
  target_coords: [number, number]
  error?: string
}

export const apiClient = {
  async findRoute(country: string, city: string, source: string, target: string): Promise<RouteData> {
    const response = await api.post('/route', {
      country,
      city,
      source,
      target,
      use_cache: true,
    })
    return response.data
  },

  async healthCheck() {
    const response = await api.get('/health')
    return response.data
  },
}

export default api
