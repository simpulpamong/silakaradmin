/** Shared authenticated route boundary. Authentication remains owned by the legacy app during migration. */
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
