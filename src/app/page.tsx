import { Bookshelf } from "@/components/bookshelf"
import { projects } from "@/data/projects"

export default function Home() {
  const sorted = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 py-16">
      <Bookshelf projects={sorted} title="Filip" />
    </div>
  )
}
