/* ============================================================
   00. AUTOMATIC GITHUB PAGES DIRECTORY
   Reads public repositories from GitHub and lists those with
   GitHub Pages enabled. Curated showcase content remains in HTML.
   ============================================================ */

const DIRECTORY_CONFIG = {
  githubUser: "pelld",
  rootRepository: "pelld.github.io",
  excludedRepositories: ["our-days"],
  apiUrl: "https://api.github.com/users/pelld/repos?per_page=100&sort=updated",
  fallbackRepositories: [
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
  "where-is-the-art": "Where Is the Art?",
  "population-health-system-explorer": "Population Health: The Whole System",
  "population-health-size-of-prize": "Population Health: Size of the Prize",
  "population-health-atlas": "Population Health Atlas",
  "p-value-explorer": "P-Value Explorer",
  "quiz-duel-stars": "Quiz Duel Stars",
  "amelia-nepal-game": "Amelia in Nepal",
  "hunter-dirt-bike-adventure": "Hunter's Dirt Bike Adventure",
  "dirt-bike-dash": "Dirt Bike Dash",
  "animal-dash": "Animal Dash"
};

/* ============================================================
   01. DISPLAY HELPERS
   GitHub topics provide deliberate grouping. Repository names
   are used only as a fallback when a topic has not been added.
   ============================================================ */

function titleFromRepository(name) {
  return DISPLAY_NAMES[name] || name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function categoryFromRepository(repository) {
  const topics = repository.topics || [];
  if (topics.includes("game") || /game|dash|quiz/.test(repository.name)) return "Game";
  if (topics.includes("population-health") || repository.name.startsWith("population-health-")) return "Population health";
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
  container.replaceChildren();

  repositories.forEach(repository => {
    const card = document.createElement("a");
    const category = document.createElement("span");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const link = document.createElement("b");

    card.className = "directory-card";
    card.href = pagesUrl(repository);
    category.textContent = categoryFromRepository(repository);
    title.textContent = titleFromRepository(repository.name);
    description.textContent = repository.description || "A public GitHub Pages project.";
    link.textContent = "Open site ↗";
    card.append(category, title, description, link);
    container.append(card);
  });
}

/* ============================================================
   03. GITHUB DISCOVERY WITH STATIC FALLBACK
   The fallback ensures the directory remains useful if GitHub's
   public API is temporarily unavailable or rate-limited.
   ============================================================ */

async function loadDirectory() {
  try {
    const response = await fetch(DIRECTORY_CONFIG.apiUrl, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repositories = await response.json();
    const visiblePages = repositories.filter(repository => repository.has_pages && !repository.archived && repository.name !== DIRECTORY_CONFIG.rootRepository && !DIRECTORY_CONFIG.excludedRepositories.includes(repository.name) && !(repository.topics || []).includes("hide-from-homepage"));
    renderDirectory(visiblePages);
  } catch (error) {
    console.warn("Automatic GitHub Pages discovery failed; using the saved directory.", error);
    renderDirectory(DIRECTORY_CONFIG.fallbackRepositories);
  }
}

loadDirectory();
