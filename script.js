// Elements
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

// Set the theme and update the toggle button icon and label
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

// Switch between light and dark, then save the choice
function toggleTheme() {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
}

// Use the saved theme on load, or the device's theme if none is saved
function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

// Open or close the mobile menu
function setMenu(open) {
  siteNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

// Open the menu if it's closed, close it if it's open
function toggleMenu() {
  setMenu(!siteNav.classList.contains("open"));
}

// Highlight the nav link of the section currently on screen
function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  let currentId = "home";

  // Find the last section we've scrolled past
  sections.forEach(function (section) {
    if (scrollPos >= section.offsetTop) {
      currentId = section.id;
    }
  });

  // At the bottom of the page, highlight "contact"
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    currentId = "contact";
  }

  navLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

// Fill the modal with the card's info, then show it
function openProject(card) {
  modalTag.textContent = card.querySelector(".tag").textContent;
  modalTitle.textContent = card.querySelector("h3").textContent;
  modalContent.innerHTML = "";

  // Copy the card's details into the modal
  card.querySelector(".project-details").childNodes.forEach(function (node) {
    modalContent.appendChild(node.cloneNode(true));
  });

  // Remove the image if it fails to load
  const image = modalContent.querySelector("img");
  if (image) {
    image.addEventListener("error", function () {
      image.remove();
    });
  }

  modal.showModal();
}

// ----- Events -----

// Click a project card to open the modal
projectCards.forEach(function (card) {
  card.addEventListener("click", function () {
    openProject(card);
  });
});

// Close the modal with the close button
modalClose.addEventListener("click", function () {
  modal.close();
});

// Close the modal when clicking outside it
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.close();
  }
});

themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", toggleMenu);

// Close the menu after clicking a nav link
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    setMenu(false);
  });
});

// Close the menu when pressing Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

// Update the active link while scrolling
window.addEventListener("scroll", updateActiveLink);

// Start
initTheme();
updateActiveLink();