/* ============================================================
   00. AUTOMATIC GITHUB PAGES DIRECTORY
   Reads public repositories from GitHub and lists those with
   GitHub Pages enabled. Curated showcase content remains in HTML.
   Root-repository mini-sites are supplied explicitly because the
   GitHub repository API cannot discover them as separate projects.
   ============================================================ */

const DIRECTORY_CONFIG = {
  githubUser: "pelld",
  rootRepository: "pelld.github.io",
  excludedRepositories: ["our-days"],
  apiUrl: "https://api.github.com/users/pelld/repos?per_page=100&sort=updated",

  embeddedSites: [
    { name: "departement-spotter", description: "Collect French départements as you spot their numbers on vehicle plates.", homepage: "https://pelld.github.io/departement-spotter/", topics: ["game"] },
    { name: "number-plates", description: "Explore current European number plates and what their markings mean.", homepage: "https://pelld.github.io/number-plates/", topics: ["reference"] },
    { name: "vehicle-spotter", description: "Count the vehicle makes and models you see on the road.", homepage: "https://pelld.github.io/vehicle-spotter/", topics: ["game"] }
  ],

  fallbackRepositories: [
    { name: "gallery", description: "Move through a three-dimensional gallery of paintings and open the works from their frames." },
    { name: "orrery", description: "A photorealistic WebGL orrery used as an experimental way to navigate projects." },
    { name: "livingearth", description: "Explore plate boundaries, volcanoes and recent earthquakes on an interactive world map." },
    { name: "homeplanet", description: "A solar-system homepage experiment with planets, moons, a comet and asteroid-belt links." },
    { name: "topthat", description: "A quick Top Trumps-style card game across themed decks." },
    { name: "touch", description: "A minimal full-screen colour experiment driven by touch duration." },
    { name: "GYW", description: "Interactive anatomy, process, history and repair of Goodyear-welt shoe construction." },
    { name: "moons", description: "Learn and practise the major moons of the planets in the Solar System." },
    { name: "tree", description: "Explore museum-quality insect photographs at their original detail." },
    { name: "Candela", description: "Interactive GCSE physics revision with questions and simulations." },
    { name: "Verbum", description: "Build English, French and Spanish vocabulary with recall and review." },
    { name: "patient-flow-explorer", description: "Explore patient pathways, demand, delay and capacity." },
    { name: "where-is-the-art", description: "Find artworks and museums by artist or location." },
    { name: "population-health-system-explorer", description: "Explore relationships across the population health system." },
    { name: "population-health-size-of-prize", description: "Explore the potential impact of population health interventions." },
    { name: "population-health-atlas", description: "Explore geographic clustering in recorded condition prevalence." },
    { name: "p-value-explorer", description: "Inspect p-values reported in PubMed abstracts." },
    { name: "quiz-duel-stars", description: "A head-to-head quiz played across two devices." },
    { name: "amelia-nepal-game", description: "A personalised mountain adventure." },
    { name: "hunter-dirt-bike-adventure", description: "Ride and perform tricks across the North Pennines." },
    { name: "dirt-bike-dash", description: "A quick two-player dirt-bike challenge." },
    { name: "animal-dash", description: "A bright action game for younger players." }
  ]
};

const DISPLAY_NAMES = {
  "patient-flow-explorer": "Patient Flow Explorer",
  "where-is-the-art": "Where Is the Art?",
  "population-health-system-explorer": "Population Health: The Whole System",
  "population-health-size-of-prize": "Population Health: Size of the Prize",
  "population-health-atlas": "Population Health Atlas",
  "p-value-explorer": "P-Value Explorer",
  "quiz-duel-stars": "Quiz Duel Stars",
  "amelia-nepal-game": "Amelia in Nepal",
  "hunter-dirt-bike-adventure": "Hunter's Dirt Bike Adventure",
  "dirt-bike-dash": "Dirt Bike Dash",
  "animal-dash": "Animal Dash",
  "Verbum": "Verbum",
  "Candela": "Candela",
  "tree": "Natural History Close-Up",
  "departement-spotter": "Département Spotter",
  "number-plates": "Platewise",
  "vehicle-spotter": "Road Spotter",
  "moons": "Moon Atlas",
  "touch": "Touch",
  "GYW": "Goodyear Welt",
  "topthat": "Top That",
  "homeplanet": "Home Planet",
  "livingearth": "Living Earth",
  "gallery": "Gallery",
  "orrery": "Orrery"
};

const DESCRIPTION_OVERRIDES = {
  "moons": "Learn and practise the major moons of the planets in the Solar System.",
  "touch": "A minimal full-screen colour experiment: touch and hold the surface to paint through the spectrum.",
  "GYW": "Take apart Goodyear-welt shoe construction through interactive anatomy, process, history and repair.",
  "topthat": "A quick Top Trumps-style card game across themed decks including vehicles, animals and moons.",
  "homeplanet": "A solar-system homepage experiment with planets, moons, a comet and asteroid-belt links.",
  "livingearth": "Explore plate boundaries, volcanoes and recent earthquakes on an interactive world map.",
  "gallery": "Move through a three-dimensional gallery of paintings and open the works from their frames.",
  "orrery": "A photorealistic WebGL orrery used as an experimental way to navigate projects."
};

/* ============================================================
   01. DISPLAY HELPERS
   GitHub topics provide deliberate grouping. Repository names
   are used only as a fallback when a topic has not been added.
   ============================================================ */

function titleFromRepository(name) {
  return DISPLAY_NAMES[name] || name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function descriptionFromRepository(repository) {
  return DESCRIPTION_OVERRIDES[repository.name] || repository.description || "A public GitHub Pages project.";
}

function categoryFromRepository(repository) {
  const topics = repository.topics || [];
  if (repository.name === "Verbum" || repository.name === "Candela" || repository.name === "moons") return "Learning";
  if (repository.name === "tree") return "Natural history";
  if (repository.name === "number-plates") return "Reference";
  if (repository.name === "GYW") return "Explainer";
  if (repository.name === "livingearth") return "Map";
  if (["touch", "homeplanet", "gallery", "orrery"].includes(repository.name)) return "Experiment";
  if (repository.name === "topthat" || topics.includes("game") || /game|dash|quiz|spotter/.test(repository.name)) return "Game";
  if (topics.includes("population-health") || repository.name.startsWith("population-health-") || repository.name === "patient-flow-explorer") return "Population health";
  if (topics.includes("evidence") || /p-value|evidence/.test(repository.name)) return "Evidence";
  if (topics.includes("tool")) return "Tool";
  return "Web project";
}

function pagesUrl(repository) {
  return repository.homepage && /^https:\/\/pelld\.github\.io\//.test(repository.homepage) ? repository.homepage : `https://${DIRECTORY_CONFIG.githubUser}.github.io/${repository.name}/`;
}

/* ============================================================
   02. DIRECTORY RENDERING
   Text is inserted with textContent so repository data cannot
   inject HTML into the homepage.
   ============================================================ */

function renderDirectory(repositories) {
  const container = document.getElementById("site-directory");
  if (!container) return;
  container.replaceChildren();

  repositories.forEach(repository => {
    const card = document.createElement("a");
    const category = document.createElement("span");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const link = document.createElement("b");
    const projectDescription = descriptionFromRepository(repository);

    card.className = "directory-card";
    card.href = pagesUrl(repository);
    card.dataset.search = `${titleFromRepository(repository.name)} ${categoryFromRepository(repository)} ${projectDescription}`.toLowerCase();
    category.textContent = categoryFromRepository(repository);
    title.textContent = titleFromRepository(repository.name);
    description.textContent = projectDescription;
    link.textContent = "Open site";
    card.append(category, title, description, link);
    container.append(card);
  });
}

/* ============================================================
   03. DRAWER INTERACTION
   ============================================================ */

function initialiseDirectoryDrawer() {
  const layer = document.getElementById("directory-drawer-layer");
  const search = document.getElementById("directory-search");
  const openButtons = [...document.querySelectorAll("[data-directory-open]")];
  const closeButtons = [...document.querySelectorAll("[data-directory-close]")];
  if (!layer || openButtons.length === 0) return;

  let lastFocusedElement = null;

  const openDrawer = () => {
    lastFocusedElement = document.activeElement;
    document.body.classList.add("directory-open");
    layer.setAttribute("aria-hidden", "false");
    window.setTimeout(() => search?.focus(), 40);
  };

  const closeDrawer = () => {
    document.body.classList.remove("directory-open");
    layer.setAttribute("aria-hidden", "true");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  openButtons.forEach(button => button.addEventListener("click", openDrawer));
  closeButtons.forEach(button => button.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("directory-open")) closeDrawer(); });

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("#site-directory .directory-card").forEach(card => { card.hidden = query.length > 0 && !card.dataset.search.includes(query); });
  });
}

/* ============================================================
   04. GITHUB DISCOVERY WITH ROOT-SITE MERGE AND STATIC FALLBACK
   Root-repository projects are merged with repository Pages sites.
   The fallback keeps the directory useful if GitHub's public API is
   temporarily unavailable or rate-limited.
   ============================================================ */

function mergeUniqueProjects(projects) {
  const seen = new Set();
  return projects.filter(project => {
    const key = pagesUrl(project).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadDirectory() {
  try {
    const response = await fetch(DIRECTORY_CONFIG.apiUrl, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repositories = await response.json();
    const visiblePages = repositories.filter(repository => repository.has_pages && !repository.archived && repository.name !== DIRECTORY_CONFIG.rootRepository && !DIRECTORY_CONFIG.excludedRepositories.includes(repository.name) && !(repository.topics || []).includes("hide-from-homepage"));
    renderDirectory(mergeUniqueProjects([...DIRECTORY_CONFIG.embeddedSites, ...visiblePages]));
  } catch (error) {
    console.warn("Automatic GitHub Pages discovery failed; using the saved directory.", error);
    renderDirectory(mergeUniqueProjects([...DIRECTORY_CONFIG.embeddedSites, ...DIRECTORY_CONFIG.fallbackRepositories]));
  }
}

initialiseDirectoryDrawer();
loadDirectory();
