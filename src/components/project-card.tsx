"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { ExternalLink, Github, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Project } from "@/types/project"
import { MediaViewer } from "./media-viewer"

export function ProjectCard({ project }: { project: Project }) {
  const [showMedia, setShowMedia] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovering(true)
    videoRef.current?.play()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    videoRef.current?.pause()
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  const isTall = project.gridSpan === "1x2" || project.gridSpan === "2x2"

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-purple-500/10"
      >
        {/* Preview */}
        <div className={`relative w-full overflow-hidden ${isTall ? "flex-1 min-h-[200px]" : "aspect-video"}`}>
          <Image
            src={project.previewImage ?? ""}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {project.previewVideo && (
            <video
              ref={videoRef}
              src={project.previewVideo}
              muted
              loop
              playsInline
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="text-xs">
                {lang}
              </Badge>
            ))}
            {project.linesOfCode && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {project.linesOfCode} LOC
              </Badge>
            )}
          </div>

          {/* Tech stack */}
          {project.techStack && (
            <p className="text-xs text-muted-foreground">
              {project.techStack.join(" · ")}
            </p>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center gap-2 pt-2">
            {project.liveUrl && (
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  Code
                </a>
              </Button>
            )}
            {project.media && project.media.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setShowMedia(true)}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Screenshots
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {showMedia && project.media && (
        <MediaViewer
          media={project.media}
          title={project.title}
          onClose={() => setShowMedia(false)}
        />
      )}
    </>
  )
}
