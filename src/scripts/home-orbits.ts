import { gsap } from "gsap";

const initOrbits = () => {
  const orbits = document.querySelectorAll<HTMLElement>(".gsap-orbit");

  orbits.forEach((orbit) => {
    const duration = Number.parseFloat(orbit.dataset.duration ?? "20");
    const start = Number.parseFloat(orbit.dataset.start ?? "0");

    gsap.killTweensOf(orbit);
    gsap.set(orbit, {
      transformOrigin: "center center",
      rotation: start,
    });
    gsap.to(orbit, {
      rotation: start + 360,
      duration,
      repeat: -1,
      ease: "none",
    });
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOrbits, { once: true });
} else {
  initOrbits();
}

document.addEventListener("astro:page-load", initOrbits);
