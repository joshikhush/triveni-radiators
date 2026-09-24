/* ==========================================================
   GALLERY DATA — the single source of truth for gallery.html.
   Everything the page renders (the photo grid and the lightbox) is built
   from the array below. Nothing about layout, filtering or the lightbox
   needs to change when photos are added — just edit this file.

   HOW TO ADD A NEW PHOTO
   -----------------------------------------------------------
   1. Drop the image file into assets/gallery/ (any reasonable web size,
      ideally already compressed — this file doesn't resize anything).
      Real installation photos only — never a stock photo.
   2. Copy an existing entry below as a template and fill in every field.
      Replace all [bracketed] placeholder text with the real value.
   3. Set "image" to the path you used in step 1, e.g.
      'assets/gallery/up-1.jpg'. Leave it as an empty string ('') if the
      photo isn't ready yet — the page automatically renders a styled
      navy placeholder tile (with the caption still shown) instead of a
      broken image, so it's always safe to add the text fields before
      the photo itself arrives.
   4. "region" must be exactly "india" or "international" — the filter
      chips and the country pill on each tile depend on this exact value.
   5. "orientation" is "landscape" or "portrait" — it controls how tall the
      tile is in the masonry grid. Match it to the real photo's shape once
      one is added.
   -----------------------------------------------------------
   Every text field on this page right now is a [bracketed] placeholder —
   none of the customer names, ratings, locations or credit lines are real,
   EXCEPT the TBEA · Turkmenistan entry, which uses figures verified against
   the client's "TBEA Turkmenistan – Radiator Supply" sheet (2026-09-24).
   Replace the remaining placeholders with verified data before this page
   goes live. */

var GALLERY_INSTALLATIONS = [
  { id: 'uttar-pradesh-1', image: '', title: '[Site Title]', location: '[City, Uttar Pradesh]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'landscape' },

  { id: 'gujarat-1', image: '', title: '[Site Title]', location: '[City, Gujarat]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'portrait' },

  { id: 'maharashtra-1', image: '', title: '[Site Title]', location: '[City, Maharashtra]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'landscape' },

  { id: 'rajasthan-1', image: '', title: '[Site Title]', location: '[City, Rajasthan]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'portrait' },

  { id: 'tamil-nadu-1', image: '', title: '[Site Title]', location: '[City, Tamil Nadu]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'landscape' },

  { id: 'madhya-pradesh-1', image: '', title: '[Site Title]', location: '[City, Madhya Pradesh]', country: 'India', region: 'india',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'portrait' },

  /* Verified from client sheet "TBEA Turkmenistan – Radiator Supply" (2026-09-24):
     532 radiators across 25 transformer jobs — see clientele.html's Project Proof
     section for the full breakdown. City-level location and photo credit are
     still unconfirmed. */
  { id: 'turkmenistan-tbea', image: '', title: '532 radiators for TBEA', location: '[City, Turkmenistan]', country: 'Turkmenistan', region: 'international',
    customer: 'TBEA', rating: '167 & 125 MVA', credit: '[Customer name]', orientation: 'landscape' },

  { id: 'tanzania-1', image: '', title: '[Site Title]', location: '[City, Tanzania]', country: 'Tanzania', region: 'international',
    customer: '[Customer name]', rating: '[XX kV, XXX MVA]', credit: '[Customer name]', orientation: 'portrait' }
];
