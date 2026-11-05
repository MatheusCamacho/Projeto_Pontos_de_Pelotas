import { useEffect } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'

export function MapController({ focusRequest }) {
  const map = useMap()

  useEffect(() => {
    if (!focusRequest) return

    map.setView(
      [focusRequest.latitude, focusRequest.longitude],
      focusRequest.zoom ?? 16,
      { animate: true },
    )
  }, [map, focusRequest])

  return null
}

export function MapClickHandler({ enabled, onMapClick }) {
  useMapEvents({
    click(event) {
      if (enabled) {
        onMapClick({
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        })
      }
    },
  })

  return null
}
