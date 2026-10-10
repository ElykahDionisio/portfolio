const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll(".nav-list a");
const sections = document.querySelectorAll("#home, #projects, #contact");
const projectCards = document.querySelectorAll(".project-card");
const modal = document.getElementById("project-modal");
const modalTag = document.getElementById("modal-tag");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (theme === "dark") {
    themeIcon.textContent = "\u2600";
    themeToggle.setAttribute("aria-label", "Switch to light mode");
  } else {
    themeIcon.textContent = "\u263E";
    themeToggle.setAttribute("aria-label", "Switch to dark mode");
  }
}

function toggleTheme() {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

function setMenu(open) {
  siteNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function toggleMenu() {
  setMenu(!siteNav.classList.contains("open"));
}

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  let currentId = "home";

  sections.forEach(function (section) {
    if (scrollPos >= section.offsetTop) {
      currentId = section.id;
    }
  });

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    currentId = "contact";
  }

  navLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

function openProject(card) {
  modalTag.textContent = card.querySelector(".tag").textContent;
  modalTitle.textContent = card.querySelector("h3").textContent;
  modalContent.innerHTML = "";

  card.querySelector(".project-details").childNodes.forEach(function (node) {
    modalContent.appendChild(node.cloneNode(true));
  });

  const image = modalContent.querySelector("img");
  if (image) {
    image.addEventListener("error", function () {
      image.remove();
    });
  }

  modal.showModal();
}

projectCards.forEach(function (card) {
  card.addEventListener("click", function () {
    openProject(card);
  });
});

modalClose.addEventListener("click", function () {
  modal.close();
});

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.close();
  }
});

themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setMenu(false);
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

window.addEventListener("scroll", updateActiveLink);

initTheme();
updateActiveLink();