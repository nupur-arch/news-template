"use client";

import { useState } from "react";

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false); const [copied, setCopied] = useState(false);
  const share = async () => { if (navigator.share) { await navigator.share({ title, url }); } else setOpen((value) => !value); };
  const encodedUrl = encodeURIComponent(url); const encodedTitle = encodeURIComponent(title);
  return <div className="share-wrap"><button className="share-main" onClick={share}>Compartilhar</button>{open && <div className="share-menu"><a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}>WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>Facebook</a><a href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`}>X</a><a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}>Telegram</a><a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}>E-mail</a><button onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }}>Copiar link</button></div>}{copied && <span className="share-toast" role="status">Link copiado</span>}</div>;
}
