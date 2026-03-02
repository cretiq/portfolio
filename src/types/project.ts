export type Project = {
  id: string
  title: string
  summary: string
  previewImage?: string
  color?: string
  previewVideo?: string
  languages: string[]
  linesOfCode?: string
  techStack?: string[]
  liveUrl?: string
  githubUrl?: string
  media?: { type: "image" | "video"; src: string; alt?: string }[]
  gridSpan?: "1x1" | "2x1" | "1x2" | "2x2"
  featured?: boolean
  order?: number
}
