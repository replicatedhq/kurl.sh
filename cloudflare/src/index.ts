import * as url from "url";

if (typeof addEventListener === 'function') {
  addEventListener('fetch', (e: Event): void => {
    // work around as strict typescript check doesn't allow e to be of type FetchEvent
    const fe = e as FetchEvent
    fe.respondWith(proxyRequest(fe.request))
  });
}

async function proxyRequest(r: Request): Promise<Response> {
  try {
    const requestUrl = new URL(r.url);
    let userAgent = r.headers.get("user-agent");
    if (!userAgent) {
      userAgent = "";
    }

    if (isTerminalRequest(r.url, userAgent)) {
      return fetch(`__BACKEND__${requestUrl.pathname}`);
    } else {
      return fetch(`__FRONTEND__${requestUrl.pathname}`);
    }
  } catch (err) {
    // Return the error stack as the response
    return new Response(err.stack || err)
  }
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
