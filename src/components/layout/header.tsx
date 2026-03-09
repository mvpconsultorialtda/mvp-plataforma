"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LayoutGrid, LogIn, LogOut } from "lucide-react";

const projects = [
  { slug: "2altos", name: "2Altos", color: "#f59e0b" },
  { slug: "2altos-campanhas", name: "Campanhas", color: "#b45309" },
  { slug: "educahubplay", name: "EducaHubPlay", color: "#8b5cf6" },
  { slug: "xequemath", name: "XequeMath", color: "#10b981" },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const activeProject = projects.find((p) => pathname.startsWith(`/${p.slug}`));

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <LayoutGrid size={22} className="text-primary" />
              <span>MVP</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeProject?.slug === p.slug
                      ? "text-white"
                      : "text-muted hover:text-foreground hover:bg-card-hover"
                  }`}
                  style={activeProject?.slug === p.slug ? { backgroundColor: p.color } : undefined}
                >
                  {p.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted hidden sm:block">{user?.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <LogOut size={16} /> Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <LogIn size={16} /> Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
