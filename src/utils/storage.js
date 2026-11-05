import { INITIAL_PLACES } from '../data/initialPlaces.js'

const STORAGE_KEY = 'pontos-de-pelotas-v1'

export function loadPlaces() {
  try {
    const savedPlaces = localStorage.getItem(STORAGE_KEY)

    if (!savedPlaces) return INITIAL_PLACES

    const parsedPlaces = JSON.parse(savedPlaces)
    if (!Array.isArray(parsedPlaces)) return INITIAL_PLACES

    return parsedPlaces.filter(isValidPlace)
  } catch {
    return INITIAL_PLACES
  }
}

export function savePlaces(places) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
    return true
  } catch {
    return false
  }
}

function isValidPlace(place) {
  return (
    place &&
    typeof place.id === 'string' &&
    typeof place.name === 'string' &&
    typeof place.category === 'string' &&
    Number.isFinite(Number(place.latitude)) &&
    Number.isFinite(Number(place.longitude))
  )
}
