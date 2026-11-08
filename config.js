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
    { name: "Drywall repair",        price: "From $125", desc: "Holes, cracks, water damage — patched, textured and painted to match.", img: "https://images.unsplash.com/photo-1768839725085-829e6ac7ac26?w=900&q=70&auto=format&fit=crop" },
    { name: "Ceiling fans",          price: "From $125", desc: "Swap an old fan or replace a light with a new fan, assembled and balanced.", img: "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?w=900&q=70&auto=format&fit=crop" },
    { name: "Outlets & switches",    price: "From $65", desc: "Replace worn outlets and switches, add USB or GFCI outlets, new cover plates.", img: "https://images.unsplash.com/photo-1635335874521-7987db781153?w=900&q=70&auto=format&fit=crop" },
    { name: "TV mounting & shelves", price: "From $85",  desc: "TVs of any size mounted level and secure, wires hidden, plus shelves, mirrors and curtain rods.", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=70&auto=format&fit=crop" },
    { name: "Furniture assembly",    price: "From $65", desc: "Beds, dressers, desks, shelves, patio sets — built right and cleaned up.", img: "https://images.unsplash.com/photo-1772338537689-056082f100a9?w=900&q=70&auto=format&fit=crop" },
    { name: "Carpet & LVP flooring", price: "Quoted", desc: "Luxury vinyl plank and carpet installs, room by room, with trim and transitions.", img: "https://images.unsplash.com/photo-1598718544285-7180f670198b?w=900&q=70&auto=format&fit=crop" },
    { name: "Small yard work",       price: "From $75", desc: "Trimming, edging, leaf cleanup, bush and hedge shaping.", img: "https://images.unsplash.com/photo-1689728318937-17d24bc0a65c?w=900&q=70&auto=format&fit=crop" },
    { name: "Small junk removal",    price: "From $95", desc: "Old furniture, boxes and clutter hauled away — we load it, you relax.", img: "https://images.unsplash.com/photo-1757837593538-b4a8654132f1?w=900&q=70&auto=format&fit=crop" },
    { name: "Small cleaning",        price: "From $85", desc: "Move-out touch-ups, post-project cleanup, garages and tough spots.", img: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=900&q=70&auto=format&fit=crop" },
    { name: "Honey-do list",         price: "From $65/hr", desc: "A bunch of small jobs? Send the list — we'll knock it out in one visit.", img: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=900&q=70&auto=format&fit=crop" }
  ],

  // Instant ballpark ranges shown on the site — [option, low $, high $].
  // Labor only. Edit these to match how you actually price jobs.
  // Services not listed here show "send photos for a custom quote".
  estimator: {
    "Drywall repair":        { q: "How big is the damage?", opts: [["Nail holes or small cracks",125,175],["Fist-size hole",175,250],["Bigger than a basketball",250,450]] },
    "Ceiling fans":          { q: "What's the job?", opts: [["Swap an existing fan",125,175],["Replace a light with a fan",150,225],["Two fans",225,325]] },
    "Outlets & switches":    { q: "How many?", opts: [["1–2 outlets or switches",65,110],["3–5 outlets or switches",110,175],["Add USB or GFCI outlets",85,150]] },
    "TV mounting & shelves": { q: "What are we mounting?", opts: [["TV up to 55\"",85,125],["TV 65\" or bigger",125,175],["TV + hide the wires",175,275],["Shelf, mirror or rod (each)",60,95]] },
    "Furniture assembly":    { q: "What are we building?", opts: [["Small item (nightstand, chair)",65,95],["Dresser, desk or bookcase",95,150],["Bed frame or wardrobe",125,200],["Large unit or patio set",200,400]] },
    "Small yard work":       { q: "What needs doing?", opts: [["Quick tidy-up (~2 hrs)",75,150],["Leaf cleanup",100,200],["Hedge and bush trimming",100,200]] },
    "Small junk removal":    { q: "About how much stuff?", opts: [["A few items",95,150],["Half a pickup load",150,225],["Full pickup load",225,350]] },
    "Small cleaning":        { q: "What kind of cleaning?", opts: [["One room deep clean",85,140],["Garage or storage area",150,300],["Move-out clean (small home)",200,350]] },
    "Honey-do list":         { q: "About how long is the list?", opts: [["2–3 small things (~2 hrs)",130,195],["Half a day",260,325],["Full day",455,520]] }
  },

  // Photos. These are free stock photos for now — swap in your own job
  // photos over time (upload to an /img folder, then use "img/your-photo.jpg").
  heroImage: "https://images.unsplash.com/photo-1676311396794-f14881e9daaa?w=1800&q=70&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=1100&q=70&auto=format&fit=crop",

  // Before/after photos. Upload images to the /img folder on GitHub,
  // then list them here. Leave the list empty to hide the section.
  gallery: [
    // { before: "img/bath-before.jpg", after: "img/bath-after.jpg", caption: "Bathroom vanity swap — Elgin" }
  ]
};
