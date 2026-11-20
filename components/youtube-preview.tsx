"use client";

import { useState } from "react";

export function YoutubePreview({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) return <div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>;
  return <button className="video-preview" onClick={() => setPlaying(true)} style={{ backgroundImage: `linear-gradient(#0f2a4322,#0f2a43aa),url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)` }}><span className="play-icon" aria-hidden="true">▶</span><span><small>Vídeo relacionado</small><strong>{title}</strong><em>Assistir no YouTube</em></span></button>;
}
