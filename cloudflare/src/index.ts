if (typeof addEventListener === 'function') {
  addEventListener('fetch', (e: Event): void => {
    // work around as strict typescript check doesn't allow e to be of type FetchEvent
    const fe = e as FetchEvent
    fe.respondWith(proxyRequest(fe.request))
  });
}

async function proxyRequest(r: Request): Promise<Response> {
  const url = new URL(r.url);

  if (!isTerminalRequest(r)) {
    return fetch(`https://kurlsh.netlify.com/${url.pathname}`);
  }

  return fetch(r);
}

function isTerminalRequest(r: Request): boolean {
  const isTermRe = new RegExp(`(?i)^(curl|wget)\/`);
  if (isTermRe.test(r.headers["user-agent"])) {
    return true;
  }
  
  const urlParams = new URLSearchParams(r.url);
  if (urlParams.has("type")) {
    if (urlParams.get("type") === "script") {
      return true;
    }
  }

  return false;
}

interface FetchEvent extends Event {
  request: Request;

  respondWith(r: Promise<Response> | Response): Promise<Response>;
}
