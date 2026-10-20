// ============================================================
//  FOUR NINES — edit this file to change what the site shows.
//  Everything else reads from here.
// ============================================================
window.FN_CONFIG = {
  businessName: "Four Nines",
  legalName: "Four Nines Enterprise LLC",   // shown in footer and on quotes/invoices
  tagline: "Handyman work done right — 99.99% of the time.",
  subhead: "Repairs, installs, and small projects. Honest quotes, clean job sites, and work you won't have to call someone else to fix.",
  phone: "8030000000",            // <-- your real number, digits only
  email: "you@example.com",       // <-- your business email
  serviceArea: "Elgin, Lugoff, Camden, Blythewood & Northeast Columbia",
  hours: "Mon–Sat, 7am–6pm",

  // Paste your Google Apps Script web-app URL here (see README).
  // Leave blank to test: quote form will open a text message instead,
  // and the owner app will save data on this device only.
  scriptUrl: "",

  // Default tax rate for quotes/invoices (percent). 0 = no tax line.
  taxRate: 0,
  paymentNote: "Payment due on completion. Cash, check, Zelle, or Venmo accepted.",

  services: [
    { name: "Drywall repair",          price: "From $125", desc: "Holes, cracks, water damage, patch and paint to match." },
    { name: "Doors & trim",            price: "From $95",  desc: "Sticking doors, new hardware, baseboard and trim install." },
    { name: "TV mounting & shelves",   price: "From $85",  desc: "Wall mounts, floating shelves, curtain rods, mirrors." },
    { name: "Fixture swaps",           price: "From $75",  desc: "Faucets, light fixtures, ceiling fans, toilets." },
    { name: "Carpentry & built-ins",   price: "Quoted",    desc: "Custom shelving, cabinets, coffee bars, small builds." },
    { name: "Decks, fences & exterior",price: "Quoted",    desc: "Board replacement, gate repair, pressure washing, caulking." },
    { name: "Honey-do list",           price: "From $65/hr", desc: "A bunch of small jobs? Send the list — we'll knock it out." }
  ],

  // Before/after photos. Upload images to the /img folder on GitHub,
  // then list them here. Leave the list empty to hide the section.
  gallery: [
    // { before: "img/bath-before.jpg", after: "img/bath-after.jpg", caption: "Bathroom vanity swap — Elgin" }
  ]
};
