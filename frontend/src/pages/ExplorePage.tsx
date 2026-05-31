import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common'
import { Map } from '../components/Map'

export function ExplorePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Map</h1>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/')}>Home</Button>
            <Button onClick={() => navigate('/route')}>Find Route</Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <Map center={[0, 0]} zoom={2} height="h-full" />
      </div>
    </div>
  )
}
