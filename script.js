
/*
  Christian Ybañez portfolio interactions.
  Keep project details here so case studies can be updated in one place.
  Add genuine repository or prototype URLs to a project's links array when available.
*/
const projectData = {
  evote: {
    title: "E-VOTE",
    category: "MOBILE APPLICATION / SCHOOL VOTING",
    images: ["images/evote-1.jpg", "images/evote-2.jpg", "images/evote-3.jpg", "images/evote-4.jpg"],
    overview: "A mobile voting system designed for school elections and voting events. It gives students a digital way to vote while providing tools for administrators to manage election activities.",
    goal: "Make school voting activities easier to carry out through a mobile experience, with dedicated tools for the people managing an election.",
    contribution: "I contributed to the interface, the voting flow, and the database structure, alongside other parts of the application.",
    focus: "Keeping the voting steps understandable and organizing the information needed for elections, candidates, and results.",
    next: "I'd like to keep improving the user experience and strengthen testing around different voting scenarios.",
    highlights: ["Digital student voting flow", "Election and candidate management", "Voting results", "Mobile interface and database work"],
    technologies: ["Dart", "Flutter", "Firebase", "Firestore", "Mobile Development"],
    links: []
  },
  cafe: {
    title: "Kaventra Café",
    category: "UI/UX DESIGN / WEBSITE CONCEPT",
    images: ["images/cafe-1.jpg", "images/cafe-2.jpg", "images/cafe-3.jpg"],
    overview: "A café website concept where I explored what a clean, welcoming online experience could look like through design and prototyping.",
    goal: "Create a simple, appealing website concept that fits a café's visual identity and feels easy to navigate.",
    contribution: "I designed the page layout, visual style, interface elements, and an interactive prototype in Figma.",
    focus: "Typography, spacing, layout consistency, and the way different parts of the interface work together.",
    next: "I'd like to test the prototype with users and explore how the design would translate into a responsive website.",
    highlights: ["Website layout concept", "Figma interface design", "Typography and visual styling", "Interactive prototype"],
    technologies: ["Figma", "UI/UX Design", "Web Design", "Prototyping"],
    links: []
  },
  database: {
    title: "Student Database",
    category: "DATABASE DESIGN / DATA ORGANIZATION",
    images: ["images/database-1.jpg", "images/database-2.jpg"],
    overview: "A database project built around organizing student information and the records connected to it.",
    goal: "Keep student-related information structured so the relationships between different records are easier to understand.",
    contribution: "I worked on the database structure, entity relationships, and the way the information was organized.",
    focus: "Thinking through how data connects before building the database structure, rather than keeping everything in one place.",
    next: "I'd like to expand the documentation with sample queries and more examples of how the database is used.",
    highlights: ["Student information organization", "Database tables and relationships", "Entity-relationship design", "SQL-based data structure"],
    technologies: ["SQL", "Database Design", "ERD", "Data Management"],
    links: []
  },
  portfolio: {
    title: "Portfolio Website",
    category: "FRONT-END DEVELOPMENT / PERSONAL WEBSITE",
    images: ["images/portfolio-1.jpg", "images/portfolio-2.jpg"],
    overview: "The site you're browsing now. I built it to bring my projects, interests, and technical skills into one easy-to-explore place.",
    goal: "Create a personal website that clearly presents who I am and gives visitors a closer look at the work I've done.",
    contribution: "I designed and developed the site using HTML, CSS, and JavaScript, including the project cards, gallery, and responsive layout.",
    focus: "Readable content, consistent styling, mobile-friendly layouts, and keyboard-friendly interactions.",
    next: "I'll continue refining the case studies and testing accessibility and performance as the site grows.",
    highlights: ["Responsive layouts", "Project case-study gallery", "Mobile navigation", "Accessible dialog behavior and theme toggle"],
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    links: []
  }
};

/* Project filters: categories and clickable skills */
const projectCards = [...document.querySelectorAll(".project-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];
const filterStatus = document.getElementById("filterStatus");
const emptyProjects = document.getElementById("emptyProjects");

function filterProjects(type, value = "all") {
  const normalized = value.toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matches = type === "skill"
      ? card.dataset.tech.split(",").some((tech) => tech.trim() === normalized)
      : normalized === "all" || card.dataset.category === normalized;

    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    const active = type === "category" && button.dataset.filter === normalized;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (type === "skill") {
    filterStatus.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"} using ${value}`;
  } else if (normalized === "all") {
    filterStatus.textContent = `Showing all ${visibleCount} projects`;
  } else {
    filterStatus.textContent = `${visibleCount} ${value} project${visibleCount === 1 ? "" : "s"}`;
  }

  const selectedSkill = type === "skill";
  document.querySelectorAll(".skill-chip").forEach((button) => {
    button.setAttribute("aria-pressed", String(selectedSkill && button.dataset.skill.toLowerCase() === normalized));
  });

  if (visibleCount === 0) {
    document.getElementById("emptyProjectsTitle").textContent = "No matching featured project yet";
    document.getElementById("emptyProjectsMessage").textContent = selectedSkill
      ? `I haven't featured a project using ${value} here yet. You can still explore my other work.`
      : "Try another category or view all of my projects.";
  }
  emptyProjects.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects("category", button.dataset.filter));
});

document.querySelectorAll(".skill-chip").forEach((button) => {
  button.addEventListener("click", () => {
    filterProjects("skill", button.dataset.skill);
    document.getElementById("projects").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });
});

document.getElementById("resetFilter").addEventListener("click", () => filterProjects("category", "all"));

/* Project dialog */
const modal = document.getElementById("projectModal");
const modalPanel = modal.querySelector(".modal-panel");
const modalImage = document.getElementById("modalImage");
const galleryFallback = document.getElementById("galleryFallback");
const galleryDots = document.getElementById("galleryDots");
const galleryCount = document.getElementById("galleryCount");
const closeModalButton = document.getElementById("closeModal");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const pageRegions = [document.querySelector(".site-header"), document.getElementById("main"), document.querySelector(".footer"), document.getElementById("backToTop")];
let activeProject = null;
let activeImageIndex = 0;
let returnFocusTo = null;

function fillText(id, value) {
  document.getElementById(id).textContent = value;
}

function fillTags(id, values) {
  const container = document.getElementById(id);
  container.replaceChildren();
  values.forEach((value) => {
    const tag = document.createElement("span");
    tag.textContent = value;
    container.appendChild(tag);
  });
}

function fillHighlights(items) {
  const list = document.getElementById("modalHighlights");
  list.replaceChildren();
  items.forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = item;
    list.appendChild(entry);
  });
}

function fillResourceLinks(links) {
  const container = document.getElementById("projectResources");
  container.replaceChildren();
  links.forEach(({ label, url }) => {
    if (typeof url !== "string" || !/^https:\/\//i.test(url)) return;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = `${label} ↗`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    container.appendChild(link);
  });
}

function updateGallery() {
  if (!activeProject || !activeProject.images.length) return;
  const filename = activeProject.images[activeImageIndex];
  galleryFallback.hidden = true;
  modalImage.hidden = false;
  modalImage.alt = `${activeProject.title}, screenshot ${activeImageIndex + 1} of ${activeProject.images.length}`;
  modalImage.src = filename;
  galleryCount.textContent = `${activeImageIndex + 1} / ${activeProject.images.length}`;
  [...galleryDots.children].forEach((dot, index) => {
    const selected = index === activeImageIndex;
    dot.classList.toggle("active", selected);
    dot.setAttribute("aria-current", String(selected));
  });
}

function moveGallery(direction) {
  if (!activeProject || activeProject.images.length < 2) return;
  activeImageIndex = (activeImageIndex + direction + activeProject.images.length) % activeProject.images.length;
  updateGallery();
}

function showProject(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;
  returnFocusTo = document.activeElement;
  activeProject = project;
  activeImageIndex = 0;
  fillText("modalCategory", project.category);
  fillText("modalTitle", project.title);
  fillText("modalOverview", project.overview);
  fillText("modalGoal", project.goal);
  fillText("modalContribution", project.contribution);
  fillText("modalFocus", project.focus);
  fillText("modalNext", project.next);
  fillHighlights(project.highlights);
  fillTags("modalTech", project.technologies);
  fillResourceLinks(project.links);

  galleryDots.replaceChildren();
  project.images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show screenshot ${index + 1} of ${project.images.length}`);
    dot.addEventListener("click", () => { activeImageIndex = index; updateGallery(); });
    galleryDots.appendChild(dot);
  });
  const multipleImages = project.images.length > 1;
  galleryPrev.hidden = !multipleImages;
  galleryNext.hidden = !multipleImages;
  galleryDots.hidden = !multipleImages;
  updateGallery();

  modal.hidden = false;
  document.body.classList.add("modal-open");
  pageRegions.forEach((region) => { region.inert = true; });
  modalPanel.scrollTop = 0;
  closeModalButton.focus();
}

function closeProject() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  pageRegions.forEach((region) => { region.inert = false; });
  activeProject = null;
  activeImageIndex = 0;
  modalImage.removeAttribute("src");
  if (returnFocusTo && returnFocusTo.isConnected) returnFocusTo.focus();
  returnFocusTo = null;
}

document.querySelectorAll(".project-trigger").forEach((button) => {
  button.addEventListener("click", () => showProject(button.dataset.project));
});
closeModalButton.addEventListener("click", closeProject);
galleryPrev.addEventListener("click", () => moveGallery(-1));
galleryNext.addEventListener("click", () => moveGallery(1));
modal.addEventListener("click", (event) => { if (event.target === modal) closeProject(); });
modalImage.addEventListener("error", () => {
  if (modal.hidden) return;
  modalImage.hidden = true;
  galleryFallback.hidden = false;
  galleryFallback.textContent = "Screenshot not found. Add the image file to the images folder.";
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;
  if (event.key === "Escape") { event.preventDefault(); closeProject(); return; }
  if (event.key === "ArrowRight") { event.preventDefault(); moveGallery(1); return; }
  if (event.key === "ArrowLeft") { event.preventDefault(); moveGallery(-1); return; }
  if (event.key !== "Tab") return;

  const focusable = [...modalPanel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.closest("[hidden]") && !element.hidden);
  if (!focusable.length) { event.preventDefault(); modalPanel.focus(); return; }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

/* Mobile navigation */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
function closeMenu() {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.querySelector("span").textContent = "☰";
}
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  menuToggle.querySelector("span").textContent = isOpen ? "×" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("is-open")) { closeMenu(); menuToggle.focus(); }
});
window.addEventListener("resize", () => { if (window.innerWidth > 1120) closeMenu(); });

/* Light/dark theme, with saved preference when storage is available */
const themeToggle = document.getElementById("themeToggle");
let storedTheme = null;
try { storedTheme = localStorage.getItem("portfolio-theme"); } catch (_) { /* Storage is optional. */ }
function setTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeToggle.querySelector("span").textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#101a18" : "#f7f8f5");
}
setTheme(storedTheme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(next);
  try { localStorage.setItem("portfolio-theme", next); } catch (_) { /* Keep the current-session theme. */ }
});

/* Friendly fallback when a portrait or project screenshot is missing */
const profilePhoto = document.getElementById("profilePhoto");
function showMissingProfile() { profilePhoto.closest(".portrait-frame").classList.add("image-missing"); }
profilePhoto.addEventListener("error", showMissingProfile);
if (profilePhoto.complete && profilePhoto.naturalWidth === 0) showMissingProfile();
document.querySelectorAll(".project-cover img").forEach((image) => {
  const showFallback = () => image.closest(".project-cover").classList.add("image-missing");
  image.addEventListener("error", showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

/* Show the résumé download only if the real PDF exists on the site */
if (window.location.protocol === "http:" || window.location.protocol === "https:") {
  fetch("assets/resume.pdf", { method: "HEAD" })
    .then((response) => {
      if (!response.ok || !response.headers.get("content-type")?.includes("pdf")) return;
      document.getElementById("resumeLink").hidden = false;
      document.getElementById("resumeRequest").hidden = true;
    })
    .catch(() => { /* Keep the email request link if the file is unavailable. */ });
}

/* Back to top and current year */
const backToTop = document.getElementById("backToTop");
function updateBackToTop() { backToTop.classList.toggle("show", window.scrollY > 450); }
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
document.getElementById("currentYear").textContent = new Date().getFullYear();
