/* ============================================================
   00. QUESTION-FIELD CONFIGURATION
   The connections are conceptual relationships between projects.
   ============================================================ */
const QUESTION_CONNECTIONS = [[0,1],[0,2],[0,3],[0,5],[1,2],[1,3],[2,5],[3,5],[4,5],[4,7],[6,7]];

/* ============================================================
   01. INITIALISE THE INTERACTIVE FIELD
   ============================================================ */
(() => {
  const stage = document.getElementById("question-stage");
  const field = document.getElementById("question-field");
  const svg = document.getElementById("question-lines");
  const lineGroup = document.getElementById("question-line-group");
  const links = [...document.querySelectorAll(".question-link")];
  const filterButtons = [...document.querySelectorAll("[data-project-filter]")];
  const mark = document.getElementById("stage-mark");
  const readoutIndex = document.getElementById("readout-index");
  const readoutTitle = document.getElementById("readout-title");
  const readoutDescription = document.getElementById("readout-description");
  const readoutAction = document.getElementById("readout-action");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!stage || !field || !svg || !lineGroup || links.length === 0) return;

  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const lineElements = [];
  let activeLink = null;
  let lineFrame = 0;
  let fieldX = 0;
  let fieldY = 0;

  /* ============================================================
     02. CREATE AND POSITION RELATIONSHIP LINES
     ============================================================ */
  QUESTION_CONNECTIONS.forEach(([from, to]) => {
    const line = document.createElementNS(SVG_NAMESPACE, "line");
    line.dataset.from = String(from);
    line.dataset.to = String(to);
    lineGroup.append(line);
    lineElements.push(line);
  });

  const updateLines = () => {
    lineFrame = 0;
    const stageBounds = stage.getBoundingClientRect();

    lineElements.forEach(line => {
      const from = links[Number(line.dataset.from)];
      const to = links[Number(line.dataset.to)];
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
     03. PROJECT ACTIVATION AND READOUT
     ============================================================ */
  const relatedIndexes = index => {
    const related = new Set();
    QUESTION_CONNECTIONS.forEach(([from, to]) => {
      if (from === index) related.add(to);
      if (to === index) related.add(from);
    });
    return related;
  };

  const activate = link => {
    if (!link || link.classList.contains("is-filtered")) return;
    activeLink = link;
    const index = Number(link.dataset.index);
    const related = relatedIndexes(index);
    const colour = link.dataset.colour || "#c8f169";

    stage.classList.add("has-active");
    stage.style.setProperty("--accent", colour);
    links.forEach(candidate => {
      const candidateIndex = Number(candidate.dataset.index);
      candidate.classList.toggle("is-active", candidate === link);
      candidate.classList.toggle("is-related", candidate !== link && related.has(candidateIndex));
    });

    lineElements.forEach(line => {
      const from = Number(line.dataset.from);
      const to = Number(line.dataset.to);
      line.classList.toggle("is-active", from === index || to === index);
    });

    if (mark) {
      mark.textContent = link.dataset.mark || "?";
      if (!prefersReducedMotion && typeof mark.animate === "function") {
        mark.animate([{ opacity:0, transform:"scale(.9) rotate(-4deg)" },{ opacity:.17, transform:"scale(1) rotate(-2deg)" }], { duration:340, easing:"cubic-bezier(.2,.8,.2,1)" });
      }
    }

    if (readoutIndex) readoutIndex.textContent = String(index + 1).padStart(2, "0");
    if (readoutTitle) readoutTitle.textContent = link.dataset.projectTitle || link.textContent.trim();
    if (readoutDescription) readoutDescription.textContent = link.dataset.description || "Open this project.";
    if (readoutAction) readoutAction.textContent = "Click to open ↗";
  };

  const reset = () => {
    activeLink = null;
    stage.classList.remove("has-active");
    stage.style.setProperty("--accent", "#c8f169");
    links.forEach(link => link.classList.remove("is-active","is-related"));
    lineElements.forEach(line => line.classList.remove("is-active"));
    if (mark) mark.textContent = "?";
    if (readoutIndex) readoutIndex.textContent = "00";
    if (readoutTitle) readoutTitle.textContent = "Move through the questions";
    if (readoutDescription) readoutDescription.textContent = "The links react, reveal their relationships and open the project directly.";
    if (readoutAction) readoutAction.textContent = "Select a question";
  };

  links.forEach(link => {
    link.addEventListener("pointerenter", () => activate(link));
    link.addEventListener("focus", () => activate(link));
    link.addEventListener("blur", () => {
      window.setTimeout(() => { if (!field.contains(document.activeElement)) reset(); }, 0);
    });
  });

  field.addEventListener("pointerleave", reset);

  /* ============================================================
     04. POINTER LIGHT, PARALLAX AND MAGNETIC LINKS
     ============================================================ */
  const clearMagnetism = () => {
    links.forEach(link => {
      link.style.setProperty("--mag-x", "0px");
      link.style.setProperty("--mag-y", "0px");
    });
  };

  stage.addEventListener("pointermove", event => {
    const bounds = stage.getBoundingClientRect();
    const localX = event.clientX - bounds.left;
    const localY = event.clientY - bounds.top;
    stage.style.setProperty("--mx", `${localX}px`);
    stage.style.setProperty("--my", `${localY}px`);

    if (prefersReducedMotion || window.innerWidth <= 760) return;

    fieldX = ((localX / bounds.width) - .5) * -10;
    fieldY = ((localY / bounds.height) - .5) * -7;
    field.style.setProperty("--field-x", `${fieldX}px`);
    field.style.setProperty("--field-y", `${fieldY}px`);
    svg.style.transform = `translate3d(${fieldX}px,${fieldY}px,0)`;

    links.forEach(link => {
      const linkBounds = link.getBoundingClientRect();
      const centreX = linkBounds.left + linkBounds.width / 2;
      const centreY = linkBounds.top + linkBounds.height / 2;
      const deltaX = event.clientX - centreX;
      const deltaY = event.clientY - centreY;
      const distance = Math.hypot(deltaX, deltaY);
      const influence = Math.max(0, 1 - distance / 190);
      link.style.setProperty("--mag-x", `${deltaX * influence * .055}px`);
      link.style.setProperty("--mag-y", `${deltaY * influence * .055}px`);
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
     05. CATEGORY FOCUS MODES
     ============================================================ */
  const applyFilter = filter => {
    filterButtons.forEach(button => button.setAttribute("aria-pressed", button.dataset.projectFilter === filter ? "true" : "false"));
    links.forEach(link => link.classList.toggle("is-filtered", filter !== "all" && link.dataset.group !== filter));
    lineElements.forEach(line => {
      const from = links[Number(line.dataset.from)];
      const to = links[Number(line.dataset.to)];
      line.classList.toggle("is-filtered", from?.classList.contains("is-filtered") || to?.classList.contains("is-filtered"));
    });
    reset();
  };

  filterButtons.forEach(button => button.addEventListener("click", () => applyFilter(button.dataset.projectFilter || "all")));

  /* ============================================================
     06. KEYBOARD SHORTCUTS
     ============================================================ */
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.querySelector("[data-directory-open]")?.click();
      return;
    }

    if (!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key) || !activeLink) return;
    event.preventDefault();
    const visibleLinks = links.filter(link => !link.classList.contains("is-filtered"));
    const currentIndex = visibleLinks.indexOf(activeLink);
    const direction = ["ArrowRight","ArrowDown"].includes(event.key) ? 1 : -1;
    visibleLinks[(currentIndex + direction + visibleLinks.length) % visibleLinks.length]?.focus();
  });

  /* ============================================================
     07. RESIZE AND FONT-LOAD SYNCHRONISATION
     ============================================================ */
  const resizeObserver = new ResizeObserver(scheduleLineUpdate);
  resizeObserver.observe(stage);
  links.forEach(link => resizeObserver.observe(link));
  window.addEventListener("resize", scheduleLineUpdate);
  document.fonts?.ready.then(scheduleLineUpdate);
  scheduleLineUpdate();
})();
