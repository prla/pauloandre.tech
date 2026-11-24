// Serves a clean-Markdown representation of the homepage (and the 404
// page) to requests that prefer text/markdown over text/html, per
// https://acceptmarkdown.com. Keep HOME_MARKDOWN in sync with the hero
// copy in index.html by hand. There's no build step to generate it.

const HOME_MARKDOWN = `# The hardest problems in technology leadership don't have playbooks.

I help engineering organizations navigate change without losing their top talent or their momentum. Sometimes that means stepping in as an interim or fractional leader. Other times, coaching the managers who carry it.

AI is changing how engineering teams work faster than organizations can adapt. But the challenges go deeper: unclear accountability, struggling managers, difficult people decisions, delivery that isn't working. I've spent 20+ years building and leading technology organizations, and I help leaders work through problems like these.

[Let's talk →](https://calendly.com/paulo-andre/30min)

## Companies I've worked with

Spotify, Hotjar, Enigma, Adverity, Delivery Hero, AMBOSS

Around 900 coaching sessions with 85 leaders across 30 companies, including several years as resident leadership coach at Hotjar.

## Three ways to work together

### 01 — With you

**A coach and advisor for the decisions you can't delegate.**

I work one-to-one with product and engineering leaders: managers and directors stepping into bigger roles, and CTOs, VPs and founders dealing with difficult decisions, transitions, people problems and organizational complexity.

Sometimes that's coaching. Sometimes it's advice from someone who has sat in the seat. Usually it's some combination of both.

[Let's talk about your situation →](https://calendly.com/paulo-andre/30min)

### 02 — With your leaders

**Build a stronger leadership layer.**

For CTOs, VPs and Heads of People who want their managers to grow, I work across the whole leadership layer: new managers who still need the fundamentals, directors making harder calls on people and structure, senior leaders in the middle of ambiguous, high-stakes transitions.

Better managers solve more locally. Fewer escalations reach you. More of your time goes to the work only you can do.

[Let's talk about your team →](https://calendly.com/paulo-andre/30min)

### 03 — Inside the organization

**Interim and fractional leadership.**

I work with founders, CEOs and technology leaders when the organization itself needs attention: unclear accountability, leadership gaps, a founder bottleneck, delivery that has stopped working.

That can mean diagnosing it alongside your leadership team, or stepping in as interim or fractional CTO or VP Engineering. Either way, the goal is to strengthen the system and make myself unnecessary.

[Let's talk about your organization →](https://calendly.com/paulo-andre/30min)

## In their words

> I've known Paulo for a long time. It started with him coaching managers who reported to me at Hotjar. Over time we connected and became friends through shared interests and values. I'm now lucky enough to be coached by him myself. That combination is rare! He knows me well enough to see my patterns, and he's professional enough to do something useful with that knowledge.
>
> What sets Paulo apart is that he coaches rather than mentors. Instead of telling you what to do in a given situation, he helps you build the muscle to work it out yourself. He asks the question that makes you look at the situation differently, then gives you something small and concrete to try before the next session. I leave with practical actions, not just advice.
>
> He is also candid. Paulo is firmly in my corner, but he will challenge me when I'm holding myself to an outdated idea of what a leader should be, or when my self-expectations are too high. He has a wide view of what I'm capable of, and he pays close attention to the details and to how you describe situations, picking up on a lot of signals between the lines. Often, simply hearing those observations played back to me is an eye-opener that helps me connect the dots.
>
> Above all, Paulo is genuinely interested in you as a person, not only in your professional role. He is dedicated to seeing you grow into a better leader and a better human being, and it shows in how he runs his sessions, how he follows up, and how much time he gives.
>
> Our conversations leave me clearer, calmer and more honest with myself. If you're a leader who wants to build your own judgment rather than borrow someone else's, I recommend working with Paulo.

— **Clint Calleja**, Senior Director of Engineering, Contentsquare

> I first started working with Paulo when I took on an exciting and complex new project at Spotify, as engineering director for a greenfield, yet-to-be-proven product area. Having Paulo by my side during that time was incredibly valuable. From strategic insights and org debugging to navigating complex work relationships, determining personal goals and managing my time and energy more effectively, whatever it was, he helped me grow and significantly sharpen my thinking.
>
> Paulo has tremendous knowledge, drawn from both theory and experience, and always has a relevant tool, resource or framework at hand for whatever I've thrown at him. Yet he doesn't lead with it. His focus is first and foremost on me and my specific situation, and he offers suggestions only where they genuinely apply. What stood out most was his pragmatism grounded in strong values, and his systems thinking that always stays human-first. Beyond being deeply enriching, working with him has been an absolute pleasure.

— **Domenic Vossen**, former Director of Engineering, Spotify

> I worked with Paulo during my time at Hotjar, and his coaching was invaluable to my growth as a product leader. Like many people in tech, I'd hit a familiar fork in the road: remain an individual contributor, or move into management. Rather than pushing me toward one path, Paulo first helped me get clear on my "why" — and with that clarity, I could move forward with real confidence.
>
> I chose management, and Paulo guided me through the transition, helping me become the leader I actually wanted to be, not just one shaped by management books.
>
> Thanks to his guidance, I grew into an effective leader and was later promoted to Director of Product. I credit Paulo with a lot of that growth.

— **Mohammad Rizwan**, former Director of Product, Hotjar / Contentsquare

> I worked with Paulo for about a year while Journi's engineering team was growing past the point where I could lead everyone directly. He helped me figure out what to let go of, define the VP Engineering role we needed, and hand over team lead positions without trying to clone myself. He is practical, direct, and very good at asking the questions I had been avoiding.

— **Christian Papauschek**, Co-Founder & CTO, Journi

## The Hagakure

I also write essays about technology, leadership, organizations, and making sense of an increasingly strange industry.

[Read The Hagakure →](https://hagakure.substack.com/)

---

© 2026 Paulo André
[LinkedIn](https://www.linkedin.com/in/paulorlandre/) · [Hagakure](https://hagakure.substack.com/)
`;

const NOT_FOUND_MARKDOWN = `# 404: Not found

This page doesn't exist. This is a single-page site. There's nothing else under this domain.

- [pauloandre.tech](https://pauloandre.tech/): the actual site
- [/llms.txt](https://pauloandre.tech/llms.txt): machine-readable summary
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
// markdown at a higher (or sole) preference. A tie (e.g. plain "Accept:
// */*" from curl or a generic bot) keeps serving HTML, since that's this
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
