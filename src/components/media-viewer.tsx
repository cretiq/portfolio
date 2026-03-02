"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type MediaItem = { type: "image" | "video"; src: string; alt?: string }

export function MediaViewer({
  media,
  title,
  onClose,
}: {
  media: MediaItem[]
  title: string
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const current = media[index]

  const prev = () => setIndex((i) => (i - 1 + media.length) % media.length)
  const next = () => setIndex((i) => (i + 1) % media.length)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative flex items-center justify-center">
          {media.length > 1 && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 z-10 h-8 w-8"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            {current.type === "image" ? (
              <Image
                src={current.src}
                alt={current.alt || title}
                fill
                className="object-contain"
              />
            ) : (
              <video
                src={current.src}
                controls
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {media.length > 1 && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 z-10 h-8 w-8"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {media.length > 1 && (
          <p className="text-center text-sm text-muted-foreground">
            {index + 1} / {media.length}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
