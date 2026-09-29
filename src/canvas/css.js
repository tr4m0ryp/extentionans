// Injects the hiding CSS at document_start, before the page paints, so nothing
// governed here ever flashes on screen. Reveal is done by adding marker classes,
// never by un-hiding after a visible delay.
var CanvasHide = globalThis.CanvasHide || (globalThis.CanvasHide = {});

CanvasHide.css = (function () {
  const s = CanvasHide.sel;
  const inCourse = `a[href*='/courses/${CanvasHide.course.id}/']`;
  // One rule per selector: an unsupported selector then drops only its own rule.
  const hide = (...list) => list.map((x) => `${x} { display: none !important; }`).join("\n");

  // Every Canvas page (dashboard included): this course's Discussions entries.
  const global = hide(
    `${s.discCard}${inCourse.slice(1)}`,
    `${s.discTodo}:has(${inCourse})`
  );
  // Always-on for the matched course: home block, Announcements and Discussions
  // tabs, and every link or row that leads into the Discussions section.
  const base = `
    ${s.recentBlock} { display: none !important; }
    #section-tabs li:has(${s.navTab}) { display: none !important; }
  ` + hide(
    s.discNav,
    `:is(${s.discIndexLink})`,
    // A wiki table row that exists only to point at the forum (no nested table).
    `tr:has(> td :is(${s.discIndexLink})):not(:has(table))`,
    s.discModuleItem,
    s.discAssignment,
    s.discTodo,
    ".cvh-hide"
  );
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
  return { global, base, index, topic, leaving };
})();

CanvasHide.injectStyle = function (cssText) {
  const style = document.createElement("style");
  style.className = "cvh-style";
  style.textContent = cssText;
  (document.head || document.documentElement).appendChild(style);
};
