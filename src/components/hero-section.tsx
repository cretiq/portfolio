import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-4 px-4 pb-12 pt-24 text-center sm:pb-16 sm:pt-32">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Your Name
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Full-stack developer building things for the web and beyond.
      </p>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
        </Button>
        <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </Button>
        <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
          <a href="mailto:you@example.com" aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  )
}
