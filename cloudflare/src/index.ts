import * as url from "url";

if (typeof addEventListener === 'function') {
  addEventListener('fetch', (e: Event): void => {
    // work around as strict typescript check doesn't allow e to be of type FetchEvent
    const fe = e as FetchEvent
    fe.respondWith(proxyRequest(fe.request))
  });
}

async function proxyRequest(r: Request): Promise<Response> {
  const requestUrl = new URL(r.url);
  const userAgent = r.headers["user-agent"];

  if (!isTerminalRequest(r.url, userAgent)) {
    return fetch(`https://kurlsh.netlify.com/${requestUrl.pathname}`);
  }

  return fetch(r);
}

export function isTerminalRequest(requestUrl: string, userAgent: string): boolean {
  if (userAgent.includes("curl")) {
    return true;
  }

  if (userAgent.includes("wget")) {
    return true;
  }

  const parsed = url.parse(requestUrl, true);
  if (parsed.query["type"] === "script") {
    return true;
  }

  return false;
}

interface FetchEvent extends Event {
  request: Request;

  respondWith(r: Promise<Response> | Response): Promise<Response>;
}
