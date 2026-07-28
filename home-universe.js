/* ============================================================
   00. PROJECT DATA
   ============================================================ */
const universeProjects = [
  { title:"Population Health: The Whole System", short:"Whole system", type:"Interactive systems map", description:"Follow the relationships between wider determinants, prevention, treatment and recovery—and keep asking why.", url:"https://pelld.github.io/population-health-system-explorer/", colour:"#71e2bd", x:.66, y:.22, radius:28 },
  { title:"Population Health: Size of the Prize", short:"Size of the prize", type:"Decision support prototype", description:"Explore how interventions affect the whole person and compare health, financial and societal returns.", url:"https://pelld.github.io/population-health-size-of-prize/", colour:"#d9f279", x:.9, y:.31, radius:25 },
  { title:"Population Health Atlas", short:"Health atlas", type:"Geographic analysis", description:"Investigate where recorded long-term conditions cluster and what remains after adjustment for deprivation.", url:"https://pelld.github.io/population-health-atlas/", colour:"#78b9ef", x:.76, y:.52, radius:27 },
  { title:"P-Value Explorer", short:"P-value explorer", type:"PubMed evidence explorer", description:"Search abstracts, extract reported p-values and inspect their distribution around the 0.05 threshold.", url:"https://pelld.github.io/p-value-explorer/", colour:"#aa8df4", x:.94, y:.61, radius:23 },
  { title:"Where Is the Art?", short:"Where is the art?", type:"Interactive art map", description:"Search by artist or place to discover where artworks are held and what can be seen nearby.", url:"https://pelld.github.io/where-is-the-art/", colour:"#ff9775", x:.62, y:.65, radius:31 },
  { title:"Quiz Duel Stars", short:"Quiz duel", type:"Two-device game", description:"Fast head-to-head trivia played together from different phones and different locations.", url:"https://pelld.github.io/quiz-duel-stars/", colour:"#f3d864", x:.49, y:.46, radius:24 },
  { title:"Amelia in Nepal", short:"Amelia in Nepal", type:"Personal adventure", description:"A personalised journey through the mountains, built as a playable web adventure.", url:"https://pelld.github.io/amelia-nepal-game/", colour:"#80d9c8", x:.48, y:.2, radius:22 },
  { title:"Hunter's Dirt Bike Adventure", short:"Dirt bike adventure", type:"Action game", description:"Ride, jump and perform tricks across a game-world inspired by the North Pennines.", url:"https://pelld.github.io/hunter-dirt-bike-adventure/", colour:"#eeb06f", x:.4, y:.67, radius:25 },
  { title:"Animal Dash", short:"Animal dash", type:"Arcade game", description:"A bright and simple action game designed for younger players and quick bursts of play.", url:"https://pelld.github.io/animal-dash/", colour:"#ef8db3", x:.31, y:.35, radius:21 }
];

const universeConnections = [[0,1],[0,2],[0,4],[0,6],[1,2],[1,3],[2,3],[2,4],[4,6],[5,6],[5,7],[5,8],[7,8]];

/* ============================================================
   01. INITIALISE THE CANVAS AND INTERFACE
   ============================================================ */
(() => {
  const canvas = document.getElementById("universe-canvas");
  const universe = document.querySelector(".project-universe");
  if (!canvas || !universe) return;

  const context = canvas.getContext("2d");
  const panelIndex = document.getElementById("universe-panel-index");
  const panelType = document.getElementById("universe-panel-type");
  const panelTitle = document.getElementById("universe-panel-title");
  const panelDescription = document.getElementById("universe-panel-description");
  const panelLink = document.getElementById("universe-panel-link");
  const accessibleButtons = [...document.querySelectorAll(".universe-accessible-list button")];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let selectedProject = 0;
  let hoverProject = -1;
  let pointer = { x:-1000, y:-1000, active:false };
  let scrollProgress = 0;
  let animationFrame = 0;
  const startTime = performance.now();

  const nodes = universeProjects.map((project, index) => ({ ...project, index, px:0, py:0, displayX:0, displayY:0 }));

  /* ============================================================
     02. RESIZE AND POSITION NODES
     Desktop nodes are deliberately constrained to the right so
     the graphic supports the headline rather than crossing it.
     ============================================================ */
  const resize = () => {
    const bounds = universe.getBoundingClientRect();
    width = Math.max(320, bounds.width);
    height = Math.max(560, bounds.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    nodes.forEach(node => {
      const mobile = width < 720;
      node.px = mobile ? width * (.1 + node.x * .8) : width * (.54 + node.x * .43);
      node.py = mobile ? height * (.4 + node.y * .45) : height * (.08 + node.y * .76);
      if (!node.displayX) { node.displayX = node.px; node.displayY = node.py; }
    });
  };

  /* ============================================================
     03. PROJECT SELECTION
     ============================================================ */
  const selectProject = (index, pin = false) => {
    const project = universeProjects[index];
    if (!project) return;
    if (pin) selectedProject = index;
    panelIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(universeProjects.length).padStart(2, "0")}`;
    panelType.textContent = project.type;
    panelTitle.textContent = project.title;
    panelDescription.textContent = project.description;
    panelLink.href = project.url;
    accessibleButtons.forEach((button, buttonIndex) => button.setAttribute("aria-pressed", buttonIndex === index ? "true" : "false"));
  };

  accessibleButtons.forEach(button => button.addEventListener("click", () => selectProject(Number(button.dataset.project), true)));

  /* ============================================================
     04. POINTER, TOUCH AND SCROLL INPUT
     ============================================================ */
  const setPointer = event => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  };

  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerleave", () => { pointer.active = false; hoverProject = -1; selectProject(selectedProject); });
  canvas.addEventListener("pointerdown", event => {
    setPointer(event);
    if (hoverProject >= 0) selectProject(hoverProject, true);
  });

  window.addEventListener("scroll", () => {
    const bounds = universe.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
  }, { passive:true });

  window.addEventListener("resize", resize);

  /* ============================================================
     05. DRAW HELPERS
     ============================================================ */
  const hexToRgba = (hex, alpha) => {
    const value = parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  };

  const roundedRect = (x, y, w, h, radius) => {
    const r = Math.min(radius, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  };

  /* ============================================================
     06. ANIMATION LOOP
     ============================================================ */
  const draw = now => {
    const elapsed = (now - startTime) / 1000;
    context.clearRect(0, 0, width, height);

    hoverProject = -1;
    let closestDistance = Number.POSITIVE_INFINITY;

    nodes.forEach(node => {
      const driftX = prefersReducedMotion ? 0 : Math.sin(elapsed * .42 + node.index * 1.9) * 6;
      const driftY = prefersReducedMotion ? 0 : Math.cos(elapsed * .38 + node.index * 1.4) * 5;
      let targetX = node.px + driftX - scrollProgress * (node.index % 2 ? 14 : -10);
      let targetY = node.py + driftY - scrollProgress * (14 + node.index);

      if (pointer.active) {
        const dx = targetX - pointer.x;
        const dy = targetY - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150;
          targetX += (dx / distance) * force * 20;
          targetY += (dy / distance) * force * 20;
        }
      }

      node.displayX += (targetX - node.displayX) * (prefersReducedMotion ? 1 : .06);
      node.displayY += (targetY - node.displayY) * (prefersReducedMotion ? 1 : .06);

      if (pointer.active) {
        const distance = Math.hypot(node.displayX - pointer.x, node.displayY - pointer.y);
        if (distance < node.radius + 28 && distance < closestDistance) { closestDistance = distance; hoverProject = node.index; }
      }
    });

    canvas.style.cursor = hoverProject >= 0 ? "pointer" : "default";
    if (hoverProject >= 0) selectProject(hoverProject);

    /* Draw restrained connections behind the nodes. */
    universeConnections.forEach(([fromIndex, toIndex]) => {
      const from = nodes[fromIndex];
      const to = nodes[toIndex];
      const highlighted = [fromIndex, toIndex].includes(hoverProject >= 0 ? hoverProject : selectedProject);
      const gradient = context.createLinearGradient(from.displayX, from.displayY, to.displayX, to.displayY);
      gradient.addColorStop(0, hexToRgba(from.colour, highlighted ? .42 : .1));
      gradient.addColorStop(1, hexToRgba(to.colour, highlighted ? .42 : .1));
      context.strokeStyle = gradient;
      context.lineWidth = highlighted ? 1.3 : .65;
      context.beginPath();
      context.moveTo(from.displayX, from.displayY);
      context.lineTo(to.displayX, to.displayY);
      context.stroke();
    });

    /* Only the active node receives a label. */
    nodes.forEach(node => {
      const activeIndex = hoverProject >= 0 ? hoverProject : selectedProject;
      const active = node.index === activeIndex;
      const radius = node.radius * (active ? 1.16 : 1);

      context.strokeStyle = hexToRgba(node.colour, active ? .46 : .09);
      context.lineWidth = 1;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius + (active ? 16 : 9), 0, Math.PI * 2);
      context.stroke();

      const glow = context.createRadialGradient(node.displayX, node.displayY, 2, node.displayX, node.displayY, radius * 2.15);
      glow.addColorStop(0, hexToRgba(node.colour, active ? .52 : .24));
      glow.addColorStop(1, hexToRgba(node.colour, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius * 2.15, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = node.colour;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(12,13,19,.9)";
      context.beginPath();
      context.arc(node.displayX, node.displayY, Math.max(7, radius - 7), 0, Math.PI * 2);
      context.fill();

      context.fillStyle = node.colour;
      context.beginPath();
      context.arc(node.displayX, node.displayY, active ? 6 : 4, 0, Math.PI * 2);
      context.fill();

      if (active) {
        context.font = `700 ${width < 720 ? 10 : 11}px "DM Sans", sans-serif`;
        const textWidth = context.measureText(node.short).width;
        const labelWidth = textWidth + 20;
        const labelX = node.displayX - labelWidth / 2;
        const labelY = node.displayY + radius + 14;
        roundedRect(labelX, labelY, labelWidth, 25, 12.5);
        context.fillStyle = "rgba(247,247,242,.94)";
        context.fill();
        context.fillStyle = "#171820";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(node.short, node.displayX, labelY + 12.5);
      }
    });

    if (!prefersReducedMotion) animationFrame = requestAnimationFrame(draw);
  };

  resize();
  selectProject(0, true);
  if (prefersReducedMotion) draw(performance.now());
  else animationFrame = requestAnimationFrame(draw);

  window.addEventListener("pagehide", () => cancelAnimationFrame(animationFrame), { once:true });
})();
