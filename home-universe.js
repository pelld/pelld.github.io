/* ============================================================
   00. CONSTELLATION RELATIONSHIPS
   The network mixes thematic connections within analysis and games
   with a few bridges between mapping, place and personalised play.
   ============================================================ */
const CONSTELLATION_CONNECTIONS = [
  [0,1],[0,3],[1,2],[1,3],[1,4],[1,5],[2,3],[3,4],
  [5,7],[6,7],[6,9],[6,10],[7,8],[7,10],[8,9],[8,10],[9,10]
];

/* ============================================================
   01. INITIALISE THE CLICKABLE CONSTELLATION
   ============================================================ */
(() => {
  const stage = document.getElementById("constellation-stage");
  const field = document.getElementById("constellation-field");
  const svg = document.getElementById("constellation-lines");
  const lineGroup = document.getElementById("constellation-line-group");
  const orbits = [...document.querySelectorAll(".project-orbit")];
  const filterButtons = [...document.querySelectorAll("[data-project-filter]")];
  const readoutIndex = document.getElementById("readout-index");
  const readoutTitle = document.getElementById("readout-title");
  const readoutDescription = document.getElementById("readout-description");
  const readoutAction = document.getElementById("readout-action");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!stage || !field || !svg || !lineGroup || orbits.length === 0) return;

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const lines = [];
  let activeOrbit = null;
  let lineFrame = 0;
  let fieldX = 0;
  let fieldY = 0;

  /* ============================================================
     02. BUILD AND POSITION THE SVG CONNECTIONS
     ============================================================ */
  CONSTELLATION_CONNECTIONS.forEach(([from, to]) => {
    const line = document.createElementNS(SVG_NAMESPACE, "line");
    line.dataset.from = String(from);
    line.dataset.to = String(to);
    lineGroup.append(line);
    lines.push(line);
  });

  const updateLines = () => {
    lineFrame = 0;
    const stageBounds = stage.getBoundingClientRect();

    lines.forEach(line => {
      const from = orbits[Number(line.dataset.from)]?.querySelector(".orbit-ring");
      const to = orbits[Number(line.dataset.to)]?.querySelector(".orbit-ring");
      if (!from || !to) return;

      const fromBounds = from.getBoundingClientRect();
      const toBounds = to.getBoundingClientRect();
      line.setAttribute("x1", String(fromBounds.left + fromBounds.width / 2 - stageBounds.left - fieldX));
      line.setAttribute("y1", String(fromBounds.top + fromBounds.height / 2 - stageBounds.top - fieldY));
      line.setAttribute("x2", String(toBounds.left + toBounds.width / 2 - stageBounds.left - fieldX));
      line.setAttribute("y2", String(toBounds.top + toBounds.height / 2 - stageBounds.top - fieldY));
    });
  };

  const scheduleLineUpdate = () => {
    if (lineFrame) return;
    lineFrame = requestAnimationFrame(updateLines);
  };

  /* ============================================================
     03. ACTIVATE AN ORBIT AND ITS RELATED PROJECTS
     ============================================================ */
  const relatedIndexes = index => {
    const related = new Set();
    CONSTELLATION_CONNECTIONS.forEach(([from, to]) => {
      if (from === index) related.add(to);
      if (to === index) related.add(from);
    });
    return related;
  };

  const activateOrbit = orbit => {
    if (!orbit || orbit.classList.contains("is-filtered")) return;

    activeOrbit = orbit;
    const index = Number(orbit.dataset.index);
    const related = relatedIndexes(index);
    const colour = orbit.dataset.colour || "#c8f169";

    stage.classList.add("has-active");
    stage.style.setProperty("--accent", colour);

    orbits.forEach(candidate => {
      const candidateIndex = Number(candidate.dataset.index);
      candidate.classList.toggle("is-active", candidate === orbit);
      candidate.classList.toggle("is-related", candidate !== orbit && related.has(candidateIndex));
    });

    lines.forEach(line => {
      const from = Number(line.dataset.from);
      const to = Number(line.dataset.to);
      line.classList.toggle("is-active", from === index || to === index);
    });

    if (readoutIndex) readoutIndex.textContent = String(index + 1).padStart(2, "0");
    if (readoutTitle) readoutTitle.textContent = orbit.dataset.title || orbit.textContent.trim();
    if (readoutDescription) readoutDescription.textContent = orbit.dataset.description || "Open this project.";
    if (readoutAction) readoutAction.textContent = "Click to open ↗";
  };

  const resetConstellation = () => {
    activeOrbit = null;
    stage.classList.remove("has-active");
    stage.style.setProperty("--accent", "#65dfbd");
    orbits.forEach(orbit => orbit.classList.remove("is-active","is-related"));
    lines.forEach(line => line.classList.remove("is-active"));
    if (readoutIndex) readoutIndex.textContent = "01";
    if (readoutTitle) readoutTitle.textContent = "Population Health: The Whole System";
    if (readoutDescription) readoutDescription.textContent = "Move across the constellation. Each orbit is a direct project link.";
    if (readoutAction) readoutAction.textContent = "Select a project ↗";
  };

  orbits.forEach(orbit => {
    orbit.addEventListener("pointerenter", () => activateOrbit(orbit));
    orbit.addEventListener("focus", () => activateOrbit(orbit));
    orbit.addEventListener("blur", () => {
      window.setTimeout(() => { if (!field.contains(document.activeElement)) resetConstellation(); }, 0);
    });
  });

  field.addEventListener("pointerleave", resetConstellation);

  /* ============================================================
     04. POINTER LIGHT, PARALLAX AND RESTRAINED MAGNETISM
     ============================================================ */
  const clearMagnetism = () => {
    orbits.forEach(orbit => {
      orbit.style.setProperty("--mag-x", "0px");
      orbit.style.setProperty("--mag-y", "0px");
    });
  };

  stage.addEventListener("pointermove", event => {
    const bounds = stage.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    stage.style.setProperty("--mx", `${localX}px`);
    stage.style.setProperty("--my", `${localY}px`);

    if (prefersReducedMotion || window.innerWidth <= 900) return;

    fieldX = ((localX / bounds.width) - .5) * -11;
    fieldY = ((localY / bounds.height) - .5) * -8;
    field.style.setProperty("--field-x", `${fieldX}px`);
    field.style.setProperty("--field-y", `${fieldY}px`);
    svg.style.transform = `translate3d(${fieldX}px,${fieldY}px,0)`;

    orbits.forEach(orbit => {
      const ring = orbit.querySelector(".orbit-ring");
      if (!ring) return;
      const ringBounds = ring.getBoundingClientRect();
      const centreX = ringBounds.left + ringBounds.width / 2;
      const centreY = ringBounds.top + ringBounds.height / 2;
      const deltaX = event.clientX - centreX;
      const deltaY = event.clientY - centreY;
      const distance = Math.hypot(deltaX, deltaY);
      const influence = Math.max(0, 1 - distance / 210);
      orbit.style.setProperty("--mag-x", `${deltaX * influence * .05}px`);
      orbit.style.setProperty("--mag-y", `${deltaY * influence * .05}px`);
    });

    scheduleLineUpdate();
  });

  stage.addEventListener("pointerleave", () => {
    fieldX = 0;
    fieldY = 0;
    field.style.setProperty("--field-x", "0px");
    field.style.setProperty("--field-y", "0px");
    svg.style.transform = "translate3d(0,0,0)";
    clearMagnetism();
    scheduleLineUpdate();
  });

  /* ============================================================
     05. ANALYSE / EXPLORE / PLAY FILTERS
     ============================================================ */
  const applyFilter = filter => {
    filterButtons.forEach(button => button.setAttribute("aria-pressed", button.dataset.projectFilter === filter ? "true" : "false"));
    orbits.forEach(orbit => orbit.classList.toggle("is-filtered", filter !== "all" && orbit.dataset.group !== filter));
    lines.forEach(line => {
      const from = orbits[Number(line.dataset.from)];
      const to = orbits[Number(line.dataset.to)];
      line.classList.toggle("is-filtered", from?.classList.contains("is-filtered") || to?.classList.contains("is-filtered"));
    });
    resetConstellation();
  };

  filterButtons.forEach(button => button.addEventListener("click", () => applyFilter(button.dataset.projectFilter || "all")));

  /* ============================================================
     06. KEYBOARD NAVIGATION AND PROJECT-INDEX SHORTCUT
     ============================================================ */
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.querySelector("[data-directory-open]")?.click();
      return;
    }

    if (!activeOrbit || !["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const visibleOrbits = orbits.filter(orbit => !orbit.classList.contains("is-filtered"));
    const currentIndex = visibleOrbits.indexOf(activeOrbit);
    const direction = ["ArrowRight","ArrowDown"].includes(event.key) ? 1 : -1;
    visibleOrbits[(currentIndex + direction + visibleOrbits.length) % visibleOrbits.length]?.focus();
  });

  /* ============================================================
     07. KEEP LINES SYNCHRONISED WITH RESPONSIVE LAYOUT
     ============================================================ */
  const resizeObserver = new ResizeObserver(scheduleLineUpdate);
  resizeObserver.observe(stage);
  orbits.forEach(orbit => resizeObserver.observe(orbit));
  window.addEventListener("resize", scheduleLineUpdate);
  document.fonts?.ready.then(scheduleLineUpdate);
  scheduleLineUpdate();
})();
