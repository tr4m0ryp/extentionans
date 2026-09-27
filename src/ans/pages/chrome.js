// Chrome "This site can't be reached" page (ERR_CONNECTION_TIMED_OUT).
var AnsOffline = globalThis.AnsOffline || (globalThis.AnsOffline = {});

AnsOffline.chromePage = function (host) {
  const css = `
    :root { --bg:#fff; --text:#5f6368; --title:#202124; --btn:#1a73e8; --btn-text:#fff; --icon:#5f6368; }
    @media (prefers-color-scheme: dark) {
      :root { --bg:#202124; --text:#9aa0a6; --title:#e8eaed; --btn:#8ab4f8; --btn-text:#202124; --icon:#9aa0a6; }
    }
    html, body { margin:0; background:var(--bg); }
    body { font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size:15px; color:var(--text); line-height:20px; }
    .wrap { box-sizing:border-box; max-width:600px; width:100%; margin:14vh auto 0; padding:0 24px; }
    .icon { width:72px; height:72px; margin-bottom:40px; color:var(--icon); }
    h1 { color:var(--title); font-size:1.6em; font-weight:normal; line-height:1.25em; margin:0 0 16px; }
    p { margin:0 0 12px; }
    ul { margin:0 0 16px; padding-left:40px; }
    li { margin-bottom:4px; }
    a { color:var(--btn); text-decoration:none; }
    .code { font-size:0.86em; text-transform:uppercase; margin-top:16px; }
    .nav { display:flex; justify-content:space-between; margin-top:52px; }
    button { font:inherit; font-size:14px; border-radius:4px; padding:8px 16px; cursor:pointer; }
    .details { background:transparent; border:1px solid #dadce0; color:var(--btn); }
    .reload { background:var(--btn); border:1px solid var(--btn); color:var(--btn-text); }
  `;
  const icon = `
    <svg class="icon" viewBox="0 0 72 72" fill="currentColor" aria-hidden="true">
      <path d="M44 6H14a4 4 0 0 0-4 4v52a4 4 0 0 0 4 4h44a4 4 0 0 0 4-4V24L44 6zm14 56H14V10h28v16h16v36z"/>
      <circle cx="28" cy="40" r="3"/><circle cx="44" cy="40" r="3"/>
      <path d="M26 54c2.5-4 6-6 10-6s7.5 2 10 6l-2.6 1.6C41.4 52.4 38.8 51 36 51s-5.4 1.4-7.4 4.6L26 54z"/>
    </svg>`;
  const body = `
    <div class="wrap">
      ${icon}
      <h1>This site can’t be reached</h1>
      <p><strong>${host}</strong> took too long to respond.</p>
      <p>Try:</p>
      <ul>
        <li>Checking the connection</li>
        <li><a href="#">Checking the proxy and the firewall</a></li>
      </ul>
      <div class="code">ERR_CONNECTION_TIMED_OUT</div>
      <div class="nav">
        <button class="details" data-action="details">Details</button>
        <button class="reload" data-action="reload">Reload</button>
      </div>
    </div>`;
  return { title: host, css, body };
};
