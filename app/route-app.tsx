'use client';

import dynamic from 'next/dynamic';

/**
 * The single client shell used by every App Router entry point.  Keeping this
 * boundary here means providers, auth state, cache state, and the legacy page
 * components are mounted once per route, rather than being duplicated in each
 * page wrapper.
 */
const App = dynamic(() => import('../src/App'), { ssr: false });

export type AppRoute =
  | 'dashboard'
  | 'login'
  | 'kebakaran'
  | 'odnk'
  | 'input'
  | 'peta'
  | 'sampah'
  | 'pengaturan'
  | 'personil';

export default function RouteApp({ route }: { route: AppRoute }) {
  return <App route={route} />;
}
