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

   PENDING (surfaced to the client, not published) — only one remains:
     - Toshiba start year — client confirms separately (see clientele.html).
   ArcelorMittal (client, 2026-09-28): moved to a Spotlight showcase as Triveni's
   single HDG job; removed from the supply record AND the export total (HDG was
   discontinued — outsourced, supply-chain constraints).
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
     computation. `type` is the radiator's transformer type shown in the
     International Supply Record (client mapping, 2026-09-28), using the
     products-page categories — Power Transformer, Medium Power Transformer,
     Inverter Duty Transformer (was "Renewable Energy"). Sizes and job numbers
     (`note`, `ref`, `jobs`) are held for reference but are NOT shown in the
     supply list or on the map (client, 2026-09-28). */
  var SUPPLIES = [
    /* ---- USA — indirect, supplied via Indian customers for USA end customers ---- */
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India', type: 'Inverter Duty Transformer',
      endCustomer: 'Toshiba Transmission & Distribution Systems India Pvt Ltd',
      period: 'FY 2024-25', window: 'Nov 2024 – Mar 2025', note: '1600×520×12',
      qty: 15, years: [2024, 2025] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India', type: 'Inverter Duty Transformer',
      period: 'FY 2025-26', note: '744 × 1600×520×12 + 37 × 1600×520×17',
      qty: 781, years: [2025, 2026] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'Toshiba T&D India', type: 'Inverter Duty Transformer',
      period: 'FY 2026-27', window: 'to 21 Sep 2026', note: '1600×520×12',
      qty: 1020, years: [2026, 2027] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'AYR Energy India', type: 'Medium Power Transformer',
      endCustomer: 'AYR Energy India Pvt Ltd',
      period: 'FY 2025-26', window: 'Jul 2025 – Feb 2026',
      qty: 301, years: [2025, 2026] },
    { country: 'USA', mode: 'indirect', indianCustomer: 'AYR Energy India', type: 'Medium Power Transformer',
      period: 'FY 2026-27', window: 'to 21 Sep 2026',
      qty: 222, years: [2026, 2027] },
    /* ---- USA — the single DIRECT export ---- */
    { country: 'USA', mode: 'direct', endCustomer: 'AYR, USA', type: 'Medium Power Transformer',
      period: '2025-26', qty: 154, years: [2025, 2026] },

    /* ---- Moldova (indirect, via Siemens) — client 2026-09-27: done for
       Siemens India; voltage 330 kV. Client keeps website spec detail minimal. ---- */
    { country: 'Moldova', mode: 'indirect', indianCustomer: 'Siemens', type: 'Power Transformer', period: 'June 2023', jobs: 'I320/1–4',
      voltage: '330 kV',
      qty: 88, years: [2023, 2023], spotlight: 'moldova' },

    /* ---- Bulgaria (indirect, via Siemens) — client 2026-09-27 ---- */
    { country: 'Bulgaria', mode: 'indirect', indianCustomer: 'Siemens', type: 'Power Transformer', period: 'December 2023', jobs: 'I348/1,2',
      application: 'Power Transformer', rating: '160/80/80 MVA', voltage: '420/33/33 kV',
      qty: 33, years: [2023, 2023], spotlight: 'bulgaria' },

    /* ---- Oman (indirect, via Wilson) — client 2026-09-27; "Wilson" beside the
       Oman supply in the source doc = Wilson Power Solutions, the Indian customer ---- */
    { country: 'Oman', mode: 'indirect', indianCustomer: 'Wilson', type: 'Inverter Duty Transformer', period: 'June 2026', jobs: '2052/1–12',
      application: 'Inverter Transformer', rating: '17.6 MVA', voltage: '33/4x0.69 kV',
      qty: 144, years: [2026, 2026], spotlight: 'oman' },

    /* ---- Turkmenistan (indirect, via TBEA) — 532 across 25 transformer jobs ---- */
    { country: 'Turkmenistan', mode: 'indirect', indianCustomer: 'TBEA', type: 'Power Transformer',
      period: '2021-23', rating: '167 MVA', note: '17 jobs × 20 · 2800×28×520×1',
      qty: 340, years: [2021, 2023], spotlight: 'turkmenistan' },
    { country: 'Turkmenistan', mode: 'indirect', indianCustomer: 'TBEA', type: 'Power Transformer',
      period: '2021-23', rating: '125 MVA', note: '8 jobs × 24 · 2800×28×520×1',
      qty: 192, years: [2021, 2023] },

    /* ---- Tanzania (indirect, via TBEA) — three jobs, kept exactly as listed ---- */
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA', type: 'Power Transformer',
      period: '2022-23', ref: 'TI4215', rating: '250 MVA', qty: 36, years: [2022, 2023] },
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA', type: 'Power Transformer',
      period: '2022-23', ref: 'TI4217', rating: '250 MVA', qty: 80, years: [2022, 2023] },
    { country: 'Tanzania', mode: 'indirect', indianCustomer: 'TBEA', type: 'Power Transformer',
      period: '2022-23', ref: 'TI4228', rating: '50 MVA', qty: 33, years: [2022, 2023] },

    /* ArcelorMittal is NOT listed here (client, 2026-09-28): it was Triveni's
       single HDG job and is shown only as a Spotlight showcase (SPOTLIGHTS.
       arcelormittal), so it is deliberately excluded from the export total and
       the supply record. */

    /* ---- Retained documented country supplies (indirect, via Indian OEMs) ---- */
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Prolec GE', type: 'Power Transformer', period: '2016-17', qty: 36, years: [2016, 2017] },
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Prolec GE', type: 'Power Transformer', period: '2016-17', qty: 8,  years: [2016, 2017] },
    { country: 'Bangladesh', mode: 'indirect', indianCustomer: 'Siemens',    type: 'Power Transformer', period: '2017-18', qty: 48, years: [2017, 2018] },
    { country: 'Bhutan',     mode: 'indirect', indianCustomer: 'GE T&D',     type: 'Medium Power Transformer', period: '2021-22', qty: 36, years: [2021, 2022] },
    { country: 'Bhutan',     mode: 'indirect', indianCustomer: 'Hitachi',    type: 'Medium Power Transformer', period: '2022-23', qty: 48, years: [2022, 2023] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       type: 'Power Transformer', period: '2020-21', qty: 24, years: [2020, 2021] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       type: 'Power Transformer', period: '2020-21', qty: 32, years: [2020, 2021] },
    { country: 'Nepal',      mode: 'indirect', indianCustomer: 'TBEA',       type: 'Power Transformer', period: '2022-23', qty: 6,  years: [2022, 2023] },
    { country: 'Niger',      mode: 'indirect', indianCustomer: 'TBEA',       type: 'Power Transformer', period: '2020-21', qty: 30, years: [2020, 2021] },
    { country: 'Malaysia',   mode: 'indirect', indianCustomer: 'Prolec-GE',  type: 'Medium Power Transformer', period: '2015-16', qty: 8,  years: [2015, 2016] }
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
      line: 'Supplied through Siemens for their Moldova export job — 330 kV, dispatched June 2023.'
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
      line: 'Supplied through Siemens for their Bulgaria export job — 160/80/80 MVA, 420/33/33 kV power transformers, dispatched December 2023.'
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
      line: 'Supplied through Wilson for their Oman export job — 17.6 MVA, 33/4x0.69 kV inverter transformers, dispatched June 2026.'
    },
    arcelormittal: {
      /* client 2026-09-28: Triveni's SINGLE HDG (Hot-Dip Galvanized) job. Triveni
         chose not to pursue HDG further (outsourced, supply-chain constraints).
         Shown only as this showcase — NOT in SUPPLIES, so excluded from the
         export total and the supply record. Source: TBEA international-sites
         performance certificate, p.3 (qty 26 is passed in via makeSpot). */
      title: 'ArcelorMittal · HDG',
      indianCustomer: 'TBEA',
      endCustomer: 'ArcelorMittal',
      application: 'Power Transformer (HDG)',
      rating: '165 MVA',
      voltage: '220/33 kV',
      jobs: 'T14245/1',
      line: 'Triveni’s single Hot-Dip Galvanized (HDG) radiator job — 26 HDG radiators (165 MVA, 220/33 kV, 2023–24) supplied through TBEA for ArcelorMittal. Triveni chose not to pursue HDG further, as it was outsourced and carried supply-chain constraints.'
    }
  };

  window.CLIENTS_DATA = {
    COUNTRY_META: COUNTRY_META,
    SUPPLIES: SUPPLIES,
    SPOTLIGHTS: SPOTLIGHTS
  };
})();
