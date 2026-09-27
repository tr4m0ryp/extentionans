// Lets ans.uva.nl load and sit for a spell, then swaps in a browser-style error
// page, so it reads as a real request that hung and finally timed out. The
// address bar keeps the real URL throughout.
(function () {
  const { chromePage, edgePage } = globalThis.AnsOffline;

  // How long the real page stays visible before the "timeout" (ms).
  const DELAY = 30000;

  function render() {
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

    // Page scripts may still be running; keep our page in place.
    new MutationObserver(() => {
      if (document.documentElement !== html) document.replaceChild(html, document.documentElement);
    }).observe(document, { childList: true });

    html.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action], a");
      if (!el) return;
      e.preventDefault();
      if (el.dataset.action === "reload") location.reload();
    });
  }

  setTimeout(render, DELAY);
})();
