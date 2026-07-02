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

export interface SceneDef {
  id: string;
  index: number;
  navLabel: string;
  eyebrow: string;
  title: string;
  copy: string;
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
    copy: "Every voyage begins at the core. A living motherboard breathes in the dark — energy pulsing through its veins, the first star in a galaxy of the devices we design, deploy and keep alive.",
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
    copy: "Drift toward the imaging system. Precision optics bloom open in the void, elements turning through their focal dance — engineered to seize light where there is almost none.",
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
    copy: "Cross into the watch. AI-guided sensors sweep the dark with laser scans, mapping an entire world in glowing wireframe — nothing moves here unseen.",
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
    copy: "Enter the light. A field of panels turns toward a distant sun, harvesting current and pouring it into banks of glowing cells — energy, stored and ready.",
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
    copy: "A single home floats in orbit, every device woven into one luminous nervous system — lights, locks, climate and sensors, all speaking to each other in pulses of light.",
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
    copy: "Follow the data. Server constellations trade packets of pure light across glowing fiber — every pulse a request answered at the speed of the void.",
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
    copy: "The engine room of the galaxy. Coils, inverters and industrial cells trade high-voltage arcs — the uninterrupted heartbeat that keeps every world alive.",
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
    copy: "Arrive at the control room. A holographic Earth turns above the console — the voyage ends where the next one begins. Send a signal, and we'll build it with you.",
    accent: COLORS.emerald,
    anchor: [0, 4, -910],
    camera: [0, 4, -864],
  },
];

export const SCENE_COUNT = SCENES.length;

export const SERVICE_CARDS = [
  { title: "Installation", copy: "End-to-end setup for every system we deploy." },
  { title: "Maintenance", copy: "Scheduled upkeep that keeps hardware at peak health." },
  { title: "Repair", copy: "Rapid diagnostics and component-level repair." },
  { title: "Consultation", copy: "The right system, designed for your space and budget." },
] as const;

export const CONTACT_CARDS = [
  { label: "Email", value: "info@mehtabelectronics.com" },
  { label: "Phone", value: "+92 300 000 0000" },
  { label: "Location", value: "Lahore, Pakistan" },
] as const;

// Total scroll length as a multiple of viewport height per scene.
// Longer = slower, more cinematic glide between worlds.
export const SCROLL_VH_PER_SCENE = 1.6;
