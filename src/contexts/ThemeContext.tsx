
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeVariant = 'default' | 'ocean' | 'forest' | 'sunset' | 'purple' | 'rose' | 'monochrome';

interface ThemeContextType {
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('default');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-variant') as ThemeVariant;
    const savedDark = localStorage.getItem('theme-dark') === 'true';
    
    if (savedTheme) setThemeVariant(savedTheme);
    if (savedDark !== undefined) setIsDark(savedDark);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-variant', themeVariant);
    localStorage.setItem('theme-dark', isDark.toString());
    
    // Apply theme classes to document
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${themeVariant}`);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, [themeVariant, isDark]);

  return (
    <ThemeContext.Provider value={{ themeVariant, setThemeVariant, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
