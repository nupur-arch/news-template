import { NextResponse } from "next/server";
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { message: "Please submit a valid email address." },
      { status: 415 },
    );
  let email: unknown;
  try {
    const body = await request.text();
    if (body.length > 2048)
      return NextResponse.json(
        { message: "Please submit only your email address." },
        { status: 413 },
      );
    email = (JSON.parse(body) as { email?: unknown }).email;
  } catch {
    return NextResponse.json(
      { message: "Please submit a valid email address." },
      { status: 400 },
    );
  }
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 422 },
    );
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true")
    return NextResponse.json({
      message:
        "Preview complete. No subscription was created and no email was sent.",
    });
  const endpoint = process.env.NEWSLETTER_API_URL;
  if (!endpoint)
    return NextResponse.json(
      {
        message:
          "Newsletter signup is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:")
      throw new Error("Newsletter endpoint must use HTTPS");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_API_TOKEN
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Newsletter provider rejected request");
    return NextResponse.json({
      message: "You’re on the list. Watch your inbox.",
    });
  } catch {
    return NextResponse.json(
      { message: "We couldn’t complete your signup. Please try again later." },
      { status: 502 },
    );
  }
}
