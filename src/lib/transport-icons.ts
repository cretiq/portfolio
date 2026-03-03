import type { TransportMode } from "@/types/transit"

const TEARDROP = `<path d="M20,1.25 L32.5,17.5 Q35,22.5 35,27.5 Q35,41.25 20,41.25 Q5,41.25 5,27.5 Q5,22.5 7.5,17.5 Z" fill="__COLOR__" stroke="rgba(255,255,255,0.5)" stroke-width="2.25"/>`

function desaturate(hex: string, amount = 0.45): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  s *= amount
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const ro = Math.round(hue2rgb(p, q, h + 1/3) * 255)
  const go = Math.round(hue2rgb(p, q, h) * 255)
  const bo = Math.round(hue2rgb(p, q, h - 1/3) * 255)
  return `#${ro.toString(16).padStart(2, "0")}${go.toString(16).padStart(2, "0")}${bo.toString(16).padStart(2, "0")}`
}

const BUS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 42.5">${TEARDROP}<text x="20" y="31" text-anchor="middle" fill="white" font-size="15" font-weight="bold" font-family="system-ui">__LABEL__</text></svg>`
const METRO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 42.5">${TEARDROP}<text x="20" y="31" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="system-ui">__LABEL__</text></svg>`
const TRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 42.5">${TEARDROP}<text x="20" y="31" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="system-ui">__LABEL__</text></svg>`
const TRAM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 42.5">${TEARDROP}<text x="20" y="31" text-anchor="middle" fill="white" font-size="15" font-weight="bold" font-family="system-ui">__LABEL__</text></svg>`
const BOAT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="45" viewBox="0 0 40 42.5">${TEARDROP}<text x="20" y="31" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="system-ui">__LABEL__</text></svg>`

const MODE_SVGS: Record<TransportMode, string> = {
  bus: BUS_SVG,
  metro: METRO_SVG,
  train: TRAIN_SVG,
  tram: TRAM_SVG,
  boat: BOAT_SVG,
}

const iconCache = new Map<string, string>()

export function getIconUrl(mode: TransportMode, color: string, label: string): string {
  const key = `${mode}:${color}:${label}`
  if (iconCache.has(key)) return iconCache.get(key)!

  const muted = desaturate(color)
  const svg = MODE_SVGS[mode]
    .replace(/__COLOR__/g, muted)
    .replace(/__LABEL__/g, label.substring(0, 3))

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  iconCache.set(key, url)
  return url
}
