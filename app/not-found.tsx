import Link from "next/link";
export default function NotFound() {
  return (
    <main className="state-page">
      <span className="eyebrow">404 / Story not found</span>
      <h1>A page out of place.</h1>
      <p>This story may have moved. The front page is a good place to start.</p>
      <Link className="read-button" href="/">
        Back to the edition ↗
      </Link>
    </main>
  );
}
