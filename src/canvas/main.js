// Entry point (runs last). Confirms the page belongs to the OVV-1 course, injects
// the pre-paint hiding CSS, then routes to the handler for the current page.
(function () {
  const H = globalThis.CanvasHide;
  const { course, css, injectStyle, topicId } = H;
  const path = location.pathname;

  const urlId = (path.match(/\/courses\/(\d+)/) || [])[1];
  if (!urlId) return;

  const isTopic = /\/courses\/\d+\/discussion_topics\/\d+/.test(path);
  const isIndex = /\/courses\/\d+\/announcements\/?$/.test(path);
  const tid = topicId(path);

  const apply = () => {
    // Base hiding (home block + nav tab) applies on every course page.
    let sheet = css.base + (isIndex ? css.index : "");
    if (isTopic && tid) {
      document.documentElement.setAttribute("data-cvh-topic", "pending");
      sheet += css.topic;
    }
    injectStyle(sheet);

    if (isTopic && tid) H.runTopic(tid);
    else if (isIndex) H.runIndex();
    else H.runHome();
  };

  // Fast path: known course id, act immediately with no DOM dependency.
  if (urlId === course.id) return apply();

  // Different id: confirm this really is OVV-1 by its unique code (or name)
  // before touching anything. Needs the body text, so wait for it.
  const confirm = () => {
    const t = document.body ? document.body.textContent : "";
    if (course.codeRe.test(t) || course.nameRe.test(t)) apply();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", confirm, { once: true });
  } else {
    confirm();
  }
})();
