import { useTheme } from "../utils/ThemeContext";
import { Palette } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all group relative"
      title={`Switch to ${theme === "neon" ? "Pink" : "Neon"} theme`}
      aria-label="Toggle theme"
    >
      <Palette className="size-5" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {theme === "neon" ? "Pink Theme" : "Neon Theme"}
      </span>
    </button>
  );
}
