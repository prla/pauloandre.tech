export default async (request, context) => {
  const response = await context.next();
  if (response.status !== 404) return response;

  const accept = request.headers.get("accept") || "";
  const prefersMarkdown =
    accept.includes("text/markdown") ||
    (accept.includes("text/plain") && !accept.includes("text/html"));

  if (prefersMarkdown) {
    const body = `# 404 — Not found

This page doesn't exist. This is a single-page site — there's nothing else under this domain.

- [pauloandre.tech](https://pauloandre.tech/) — the actual site
- [/llms.txt](https://pauloandre.tech/llms.txt) — machine-readable summary
`;
    return new Response(body, {
      status: 404,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "vary": "Accept, Accept-Encoding",
        "x-robots-tag": "noindex",
      },
    });
  }

  const headers = new Headers(response.headers);
  headers.set("vary", "Accept, Accept-Encoding");
  return new Response(response.body, { status: response.status, headers });
};

export const config = { path: "/*" };
