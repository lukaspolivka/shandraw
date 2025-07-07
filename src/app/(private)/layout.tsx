import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
