"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { ExternalLink, Github, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Project } from "@/types/project"
import { MediaViewer } from "./media-viewer"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import dynamic from "next/dynamic"

const LiveTransitMap = dynamic(
  () => import("@/components/ui/live-transit-map").then((m) => m.LiveTransitMap),
  { ssr: false }
)

export function Bookshelf({
  projects,
  title,
}: {
  projects: Project[]
  title: string
}) {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id ?? null)
  const [mediaProject, setMediaProject] = useState<Project | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      const idx = projects.findIndex((p) => p.id === expandedId)
      if (e.key === "ArrowRight" && idx < projects.length - 1) {
        setExpandedId(projects[idx + 1].id)
      } else if (e.key === "ArrowLeft" && idx > 0) {
        setExpandedId(projects[idx - 1].id)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [expandedId, projects])

  return (
    <>
      <div className="mx-auto flex h-[80vh] min-h-[500px] w-full max-w-7xl flex-col bg-black p-2">
        <h1 className="px-2 pt-4 pb-4 font-[family-name:var(--font-sora)] text-6xl font-bold uppercase tracking-[-0.03em] text-white sm:text-8xl">
          {title}
        </h1>
        <div className="flex min-h-0 flex-1">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id
            return (
              <motion.div
                key={project.id}
                className="relative flex shrink-0 cursor-pointer overflow-hidden border-r border-white/10 bg-black last:border-r-0"
                style={{ willChange: "flex-grow" }}
                animate={{ flexGrow: isExpanded ? 8 : 0, flexBasis: isExpanded ? "auto" : "56px" }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={() => setExpandedId(project.id)}
              >
                {/* Vertical spine — dark back of book */}
                <div className="relative z-10 flex w-14 shrink-0 flex-col items-center justify-between bg-black py-3">
                  {project.year && (
                    <span className={`whitespace-nowrap text-base tracking-wider [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 ${isExpanded ? "text-white/40" : "text-white/10"}`}>
                      {project.year}
                    </span>
                  )}
                  <span className={`whitespace-nowrap text-3xl font-semibold [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 ${isExpanded ? "text-white" : "text-white/10"}`}>
                    {project.title}{project.subtitle && ` — ${project.subtitle}`}
                  </span>
                </div>

                {/* Color area — only visible when expanded */}
                <motion.div
                  className="relative m-3 ml-0 min-w-0 overflow-hidden rounded-4xl"
                  style={{ backgroundColor: project.color ?? "#333" }}
                  animate={{ flexGrow: isExpanded ? 1 : 0, flexBasis: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Cover */}
                  {project.transitMapCover ? (
                    <LiveTransitMap />
                  ) : project.animatedCover ? (
                    <BackgroundGradientAnimation
                      containerClassName="absolute inset-0"
                      interactive={isExpanded}
                    />
                  ) : project.previewImage ? (
                    <Image
                      src={project.previewImage}
                      alt={project.title}
                      fill
                      className={`object-cover ${project.coverPosition ?? "object-top"}`}
                      sizes="(max-width: 768px) 100vw, 100vw"
                      quality={90}
                    />
                  ) : null}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-4xl bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Expanded: full content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="relative z-10 flex h-full flex-col justify-end p-6"
                      >
                        <div className="flex flex-col gap-3">
                          <p className="max-w-md text-sm text-white/70">{project.summary}</p>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {project.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                            {project.linesOfCode && (
                              <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                                {project.linesOfCode} LOC
                              </Badge>
                            )}
                          </div>

                          {project.techStack && (
                            <p className="text-xs text-white/50">
                              {project.techStack.join(" · ")}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            {project.liveUrl && (
                              <Button size="sm" variant="secondary" className="h-8 gap-1.5 text-xs" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Live
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="secondary" className="h-8 gap-1.5 text-xs" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3.5 w-3.5" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {project.media && project.media.length > 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 gap-1.5 text-xs"
                                onClick={() => setMediaProject(project)}
                              >
                                <ImageIcon className="h-3.5 w-3.5" />
                                Screenshots
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {mediaProject?.media && (
        <MediaViewer
          media={mediaProject.media}
          title={mediaProject.title}
          onClose={() => setMediaProject(null)}
        />
      )}
    </>
  )
}
