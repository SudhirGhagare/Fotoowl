// theme/ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from "@react-navigation/native";

const lightColors = {
  background: "#FFFCF7",
  text: "#333",
  card: "#fff",
};

const darkColors = {
  background: "#121212",
  text: "#fff",
  card: "#1E1E1E",
};

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof lightColors;
  navigationTheme: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const colors = darkMode ? darkColors : lightColors;

  const navigationTheme: Theme = {
    ...(darkMode ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(darkMode ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
    },
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, colors, navigationTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
