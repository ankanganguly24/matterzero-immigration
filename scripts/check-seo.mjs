const base = process.env.SEO_CHECK_BASE_URL ?? "http://localhost:3000";
const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? base;
const slugs = [
  "organize-before-o1a-consultation",
  "document-requests-applicants-can-follow",
  "build-a-clear-employment-timeline",
];
const routes = [
  { path: "/", status: 200, schema: "FAQPage" },
  { path: "/resources", status: 200, schema: "BreadcrumbList" },
  ...slugs.map((slug) => ({ path: `/resources/${slug}`, status: 200, schema: "BreadcrumbList" })),
  { path: "/this-page-does-not-exist", status: 404 },
];
const failures = [];
const pages = new Map();

function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const route of routes) {
  const response = await fetch(new URL(route.path, base), { redirect: "manual" });
  const html = await response.text();
  pages.set(route.path, html);
  assert(
    response.status === route.status,
    `${route.path}: expected HTTP ${route.status}, received ${response.status}`,
  );
  assert(
    !response.headers.get("location"),
    `${route.path}: unexpected redirect; keep routes direct and avoid chains`,
  );
  assert(
    (html.match(/<h1(?:\s|>)/gi) ?? []).length === 1,
    `${route.path}: expected exactly one H1`,
  );
  assert(/<title>[^<]+<\/title>/i.test(html), `${route.path}: missing title`);
  assert(
    /<meta\s+name="description"\s+content="[^"]+"/i.test(html),
    `${route.path}: missing meta description`,
  );
  if (route.status === 200) {
    const canonicals = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/gi)].map(
      (match) => match[1],
    );
    assert(canonicals.length === 1, `${route.path}: expected exactly one canonical link`);
    assert(
      canonicals[0] ===
        `${canonicalOrigin.replace(/\/$/, "")}${route.path === "/" ? "" : route.path}`,
      `${route.path}: canonical URL does not match configured origin and route`,
    );
  }
  if (route.schema)
    assert(
      html.includes(`"@type":"${route.schema}"`),
      `${route.path}: missing ${route.schema} structured data`,
    );
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const image of imageTags)
    assert(/\balt="[^"]*"/i.test(image), `${route.path}: image missing alt attribute`);
}

const home = pages.get("/") ?? "";
const resourceIndex = pages.get("/resources") ?? "";
const loginResponse = await fetch(new URL("/login", base), { redirect: "manual" });
const loginHtml = await loginResponse.text();
assert(loginResponse.status === 200, "/login: expected HTTP 200");
assert(loginHtml.includes('type="email"'), "/login: missing email sign-in field");
assert(loginHtml.includes("Email me a sign-in link"), "/login: missing sign-in action");
assert(
  /<meta\s+name="robots"\s+content="[^\"]*noindex/i.test(loginHtml),
  "/login: expected noindex metadata",
);
for (const metadata of [
  '<meta property="og:image" content=',
  '<meta name="twitter:image" content=',
  '<link rel="icon" href="/icon"',
  '<link rel="apple-touch-icon" href="/apple-icon"',
])
  assert(home.includes(metadata), `Home page is missing ${metadata}`);
for (const asset of [
  { path: "/og.png", type: "image/png" },
  { path: "/icon", type: "image/png" },
  { path: "/apple-icon", type: "image/png" },
]) {
  const response = await fetch(new URL(asset.path, base), { redirect: "manual" });
  assert(response.status === 200, `${asset.path}: expected HTTP 200`);
  assert(
    response.headers.get("content-type")?.includes(asset.type),
    `${asset.path}: expected ${asset.type} content type`,
  );
}
assert(
  home.includes("Four clear steps from first conversation to human review"),
  "Home page is missing the How it works section",
);
for (const step of [
  "Open a matter",
  "Gather the story",
  "Complete the checklist",
  "Review and hand off",
])
  assert(home.includes(step), `How it works section is missing “${step}”`);
for (const slug of slugs) {
  assert(home.includes(`/resources/${slug}`), `Home page does not link to article ${slug}`);
  assert(
    resourceIndex.includes(`/resources/${slug}`),
    `Resource index does not link to article ${slug}`,
  );
}
for (const path of ["/sitemap.xml", "/robots.txt"]) {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  assert(response.status === 200, `${path}: expected HTTP 200`);
  assert(!response.headers.get("location"), `${path}: unexpected redirect`);
}
const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
assert(
  sitemap.includes(`${canonicalOrigin.replace(/\/$/, "")}/resources`),
  "Sitemap is missing the resources index",
);
for (const slug of slugs)
  assert(sitemap.includes(`/resources/${slug}`), `Sitemap is missing article ${slug}`);

if (failures.length) {
  console.error(
    `SEO smoke check failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`,
  );
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `SEO smoke check passed for ${routes.length} routes, metadata, brand assets, sitemap.xml, and robots.txt.`,
  );
}
