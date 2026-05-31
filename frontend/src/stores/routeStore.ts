import { create } from 'zustand'
import type { RouteData } from '../services/api'

interface RouteStore {
  routeData: RouteData | null
  isLoading: boolean
  error: string | null
  setRouteData: (data: RouteData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useRouteStore = create<RouteStore>((set) => ({
  routeData: null,
  isLoading: false,
  error: null,
  setRouteData: (data) => set({ routeData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ routeData: null, isLoading: false, error: null }),
}))
