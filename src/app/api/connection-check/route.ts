const DEFAULT_API_BASE_URL = "http://127.0.0.1:8080";
const REQUEST_TIMEOUT_MS = 8_000;

type ConnectionRequest = {
  username?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return Response.json(
      { ok: false, message: "Expected a JSON request." },
      { status: 415 },
    );
  }

  let payload: ConnectionRequest;
  try {
    payload = (await request.json()) as ConnectionRequest;
  } catch {
    return Response.json(
      { ok: false, message: "The request body is not valid JSON." },
      { status: 400 },
    );
  }

  const username =
    typeof payload.username === "string" ? payload.username.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!username || !password || username.length > 128 || password.length > 512) {
    return Response.json(
      { ok: false, message: "Enter a valid username and password." },
      { status: 400 },
    );
  }

  const apiBaseUrl = (
    process.env.CARELY_API_BASE_URL ?? DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = performance.now();

  try {
    const upstreamResponse = await fetch(
      `${apiBaseUrl}/fe-connection-check`,
      {
        method: "GET",
        headers: {
          Accept: "text/plain, application/json",
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        },
        cache: "no-store",
        redirect: "manual",
        signal: controller.signal,
      },
    );
    const responseText = await upstreamResponse.text();
    const durationMs = Math.round(performance.now() - startedAt);

    if (!upstreamResponse.ok) {
      const redirectedToSignIn =
        upstreamResponse.status >= 300 && upstreamResponse.status < 400;
      return Response.json(
        {
          ok: false,
          message:
            upstreamResponse.status === 401
              ? "The backend rejected these credentials."
              : redirectedToSignIn
                ? "The backend redirected to its sign-in page. Check the Basic Auth credentials."
              : `The backend returned ${upstreamResponse.status} ${upstreamResponse.statusText}.`,
          status: upstreamResponse.status,
          durationMs,
        },
        { status: redirectedToSignIn ? 401 : upstreamResponse.status },
      );
    }

    return Response.json(
      {
        ok: true,
        message: responseText || "Connection successful",
        status: upstreamResponse.status,
        durationMs,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return Response.json(
      {
        ok: false,
        message: timedOut
          ? "The backend did not respond within 8 seconds."
          : "Could not reach the backend service on port 8080.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
