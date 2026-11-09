// ============================================================
//  FOUR NINES — edit this file to change what the site shows.
//  Everything else reads from here.
// ============================================================
window.FN_CONFIG = {
  businessName: "Four Nines",
  legalName: "Four Nines Enterprise, LLC",   // shown in footer and on quotes/invoices
  ownerName: "",                 // your first name, used to sign messages (optional)
  tagline: "Your to-do list, done right.",
  subhead: "Drywall, TV mounting, ceiling fans, furniture assembly and more, on evenings and weekends so you never take off work. Upfront prices. Pay when it's done.",
  phone: "",                      // <-- business number, digits only (blank = email only)
  email: "a.navarro@fourninesenterprise.com",
  serviceArea: "Elgin, Lugoff, Camden, Blythewood & Northeast Columbia",
  hours: "Evenings & weekends",

  // Paste your Google Apps Script web-app URL here (see README).
  // Leave blank to test: quote form will open a text message instead,
  // and the owner app will save data on this device only.
  scriptUrl: "https://script.google.com/macros/s/AKfycbxnNNW6lomqosiwASAX9jwDRSxZwvrWHvy32dmPkRZshDmkh7QxbNhjZsuoMInvFGV_/exec",

  // Default tax rate for quotes/invoices (percent). 0 = no tax line.
  taxRate: 0,
  paymentNote: "Nothing up front. You pay when the job is done, by cash, check, Zelle or Venmo.",

  services: [
    { name: "Drywall repair",        price: "From $125", desc: "Holes, cracks and water spots patched, textured and painted so you can't find them.", img: "https://images.unsplash.com/photo-1768839725085-829e6ac7ac26?w=900&q=70&auto=format&fit=crop" },
    { name: "Ceiling fans",          price: "From $125", desc: "Old fan out, new fan in, or swap a light for a fan. Assembled, balanced, no wobble.", img: "img/ceiling-fan.jpg" },
    { name: "Outlets & switches",    price: "From $65", desc: "Swap worn or outdated outlets and switches, add USB or GFCI outlets, fresh cover plates.", img: "img/gfci-after.jpg" },
    { name: "TV mounting & shelves", price: "From $85",  desc: "Any size TV mounted level and secure, wires hidden. Shelves, mirrors and curtain rods too.", img: "img/tv-after.jpg" },
    { name: "Furniture assembly",    price: "From $65", desc: "Beds, dressers, desks, patio sets. Built solid, boxes hauled off.", img: "img/garage-racks.jpg" },
    { name: "Carpet & LVP flooring", price: "Quoted", desc: "LVP and carpet installed room by room, with clean trim and transitions.", img: "https://images.unsplash.com/photo-1598718544285-7180f670198b?w=900&q=70&auto=format&fit=crop" },
    { name: "Small yard work",       price: "From $75", desc: "Trimming, edging, leaf cleanup and hedge shaping to get your yard back in shape.", img: "img/fire-pit.jpg" },
    { name: "Small junk removal",    price: "From $95", desc: "Old furniture, boxes and clutter hauled away. We do the lifting.", img: "img/deck-before.jpg" },
    { name: "Small cleaning",        price: "From $85", desc: "Move-out touch-ups, garages, and the spots that never get cleaned.", img: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=900&q=70&auto=format&fit=crop" },
    { name: "Honey-do list",         price: "From $65/hr", desc: "Send the whole list. One visit, everything checked off.", img: "https://images.unsplash.com/photo-1599619585752-c3edb42a414c?w=900&q=70&auto=format&fit=crop" }
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
  heroImage: "img/garage-racks.jpg",
  aboutImage: "img/mirror.jpg",

  // Before/after photos. Upload images to the /img folder on GitHub,
  // then list them here. Leave the list empty to hide the section.
  gallery: [
    { before: "img/sink-before.jpg", after: "img/sink-after.jpg", caption: "Water-damaged sink cabinet floor rebuilt and sealed" },
    { before: "img/tv-before.jpg",   after: "img/tv-after.jpg",   caption: "Bedroom TV mounted level and secure" },
    { before: "img/gfci-before.jpg", after: "img/gfci-after.jpg", caption: "Worn kitchen outlet upgraded to GFCI" },
    { before: "img/deck-before.jpg", after: "img/deck-after.jpg", caption: "Cluttered patio cleared and junk hauled off" },
    { before: "img/yard-before.jpg", after: "img/yard-after.jpg", caption: "Overgrown fence line trimmed and cleaned up" },
    { after: "img/garage-racks.jpg", caption: "Overhead garage storage racks installed" },
    { after: "img/fire-pit.jpg",     caption: "Backyard fire pit area with paver border and lights" },
    { after: "img/ceiling-fan.jpg",  caption: "Ceiling fan installed and balanced" },
    { after: "img/mirror.jpg",       caption: "Large statement mirror hung level" }
  ]
};
