// Serves a clean-Markdown representation of the homepage (and the 404
// page) to requests that prefer text/markdown over text/html, per
// https://acceptmarkdown.com. Keep HOME_MARKDOWN in sync with the hero
// copy in index.html by hand — there's no build step to generate it.

const HOME_MARKDOWN = `# The hardest problems in technology leadership don't have playbooks.

I coach and advise engineering leaders — from new managers to CTOs and founders — dealing with difficult leadership and organizational problems.

Engineering isn't working and you can't quite explain why. Your CEO wants an AI strategy yesterday. You're avoiding a difficult people decision. The role that used to fit you doesn't anymore. Or something simply feels wrong and you're too close to see it clearly.

I've spent 20+ years building and leading technology organizations. Sometimes it helps to have someone who's seen a lot of this before in your corner.

**What's keeping you awake at night?**

[Let's talk →](https://calendar.app.google/jKuzeph3c6ndobgM8)

## Companies I've worked with

Spotify, Hotjar, Enigma, Adverity, Delivery Hero, AMBOSS

## For your leadership team

For CTOs, VPs of Engineering, founders, and People leads thinking about this for more than one person.

**Make your managers better. Get your own time back.**

I work across the layer — new managers building the fundamentals, experienced managers and directors sharpening judgment on hard people and organizational calls, senior leaders navigating ambiguity and consequential transitions.

Better managers solve more locally. Fewer escalations reach you. More of your time goes to the work only you can do. You're not buying individual development — you're raising the capability of your whole management system, for roughly the cost of one more engineer.

[Let's talk about your team →](https://calendar.app.google/jKuzeph3c6ndobgM8)

## Writing

I also write **The Hagakure** — essays about technology, leadership, organizations, and making sense of an increasingly strange industry.

[Read The Hagakure →](https://hagakure.substack.com/)

---

Paulo André · Berlin
[LinkedIn](https://www.linkedin.com/in/paulorlandre/) · [Hagakure](https://hagakure.substack.com/)
`;

const NOT_FOUND_MARKDOWN = `# 404 — Not found

This page doesn't exist. This is a single-page site — there's nothing else under this domain.

- [pauloandre.tech](https://pauloandre.tech/) — the actual site
- [/llms.txt](https://pauloandre.tech/llms.txt) — machine-readable summary
`;

function parseAccept(header) {
  return header.split(",").map((part) => {
    const [type, ...params] = part.trim().split(";").map((s) => s.trim());
    const [maj, min] = type.toLowerCase().split("/");
    let q = 1;
    for (const p of params) {
      const [k, v] = p.split("=").map((s) => s.trim());
      if (k === "q") q = parseFloat(v);
    }
    return { maj, min, q: isNaN(q) ? 1 : q };
  });
}

function acceptQuality(header, mime) {
  const [maj, min] = mime.split("/");
  let best = 0;
  for (const entry of parseAccept(header)) {
    if (entry.q <= 0) continue;
    if ((entry.maj === maj || entry.maj === "*") && (entry.min === min || entry.min === "*")) {
      best = Math.max(best, entry.q);
    }
  }
  return best;
}

function markdownResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "vary": "Accept, Accept-Encoding",
      "x-robots-tag": "noindex",
    },
  });
}

function notAcceptable() {
  return new Response("Not Acceptable", {
    status: 406,
    headers: { vary: "Accept" },
  });
}

// mdQ strictly greater than htmlQ means the client explicitly asked for
// markdown at a higher (or sole) preference. A tie — e.g. plain "Accept:
// */*" from curl or a generic bot — keeps serving HTML, since that's this
// site's default representation.
function negotiate(accept, { markdown, status, htmlResponse }) {
  const mdQ = acceptQuality(accept, "text/markdown");
  const htmlQ = acceptQuality(accept, "text/html");

  if (mdQ === 0 && htmlQ === 0) return notAcceptable();
  if (mdQ > htmlQ) return markdownResponse(markdown, status);
  return htmlResponse();
}

function withVary(response) {
  const headers = new Headers(response.headers);
  headers.set("vary", "Accept, Accept-Encoding");
  return new Response(response.body, { status: response.status, headers });
}

export default async (request, context) => {
  const url = new URL(request.url);
  const accept = request.headers.get("accept") || "*/*";

  if (url.pathname === "/") {
    return negotiate(accept, {
      markdown: HOME_MARKDOWN,
      status: 200,
      htmlResponse: async () => withVary(await context.next()),
    });
  }

  const response = await context.next();
  if (response.status !== 404) return response;

  return negotiate(accept, {
    markdown: NOT_FOUND_MARKDOWN,
    status: 404,
    htmlResponse: async () => withVary(response),
  });
};

export const config = { path: "/*" };
