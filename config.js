// ============================================================
//  FOUR NINES — edit this file to change what the site shows.
//  Everything else reads from here.
// ============================================================
window.FN_CONFIG = {
  businessName: "Four Nines",
  legalName: "Four Nines Enterprise, LLC",   // shown in footer and on quotes/invoices
  tagline: "Handyman work done right — 99.99% of the time.",
  subhead: "Repairs, installs, and small projects. Honest quotes, clean job sites, and work you won't have to call someone else to fix.",
  phone: "8030000000",            // <-- your real number, digits only
  email: "you@example.com",       // <-- your business email
  serviceArea: "Elgin, Lugoff, Camden, Blythewood & Northeast Columbia",
  hours: "Evenings & weekends",

  // Paste your Google Apps Script web-app URL here (see README).
  // Leave blank to test: quote form will open a text message instead,
  // and the owner app will save data on this device only.
  scriptUrl: "",

  // Default tax rate for quotes/invoices (percent). 0 = no tax line.
  taxRate: 0,
  paymentNote: "Payment due on completion. Cash, check, Zelle, or Venmo accepted.",

  services: [
    { name: "Drywall repair",          price: "From $125", desc: "Holes, cracks, water damage, patch and paint to match." , img: "https://images.unsplash.com/photo-1768839725085-829e6ac7ac26?w=900&q=70&auto=format&fit=crop" },
    { name: "Doors & trim",            price: "From $95",  desc: "Sticking doors, new hardware, baseboard and trim install." , img: "https://images.unsplash.com/photo-1773432114026-25ee626e9e8a?w=900&q=70&auto=format&fit=crop" },
    { name: "TV mounting & shelves",   price: "From $85",  desc: "Wall mounts, floating shelves, curtain rods, mirrors." , img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=70&auto=format&fit=crop" },
    { name: "Fixture swaps",           price: "From $75",  desc: "Faucets, light fixtures, ceiling fans, toilets." , img: "https://images.unsplash.com/photo-1618832515490-e181c4794a45?w=900&q=70&auto=format&fit=crop" },
    { name: "Carpentry & built-ins",   price: "Quoted",    desc: "Custom shelving, cabinets, coffee bars, small builds." , img: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=900&q=70&auto=format&fit=crop" },
    { name: "Decks, fences & exterior",price: "Quoted",    desc: "Board replacement, gate repair, pressure washing, caulking." , img: "https://images.unsplash.com/photo-1786295866839-d17f879c65cd?w=900&q=70&auto=format&fit=crop" },
    { name: "Honey-do list",           price: "From $65/hr", desc: "A bunch of small jobs? Send the list — we'll knock it out." , img: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=900&q=70&auto=format&fit=crop" }
  ],

  // Photos. These are free stock photos for now — swap in your own job
  // photos over time (upload to an /img folder, then use "img/your-photo.jpg").
  heroImage: "https://images.unsplash.com/photo-1676311396794-f14881e9daaa?w=1800&q=70&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=1100&q=70&auto=format&fit=crop",

  // Before/after photos. Upload images to the /img folder on GitHub,
  // then list them here. Leave the list empty to hide the section.
  gallery: [
    // { before: "img/bath-before.jpg", after: "img/bath-after.jpg", caption: "Bathroom vanity swap — Elgin" }
  ]
};
