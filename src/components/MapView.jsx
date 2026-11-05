import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { getCategory } from '../data/categories.js'
import { MapClickHandler, MapController } from './MapControls.jsx'

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

function createPlaceIcon(categoryValue, selected) {
  const category = getCategory(categoryValue)
  const size = selected ? 38 : 32
  const html = `
    <span class="map-marker ${selected ? 'map-marker--selected' : ''}"
      style="--marker-color:${category.color}; width:${size}px; height:${size}px;">
      <span>${category.symbol}</span>
    </span>
  `

  return L.divIcon({
    className: 'map-marker-shell',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

export default function MapView({
  places,
  selectedId,
  onSelect,
  isAdding,
  onMapClick,
  draftPoint,
  focusRequest,
  userLocation,
}) {
  return (
    <MapContainer
      center={[-31.7706, -52.3415]}
      zoom={15}
      scrollWheelZoom
      zoomControl
      className={`map-canvas ${isAdding ? 'map-canvas--adding' : ''}`}
    >
      <TileLayer
        url={TILE_URL}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
      />

      <MapController focusRequest={focusRequest} />
      <MapClickHandler enabled={isAdding} onMapClick={onMapClick} />

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[Number(place.latitude), Number(place.longitude)]}
          icon={createPlaceIcon(place.category, place.id === selectedId)}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          <Popup className="place-popup">
            <div className="popup-content">
              <span className="popup-category">{getCategory(place.category).label}</span>
              <strong>{place.name}</strong>
              <p>{place.description || 'Sem descrição cadastrada.'}</p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=17/${place.latitude}/${place.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir no OpenStreetMap ↗
              </a>
            </div>
          </Popup>
        </Marker>
      ))}

      {draftPoint && (
        <Marker position={[draftPoint.latitude, draftPoint.longitude]}>
          <Popup>Local selecionado. Preencha os dados para salvar.</Popup>
        </Marker>
      )}

      {userLocation && (
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={9}
          pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2678d8', fillOpacity: 1 }}
        >
          <Popup>Você está aqui (conforme a localização informada pelo navegador).</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  )
}
