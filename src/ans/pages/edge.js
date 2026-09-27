// Edge "Hmmm... can't reach this page" (ERR_CONNECTION_TIMED_OUT).
var AnsOffline = globalThis.AnsOffline || (globalThis.AnsOffline = {});

AnsOffline.edgePage = function (host) {
  const css = `
    :root { --bg:#f7f7f7; --text:#1b1b1b; --muted:#505050; --btn:#0067b8; --btn-text:#fff; --icon:#767676; }
    @media (prefers-color-scheme: dark) {
      :root { --bg:#1f1f1f; --text:#fff; --muted:#c8c8c8; --btn:#4cc2ff; --btn-text:#000; --icon:#a0a0a0; }
    }
    html, body { margin:0; background:var(--bg); }
    body { font-family: "Segoe UI", system-ui, -apple-system, Helvetica, Arial, sans-serif; font-size:15px; color:var(--text); line-height:22px; }
    .wrap { box-sizing:border-box; max-width:620px; width:100%; margin:16vh auto 0; padding:0 24px; }
    .icon { width:64px; height:64px; margin-bottom:28px; color:var(--icon); }
    h1 { font-size:28px; font-weight:600; line-height:36px; margin:0 0 20px; }
    p { margin:0 0 12px; color:var(--muted); }
    ul { margin:0 0 16px; padding-left:22px; color:var(--muted); }
    a { color:var(--btn); text-decoration:none; }
    .code { font-size:13px; color:var(--muted); margin-top:18px; }
    .nav { margin-top:32px; }
    button { font:inherit; font-size:14px; font-weight:600; border:0; border-radius:4px; padding:7px 24px; cursor:pointer; background:var(--btn); color:var(--btn-text); }
  `;
  const icon = `
    <svg class="icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
      <path d="M12 8h26l14 14v34H12z"/><path d="M38 8v14h14"/>
      <circle cx="25" cy="36" r="1.5" fill="currentColor"/><circle cx="39" cy="36" r="1.5" fill="currentColor"/>
      <path d="M24 48c2-3 5-4.5 8-4.5s6 1.5 8 4.5"/>
    </svg>`;
  const body = `
    <div class="wrap">
      ${icon}
      <h1>Hmmm… can’t reach this page</h1>
      <p><strong>${host}</strong> took too long to respond</p>
      <p>Try:</p>
      <ul>
        <li>Checking the connection</li>
        <li><a href="#">Checking the proxy and the firewall</a></li>
      </ul>
      <div class="code">ERR_CONNECTION_TIMED_OUT</div>
      <div class="nav"><button data-action="reload">Refresh</button></div>
    </div>`;
  return { title: host, css, body };
};
