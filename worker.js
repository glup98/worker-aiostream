export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return new Response('Missing "url" query param', { status: 400 });
    }

    // Lista blanca
    const ALLOW = [
      "anime-kitsu.strem.fun",
      "torrentio.strem.fun"
    ];
    try {
      const t = new URL(target);
      if (!ALLOW.includes(t.host)) {
        return new Response("Domain not allowed", { status: 403 });
      }
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    const headers = new Headers(request.headers);
    headers.set("user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari");

    const init = { method: "GET", headers };

    const upstream = await fetch(target, init);

    const respHeaders = new Headers(upstream.headers);
    respHeaders.set("access-control-allow-origin", "*");
    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: respHeaders,
    });
  },
};
