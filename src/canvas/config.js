// Identity of the OVV-1 course and the elements governed within it.
// Content scripts are not ES modules, so state is shared via a global.
var CanvasHide = globalThis.CanvasHide || (globalThis.CanvasHide = {});

CanvasHide.course = {
  // Primary match: the course id in the URL (/courses/<id>/...).
  id: "59331",
  // Fallbacks if the id changes (re-enrollment, new term). The code is unique;
  // the name is a looser secondary check.
  codeRe: /4011OVV10Y/i,
  nameRe: /voortplanting en veroudering\s*-\s*1/i,
};

CanvasHide.sel = {
  recentBlock: "#announcements_on_home_page",       // course home "Recente aankondigingen"
  navTab: "#aankondigingen-link",                   // left-nav Announcements link (stable id)
  todoLinks: ".todo-list a[href*='discussion_topics'], .Sidebar__TodoListContainer a[href*='discussion_topics']",
  todoContainer: ".todo-list, .Sidebar__TodoListContainer",
  annRow: ".ic-announcement-row",                   // a row on the Announcements index
  annRowLink: "a[href*='discussion_topics']",       // the row's link to the announcement
  content: "#content",
};

// Storage keys, namespaced per course so multiple courses never collide.
CanvasHide.keys = {
  allow: "cvh_allow_" + CanvasHide.course.id,       // ids currently in the To-do list
  annIds: "cvh_annids_" + CanvasHide.course.id,     // ids of all announcements in the course
};

// Extract a discussion-topic id from a URL or href.
CanvasHide.topicId = (s) =>
  (String(s || "").match(/discussion_topics\/(\d+)/) || [])[1] || null;
