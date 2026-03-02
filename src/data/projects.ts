import { Project } from "@/types/project"

export const projects: Project[] = [
  {
    id: "nextcareer",
    title: "NextCareer",
    summary: "AI-powered job search platform — apply to 20+ tech roles in 30 minutes.",
    color: "#1e3a5f",
    previewImage: "/projects/nextcareer/icon.png",
    languages: ["TypeScript"],
    techStack: ["Next.js 15", "React 19", "MongoDB", "Prisma", "OpenAI", "Gemini", "Stripe", "Redis"],
    linesOfCode: "450k",
    githubUrl: "https://github.com/cretiq/techrec",
    featured: true,
    order: 0,
  },
]
