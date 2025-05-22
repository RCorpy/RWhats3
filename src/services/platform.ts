import { Capacitor } from '@capacitor/core';

type Platform = 'android' | 'web' | 'ios' | 'electron';

export const getPlatform = (): Platform => {
  if ((window as any).electron) return 'electron';

  const platform = Capacitor.getPlatform();

  if (platform === 'android' || platform === 'ios' || platform === 'web') {
    return platform;
  }

  // Fallback por seguridad
  return 'web';
};
