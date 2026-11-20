"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/src/config/site";
import { normalizeSearch } from "@/src/lib/normalize-search";
import { ImageWithFallback } from "./image-with-fallback";

type Result = { slug: string; title: string; excerpt: string; category: string; categorySlug: string; subtopic: string; image: { src: string; alt: string } };
const recentKey = "cbo-recent-searches";

function Highlight({ text, query }: { text: string; query: string }) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean); if (!words.length) return text;
  const normalized = normalizeSearch(text); const hits: [number, number][] = [];
  words.forEach((word) => { let start = 0; while ((start = normalized.indexOf(word, start)) >= 0) { hits.push([start, start + word.length]); start += word.length; } });
  hits.sort((a, b) => a[0] - b[0]); const merged = hits.filter((hit, index) => !index || hit[0] >= hits[index - 1][1]);
  const nodes: ReactNode[] = []; let cursor = 0; merged.forEach(([start, end]) => { nodes.push(text.slice(cursor, start), <mark key={`${start}-${end}`}>{text.slice(start, end)}</mark>); cursor = end; }); nodes.push(text.slice(cursor)); return nodes;
}

export function SearchPanel() {
  const router = useRouter(); const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false); const [query, setQuery] = useState(""); const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState(false); const [selected, setSelected] = useState(-1); const [recent, setRecent] = useState<string[]>([]); const [retry, setRetry] = useState(0);
  const close = () => { setOpen(false); setSelected(-1); };
  const saveRecent = (value: string) => { const term = value.trim(); if (term.length < 2) return; const next = [term, ...recent.filter((item) => normalizeSearch(item) !== normalizeSearch(term))].slice(0, 5); setRecent(next); localStorage.setItem(recentKey, JSON.stringify(next)); };
  const goToSearch = () => { saveRecent(query); close(); router.push(`/busca?q=${encodeURIComponent(query.trim())}`); };

  useEffect(() => { try { setRecent(JSON.parse(localStorage.getItem(recentKey) ?? "[]")); } catch { setRecent([]); } }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { const target = event.target as HTMLElement; const typing = target.matches("input,textarea,[contenteditable=true]"); if ((event.ctrlKey && event.key.toLowerCase() === "k") || (event.key === "/" && !typing)) { event.preventDefault(); setOpen(true); } if (event.key === "Escape") close(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 0); }, [open]);
  useEffect(() => {
    setSelected(-1); setError(false); setResults([]);
    if (query.trim().length < 2) { setResults([]); setLoading(false); return; }
    const controller = new AbortController(); const timer = window.setTimeout(async () => {
      setLoading(true);
      try { const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal }); if (!response.ok) throw new Error(); const data = await response.json() as { results: Result[] }; setResults(data.results); }
      catch (reason) { if ((reason as Error).name !== "AbortError") setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, retry]);
  const listOpen = open && query.trim().length >= 2; const activeId = selected >= 0 ? `search-option-${selected}` : undefined;
  const skeletons = useMemo(() => Array.from({ length: 3 }), []);

  return <><button className="icon-link search-open" aria-label="Abrir busca" aria-keyshortcuts="Control+K /" onClick={() => setOpen(true)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>{open && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar artigos" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><div className="search-dialog"><div className="search-combobox"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setSelected((value) => Math.min(value + 1, results.length - 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setSelected((value) => Math.max(value - 1, 0)); } if (event.key === "Enter") { event.preventDefault(); if (selected >= 0 && results[selected]) { saveRecent(query); router.push(`/artigo/${results[selected].slug}`); close(); } else goToSearch(); } }} placeholder="Busque por impostos, documentos ou rotina" role="combobox" aria-autocomplete="list" aria-expanded={listOpen} aria-controls="search-suggestions" aria-activedescendant={activeId}/><kbd>Esc</kbd><button className="search-close" onClick={close} aria-label="Fechar busca">Fechar</button></div><div id="search-suggestions" className="search-suggestions" role={listOpen ? "listbox" : undefined} aria-label="Sugestões de busca">
    {!query && <div className="search-empty-input">{recent.length > 0 && <section><div className="search-section-title"><strong>Buscas recentes</strong><button onClick={() => { setRecent([]); localStorage.removeItem(recentKey); }}>Limpar</button></div>{recent.map((term) => <div className="recent-row" key={term}><button onClick={() => setQuery(term)}>{term}</button><button aria-label={`Remover ${term}`} onClick={() => { const next = recent.filter((item) => item !== term); setRecent(next); localStorage.setItem(recentKey, JSON.stringify(next)); }}>×</button></div>)}</section>}<section><strong>Categorias populares</strong><div className="popular-categories">{siteConfig.categories.map((category) => <Link key={category.slug} href={`/categoria/${category.slug}`} onClick={close}>{category.name}</Link>)}</div></section></div>}
    {query.length === 1 && <p className="search-hint">Digite mais um caractere para buscar.</p>}
    {loading && skeletons.map((_, index) => <div className="suggestion-skeleton" key={index}><span/><div><i/><i/></div></div>)}
    {error && !loading && <div className="search-state"><strong>Não foi possível buscar agora.</strong><p>Verifique sua conexão e tente novamente.</p><button onClick={() => setRetry((value) => value + 1)}>Tentar novamente</button></div>}
    {!loading && !error && query.trim().length >= 2 && results.map((result, index) => <Link id={`search-option-${index}`} role="option" aria-selected={selected === index} className={`search-result-row ${selected === index ? "is-selected" : ""}`} href={`/artigo/${result.slug}`} key={result.slug} onMouseEnter={() => setSelected(index)} onClick={() => { saveRecent(query); close(); }}><span className="search-thumb"><ImageWithFallback src={result.image.src} alt="" fill sizes="80px"/></span><span className="search-result-copy"><strong><Highlight text={result.title} query={query}/></strong><span>{result.excerpt}</span></span><span className="result-chip">{result.category}</span></Link>)}
    {!loading && !error && query.trim().length >= 2 && !results.length && <div className="search-state"><strong>Nenhum resultado</strong><p>Tente um termo mais amplo ou navegue por uma categoria.</p><div className="popular-categories">{siteConfig.categories.map((category) => <Link key={category.slug} href={`/categoria/${category.slug}`} onClick={close}>{category.name}</Link>)}</div></div>}
  </div></div></div>}</>;
}
