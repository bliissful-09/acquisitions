export const isCurlRequest = (req) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  return userAgent.includes('curl');
};

export const isBrowserRequest = (req) => {
  if (isCurlRequest(req)) {
    return false;
  }

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const acceptHeader = (req.headers.accept || '').toLowerCase();

  const looksLikeBrowser = /mozilla|chrome|safari|firefox|edge|opera|webkit/.test(userAgent);
  const acceptsHtml = acceptHeader.includes('text/html') || acceptHeader.includes('application/xhtml+xml');

  return looksLikeBrowser && acceptsHtml;
};

export const getRequestSource = (req) => {
  if (isCurlRequest(req)) return 'curl';
  if (isBrowserRequest(req)) return 'browser';
  return 'other';
};

export const getClientIp = (req) => {
  const forwardedFor = (req.headers['x-forwarded-for'] || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)[0];

  if (forwardedFor) {
    return forwardedFor.replace(/^::ffff:/, '');
  }

  const socketIp = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '';
  if (socketIp) {
    return socketIp.replace(/^::ffff:/, '');
  }

  const ip = req.ip || 'unknown';
  return ip.replace(/^::ffff:/, '');
};

export const browserHtmlPage = (clientIp) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Acquisitions API</title>
    <style>
      :root {
        --bg: #0f172a;
        --panel: rgba(15, 23, 42, 0.8);
        --card: #111827;
        --primary: #8b5cf6;
        --secondary: #22c55e;
        --text: #e2e8f0;
        --muted: #94a3b8;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Arial, Helvetica, sans-serif;
        background: linear-gradient(135deg, #020617, #111827 40%, #1e293b);
        color: var(--text);
      }

      .card {
        width: min(640px, 90vw);
        background: rgba(17, 24, 39, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        padding: 32px;
        backdrop-filter: blur(10px);
      }

      .badge {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(139, 92, 246, 0.15);
        color: #c4b5fd;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 20px 0 12px;
        font-size: clamp(2rem, 4vw, 3rem);
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .ip-box {
        margin-top: 18px;
        display: inline-block;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(34, 197, 94, 0.12);
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: #dcfce7;
        font-weight: 700;
      }

      .status {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #bbf7d0;
        font-weight: 700;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--secondary);
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="badge">Browser detected</div>
      <h1>Acquisitions API</h1>
      <p>This request came from a browser, so the server returned a sleek HTML page instead of JSON.</p>
      <div class="ip-box"><strong>Your IP:</strong> ${clientIp}</div>
      <div class="status">
        <span class="dot"></span>
        <span>Connected successfully</span>
      </div>
    </main>
  </body>
</html>`;
