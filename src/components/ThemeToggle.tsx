import { MoonStar as Moon, SunMedium as Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    localStorage.removeItem("ks_notebook_theme");

    const sessionTheme = sessionStorage.getItem("ks_theme_session") as "light" | "dark" | null;
    const initialTheme = sessionTheme || "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    sessionStorage.setItem("ks_theme_session", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-transparent hover:bg-[#e6e3d8]/60 dark:hover:bg-[#2a2926] text-[#7e8976] dark:text-[#9fa895] hover:text-[#2d2d2a] dark:hover:text-[#eae6df] cursor-pointer shrink-0",
        className
      )}
      aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to White Mode"}
      title={theme === "light" ? "White Mode Active (Click for Dark Mode)" : "Dark Mode Active (Click for White Mode)"}
    >
      {theme === "light" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

