'use client';

import React from 'react';
import '../src/index.css';
import '../src/styles/theme.css';
import '../src/styles/enterprise.css';
import '../src/styles/ui.css';
import '../src/styles/dashboard.css';
import '../src/styles/peta-shell.css';
import '../src/styles/responsive.css';
import '../src/styles/print.css';

/** Global client-side styling/provider boundary. Route-specific UI is mounted by AppRoute. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
