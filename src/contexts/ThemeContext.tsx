import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="inline-flex"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-foreground/80" />
          ) : (
            <Sun className="h-5 w-5 text-foreground/80" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
