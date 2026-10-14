/**
 * @fileoverview Custom element <dark-mode> providing persistent theme toggling.
 * Respects OS preference (prefers-color-scheme) as default and safely handles localStorage.
 */

class DarkMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isDarkMode = this._getInitialTheme();
    this.toggleButton = null;
  }

  /**
   * Resolves the starting theme: explicit user choice > system OS preference.
   * @private
   * @returns {boolean}
   */
  _getInitialTheme() {
    try {
      const stored = localStorage.getItem("isDarkMode");
      if (stored !== null) {
        return stored === "1";
      }
    } catch {
      // Storage access blocked or restricted; fallback to OS query
    }

    // System OS preference fallback
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
    );
  }

  connectedCallback() {
    this.render();
    this.updateBodyClass();
    this.attachListener();
  }

  /**
   * Toggles theme state, updates persistent storage and DOM classes.
   */
  toggleDarkMode = () => {
    this.isDarkMode = !this.isDarkMode;
    try {
      localStorage.setItem("isDarkMode", this.isDarkMode ? "1" : "0");
    } catch {
      // Ignore storage write failures in restricted environments
    }
    this.updateBodyClass();
    this._syncAccessibilityAttributes();
  };

  /**
   * Applies appropriate body classes for theme styling.
   */
  updateBodyClass() {
    document.body.classList.toggle("is-dark-mode", this.isDarkMode);
    document.body.classList.toggle("is-light-mode", !this.isDarkMode);
  }

  /**
   * Synchronizes ARIA states on the toggle button for screen reader clarity.
   * @private
   */
  _syncAccessibilityAttributes() {
    if (this.toggleButton instanceof Element) {
      this.toggleButton.setAttribute("aria-pressed", String(this.isDarkMode));
      this.toggleButton.setAttribute(
        "aria-label",
        this.isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  /**
   * Attaches event listeners and sets initial ARIA attributes on the projected button.
   */
  attachListener() {
    this.toggleButton = this.querySelector('[slot="button"]');
    if (this.toggleButton instanceof Element) {
      this.toggleButton.addEventListener("click", this.toggleDarkMode);
      this._syncAccessibilityAttributes();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `<slot name="button"></slot>`;
  }
}

if (!customElements.get("dark-mode")) {
  customElements.define("dark-mode", DarkMode);
}
