import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button variant="outline" onClick={toggleTheme}>
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </Button>
  );
}
