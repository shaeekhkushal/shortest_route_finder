import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { RouteData } from '../services/api'

function MapBounds({ routeData }: { routeData?: RouteData }) {
  const map = useMap()

  useEffect(() => {
    if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
      const bounds = L.latLngBounds(routeData.coordinates as [number, number][])
      map.fitBounds(bounds, { padding: [50, 50] })
    } else if (routeData?.source_coords) {
      map.setView([routeData.source_coords[0], routeData.source_coords[1]], map.getZoom())
    }
  }, [routeData, map])

  return null
}

export function Map({
  center = [0, 0],
  zoom = 2,
  routeData,
  markers,
  height = 'h-screen',
}: {
  center?: [number, number]
  zoom?: number
  routeData?: RouteData
  markers?: { lat: number; lon: number; label: string }[]
  height?: string
}) {
  const [displayCenter, setDisplayCenter] = useState(center)

  useEffect(() => {
    if (routeData?.source_coords) {
      setDisplayCenter([routeData.source_coords[0], routeData.source_coords[1]])
    }
  }, [routeData])

  return (
    <MapContainer center={displayCenter} zoom={zoom} className={`${height} w-full`} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <MapBounds routeData={routeData} />

      {routeData && routeData.coordinates && routeData.coordinates.length > 0 && (
        <>
          <Polyline positions={routeData.coordinates} pathOptions={{ color: 'blue', weight: 4, opacity: 0.8 }} />
          <Marker position={[routeData.source_coords[0], routeData.source_coords[1]]}>
            <Popup>Start Point</Popup>
          </Marker>
          <Marker position={[routeData.target_coords[0], routeData.target_coords[1]]}>
            <Popup>End Point</Popup>
          </Marker>
        </>
      )}

      {markers &&
        markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lon]}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
