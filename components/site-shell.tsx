import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";
import { siteConfig } from "@/src/config/site";
import { SearchPanel } from "./search-panel";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="cbo-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-link"><Logo className="logo-full" /><Logo variant="mark" className="logo-mark" /></Link>
        <nav className="desktop-menu" aria-label="Navegação principal">
          {siteConfig.categories.map((category) => <Link key={category.slug} href={`/categoria/${category.slug}`}>{category.name}</Link>)}
          <Link href="/esportes">Esportes</Link>
        </nav>
        <ThemeToggle />
        <SearchPanel />
        <details className="mobile-menu">
          <summary aria-label="Abrir menu"><span /><span /><span /></summary>
          <nav aria-label="Navegação móvel">
            {siteConfig.categories.map((category) => <Link key={category.slug} href={`/categoria/${category.slug}`}>{category.name}</Link>)}
            <Link href="/esportes">Esportes</Link><Link href="/busca">Buscar</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="cbo-footer">
      <div className="shell footer-grid">
        <div><Logo tone="light" /><p>{siteConfig.tagline}</p></div>
        <nav aria-label="Institucional"><strong>Institucional</strong><Link href="/sobre">Sobre</Link><Link href="/privacidade">Privacidade</Link></nav>
        <nav aria-label="Fontes"><strong>Fontes</strong>{siteConfig.referenceLinks.map((link) => <a key={link.href} href={link.href} rel="noreferrer">{link.label}</a>)}</nav>
      </div>
      <div className="shell footer-bottom"><span>© 2026 {siteConfig.name} · Conteúdo de exemplo</span><span>{siteConfig.footerNote}</span></div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main id="conteudo">{children}</main><SiteFooter /></>;
}
