// ============================================================================
// Central source of truth for the entire cinematic journey.
// The camera path, the 3D scenes and the HTML overlays all derive from the
// data here so they can never drift out of sync.
// ============================================================================

export const COLORS = {
  void: "#04050a",
  voidSoft: "#080a12",
  cyan: "#22d3ee",
  blue: "#2f6bff",
  purple: "#8b5cff",
  magenta: "#ff4fd8",
  emerald: "#2effb0",
  amber: "#ffb347",
  white: "#eaf2ff",
} as const;

export const COMPANY = {
  name: "Mehtab Electronics",
  shortName: "Mehtab",
  tagline: "Future Electronics, Delivered Today",
  description:
    "Lahore's trusted partner for professional camera systems, CCTV, solar energy, smart home automation, networking and industrial power solutions — from design and installation to maintenance.",
  founded: "Established in Lahore",
  email: "info@mehtabelectronics.com",
  phone: "+92 300 000 0000",
  whatsapp: "+92 300 000 0000",
  location: "Lahore, Pakistan",
  address: "Main Boulevard, Gulberg III, Lahore",
  hours: "Mon – Sat, 10:00 AM – 8:00 PM",
  social: {
    facebook: "https://facebook.com/mehtabelectronics",
    instagram: "https://instagram.com/mehtabelectronics",
  },
} as const;

export interface SceneDef {
  id: string;
  index: number;
  navLabel: string;
  eyebrow: string;
  title: string;
  copy: string;
  /** Extended business context shown below the main copy. */
  details?: string;
  /** Key selling points for this service area. */
  features?: readonly string[];
  /** Path to contextual illustration in /public. */
  image: string;
  accent: string;
  /** World-space center of this scene's environment. */
  anchor: [number, number, number];
  /** Camera keyframe — where the lens sits when this scene is on-screen. */
  camera: [number, number, number];
}

// Big cinematic spacing so the camera genuinely travels through space.
export const SCENES: SceneDef[] = [
  {
    id: "hero",
    index: 0,
    navLabel: "Core",
    eyebrow: "Mehtab Electronics",
    title: "Future\nElectronics",
    copy: "Your complete electronics partner in Lahore — cameras, security, solar, smart homes, networking and power systems under one roof.",
    details:
      "We design, supply, install and maintain technology that keeps homes and businesses connected, protected and powered.",
    features: ["Free site survey", "Certified technicians", "Warranty-backed installs"],
    image: "/images/services/hero.svg",
    accent: COLORS.cyan,
    anchor: [0, 0, 0],
    camera: [0, 3, 46],
  },
  {
    id: "cameras",
    index: 1,
    navLabel: "Imaging",
    eyebrow: "Optics & Imaging",
    title: "Professional\nCamera Systems",
    copy: "DSLR, mirrorless, PTZ and IP cameras for studios, retail, events and broadcast — matched to your lens, lighting and workflow needs.",
    details:
      "From Hikvision and Dahua to professional cinema rigs, we configure, mount and calibrate every system for crystal-clear imaging day and night.",
    features: ["4K & night vision", "PTZ & dome installs", "Studio & event setups"],
    image: "/images/services/cameras.svg",
    accent: COLORS.purple,
    anchor: [28, 10, -130],
    camera: [20, 8, -86],
  },
  {
    id: "security",
    index: 2,
    navLabel: "Security",
    eyebrow: "Surveillance & AI",
    title: "CCTV &\nSecurity",
    copy: "End-to-end surveillance for homes, shops, warehouses and offices — AI motion alerts, remote viewing and 24/7 recording.",
    details:
      "We map blind spots, run clean cable routes and set up mobile apps so you can monitor every camera from anywhere in the world.",
    features: ["AI person detection", "NVR & cloud backup", "Access control integration"],
    image: "/images/services/security.svg",
    accent: COLORS.cyan,
    anchor: [-26, -10, -260],
    camera: [-18, -6, -216],
  },
  {
    id: "solar",
    index: 3,
    navLabel: "Solar",
    eyebrow: "Renewable Energy",
    title: "Solar\nEnergy",
    copy: "Grid-tie and hybrid solar for homes and commercial sites — lower bills, backup power and a greener footprint.",
    details:
      "Load calculation, panel placement, inverter sizing and net-metering guidance — we handle the full journey from survey to switch-on.",
    features: ["On-grid & hybrid", "Battery backup", "Net metering support"],
    image: "/images/services/solar.svg",
    accent: COLORS.emerald,
    anchor: [30, 14, -390],
    camera: [22, 10, -346],
  },
  {
    id: "smart-home",
    index: 4,
    navLabel: "Smart Home",
    eyebrow: "Home Automation",
    title: "Smart\nHome",
    copy: "Control lights, climate, locks and appliances from one app — voice assistants, scenes and schedules that adapt to your routine.",
    details:
      "We integrate Wi-Fi, Zigbee and Matter devices into a single dashboard so every room responds the way you expect.",
    features: ["Voice control", "Smart lighting", "Automated climate"],
    image: "/images/services/smart-home.svg",
    accent: COLORS.magenta,
    anchor: [-30, -8, -520],
    camera: [-22, -4, -476],
  },
  {
    id: "networking",
    index: 5,
    navLabel: "Networking",
    eyebrow: "Infrastructure",
    title: "Networking\n& Fiber",
    copy: "Structured cabling, fiber runs, Wi-Fi mesh and rack builds for offices, campuses and multi-floor homes.",
    details:
      "Cat6/Cat6A terminations, switch configuration, VLANs and speed testing — infrastructure that stays fast under real load.",
    features: ["Fiber & Cat6A", "Wi-Fi mesh design", "Server rack builds"],
    image: "/images/services/networking.svg",
    accent: COLORS.blue,
    anchor: [28, 12, -650],
    camera: [20, 8, -606],
  },
  {
    id: "power",
    index: 6,
    navLabel: "Power",
    eyebrow: "Energy Systems",
    title: "Power\nSolutions",
    copy: "UPS, inverters, stabilizers and industrial backup — uninterrupted power when the grid drops out.",
    details:
      "Right-sized battery banks, automatic changeover and surge protection keep critical equipment running through outages.",
    features: ["UPS & inverters", "Voltage stabilizers", "Industrial backup"],
    image: "/images/services/power.svg",
    accent: COLORS.amber,
    anchor: [-26, -12, -780],
    camera: [-18, -8, -736],
  },
  {
    id: "contact",
    index: 7,
    navLabel: "Contact",
    eyebrow: "Get In Touch",
    title: "Let's Build\nThe Future",
    copy: "Tell us about your project — we'll recommend the right system, share a clear quote and schedule installation at your convenience.",
    details: "Visit our showroom, call or message us. Same-week site surveys available across Lahore.",
    features: ["Free consultation", "Transparent pricing", "After-sales support"],
    image: "/images/services/contact.svg",
    accent: COLORS.emerald,
    anchor: [0, 4, -910],
    camera: [0, 4, -864],
  },
];

export const SCENE_COUNT = SCENES.length;

export const SERVICE_CARDS = [
  {
    title: "Installation",
    copy: "End-to-end setup for every system we deploy.",
    icon: "⚡",
  },
  {
    title: "Maintenance",
    copy: "Scheduled upkeep that keeps hardware at peak health.",
    icon: "🔧",
  },
  {
    title: "Repair",
    copy: "Rapid diagnostics and component-level repair.",
    icon: "🛠️",
  },
  {
    title: "Consultation",
    copy: "The right system, designed for your space and budget.",
    icon: "💡",
  },
] as const;

export const CONTACT_CARDS = [
  { label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { label: "Phone", value: COMPANY.phone, href: `tel:${COMPANY.phone.replace(/\s/g, "")}` },
  { label: "WhatsApp", value: "Message us", href: `https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}` },
  { label: "Location", value: COMPANY.location, href: undefined },
] as const;

export const STATS = [
  { value: "500+", label: "Projects delivered" },
  { value: "8+", label: "Service categories" },
  { value: "24/7", label: "Support available" },
] as const;

// Total scroll length as a multiple of viewport height per scene.
// Longer = slower, more cinematic glide between worlds.
export const SCROLL_VH_PER_SCENE = 1.6;
