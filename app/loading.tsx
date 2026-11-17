export default function Loading() {
  return (
    <main
      className="loading-state"
      aria-busy="true"
      aria-label="Loading the morning edition"
    >
      <span className="wordmark">
        The Daily Standard<span>®</span>
      </span>
      <div className="skeleton" />
      <p className="eyebrow">Preparing your edition…</p>
    </main>
  );
}
