// Refreshes the cached set of all announcement ids for the course, and looks up
// a single topic's announcement flag. Same-origin fetches send the Canvas
// session cookie automatically. Canvas may prefix JSON with an anti-JSON guard.
var CanvasHide = globalThis.CanvasHide || (globalThis.CanvasHide = {});

CanvasHide.api = (function () {
  const parse = (t) => JSON.parse(String(t).replace(/^while\(1\);\s*/, ""));

  async function json(url) {
    const r = await fetch(url, { headers: { Accept: "application/json" }, credentials: "same-origin" });
    if (!r.ok) throw new Error(r.status);
    return parse(await r.text());
  }

  return {
    // All announcement ids in the course, refreshed into storage.
    async refreshAnnouncementIds() {
      const id = CanvasHide.course.id;
      try {
        const list = await json(
          `/api/v1/courses/${id}/discussion_topics?only_announcements=true&per_page=100`
        );
        const ids = list.map((a) => String(a.id));
        await CanvasHide.store.set(CanvasHide.keys.annIds, ids);
        return ids;
      } catch (_) {
        return null;
      }
    },
    // Whether a single topic is an announcement (used when the cache is cold).
    async isAnnouncement(topicId) {
      const id = CanvasHide.course.id;
      try {
        const t = await json(`/api/v1/courses/${id}/discussion_topics/${topicId}`);
        return !!t.is_announcement;
      } catch (_) {
        return false;
      }
    },
  };
})();
