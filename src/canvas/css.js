// Injects the hiding CSS at document_start, before the page paints, so nothing
// governed here ever flashes on screen. Reveal is done by adding marker classes,
// never by un-hiding after a visible delay.
var CanvasHide = globalThis.CanvasHide || (globalThis.CanvasHide = {});

CanvasHide.css = (function () {
  const s = CanvasHide.sel;
  // Always-on for the matched course: home block + left-nav tab.
  const base = `
    ${s.recentBlock} { display: none !important; }
    #section-tabs li:has(${s.navTab}) { display: none !important; }
  `;
  // Announcements index: hide every row; only rows we mark .cvh-show appear.
  const index = `
    ${s.annRow}:not(.cvh-show) { display: none !important; }
  `;
  // Announcement page: keep content invisible until we decide allow/block.
  // visibility (not display) preserves layout, so the reveal is seamless.
  const topic = `
    html[data-cvh-topic="pending"] ${s.content} { visibility: hidden !important; }
  `;
  // Discussions section: hidden while we redirect away from it.
  const leaving = `
    ${s.content} { visibility: hidden !important; }
  `;
  return { base, index, topic, leaving };
})();

CanvasHide.injectStyle = function (cssText) {
  const style = document.createElement("style");
  style.className = "cvh-style";
  style.textContent = cssText;
  (document.head || document.documentElement).appendChild(style);
};
