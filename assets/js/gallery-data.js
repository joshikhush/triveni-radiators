/* ==========================================================
   GALLERY DATA — the single source of truth for gallery.html.
   Everything the page renders (the photo grid and the lightbox) is built
   from the array below. Nothing about layout, filtering or the lightbox
   needs to change when photos are added — just edit this file.

   HOW TO ADD A NEW PHOTO
   -----------------------------------------------------------
   1. Drop the ORIGINAL image file into assets/installations/ (or wherever
      your working originals live) and keep it there untouched.
   2. Create two resized copies in assets/gallery/, both stripped of EXIF/
      GPS metadata and orientation-corrected:
        - "<id>-web.jpg"   — longest side max 2000px, JPEG quality ~80.
          Used by the lightbox (full-size view).
        - "<id>-thumb.jpg" — longest side ~800px, JPEG quality ~80.
          Used by the grid tile. Falls back to "image" if "thumb" is
          left blank, so this step is optional but keeps the grid light.
   3. Copy an existing entry below as a template and fill in every field.
   4. "region" must be exactly "india" or "international" — or left as
      null if not verified (see below). The filter chips and country pill
      depend on this exact value; null tiles show under "All" only and
      carry no region pill.
   5. "orientation" is "landscape" or "portrait", taken from the REAL
      image's own dimensions — it controls tile height in the masonry grid.

   SOURCING RULE — every field (title, location, country, region, customer,
   rating, credit) may ONLY be filled from: (a) a filename/folder name that
   clearly names the customer/site/country, (b) text legible in the photo
   itself (a nameplate, signage, etc.), or (c) a document in /sources. If a
   field isn't verifiable from one of those, leave it null — never a
   [bracketed] guess. Tiles with no verified site-specific title use the
   neutral title "Triveni radiators in service" instead of inventing one;
   "credit" mirrors "customer" once customer is verified (the photographed
   equipment is credited to the customer it belongs to), since no separate
   photo-credit documentation exists in this project. Empty fields simply
   don't render anywhere (no dash, no "TBC", no pending label) — see
   gallery.html's rendering code, which hides empty lightbox rows and pills.

   CURRENT STATE (2026-09-26) — 10 real installation photos, sourced from
   assets/installations/ (see the session's own written report for the full
   file-by-file table, exclusions and client checklist). The six India-
   state placeholders and the Turkmenistan placeholder that used to sit
   here were removed: none of the new photos could be verifiably assigned
   to a specific Indian state, Turkmenistan has no real photo yet, and the
   brief for this pass was explicit that no [bracketed] placeholder text
   may appear on the live page. Re-add a state or Turkmenistan entry here
   (title "Triveni radiators in service", image: '') once a real photo or a
   verified location arrives — the placeholder tile renders automatically
   whenever "image" is empty. */

var GALLERY_INSTALLATIONS = [
  /* TBEA · Tanzania — 3 of 7 available photos used (see report for the
     other 4, excluded as redundant — same substation/weather, no added
     information). Source for customer/country: filename ("TBEA Tanzania"
     / "Tanzania TBEA"), corroborated by a legible "TBEA" nameplate in the
     photo itself on all three used here. region "international" follows
     directly from the verified country (Tanzania). No specific project
     name, city, rating or date is verifiable, so title stays neutral and
     those fields are left null. */
  { id: 'tanzania-tbea-1', image: 'assets/gallery/tanzania-tbea-1-web.jpg', thumb: 'assets/gallery/tanzania-tbea-1-thumb.jpg',
    alt: 'Transformer with radiator banks and a TBEA nameplate at an outdoor substation',
    title: 'Triveni radiators in service', location: null, country: 'Tanzania', region: 'international',
    customer: 'TBEA', rating: null, credit: 'TBEA', orientation: 'landscape' },

  { id: 'tanzania-tbea-2', image: 'assets/gallery/tanzania-tbea-2-web.jpg', thumb: 'assets/gallery/tanzania-tbea-2-thumb.jpg',
    alt: 'Transformer with radiator banks and a TBEA nameplate under a dramatic cloudy sky',
    title: 'Triveni radiators in service', location: null, country: 'Tanzania', region: 'international',
    customer: 'TBEA', rating: null, credit: 'TBEA', orientation: 'landscape' },

  { id: 'tanzania-tbea-3', image: 'assets/gallery/tanzania-tbea-3-web.jpg', thumb: 'assets/gallery/tanzania-tbea-3-thumb.jpg',
    alt: 'Transformer with radiator banks and a TBEA nameplate at an outdoor substation',
    title: 'Triveni radiators in service', location: null, country: 'Tanzania', region: 'international',
    customer: 'TBEA', rating: null, credit: 'TBEA', orientation: 'landscape' },

  /* AYR Energy — customer confirmed from a legible "AYR ENERGY" nameplate
     on the transformer tank. No site, city or country verifiable. */
  { id: 'ayr-1', image: 'assets/gallery/ayr-1-web.jpg', thumb: 'assets/gallery/ayr-1-thumb.jpg',
    alt: 'Transformer with radiator banks and an AYR Energy nameplate in a factory test bay',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'AYR Energy', rating: null, credit: 'AYR Energy', orientation: 'portrait' },

  /* Siemens Energy — site 1's customer is confirmed from a legible
     "SIEMENS energy" nameplate; site 2 has no legible nameplate text in
     frame, so its customer comes from the filename only ("siemens-site-2")
     — still a valid source per the rule above, just weaker than site 1's.
     No city/country verifiable for either. */
  { id: 'siemens-site-1', image: 'assets/gallery/siemens-site-1-web.jpg', thumb: 'assets/gallery/siemens-site-1-thumb.jpg',
    alt: 'Transformer with radiator banks and a Siemens Energy nameplate at an outdoor substation',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'Siemens Energy', rating: null, credit: 'Siemens Energy', orientation: 'portrait' },

  { id: 'siemens-site-2', image: 'assets/gallery/siemens-site-2-web.jpg', thumb: 'assets/gallery/siemens-site-2-thumb.jpg',
    alt: 'Transformer with radiator banks at an outdoor substation, under scaffolding',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'Siemens Energy', rating: null, credit: 'Siemens Energy', orientation: 'portrait' },

  /* GE — ge-site-1's customer is confirmed from a legible "GE" roundel
     nameplate; ge-site-2 and ge-site-4 (same construction site, wider and
     tighter crops) have no legible nameplate in frame, so their customer
     comes from the filename only. No city/country verifiable for any. */
  { id: 'ge-site-1', image: 'assets/gallery/ge-site-1-web.jpg', thumb: 'assets/gallery/ge-site-1-thumb.jpg',
    alt: 'Transformer with radiator banks and a GE nameplate at an outdoor substation',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'GE', rating: null, credit: 'GE', orientation: 'landscape' },

  { id: 'ge-site-4', image: 'assets/gallery/ge-site-4-web.jpg', thumb: 'assets/gallery/ge-site-4-thumb.jpg',
    alt: 'Two transformers with radiator banks at an outdoor substation under construction',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'GE', rating: null, credit: 'GE', orientation: 'landscape' },

  { id: 'ge-site-2', image: 'assets/gallery/ge-site-2-web.jpg', thumb: 'assets/gallery/ge-site-2-thumb.jpg',
    alt: 'Transformer radiator bank at an outdoor substation under construction',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'GE', rating: null, credit: 'GE', orientation: 'landscape' },

  /* Toshiba — customer from filename only ("Toshiba.HEIC"); no legible
     nameplate text in frame, no city/country verifiable. Used in place of
     the near-duplicate "toshiba-site.jpg" (same shot, lower resolution) —
     this HEIC original gave a sharper -web.jpg. */
  { id: 'toshiba-1', image: 'assets/gallery/toshiba-1-web.jpg', thumb: 'assets/gallery/toshiba-1-thumb.jpg',
    alt: 'Transformer radiator bank in a factory yard',
    title: 'Triveni radiators in service', location: null, country: null, region: null,
    customer: 'Toshiba', rating: null, credit: 'Toshiba', orientation: 'landscape' }
];
