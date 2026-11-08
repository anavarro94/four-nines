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

  // Instant ballpark ranges shown on the site — [option, low $, high $].
  // Labor only. Edit these to match how you actually price jobs.
  // Services not listed here show "send photos for a custom quote".
  estimator: {
    "Drywall repair":        { q: "How big is the damage?", opts: [["Nail holes or small cracks",125,175],["Fist-size hole",175,250],["Bigger than a basketball",250,450]] },
    "Doors & trim":          { q: "What's the job?", opts: [["Fix a sticking door",95,140],["Replace door hardware",95,150],["Hang a new interior door",200,350],["Baseboard or trim (one room)",250,450]] },
    "TV mounting & shelves": { q: "What are we mounting?", opts: [["TV up to 55\"",85,125],["TV 65\" or bigger",125,175],["TV + hide the wires",175,275],["Shelf, mirror or rod (each)",60,95]] },
    "Fixture swaps":         { q: "What are we swapping?", opts: [["Light fixture",85,150],["Faucet",125,200],["Ceiling fan",150,250],["Toilet",175,275]] },
    "Honey-do list":         { q: "About how long is the list?", opts: [["2–3 small things (~2 hrs)",130,195],["Half a day",260,325],["Full day",455,520]] }
  },

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
