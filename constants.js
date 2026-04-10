// ═══════════════════════════════════════════════════════════════
// STEADFAST RENOVATION LTD — Theme & Constants
// ═══════════════════════════════════════════════════════════════

export const C = {
  accent: "#C9A96E",
  accentLight: "#D4BC88",
  accentDark: "#B8944F",
  bg: "#F7F5F0",
  bgAlt: "#EFEAE3",
  bgDark: "#1A1A1A",
  white: "#FFFFFF",
  text: "#1A1A1A",
  textMid: "#5C5549",
  textLight: "#8A8279",
  border: "#E2DDD5",
  borderLight: "#EDEBE6",
};

export const NAV_ITEMS = [
  { label: "Home", page: "home" },
  { label: "Services", page: "services" },
  { label: "Projects", page: "projects" },
  { label: "Before & After", page: "beforeafter" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
];

export const SERVICES = [
  { title: "Kitchens", slug: "kitchen", desc: "Custom cabinetry, premium countertops, modern layouts, and smart storage solutions designed around how you actually cook and live.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", features: ["Custom Cabinetry", "Countertop Installation", "Island Design", "Appliance Integration", "Lighting Design", "Plumbing Upgrades"] },
  { title: "Bathrooms", slug: "bathroom", desc: "Spa-inspired ensuites, powder rooms, and family bathrooms featuring heated floors, frameless glass, and luxury tile work.", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", features: ["Walk-in Showers", "Freestanding Tubs", "Heated Floors", "Custom Vanities", "Tile Work", "Fixture Upgrades"] },
  { title: "Basements", slug: "basement", desc: "From unfinished shells to entertainment hubs, home offices, gyms, or income-generating apartments — we maximize every square foot.", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", features: ["Home Theatres", "Wet Bars", "Home Offices", "Guest Suites", "Gym Spaces", "Egress Windows"] },
  { title: "Full Home", slug: "full", desc: "Complete interior and exterior transformations. We handle structural changes, open-concept conversions, additions, and everything in between.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", features: ["Open Concept", "Structural Changes", "Second Storeys", "Whole-Home Design", "Permit Management", "Trade Coordination"] },
  { title: "Custom Builds", slug: "custom", desc: "Purpose-built spaces designed from the ground up. Home offices, laneway suites, garage conversions, and bespoke additions.", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", features: ["Laneway Suites", "Garage Conversions", "Home Additions", "ADU Construction", "Custom Design", "Zoning Support"] },
  { title: "Exterior", slug: "exterior", desc: "Curb appeal that lasts. Siding, roofing, windows, doors, decks, landscaping, and outdoor living spaces built for Canadian weather.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", features: ["Siding & Cladding", "Roofing", "Windows & Doors", "Decks & Patios", "Landscaping", "Outdoor Kitchens"] },
];

export const PROJECTS = [
  { title: "High Park", sub: "Modern Kitchen & Main Floor", category: "Kitchen", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", location: "Toronto" },
  { title: "Lakeview", sub: "Complete Bathroom Suite", category: "Bathroom", img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", location: "Burlington" },
  { title: "Upper Beaches", sub: "Full Basement Entertainment", category: "Basement", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", location: "Toronto" },
  { title: "Ancaster", sub: "Heritage Home Renovation", category: "Full Home", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", location: "Hamilton" },
  { title: "Roncesvalles", sub: "Open Concept Conversion", category: "Full Home", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", location: "Toronto" },
  { title: "Port Credit", sub: "Luxury Master Ensuite", category: "Bathroom", img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80", location: "Mississauga" },
];

export const TESTIMONIALS = [
  { name: "Sarah & David Mitchell", location: "Oakville, ON", text: "We couldn't be more thrilled with our home. The team at Steadfast made the process straightforward with incredible attention to detail and a design team that turned everything they touched into gold.", rating: 5, project: "Kitchen & Main Floor" },
  { name: "James Thornton", location: "Burlington, ON", text: "From the initial consultation to the final walkthrough, every step was handled with precision and care. Our basement is now the favourite room in the house. These guys are the real deal.", rating: 5, project: "Basement Finishing" },
  { name: "The Patel Family", location: "Mississauga, ON", text: "We trusted Steadfast with our entire main floor renovation and they exceeded every expectation. On time, on budget, and the quality of work speaks for itself. We've already recommended them to three neighbours.", rating: 5, project: "Full Home Renovation" },
];

// Before & After projects — placeholder images (replace with real ones)
export const BEFORE_AFTER = [
  { title: "Basement Transformation", location: "Toronto, ON", before: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80", after: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", featured: true },
  { title: "Kitchen Overhaul", location: "Oakville, ON", before: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80", after: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" },
  { title: "Bathroom Renovation", location: "Burlington, ON", before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80", after: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80" },
  { title: "Living Room Redesign", location: "Mississauga, ON", before: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80", after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" },
  { title: "Master Ensuite", location: "Hamilton, ON", before: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80", after: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80" },
  { title: "Open Concept Main Floor", location: "Vaughan, ON", before: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
];
