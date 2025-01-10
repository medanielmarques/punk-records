import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="mx-auto mb-8 flex max-w-[800px] items-center justify-between">
      <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
        Toki
      </h1>
      <ThemeToggle />
    </header>
  )
}
