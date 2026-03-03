export type TransportMode = "bus" | "metro" | "train" | "tram" | "boat"

export interface Vehicle {
  id: string
  tripId: string
  routeId: string
  line: string
  destination: string
  mode: TransportMode
  lat: number
  lng: number
  bearing: number
  speed: number
  color: string
  timestamp: number
}

export interface WsInitialStateMessage {
  type: "initial_state"
  vehicles: Vehicle[]
}

export interface WsVehiclesMessage {
  type: "vehicles"
  added: Vehicle[]
  updated: (Partial<Vehicle> & { id: string })[]
  removed: string[]
}

export type WsServerMessage = WsInitialStateMessage | WsVehiclesMessage

export interface WsSubscribeMessage {
  type: "subscribe"
  routes: string[]
}

export interface WsUnsubscribeMessage {
  type: "unsubscribe"
  routes: string[]
}

export type WsClientMessage = WsSubscribeMessage | WsUnsubscribeMessage
