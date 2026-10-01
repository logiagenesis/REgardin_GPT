const retired =
  /^\/(?:portfolios(?:_category)?|category|tag|author|tf_header_footer|feed|comments\/feed|blog)(?:\/|$)|^\/(?:why-do-i-need-to-use-financial|why-your-sales-forecast-is-off|6-tips-to-retain-your-top-sales-talent|what-the-martian-can-teach-sales)\/?$/;
export async function onRequest(context) {
  if (retired.test(new URL(context.request.url).pathname)) {
    return new Response(
      '<!DOCTYPE html><html lang="en-ZA"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page retired | Regardin Construction</title></head><body><main><h1>This page has been retired.</h1><p>The previous website included unrelated demonstration content. It has not been carried into the new site.</p><a href="/services/">Explore Regardin services</a></main></body></html>',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      },
    );
  }
  return context.next();
}
