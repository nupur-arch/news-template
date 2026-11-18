"use client";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";
import { Reveal, SectionHeading } from "./editorial-motion";
export function Newsletter({
  demo,
  number,
}: {
  demo: boolean;
  number: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    setStatus("pending");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(12000),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          data.message || "We couldn’t save your signup. Please try again.",
        );
      setStatus("success");
      setMessage(data.message || "You’re on the list. Watch your inbox.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The signup took too long. Please try again.",
      );
    }
  }
  return (
    <section id="newsletter" className="newsletter-section page-section">
      <Reveal>
        <div className="newsletter-card">
          <div className="newsletter-copy">
            <SectionHeading
              number={number}
              label="A note from the newsroom"
              title="A wider view. A quieter inbox."
            />
            <p>
              The stories worth your time, brought together in one considered
              edition. Make a little room for curiosity.
            </p>
          </div>
          <div className="newsletter-form-side">
            <span className="newsletter-seal" aria-hidden="true">
              ✳
            </span>
            <form onSubmit={submit}>
              <label htmlFor="newsletter-email" className="eyebrow">
                Your email address
              </label>
              <div className="newsletter-input">
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "success") setStatus("idle");
                  }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                  aria-describedby="newsletter-note newsletter-status"
                />
                <button
                  type="submit"
                  disabled={status === "pending"}
                  aria-label={
                    demo
                      ? "Preview newsletter signup"
                      : "Subscribe to the newsletter"
                  }
                >
                  {status === "success" ? (
                    <Check size={22} />
                  ) : (
                    <ArrowUpRight size={22} />
                  )}
                </button>
              </div>
              <p id="newsletter-note">
                {demo
                  ? "Preview signup. No subscription is created and no email is sent."
                  : "A considered edition. Unsubscribe whenever you like."}
              </p>
              <p
                id="newsletter-status"
                className={`newsletter-status ${status}`}
                role={status === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {status === "pending" ? "Sending your request…" : message}
              </p>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
