// Halts the real page before it renders and swaps in a browser-style error page.
// The address bar keeps showing the real URL, so it reads as a genuine outage.
(function () {
  const { chromePage, edgePage } = globalThis.AnsOffline;

  window.stop();

  const host = location.hostname;
  const isEdge = navigator.userAgent.includes("Edg/");
  const page = (isEdge ? edgePage : chromePage)(host);

  const html = document.createElement("html");
  html.setAttribute("dir", "ltr");
  html.setAttribute("lang", "en");
  html.innerHTML =
    `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${page.title}</title><link rel="icon" href="data:,"><style>${page.css}</style></head>` +
    `<body>${page.body}</body>`;

  document.replaceChild(html, document.documentElement);

  // Page scripts may already have queued work; keep our page in place.
  new MutationObserver(() => {
    if (document.documentElement !== html) document.replaceChild(html, document.documentElement);
  }).observe(document, { childList: true });

  html.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action], a");
    if (!el) return;
    e.preventDefault();
    if (el.dataset.action === "reload") location.reload();
  });
})();
