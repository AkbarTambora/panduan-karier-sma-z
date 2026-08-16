// src/app/(auth)/layout.tsx
// Layout minimal untuk halaman auth (tanpa Navbar duplikat jika perlu override)

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
