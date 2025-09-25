import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-md group"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>

      {/* Elegant background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-orange-100 dark:from-slate-700 dark:to-slate-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </Button>
  )
}