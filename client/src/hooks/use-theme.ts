import { useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  function setDark(dark: boolean) {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
    setIsDark(dark);
  }

  return { isDark, setDark, toggle: () => setDark(!isDark) };
}
