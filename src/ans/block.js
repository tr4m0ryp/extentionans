// Covers ans.uva.nl with a neutral loading screen from the very first paint, so
// the platform itself never shows and cannot be used. The page keeps loading in
// the background (the tab shows its normal loading state), and after a spell the
// cover is swapped for a browser-style "site can't be reached" error, so it reads
// as a request that hung and finally timed out. The address bar keeps the real URL.
(function () {
  const { chromePage, edgePage } = globalThis.AnsOffline;

  // How long the loading screen is shown before the "timeout" (ms).
  const DELAY = 30000;

  // Full-screen loading cover: opaque white with a centered spinner.
  const OVERLAY_ID = "ans-loading-cover";
  const style = document.createElement("style");
  style.textContent = `
    #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483647;background:#fff;
      display:flex;align-items:center;justify-content:center;}
    #${OVERLAY_ID} .sp{width:38px;height:38px;border:3px solid #e0e0e0;
      border-top-color:#7a7a7a;border-radius:50%;animation:ans-spin 0.9s linear infinite;}
    @keyframes ans-spin{to{transform:rotate(360deg)}}
  `;
  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = '<div class="sp"></div>';

  const mount = (el) => (document.head || document.documentElement).appendChild(el);
  mount(style);
  (document.documentElement || document).appendChild(overlay);

  // Keep the cover on top even as the platform mutates the DOM.
  const keep = new MutationObserver(() => {
    if (!document.getElementById(OVERLAY_ID) && document.documentElement) {
      document.documentElement.appendChild(overlay);
    } else if (overlay.parentNode && overlay.nextSibling) {
      overlay.parentNode.appendChild(overlay); // re-assert as last child (top)
    }
  });
  keep.observe(document.documentElement || document, { childList: true, subtree: true });

  function render() {
    keep.disconnect();
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
