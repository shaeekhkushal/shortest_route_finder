import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Loading, Input } from '../components/common'
import { Map } from '../components/Map'
import { apiClient } from '../services/api'
import { useRouteStore } from '../stores/routeStore'

export function RouteFinderPage() {
  const navigate = useNavigate()
  const [country, setCountry] = useState('Bangladesh')
  const [city, setCity] = useState('Dhaka')
  const [selectedSource, setSelectedSource] = useState('')
  const [selectedTarget, setSelectedTarget] = useState('')

  const { routeData, isLoading, error, setRouteData, setLoading, setError, reset } = useRouteStore()

  const handleFindRoute = async () => {
    if (!country || !city || !selectedSource || !selectedTarget) {
      setError('Please fill in Country, City, From, and To locations')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.findRoute(country, city, selectedSource, selectedTarget)

      if (data.success) {
        setRouteData(data)
      } else {
        setError(data.error || 'Failed to find route')
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="w-full border-r border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 lg:w-1/2 lg:overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Shortest Route</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country
            </label>
            <Input
              value={country}
              onChange={setCountry}
              placeholder="e.g. Bangladesh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <Input
              value={city}
              onChange={setCity}
              placeholder="e.g. Dhaka"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From Location
            </label>
            <Input
              value={selectedSource}
              onChange={setSelectedSource}
              placeholder="e.g. Gulshan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Location
            </label>
            <Input
              value={selectedTarget}
              onChange={setSelectedTarget}
              placeholder="e.g. Banani"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleFindRoute} disabled={isLoading} className="flex-1">
              {isLoading ? 'Finding route...' : 'Find Route'}
            </Button>
            {routeData && (
              <Button onClick={handleReset} variant="secondary" className="flex-1">
                Reset
              </Button>
            )}
          </div>

          {routeData && routeData.success && (
            <Card className="mt-6 bg-blue-50 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Route Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distance</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {routeData.distance_km.toFixed(2)} km
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nodes in Route</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {routeData.node_count}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">From</p>
                  <p className="text-sm text-gray-900 dark:text-gray-200">{selectedSource}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">To</p>
                  <p className="text-sm text-gray-900 dark:text-gray-200">{selectedTarget}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => navigate('/')} variant="secondary" className="w-full">
              Home
            </Button>
            <Button onClick={() => navigate('/explore')} variant="secondary" className="w-full">
              Explore Map
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden h-full w-1/2 lg:block">
        {isLoading && (
          <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Loading message="Finding your best route (this may take a while for new cities)..." />
          </div>
        )}
        {!isLoading && <Map routeData={routeData || undefined} height="h-full" />}
      </div>

      <div className="lg:hidden">
        {routeData && !isLoading && (
          <div className="h-96 w-full">
            <Map routeData={routeData} height="h-96" />
          </div>
        )}
      </div>
    </div>
  )
}
