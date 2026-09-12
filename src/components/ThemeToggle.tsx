import { useThemeStore } from '@/store/theme.store';
import { Button } from './ui';

import { Moon, SunIcon } from 'lucide-react';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon role="theme-dark" aria-label="Dark mode" />
      ) : (
        <SunIcon role="theme-light" aria-label="Light mode" />
      )}
    </Button>
  );
}
