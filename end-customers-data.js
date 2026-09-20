/* ==========================================================
   END CUSTOMERS — single source of data + category labels, shared by
   clientele.html (homepage preview) and end-customers-directory.html (full
   list). Previously each page hardcoded its own copy of the category titles
   and they drifted out of sync — this file is now the only place either
   should be edited.

   Re-grouped into 4 categories per client feedback (18 Sept 2026): one
   addition (BHEL), zero removals, seven category moves from the original
   3-category, 37-organisation list. 38 organisations total.

   EC row shape: [ category key, short name, full legal name | '', logo file | null ]
   Logos: assets/logos/end-customers/ (BHEL's logo is reused from
   assets/logos/major-customers/bhel.png, copied in as the same file).
   ========================================================== */
window.END_CUSTOMER_CATS = [
  { key: 'state',   title: 'State Transmission & Distribution Companies' },
  { key: 'central', title: 'Central Power & Core Infrastructure' },
  { key: 'private', title: 'Private Power, Energy & Renewables' },
  { key: 'epc',     title: 'EPC / Infrastructure / Industrial' }
];

window.END_CUSTOMER_LOGO_PATH = 'assets/logos/end-customers/';

window.END_CUSTOMERS = [
  // ---- state transmission & distribution ----
  ['state', 'MSETCL / MAHATRANSCO', 'Maharashtra State Electricity Transmission Company Limited', 'msetcl-mahatransco.png'],
  ['state', 'UPPTCL', 'Uttar Pradesh Power Transmission Corporation Limited', 'upptcl.png'],
  ['state', 'PSTCL', 'Punjab State Transmission Corporation Limited', 'pstcl.png'],
  ['state', 'TANTRANSCO', 'Tamil Nadu Transmission Corporation Limited', 'tantransco.png'],
  ['state', 'KPTCL', 'Karnataka Power Transmission Corporation Limited', 'kptcl.jpeg'],
  ['state', 'TSTRANSCO', 'Telangana State Transmission Corporation Limited', 'tstransco.jpeg'],
  ['state', 'GETCO', 'Gujarat Energy Transmission Corporation Limited', 'getco.png'],
  ['state', 'RRVPNL', 'Rajasthan Rajya Vidyut Prasaran Nigam Limited', 'rrvpnl.jpeg'],
  ['state', 'CSPTCL', 'Chhattisgarh State Power Transmission Company Limited', 'csptcl.gif'],
  ['state', 'GSECL', 'Gujarat State Electricity Corporation Limited', 'gsecl.png'],
  ['state', 'AP GENCO', 'Andhra Pradesh Power Generation Corporation Limited', 'ap-genco.png'],
  ['state', 'AEGCL', 'Assam Electricity Grid Corporation Limited', 'aegcl.jpeg'],
  // ---- central power & core infrastructure ----
  ['central', 'PGCIL', 'Power Grid Corporation of India Limited', 'pgcil.png'],
  ['central', 'NTPC Limited', 'National Thermal Power Corporation Limited', 'ntpc.png'],
  ['central', 'BHEL', 'Bharat Heavy Electricals Limited', 'bhel.png'],
  ['central', 'Indian Railways – RDSO', 'Research Designs & Standards Organisation', 'indian-railways-rdso.jpeg'],
  // ---- private power, energy & renewables ----
  ['private', 'Reliance Industries Limited', '', 'reliance.png'],
  ['private', 'Tata Power Company Limited', '', 'tata-power.png'],
  ['private', 'Adani Energy Solutions Limited', '', 'adani-energy-solutions.png'],
  ['private', 'Adani Power Limited', '', 'adani-power.png'],
  ['private', 'Adani Green Energy Limited', '', 'adani-green-energy.png'],
  ['private', 'Torrent Power Limited', '', 'torrent-power.png'],
  ['private', 'JSW Energy Limited', '', 'jsw-energy.jpeg'],
  ['private', 'ReNew Energy', '', 'renew-energy.png'],
  ['private', 'ACME Solar Holdings', '', 'acme-solar.png'],
  ['private', 'Hero Future Energies', '', 'hero-future-energies.jpeg'],
  ['private', 'MEIL', '', 'meil.png'],
  ['private', 'Sterlite', '', 'sterlite.jpeg'],
  ['private', 'IndiGrid', '', 'indigrid.png'],
  ['private', 'APAR Industries / APARAVA', '', 'aparava.png'],
  ['private', 'GR Infra', '', 'gr-infra.jpeg'],
  ['private', 'RS Infra', '', 'rs-infra.png'],
  ['private', 'Godrej', '', 'godrej.jpeg'],
  ['private', 'POWERICA', '', 'powerica.jpeg'],
  // ---- EPC / infrastructure / industrial ----
  ['epc', 'Tata Projects Limited', '', 'tata-projects.png'],
  ['epc', 'Tata Steel', '', 'tata-steel.png'],
  ['epc', 'Kalpataru Projects International Limited (KPIL)', '', 'kalpataru-kpil.png'],
  ['epc', 'L&T', '', null]
];
