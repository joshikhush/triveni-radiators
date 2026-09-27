/* =====================================================================
   clients-data.js — SINGLE SOURCE OF TRUTH for every export & supply
   figure shown on clientele.html (the world map, the Global Reach stat
   rail, the Project Proof "Supply record" and "Spotlight", and the
   featured-project scopes).

   Every consumer reads from window.CLIENTS_DATA and computes its own
   totals — no radiator count is hardcoded anywhere else on the page.

   Figures are verbatim from the client's answers (2026-09-27). Rule from
   the client: do not invent any figure; use only the numbers written in
   those answers (the smaller documented country supplies below —
   Bangladesh/Bhutan/Nepal/Niger/Malaysia — are retained from the earlier
   documented export-jobs list so the "10+ countries supplied" claim holds;
   the client's answers updated the larger destinations and added Bulgaria).

   DIRECT vs INDIRECT (client, 2026-09-27):
     - The ONLY direct export is AYR, USA: 154 radiators (mode: 'direct').
     - Everything else is an INDIRECT export — radiators supplied to Indian
       customers for THEIR export jobs (mode: 'indirect'). indianCustomer
       names the Indian customer who chose Triveni for that export job.

   HIDDEN-FIELD RULE (client points 6-8): a field the client hasn't given
   is left out entirely (null / omitted) — never shown as "—" or blank-labelled.

   PENDING (surfaced to the client, not published) — only two remain:
     - Toshiba start year — client confirms separately (see clientele.html).
     - ArcelorMittal destination country — the TBEA international-sites
       certificate (p.3) names the end customer but gives no country, so
       ArcelorMittal is counted in totals but NOT placed on the map (mapped:false).
   Client keeps website spec detail intentionally minimal — do not chase
   rating/application/operating-range fields; show only what is given.
   FINAL (client, 2026-09-27): Moldova, Oman and USA are complete — quantities,
   years and customers all given (Moldova via Siemens, 330 kV; Oman via Wilson;
   USA direct for AYR Energy). Bulgaria via Siemens with full specs. "Wilson" =
   Wilson Power Solutions (the Oman customer).
   ===================================================================== */
(function () {
  'use strict';

  /* Map coordinates + continent for each destination country. A supply is
     only plotted on the world map when its country appears here. */
  var COUNTRY_META = {
    'USA':          { lat: 39.8, lon: -98.6, continent: 'North America' },
    'Moldova':      { lat: 47.0, lon: 28.4,  continent: 'Europe' },
    'Bulgaria':     { lat: 42.7, lon: 25.5,  continent: 'Europe' },
    'Oman':         { lat: 21.5, lon: 56.0,  continent: 'Asia' },
    'Turkmenistan': { lat: 38.9, lon: 59.6,  continent: 'Asia' },
    'Tanzania':     { lat: -6.4, lon: 34.9,  continent: 'Africa' },
    'Bangladesh':   { lat: 23.7, lon: 90.4,  continent: 'Asia' },
    'Bhutan':       { lat: 27.5, lon: 90.4,  continent: 'Asia' },
    'Nepal':        { lat: 28.4, lon: 84.1,  continent: 'Asia' },
    'Niger':        { lat: 17.6, lon: 8.1,   continent: 'Africa' },
    'Malaysia':     { lat: 4.2,  lon: 101.9, continent: 'Asia' }
  };

  /* Atomic export supplies. `years:[start,end]` drives the supply-window
     computation. Only fields the client has given are present; anything
     absent (rating, voltage, endCustomer, jobs …) is intentionally omitted. */
  var SUPPLIES = [
    /* ---- USA — indirect, supplied via Indian customers for USA end customers ---- */
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India',
      endCustomer: 'Toshiba Transmission & Distribution Systems India Pvt Ltd',
      period: 'FY 2024-25', window: 'Nov 2024 – Mar 2025', note: '1600×520×12',
      qty: 15, years: [2024, 2025] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India',
      period: 'FY 2025-26', note: '744 × 1600×520×12 + 37 × 1600×520×17',
      qty: 781, years: [2025, 2026] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India',
      period: 'FY 2026-27', window: 'to 21 Sep 2026', note: '1600×520×12',
      qty: 1020, years: [2026, 2027] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'AYR Energy India',
      endCustomer: 'AYR Energy India Pvt Ltd',
      period: 'FY 2025-26', window: 'Jul 2025 – Feb 2026',
      qty: 301, years: [2025, 2026] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'AYR Energy India',
      period: 'FY 2026-27', window: 'to 21 Sep 2026',
      qty: 222, years: [2026, 2027] },
    /* ---- USA — the single DIRECT export ---- */
    { country: 'USA', mode: 'direct', endCustomer: 'AYR, USA',
      period: '2025-26', qty: 154, years: [2025, 2026] },

    /* ---- Moldova (indirect, via Siemens) — client 2026-09-27: done for
       Siemens India; voltage 330 kV. Client keeps website spec detail minimal. ---- */
    { country: 'Moldova', mode: 'indirect', indianCustomer: 'Siemens', period: 'June 2023', jobs: 'I320/1–4',
      voltage: '330 kV',
      qty: 88, years: [2023, 2023], spotlight: 'moldova' },

    /* ---- Bulgaria (indirect, via Siemens) — client 2026-09-27 ---- */
    { country: 'Bulgaria', mode: 'indirect', indianCustomer: 'Siemens', period: 'December 2023', jobs: 'I348/1,2',
      application: 'Power Transformer', rating: '160/80/80 MVA', voltage: '420/33/33 kV',
      qty: 33, years: [2023, 2023], spotlight: 'bulgaria' },

    /* ---- Oman (indirect, via Wilson) — client 2026-09-27; "Wilson" beside the
       Oman supply in the source doc = Wilson Power Solutions, the Indian customer ---- */
    { country: 'Oman', mode: 'indirect', indianCustomer: 'Wilson', period: 'June 2026', jobs: '2052/1–12',
      application: 'Inverter Transformer', rating: '17.6 MVA', voltage: '33/4x0.69 kV',
      qty: 144, years: [2026, 2026], spotlight: 'oman' },

    /* ---- Turkmenistan (indirect, via TBEA) — 532 across 25 transformer jobs ---- */
    { country: 'Turkmenistan', mode: 'indirect', indianCustomer: 'TBEA',
      period: '2021-23', rating: '167 MVA', note: '17 jobs × 20 · 2800×28×520×1',
      qty: 340, years: [2021, 2023], spotlight: 'turkmenistan' },
    { country: 'Turkmenistan', mode: 'indirect', indianCustomer: 'TBEA',
      period: '2021-23', rating: '125 MVA', note: '8 jobs × 24 · 2800×28×520×1',
      qty: 192, years: [2021, 2023] },

    /* ---- Tanzania (indirect, via TBEA) — three jobs, kept exactly as listed ---- */
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA',
      period: '2022-23', ref: 'TI4215', rating: '250 MVA', qty: 36, years: [2022, 2023] },
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA',
      period: '2022-23', ref: 'TI4217', rating: '250 MVA', qty: 80, years: [2022, 2023] },
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA',
      period: '2022-23', ref: 'TI4228', rating: '50 MVA', qty: 33, years: [2022, 2023] },

    /* ---- ArcelorMittal (indirect, via TBEA) — destination country PENDING, so not mapped.
       Source: assets/docs/performance certificates/performance certificate TBEA international
       sites.pdf, p.3 — 26 HDG radiators supplied to TBEA Energy (India), end customer
       "Arcelor Mittal", job T14245/1, 3200×32×520, 165 MVA, 220/33 kV, 2023-24. That page
       (unlike the Turkmenistan/Tanzania pages) has NO "End Customer Country" column, so the
       destination country is genuinely absent from the document. ---- */
    { country: null, region: 'ArcelorMittal', mapped: false, mode: 'indirect', indianCustomer: 'TBEA',
      period: '2023-24', ref: 'T14245/1', rating: '165 MVA', voltage: '220/33 kV', note: 'HDG radiators 3200×32×520',
      qty: 26, years: [2023, 2024] },

    /* ---- Retained documented country supplies (indirect, via Indian OEMs) ---- */
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Prolec GE', period: '2016-17', qty: 36, years: [2016, 2017] },
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Prolec GE', period: '2016-17', qty: 8,  years: [2016, 2017] },
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Siemens',    period: '2017-18', qty: 48, years: [2017, 2018] },
    { country: 'Bhutan',     mode: 'indirect', indianCustomer: 'GE T&D',     period: '2021-22', qty: 36, years: [2021, 2022] },
    { country: 'Bhutan',     mode: 'indirect', indianCustomer: 'Hitachi',    period: '2022-23', qty: 48, years: [2022, 2023] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       period: '2020-21', qty: 24, years: [2020, 2021] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       period: '2020-21', qty: 32, years: [2020, 2021] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       period: '2022-23', qty: 6,  years: [2022, 2023] },
    { country: 'Niger',      mode: 'indirect', indianCustomer: 'TBEA',       period: '2020-21', qty: 30, years: [2020, 2021] },
    { country: 'Malaysia',   mode: 'indirect', indianCustomer: 'Prolec-GE',  period: '2015-16', qty: 8,  years: [2015, 2016] }
  ];

  /* Spotlight cards (client points 7, 8 + Turkmenistan). Only fields the
     client has confirmed appear; the render omits the rest. qty is derived
     from SUPPLIES so it can never drift from the map/record. */
  var SPOTLIGHTS = {
    turkmenistan: {
      title: 'TBEA · Turkmenistan',
      indianCustomer: 'TBEA',
      endCustomer: 'Turkmenistan',
      application: 'Power Transmission',
      rating: '167 MVA & 125 MVA',
      voltage: '500/220/35, 500/220/10 & 220/110/10 kV',
      range: '-33°C to 110°C',
      jobs: 25,
      line: '17 × 167 MVA transformers and 8 × 125 MVA transformers — 532 radiators supplied through TBEA across 25 transformer jobs in Turkmenistan.'
    },
    moldova: {
      /* client 2026-09-27: done for Siemens India; voltage 330 kV. Client keeps
         website spec detail minimal — no rating/application/operating range. */
      title: 'Siemens · Moldova',
      indianCustomer: 'Siemens',
      voltage: '330 kV',
      dispatched: 'June 2023',
      jobs: 'I320/1–4',
      line: 'Supplied through Siemens for their Moldova export job — 330 kV, dispatched June 2023 (jobs I320/1–4).'
    },
    bulgaria: {
      /* client 2026-09-27: via Siemens; 160/80/80 MVA, 420/33/33 kV power transformer. */
      title: 'Siemens · Bulgaria',
      indianCustomer: 'Siemens',
      application: 'Power Transformer',
      rating: '160/80/80 MVA',
      voltage: '420/33/33 kV',
      dispatched: 'December 2023',
      jobs: 'I348/1,2',
      line: 'Supplied through Siemens for their Bulgaria export job — 160/80/80 MVA, 420/33/33 kV power transformers, dispatched December 2023 (jobs I348/1,2).'
    },
    oman: {
      /* client 2026-09-27: via Wilson; 17.6 MVA, 33/4x0.69 kV inverter transformer. */
      title: 'Wilson · Oman',
      indianCustomer: 'Wilson',
      application: 'Inverter Transformer',
      rating: '17.6 MVA',
      voltage: '33/4x0.69 kV',
      dispatched: 'June 2026',
      jobs: '2052/1–12',
      line: 'Supplied through Wilson for their Oman export job — 17.6 MVA, 33/4x0.69 kV inverter transformers, dispatched June 2026 (jobs 2052/1–12).'
    }
  };

  window.CLIENTS_DATA = {
    COUNTRY_META: COUNTRY_META,
    SUPPLIES: SUPPLIES,
    SPOTLIGHTS: SPOTLIGHTS
  };
})();
