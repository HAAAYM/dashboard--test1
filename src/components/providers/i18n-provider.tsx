'use client';

import { useEffect } from 'react';
import '@/lib/i18n/config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n is already initialized by the import
  }, []);

  return <>{children}</>;
}
