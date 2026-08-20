# strattonfieldliverystables.co.uk

Hand-coded static rebuild of the Stratton Field Livery Stables Webflow site.
Plain HTML + one shared CSS file + a little vanilla JS. No framework, no build
step, no dependencies — and no jQuery or Webflow runtime (the original shipped
about 230 KB of it).

## Structure

```
index.html          The whole site — it's a single page with anchor sections
css/style.css       Single shared stylesheet
js/main.js          Mobile menu, testimonial slider, photo lightbox
images/             Site images
scripts/            One-off maintenance script (see "Webflow CDN images")
```

Sections, in page order, keeping the original anchor IDs so any existing links
still work: `#friendliest` (about), `#horses-mouth` (testimonials),
`#gallery`, `#team`, `#pricing`, `#part-livery`, location, `#contact`.

## Deploying (Netlify)

No build step — the site is served straight from the repo root.

1. Sign in at [netlify.com](https://app.netlify.com) with GitHub.
2. **Add new site → Import an existing project** → pick this repo.
3. Leave **build command** empty and set **publish directory** to `.` (the
   repo root). Deploy.

Cloudflare Pages works the same way (build command: *none*, output
directory: `/`).

There is no form on this site — enquiries go to `strattonfieldstables@gmail.com`
via `mailto:` links, exactly as before — so nothing needs a form backend.

## Webflow CDN images

Heads-up, this one matters before you cancel Webflow.

The Webflow code export only localised *some* of the site's images. The rest are
still hot-linked to `cdn.prod.website-files.com`, and they will break when the
Webflow site is taken down. Still remote:

- both team photos (Amy, Toby)
- four of the five gallery photos, and all 17 "More photos" lightbox images
- the two pricing icons (straw bale, sack)
- the four part-livery photos (turning out, rugs, mucking out, feed)

To pull them local, run this once from a machine with internet access:

```
bash scripts/localise-images.sh
```

It downloads each one into `images/`, rewrites the references in `index.html`
and `js/main.js`, and reports what it did. Commit the result. After that the
site has no dependency on Webflow at all.

## Before going live

- **Run `scripts/localise-images.sh`** (above) — do this first.
- **DNS**: point `strattonfieldliverystables.co.uk` at the new host. Netlify
  walks you through it under **Domain management → Add a domain**. Retire the
  Webflow site only once the switch is verified *and* the images are local.

## Notes on the rebuild

Deliberate changes from the Webflow original, all small:

- **The map** was an Embedly wrapper around a Google Maps embed, with a Google
  Maps API key sitting in the page source. It is now a plain Google Maps embed,
  which needs no key and no third party.
- **The footer social icon** was a leftover from the Webflow template: a generic
  placeholder icon linking to `#`. It is dropped. Say the word if you want real
  social links there instead.
- **One duplicate photo** ("horse box") appeared twice in the "More photos"
  lightbox set; it now appears once.
- The **testimonial slider** wraps around with arrows and supports swipe and
  keyboard; the lightbox supports arrow keys and Escape. The original slider's
  autoplay was off, and it still is.
- Image filenames were tidied (`menage-20barn-20sq.jpg` → `menage-barn-sq.jpg`).

Everything else — copy, pricing, testimonials, layout, fonts, colours and the
1440 / 991 / 767 / 479 breakpoints — is carried over as-is.

## Local preview

```
python3 -m http.server 8000
```

then open http://localhost:8000. Note that until you run the localise script,
the CDN-hosted images above load from Webflow, so you need internet access to
see them.
