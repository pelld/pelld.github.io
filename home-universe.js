/* ============================================================
   00. PROJECT DATA
   ============================================================ */
const universeProjects = [
  { title:"Population Health: The Whole System", short:"Whole system", type:"Interactive systems map", description:"Follow the relationships between wider determinants, prevention, treatment and recovery—and keep asking why.", url:"https://pelld.github.io/population-health-system-explorer/", colour:"#71e2bd", x:.67, y:.25, radius:38 },
  { title:"Population Health: Size of the Prize", short:"Size of the prize", type:"Decision support prototype", description:"Explore how interventions affect the whole person and compare health, financial and societal returns.", url:"https://pelld.github.io/population-health-size-of-prize/", colour:"#d9f279", x:.84, y:.38, radius:31 },
  { title:"Population Health Atlas", short:"Health atlas", type:"Geographic analysis", description:"Investigate where recorded long-term conditions cluster and what remains after adjustment for deprivation.", url:"https://pelld.github.io/population-health-atlas/", colour:"#78b9ef", x:.73, y:.57, radius:34 },
  { title:"P-Value Explorer", short:"P-value explorer", type:"PubMed evidence explorer", description:"Search abstracts, extract reported p-values and inspect their distribution around the 0.05 threshold.", url:"https://pelld.github.io/p-value-explorer/", colour:"#aa8df4", x:.91, y:.68, radius:29 },
  { title:"Where Is the Art?", short:"Where is the art?", type:"Interactive art map", description:"Search by artist or place to discover where artworks are held and what can be seen nearby.", url:"https://pelld.github.io/where-is-the-art/", colour:"#ff9775", x:.56, y:.72, radius:40 },
  { title:"Quiz Duel Stars", short:"Quiz duel", type:"Two-device game", description:"Fast head-to-head trivia played together from different phones and different locations.", url:"https://pelld.github.io/quiz-duel-stars/", colour:"#f3d864", x:.42, y:.48, radius:30 },
  { title:"Amelia in Nepal", short:"Amelia in Nepal", type:"Personal adventure", description:"A personalised journey through the mountains, built as a playable web adventure.", url:"https://pelld.github.io/amelia-nepal-game/", colour:"#80d9c8", x:.47, y:.23, radius:27 },
  { title:"Hunter's Dirt Bike Adventure", short:"Dirt bike adventure", type:"Action game", description:"Ride, jump and perform tricks across a game-world inspired by the North Pennines.", url:"https://pelld.github.io/hunter-dirt-bike-adventure/", colour:"#eeb06f", x:.30, y:.68, radius:31 },
  { title:"Animal Dash", short:"Animal dash", type:"Arcade game", description:"A bright and simple action game designed for younger players and quick bursts of play.", url:"https://pelld.github.io/animal-dash/", colour:"#ef8db3", x:.24, y:.35, radius:26 }
];

const universeConnections = [[0,1],[0,2],[0,4],[0,6],[1,2],[1,3],[2,3],[2,4],[4,6],[4,7],[5,6],[5,7],[5,8],[6,8],[7,8]];

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
  const activeNumber = document.getElementById("universe-active-number");
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
  let startTime = performance.now();

  const nodes = universeProjects.map((project, index) => ({ ...project, index, px:0, py:0, displayX:0, displayY:0, velocityX:0, velocityY:0 }));

  /* ============================================================
     02. RESIZE AND POSITION NODES
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
      node.px = mobile ? width * (.12 + node.x * .76) : width * node.x;
      node.py = mobile ? height * (.39 + node.y * .49) : height * node.y;
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
    activeNumber.textContent = String(index + 1).padStart(2, "0");
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
      const driftX = prefersReducedMotion ? 0 : Math.sin(elapsed * .48 + node.index * 1.9) * 8;
      const driftY = prefersReducedMotion ? 0 : Math.cos(elapsed * .42 + node.index * 1.4) * 7;
      let targetX = node.px + driftX - scrollProgress * (node.index % 2 ? 24 : -18);
      let targetY = node.py + driftY - scrollProgress * (20 + node.index * 2);

      if (pointer.active) {
        const dx = targetX - pointer.x;
        const dy = targetY - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 190 && distance > 0) {
          const force = (190 - distance) / 190;
          targetX += (dx / distance) * force * 30;
          targetY += (dy / distance) * force * 30;
        }
      }

      node.displayX += (targetX - node.displayX) * (prefersReducedMotion ? 1 : .055);
      node.displayY += (targetY - node.displayY) * (prefersReducedMotion ? 1 : .055);

      if (pointer.active) {
        const distance = Math.hypot(node.displayX - pointer.x, node.displayY - pointer.y);
        if (distance < node.radius + 34 && distance < closestDistance) { closestDistance = distance; hoverProject = node.index; }
      }
    });

    universe.style.cursor = hoverProject >= 0 ? "pointer" : "default";
    if (hoverProject >= 0) selectProject(hoverProject);

    /* Draw connections behind the nodes. */
    universeConnections.forEach(([fromIndex, toIndex]) => {
      const from = nodes[fromIndex];
      const to = nodes[toIndex];
      const highlighted = [fromIndex, toIndex].includes(hoverProject >= 0 ? hoverProject : selectedProject);
      const gradient = context.createLinearGradient(from.displayX, from.displayY, to.displayX, to.displayY);
      gradient.addColorStop(0, hexToRgba(from.colour, highlighted ? .62 : .19));
      gradient.addColorStop(1, hexToRgba(to.colour, highlighted ? .62 : .19));
      context.strokeStyle = gradient;
      context.lineWidth = highlighted ? 1.7 : .8;
      context.beginPath();
      context.moveTo(from.displayX, from.displayY);
      context.lineTo(to.displayX, to.displayY);
      context.stroke();
    });

    /* Draw each node, its orbit and its label. */
    nodes.forEach(node => {
      const activeIndex = hoverProject >= 0 ? hoverProject : selectedProject;
      const active = node.index === activeIndex;
      const radius = node.radius * (active ? 1.18 : 1);

      context.strokeStyle = hexToRgba(node.colour, active ? .5 : .13);
      context.lineWidth = 1;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius + (active ? 19 : 11), 0, Math.PI * 2);
      context.stroke();

      const glow = context.createRadialGradient(node.displayX, node.displayY, 2, node.displayX, node.displayY, radius * 2.3);
      glow.addColorStop(0, hexToRgba(node.colour, active ? .68 : .38));
      glow.addColorStop(1, hexToRgba(node.colour, 0));
      context.fillStyle = glow;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius * 2.3, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = node.colour;
      context.beginPath();
      context.arc(node.displayX, node.displayY, radius, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(12,13,19,.88)";
      context.beginPath();
      context.arc(node.displayX, node.displayY, Math.max(8, radius - 9), 0, Math.PI * 2);
      context.fill();

      context.fillStyle = node.colour;
      context.beginPath();
      context.arc(node.displayX, node.displayY, active ? 7 : 5, 0, Math.PI * 2);
      context.fill();

      if (width >= 720 || active) {
        context.font = `${active ? 700 : 600} ${active ? 12 : 10}px "DM Sans", sans-serif`;
        const textWidth = context.measureText(node.short).width;
        const labelWidth = textWidth + 22;
        const labelX = node.displayX - labelWidth / 2;
        const labelY = node.displayY + radius + 17;
        roundedRect(labelX, labelY, labelWidth, 27, 13.5);
        context.fillStyle = active ? "rgba(247,247,242,.96)" : "rgba(22,23,31,.78)";
        context.fill();
        context.fillStyle = active ? "#171820" : "rgba(255,255,255,.78)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(node.short, node.displayX, labelY + 13.5);
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
