"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="state-page">
      <span className="eyebrow">Edition interrupted</span>
      <h1>Let’s try that again.</h1>
      <p>We couldn’t reach the newsroom. Please try again in a moment.</p>
      <button className="read-button" onClick={reset}>
        Reload the edition ↗
      </button>
    </main>
  );
}
