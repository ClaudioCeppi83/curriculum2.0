/**
 * @fileoverview Core application runtime scripts for MigraCode curriculum.
 * Manages responsive off-canvas menu toggle, keyboard shortcuts, editable code mirrors,
 * interactive card flips, GFM task list accessibility, and print optimization.
 */

// ============================================================================
// 1. Off-Canvas Site Navigation Menu
// ============================================================================
const menuToggles = document.querySelectorAll(".js-menu-toggle");
const menu = document.getElementById("site-menu");
const main = document.getElementById("main");
const skipLink = document.getElementById("skip-link");

/**
 * Toggles the drawer menu visibility and manages focus trapping / inert states.
 */
function toggleMenu() {
  if (!menu || !main) return;

  const isActive = menu.classList.toggle("is-active");
  menu.toggleAttribute("hidden", !isActive);
  main.toggleAttribute("inert", isActive);

  if (isActive) {
    menu.focus();
  } else if (skipLink) {
    skipLink.focus({ preventScroll: true });
  }
}

// Bind click handlers to all nominated toggle buttons
menuToggles.forEach((toggle) => toggle.addEventListener("click", toggleMenu));

// Keyboard shortcuts for menu management
window.addEventListener("keydown", (e) => {
  // ESC key closes active menu
  if (e.key === "Escape" && menu?.classList.contains("is-active")) {
    toggleMenu();
  }
  // Meta + '/' (Cmd+/ or Ctrl+/) toggles menu
  if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    toggleMenu();
  }
});

// ============================================================================
// 2. Interactive Flashcards (Double Click & Keyboard Flip)
// ============================================================================
const cards = document.querySelectorAll("[data-card]");
cards.forEach((card) => {
  card.addEventListener("dblclick", () => {
    card.classList.toggle("is-active");
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-active");
    }
  });
});

// ============================================================================
// 3. Editable In-Browser Code Snippets
// ============================================================================
const editableCodeBlocks = document.querySelectorAll("code[data-lang]");
editableCodeBlocks.forEach((block) => {
  block.setAttribute("contenteditable", "true");
  block.setAttribute("spellcheck", "false");
  block.setAttribute("autocorrect", "off");
  block.setAttribute("autocapitalize", "off");
});

// ============================================================================
// 4. GitHub-Flavored Markdown (GFM) Task Lists Enhancement
// ============================================================================
window.addEventListener("DOMContentLoaded", () => {
  const taskListItems = document.querySelectorAll(
    "ul > li > input[type=checkbox]"
  );
  taskListItems.forEach((checkbox) => {
    checkbox.removeAttribute("disabled");
    const parentLi = checkbox.parentNode;
    if (parentLi && !parentLi.querySelector("label")) {
      const label = document.createElement("label");
      label.className = "c-task-list__label";
      while (parentLi.firstChild) {
        label.appendChild(parentLi.firstChild);
      }
      parentLi.appendChild(label);
    }
  });
});

// ============================================================================
// 5. Print Optimization (Expand Collapsed Sections for Printing)
// ============================================================================
window.addEventListener("beforeprint", () => {
  document.querySelectorAll("details").forEach((d) => d.setAttribute("open", ""));
});
