"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapboxOverlay } from "@deck.gl/mapbox"
import { IconLayer } from "@deck.gl/layers"
import type { Vehicle, WsServerMessage, WsClientMessage } from "@/types/transit"
import { getIconUrl } from "@/lib/transport-icons"

const WS_URL = "wss://sl-quick-server.fly.dev/ws"
const SHAPES_BASE = "/api/shapes"
const SHAPE_CACHE_PREFIX = "transit-shape-"
const VEHICLES_CACHE_KEY = "transit-vehicles"

const ROUTES = [
  { routeId: "9011001001300000", label: "13", mode: "metro" as const, color: "#E4002B", name: "Röda linjen" },
  { routeId: "9011001001900000", label: "19", mode: "metro" as const, color: "#0B9CDA", name: "Blå linjen" },
  { routeId: "9011001001000000", label: "10", mode: "metro" as const, color: "#2D9933", name: "Gröna linjen" },
  { routeId: "9011001004300000", label: "43", mode: "train" as const, color: "#EC6084", name: "Pendeltåg" },
] as const

const ROUTE_COLOR_MAP = new Map<string, string>(ROUTES.map((r) => [r.routeId, r.color]))

function getCachedShape(routeId: string): unknown | null {
  try {
    const raw = localStorage.getItem(SHAPE_CACHE_PREFIX + routeId)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setCachedShape(routeId: string, geojson: unknown) {
  try { localStorage.setItem(SHAPE_CACHE_PREFIX + routeId, JSON.stringify(geojson)) }
  catch { /* quota exceeded — ignore */ }
}

function getCachedVehicles(): Vehicle[] {
  try {
    const raw = sessionStorage.getItem(VEHICLES_CACHE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function setCachedVehicles(vehicles: Map<string, Vehicle>) {
  try { sessionStorage.setItem(VEHICLES_CACHE_KEY, JSON.stringify(Array.from(vehicles.values()))) }
  catch { /* ignore */ }
}

export function LiveTransitMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const overlayRef = useRef<MapboxOverlay | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const vehiclesRef = useRef<Map<string, Vehicle>>(new Map())
  const [activeRoutes, setActiveRoutes] = useState<Set<string>>(
    () => new Set(ROUTES.map((r) => r.routeId))
  )
  const activeRoutesRef = useRef(activeRoutes)
  const [, forceRender] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)
  const shapesFetchedRef = useRef(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [18.07, 59.33],
      zoom: 13.5,
      interactive: false,
      attributionControl: false,
    })

    const overlay = new MapboxOverlay({
      layers: [],
    })

    map.on("load", () => {
      map.addControl(overlay as unknown as maplibregl.IControl)
      setMapLoaded(true)
    })

    mapRef.current = map
    overlayRef.current = overlay

    return () => {
      overlay.finalize()
      map.remove()
      mapRef.current = null
      overlayRef.current = null
    }
  }, [])

  // Update deck.gl layer — reads activeRoutesRef so no dependency on activeRoutes
  const updateDeckLayer = useCallback(() => {
    if (!overlayRef.current) return

    const vehicles = Array.from(vehiclesRef.current.values()).filter((v) =>
      activeRoutesRef.current.has(v.routeId)
    )

    const layer = new IconLayer<Vehicle>({
      id: "vehicles",
      data: vehicles,
      getPosition: (d) => [d.lng, d.lat],
      getIcon: (d) => ({
        url: getIconUrl(d.mode, ROUTE_COLOR_MAP.get(d.routeId) ?? d.color, d.line),
        width: 40,
        height: 45,
        anchorY: 25,
      }),
      getAngle: (d) => 360 - d.bearing,
      getSize: 40,
      sizeUnits: "pixels" as const,
      pickable: false,
      transitions: {
        getPosition: { duration: 5000, type: "interpolation" },
        getAngle: { duration: 5000, type: "interpolation" },
      },
    })

    overlayRef.current.setProps({ layers: [layer] })
  }, [])

  // Fetch all route shapes once on map load (localStorage cached)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded || shapesFetchedRef.current) return
    shapesFetchedRef.current = true

    const addShapeToMap = (route: (typeof ROUTES)[number], geojson: unknown) => {
      const sourceId = `shape-${route.routeId}`
      const layerId = `shape-line-${route.routeId}`
      if (!mapRef.current || map.getSource(sourceId)) return

      map.addSource(sourceId, { type: "geojson", data: geojson as maplibregl.GeoJSONSourceSpecification["data"] })
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": route.color,
          "line-width": 2,
          "line-opacity": 0.3,
        },
      })
    }

    ROUTES.forEach((route) => {
      const cached = getCachedShape(route.routeId)
      if (cached) {
        addShapeToMap(route, cached)
        return
      }
      fetch(`${SHAPES_BASE}/${route.routeId}`)
        .then((r) => r.json())
        .then((geojson) => {
          setCachedShape(route.routeId, geojson)
          addShapeToMap(route, geojson)
        })
        .catch(() => {})
    })
  }, [mapLoaded])

  // Toggle shape layer visibility + update vehicle filter when activeRoutes changes
  useEffect(() => {
    activeRoutesRef.current = activeRoutes

    const map = mapRef.current
    if (!map || !mapLoaded) return

    ROUTES.forEach((route) => {
      const layerId = `shape-line-${route.routeId}`
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          activeRoutes.has(route.routeId) ? "visible" : "none"
        )
      }
    })

    updateDeckLayer()
  }, [activeRoutes, mapLoaded, updateDeckLayer])

  // Restore cached vehicles immediately on mount
  useEffect(() => {
    const cached = getCachedVehicles()
    if (cached.length > 0) {
      for (const v of cached) vehiclesRef.current.set(v.id, v)
      updateDeckLayer()
    }
  }, [updateDeckLayer])

  // WebSocket connection — connect immediately on mount, subscribe to all routes
  useEffect(() => {
    const allRouteIds = ROUTES.map((r) => r.routeId)

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      const msg: WsClientMessage = {
        type: "subscribe",
        routes: allRouteIds,
      }
      ws.send(JSON.stringify(msg))
    }

    ws.onmessage = (e) => {
      const msg: WsServerMessage = JSON.parse(e.data)

      if (msg.type === "initial_state") {
        vehiclesRef.current.clear()
        for (const v of msg.vehicles) {
          vehiclesRef.current.set(v.id, v)
        }
      } else if (msg.type === "vehicles") {
        for (const v of msg.added) {
          vehiclesRef.current.set(v.id, v)
        }
        for (const v of msg.updated) {
          const existing = vehiclesRef.current.get(v.id)
          if (existing) {
            vehiclesRef.current.set(v.id, { ...existing, ...v })
          }
        }
        for (const id of msg.removed) {
          vehiclesRef.current.delete(id)
        }
      }

      setCachedVehicles(vehiclesRef.current)
      updateDeckLayer()
      forceRender((n) => n + 1)
    }

    ws.onerror = () => ws.close()

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [updateDeckLayer])

  const toggleRoute = (routeId: string) => {
    setActiveRoutes((prev) => {
      const next = new Set(prev)
      if (next.has(routeId)) {
        next.delete(routeId)
      } else {
        next.add(routeId)
      }
      return next
    })
  }

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" style={{ pointerEvents: "none" }} />

      {/* Route toggle dots */}
      <div
        className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1.5"
        style={{ pointerEvents: "auto" }}
      >
        {ROUTES.map((route) => {
          const isActive = activeRoutes.has(route.routeId)
          return (
            <button
              key={route.routeId}
              onClick={(e) => {
                e.stopPropagation()
                toggleRoute(route.routeId)
              }}
              className="group relative flex h-5 w-5 items-center justify-center rounded-full transition-transform hover:scale-125"
              style={{
                backgroundColor: isActive ? route.color : "transparent",
                border: `2px solid ${route.color}`,
                opacity: isActive ? 1 : 0.4,
              }}
              title={`${route.label} ${route.name}`}
            />
          )
        })}
      </div>
    </div>
  )
}
