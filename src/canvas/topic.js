// A single discussion/announcement page (/courses/<id>/discussion_topics/<tid>).
// Content is held invisible by CSS (data-cvh-topic="pending", set before paint).
// We reveal it unless it is an announcement that is not in the allow-set, in
// which case it is blocked and never shown. Normal discussions always reveal.
var CanvasHide = globalThis.CanvasHide || (globalThis.CanvasHide = {});

CanvasHide.runTopic = function (tid) {
  const { keys, store, api, sel } = CanvasHide;
  const root = document.documentElement;

  const reveal = () => root.setAttribute("data-cvh-topic", "ok");

  const block = () => {
    root.setAttribute("data-cvh-topic", "blocked");
    const show = () => {
      const c = document.querySelector(sel.content);
      if (!c) return document.addEventListener("DOMContentLoaded", show, { once: true });
      c.style.visibility = "visible";
      c.innerHTML =
        '<div style="max-width:640px;margin:15vh auto;text-align:center;color:#6b7780;' +
        'font:16px system-ui,\'Segoe UI\',sans-serif">Deze aankondiging is niet beschikbaar.</div>';
    };
    show();
  };

  (async () => {
    const [allow, annIds] = await Promise.all([
      store.get(keys.allow),
      store.get(keys.annIds),
    ]);
    if (allow.includes(tid)) return reveal();

    // Not allowed: block only if it is actually an announcement.
    let isAnn = annIds.includes(tid);
    if (!isAnn && annIds.length === 0) isAnn = await api.isAnnouncement(tid);
    return isAnn ? block() : reveal();
  })();
};
