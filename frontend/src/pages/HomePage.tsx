import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Loading } from '../components/common'
import { apiClient } from '../services/api'

export function HomePage() {
  const navigate = useNavigate()
  const [apiStatus, setApiStatus] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAPI = async () => {
      try {
        await apiClient.healthCheck()
        setApiStatus(true)
      } catch (error) {
        setApiStatus(false)
      } finally {
        setLoading(false)
      }
    }

    checkAPI()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading message="Checking API connection..." />
      </div>
    )
  }

  if (!apiStatus) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <h2 className="mb-4 text-2xl font-bold text-red-600">API Error</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Cannot connect to the backend API. Make sure the backend server is running on
            http://localhost:8000
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">Route Finder</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover the shortest routes anywhere in the world using Dijkstra's Algorithm
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Explore Maps</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Browse the interactive map. Zoom, pan, and explore any location.
            </p>
            <Button onClick={() => navigate('/explore')} className="w-full">
              Open Map Explorer
            </Button>
          </Card>

          <Card>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Find Your Route
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Enter your starting point and destination to find the shortest route using
              Dijkstra's Algorithm.
            </p>
            <Button onClick={() => navigate('/route')} className="w-full">
              Find Shortest Route
            </Button>
          </Card>
        </div>

        <div className="mt-16 rounded-lg bg-blue-50 p-8 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">How it works</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>Select starting location and destination</li>
            <li>Our algorithm computes the optimal shortest path</li>
            <li>View the route on an interactive map</li>
            <li>See distance and node information</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
