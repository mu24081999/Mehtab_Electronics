import ExperienceLoader from "@/components/three/ExperienceLoader";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import Overlay from "@/components/layout/Overlay";
import CustomCursor from "@/components/layout/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import { SCENE_COUNT, SCROLL_VH_PER_SCENE } from "@/lib/constants";

// Total scrollable height. This is the ONLY thing that scrolls — it produces
// the scroll range that the camera reads. Every visible element is fixed.
const SCROLL_HEIGHT = SCENE_COUNT * SCROLL_VH_PER_SCENE * 100;

export default function Home() {
  return (
    <>
      <Preloader />
      <CustomCursor />

      {/* The permanent 3D universe */}
      <ExperienceLoader />

      {/* Fixed DOM layers driven by scroll progress */}
      <Overlay />
      <Navigation />

      {/* Scroll engine (renders nothing) */}
      <SmoothScroll />

      {/* Invisible scroll track that gives the page its length */}
      <div style={{ height: `${SCROLL_HEIGHT}vh` }} aria-hidden />

      {/* Film-grade DOM overlays */}
      <div className="vignette-frame" />
      <div className="noise-overlay" />
    </>
  );
}
