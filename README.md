# Mirage Spa — Esthetics & Spa Therapy Course (paid landing page)

Standalone one-page landing page for **paid traffic only** (Google Ads, Meta, etc.).
Separate folder, separate URL, separate deploy from the `miragespa-redesign` Flask
site. Nothing on miragespa.ca links to it.

The page uses the same chrome and section structure as `miragespa-lash-landing`.
Course copy, tuition, hours, modules, curriculum, and practical units come from
`/spa-therapy-and-esthetics/` on the main site.

## Must stay out of organic search

| Layer | Where | What it does |
|---|---|---|
| `noindex` meta tag | `index.html` `<head>` | Primary signal. Keeps the page out of the index. |
| `X-Robots-Tag` header | `_headers` / `vercel.json` / `.htaccess` | Same signal at HTTP level, covers assets too. |
| No sitemap, no inbound links | — | Nothing points at this URL, so nothing discovers it. |

**Deploy the header config that matches your host:**

- Netlify / Cloudflare Pages → `_headers` (automatic)
- Vercel → `vercel.json` (automatic)
- Apache / cPanel → `.htaccess` (automatic, needs `mod_headers`)
- Nginx → add to the server block:
  ```
  add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex";
  ```

Verify after deploy: `curl -I https://your-domain/` should show the `x-robots-tag` line.

### Why robots.txt does NOT say `Disallow: /`

Deliberate — do not "tighten" this:

1. **A blocked page can still be indexed.** `Disallow` stops crawling, not indexing.
   If anyone links to the URL, Google can list it with no description, and it cannot
   read the `noindex` tag to drop it because the crawl is blocked. Allowing the crawl
   is what makes `noindex` work.
2. **Google Ads must crawl the page.** `AdsBot-Google` checks landing pages; blocking
   it risks ad disapproval or a poor landing page score. The AdsBot agents are allowed
   explicitly.

### Do not

- Add this URL to `sitemap.xml` on the main site
- Link to it from miragespa.ca, the footer, or any nav
- Submit it in Google Search Console

## Structure

```
index.html              the landing page (site chrome + landing content)
robots.txt              crawler rules (see above)
_headers                Netlify / Cloudflare headers
vercel.json             Vercel headers
.htaccess               Apache headers
assets/                 mirrors the site's apps/static/ tree, so every relative
                        url() inside the copied CSS resolves unchanged
  plugins/css|js        bootstrap, animate.css, owl, swiper, magnific, nice-select,
                        icofont, uicons, jQuery, GSAP (+ScrollSmoother/Trigger/
                        SplitText), WOW, waypoints, counterup, backToTop, active.js
  section-css/          the site's full stylesheet set (style.css imports the rest)
  react/hero-bundle.js  same bundle the site loads
  fonts/                icofont + uicons webfonts
  images/               logo, favicon, hero, icons
  landing/
    landing.css         landing-only sections (hero, trust strip, learn grid, CTA)
    landing.js          CTA tracking hook + anchor scrolling
```

`landing.css` loads last and only adds the landing-specific sections. Header, footer,
buttons, course components, typography and colours all come from the site's CSS.

## Chrome: topbar + footer, no navigation

This is a one-page landing page, so the site's **nav header was removed** along with
everything that hung off it: the dropdown menu, the hamburger/offcanvas sidebar, the
course search widget, and the login/register modals (all dead markup once the nav is
gone). That removed ~44 KB from the page.

What remains is the site's own chrome:

- **Topbar** — the real `.ed-topbar` with the Mirage logo and contact details, made
  sticky and given a single `Enroll Now` CTA that scrolls to the pricing section.
- **Footer** — the site's full footer, unchanged, including its city dropdown.
- **Animations** — untouched and verified still working after the chrome removal:
  GSAP, WOW `fadeInUp` reveals, back-to-top progress ring, jQuery plugins.

## Colours follow the site palette

Brand palette only — tan, deep brown, cream. No navy panels or buttons.

| Element | Colour | Where the site uses it |
|---|---|---|
| Closing CTA band | `#8f6a4d` | `.theme-bg-2` on the partners / book-free / comparison CTA sections |
| Buttons on that band | `#c7976f` tan, white icon well, tan arrow | the site's default `.ed-btn`, same as the partners CTA |
| Secondary button | transparent, tan `#c7976f` border, brown `#8f6a4d` text | brand tones, outlined so it reads as secondary |
| Trust strip | `#f8f1ec` cream, hairline gold borders | the site's light sections |

`--ed-deep-brown: #8f6a4d` is declared once at the top of `landing.css`. The site
defines this colour inline as `.theme-bg-2` on each page that uses it rather than as a
token, so it is named here for consistency.

The only dark-blue element left on the page is the Zoho live-chat bubble, which is
third-party and appears identically on miragespa.ca.

## Local preview

```bash
python -m http.server 5056
```

Then open http://127.0.0.1:5056/ — static page, no build step.

## Where the CTAs go

Conversion elements carry `data-cta="<name>"`:

| `data-cta` | Location | Target |
|---|---|---|
| `topbar` | Sticky topbar button | scrolls to `#register` |
| `hero-primary` | Hero button | scrolls to `#register` |
| `info-box` | Course info box | scrolls to `#register` |
| `pricing-card` | Pricing card button | scrolls to `#register` |
| `footer-primary` | Closing CTA | scrolls to `#register` |
| `footer-call` | Closing CTA | `tel:18888292607` |

`assets/landing/landing.js` forwards these clicks to `gtag` / `fbq` when present. Add
the actual tag in `<head>`.

The **Register** section embeds the same Zoho **Contact Us** form used on
`miragespa.ca/register-now-2-2/`. It posts to Zoho (not the main site). After submit,
Zoho sends the visitor to this landing domain’s `thank-you.html`.

## Known follow-ups

- **Lead form is on-page.** Register CTAs stay on this landing page and submit to
  the same Zoho Contact Us form as the main site. After submit, visitors land on
  `thank-you.html` here — not miragespa.ca.
- **Page weight ≈ 4 MB uncompressed** (1.7 MB CSS, 980 KB JS, 1 MB hero image,
  300 KB icon font). That is what the live site loads too — the cost of exact parity.
  If ad performance matters more than parity, the wins are: keep the hero as WebP,
  and drop `icofont.css` / unused `uicons` weights (the page uses three icons).
- **The footer still carries 59 links** back to the main site. That is the site's real
  footer, kept as asked, but it is a lot of exits for a paid landing page. A slimmed
  footer (logo, contact, legal only) is a small change if you want it.
- **Content mirrors the live course page.** If tuition, kit contents or entry
  requirements change on miragespa.ca, update them here too.
- **Rebuilding.** `index.html` is now the source of truth — edit it directly. It was
  generated from the live render, so re-generating would discard hand edits.
