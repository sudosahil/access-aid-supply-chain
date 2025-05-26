
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme, ThemeVariant } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon } from 'lucide-react';

const themes = [
  { id: 'default', name: 'Default Blue', colors: ['#60a5fa', '#3b82f6', '#1e40af'] },
  { id: 'ocean', name: 'Ocean Teal', colors: ['#14b8a6', '#0d9488', '#0f766e'] },
  { id: 'forest', name: 'Forest Green', colors: ['#22c55e', '#16a34a', '#15803d'] },
  { id: 'sunset', name: 'Sunset Orange', colors: ['#f97316', '#ea580c', '#c2410c'] },
  { id: 'purple', name: 'Royal Purple', colors: ['#a855f7', '#9333ea', '#7c3aed'] },
  { id: 'rose', name: 'Rose Pink', colors: ['#f43f5e', '#e11d48', '#be123c'] }
] as const;

export const ThemeSelector = () => {
  const { themeVariant, setThemeVariant, isDark, setIsDark } = useTheme();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="flex items-center gap-2">
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Dark Mode
          </Label>
          <Switch
            id="dark-mode"
            checked={isDark}
            onCheckedChange={setIsDark}
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-medium">Color Theme</Label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant={themeVariant === theme.id ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center gap-2"
                onClick={() => setThemeVariant(theme.id as ThemeVariant)}
              >
                <div className="flex gap-1">
                  {theme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs">{theme.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
