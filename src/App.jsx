import { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView.jsx'
import { CATEGORIES, getCategory } from './data/categories.js'
import { loadPlaces, savePlaces } from './utils/storage.js'

const DEFAULT_FOCUS = { latitude: -31.7706, longitude: -52.3415, zoom: 15 }

function formatCoordinate(value) {
  return Number(value).toFixed(5)
}

function App() {
  const [places, setPlaces] = useState(loadPlaces)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('todas')
  const [selectedId, setSelectedId] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [draftPoint, setDraftPoint] = useState(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('cultura')
  const [description, setDescription] = useState('')
  const [focusRequest, setFocusRequest] = useState(DEFAULT_FOCUS)
  const [userLocation, setUserLocation] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [storageAvailable, setStorageAvailable] = useState(true)

  useEffect(() => {
    const saved = savePlaces(places)
    setStorageAvailable(saved)
  }, [places])

  useEffect(() => {
    if (!feedback) return undefined
    const timeout = window.setTimeout(() => setFeedback(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  const visiblePlaces = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')

    return places.filter((place) => {
      const matchesCategory = activeCategory === 'todas' || place.category === activeCategory
      const searchableText = `${place.name} ${place.description ?? ''}`.toLocaleLowerCase('pt-BR')
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })
  }, [places, search, activeCategory])

  const customCount = places.filter((place) => place.isCustom).length

  function selectPlace(place) {
    setSelectedId(place.id)
    setFocusRequest({
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      zoom: 17,
    })
  }

  function startAdding() {
    setIsAdding(true)
    setDraftPoint(null)
    setName('')
    setDescription('')
    setFeedback('Clique em qualquer ponto do mapa para escolher a localização.')
  }

  function cancelAdding() {
    setIsAdding(false)
    setDraftPoint(null)
    setName('')
    setDescription('')
  }

  function handleMapClick(point) {
    setDraftPoint(point)
    setFeedback('Local escolhido. Agora preencha os dados do ponto.')
  }

  function handleSavePlace(event) {
    event.preventDefault()

    if (!draftPoint) {
      setFeedback('Primeiro, clique no mapa para escolher um local.')
      return
    }

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setFeedback('Informe um nome com pelo menos 2 caracteres.')
      return
    }

    const newPlace = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      category,
      description: description.trim(),
      latitude: Number(draftPoint.latitude.toFixed(6)),
      longitude: Number(draftPoint.longitude.toFixed(6)),
      isCustom: true,
    }

    setPlaces((currentPlaces) => [...currentPlaces, newPlace])
    setSelectedId(newPlace.id)
    setFocusRequest({ ...draftPoint, zoom: 17 })
    cancelAdding()
    setFeedback('Local adicionado ao mapa.')
  }

  function removePlace(place) {
    if (!place.isCustom) return
    setPlaces((currentPlaces) => currentPlaces.filter((item) => item.id !== place.id))
    if (selectedId === place.id) setSelectedId(null)
    setFeedback('Local removido.')
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setFeedback('Este navegador não oferece suporte à localização.')
      return
    }

    setFeedback('Solicitando sua localização ao navegador…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setUserLocation(point)
        setFocusRequest({ ...point, zoom: 16 })
        setFeedback('Sua localização foi encontrada.')
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? 'Permissão de localização não concedida.'
          : 'Não foi possível obter sua localização. Tente novamente.'
        setFeedback(message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  function resetMap() {
    setSelectedId(null)
    setActiveCategory('todas')
    setSearch('')
    setFocusRequest(DEFAULT_FOCUS)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Pontos de Pelotas - início">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-text">pontos<span>.</span></span>
        </a>
        <div className="topbar-location">
          <span className="status-dot" />
          <span>Pelotas, Rio Grande do Sul</span>
        </div>
        <div className="topbar-right">
          <span className="project-label">MAPA INTERATIVO</span>
        </div>
      </header>

      <section className="workspace" id="inicio">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <div className="eyebrow">EXPLORE A CIDADE</div>
            <h1>Encontre um<br /><em>ponto no mapa.</em></h1>
            <p>Consulte locais de referência e marque novos lugares em Pelotas.</p>
          </div>

          <button className="primary-button add-button" onClick={isAdding ? cancelAdding : startAdding}>
            <span className="plus-icon">{isAdding ? '×' : '+'}</span>
            {isAdding ? 'Cancelar cadastro' : 'Adicionar local'}
          </button>

          {isAdding && (
            <section className="add-panel" aria-live="polite">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">NOVO REGISTRO</span>
                  <h2>Marque um lugar</h2>
                </div>
                <span className="step-number">01</span>
              </div>
              {!draftPoint ? (
                <p className="instruction-card">Clique no ponto desejado do mapa. As coordenadas serão preenchidas automaticamente.</p>
              ) : (
                <>
                  <div className="coordinate-preview">
                    <span>COORDENADAS SELECIONADAS</span>
                    <strong>{formatCoordinate(draftPoint.latitude)}, {formatCoordinate(draftPoint.longitude)}</strong>
                  </div>
                  <form onSubmit={handleSavePlace} className="place-form">
                    <label htmlFor="place-name">Nome do local</label>
                    <input
                      id="place-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Ex.: Biblioteca pública"
                      maxLength={60}
                      required
                    />
                    <label htmlFor="place-category">Categoria</label>
                    <select id="place-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                      {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                    <label htmlFor="place-description">Descrição <span>(opcional)</span></label>
                    <textarea
                      id="place-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Adicione uma informação sobre o local"
                      rows="2"
                      maxLength={160}
                    />
                    <button className="primary-button form-submit" type="submit">Salvar no mapa <span>↗</span></button>
                  </form>
                </>
              )}
            </section>
          )}

          <div className="list-toolbar">
            <div className="section-title-row">
              <h2>Locais cadastrados</h2>
              <span className="count-badge">{places.length.toString().padStart(2, '0')}</span>
            </div>
            <div className="search-box">
              <span className="search-icon" aria-hidden="true" />
              <input
                aria-label="Buscar local"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Limpar busca">×</button>}
            </div>
            <div className="filter-list" aria-label="Filtrar por categoria">
              <button className={activeCategory === 'todas' ? 'filter-chip active' : 'filter-chip'} onClick={() => setActiveCategory('todas')}>Todos</button>
              {CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  className={activeCategory === item.value ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setActiveCategory(item.value)}
                >
                  <span className="filter-dot" style={{ backgroundColor: item.color }} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="places-list">
            {visiblePlaces.length === 0 ? (
              <div className="empty-state">
                <span className="empty-symbol">⌕</span>
                <strong>Nenhum local encontrado</strong>
                <p>Tente alterar a busca ou o filtro selecionado.</p>
                <button onClick={resetMap}>Limpar filtros</button>
              </div>
            ) : visiblePlaces.map((place, index) => {
              const itemCategory = getCategory(place.category)
              return (
                <article key={place.id} className={`place-card ${selectedId === place.id ? 'place-card--selected' : ''}`}>
                  <button className="place-card-main" onClick={() => selectPlace(place)}>
                    <span className="place-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="place-card-copy">
                      <strong>{place.name}</strong>
                      <span className="place-meta"><i style={{ backgroundColor: itemCategory.color }} />{itemCategory.label}</span>
                    </span>
                    <span className="place-arrow">↗</span>
                  </button>
                  {selectedId === place.id && (
                    <div className="place-details">
                      <p>{place.description || 'Sem descrição cadastrada.'}</p>
                      <span>{formatCoordinate(place.latitude)}, {formatCoordinate(place.longitude)}</span>
                      {place.isCustom && <button className="remove-button" onClick={() => removePlace(place)}>Remover local</button>}
                    </div>
                  )}
                </article>
              )
            })}
          </div>

          <div className="sidebar-footer">
            <div className="stats-block">
              <div><strong>{places.length}</strong><span>no mapa</span></div>
              <div><strong>{customCount}</strong><span>adicionados por você</span></div>
            </div>
            <div className="storage-note">
              <span className={`storage-indicator ${storageAvailable ? '' : 'storage-indicator--warning'}`} />
              {storageAvailable ? 'Alterações salvas neste navegador' : 'Não foi possível salvar neste navegador'}
            </div>
          </div>
        </aside>

        <section className="map-section" aria-label="Mapa interativo de Pelotas">
          <div className="map-heading">
            <div>
              <span className="eyebrow">VISUALIZAÇÃO GEOGRÁFICA</span>
              <h2>Mapa de Pelotas <span>↗</span></h2>
            </div>
            <div className="map-actions">
              <button className="map-action" onClick={locateMe} title="Usar minha localização">
                <span className="target-icon">◎</span><span>Minha localização</span>
              </button>
              <button className="map-action map-action--reset" onClick={resetMap} title="Voltar para a visão inicial">↺</button>
            </div>
          </div>

          <div className="map-frame">
            <MapView
              places={visiblePlaces}
              selectedId={selectedId}
              onSelect={selectPlace}
              isAdding={isAdding}
              onMapClick={handleMapClick}
              draftPoint={draftPoint}
              focusRequest={focusRequest}
              userLocation={userLocation}
            />
            {isAdding && <div className="map-instruction"><span className="instruction-pulse" />Clique no mapa para escolher o local</div>}
            <div className="map-legend">
              <span className="legend-title">CATEGORIAS</span>
              {CATEGORIES.map((item) => (
                <span key={item.value} className="legend-item"><i style={{ backgroundColor: item.color }} />{item.label}</span>
              ))}
            </div>
            <div className="map-coordinates">RS · BRASIL <span>31°46'S&nbsp; 52°20'W</span></div>
          </div>

          <div className="map-bottom-note">
            <span>Os marcadores mostram locais de referência e pontos cadastrados.</span>
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Sobre os dados do mapa ↗</a>
          </div>
        </section>
      </section>

      {feedback && <div className="toast-message" role="status">{feedback}</div>}
    </main>
  )
}

export default App
