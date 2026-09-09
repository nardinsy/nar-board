import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';

import { useThemeStore } from './store/theme.store';

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
