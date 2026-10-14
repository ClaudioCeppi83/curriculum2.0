/**
 * @fileoverview Custom element <tab-panels> providing accessible tab switching.
 * Follows W3C WAI-ARIA Tab Pattern with full keyboard arrow navigation and leak-free lifecycle.
 */

class TabPanels extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._onHashChange = this._onHashChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    this.render();
    this._addEventListeners();

    if (window.location.hash) {
      this._handleFragmentNavigation(window.location.hash);
    }
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this._onHashChange);
    this.removeEventListener("keydown", this._onKeyDown);
  }

  render() {
    this.shadowRoot.innerHTML = `<slot></slot>`;
  }

  /**
   * Binds user interaction listeners to tab triggers and URL hash updates.
   * @private
   */
  _addEventListeners() {
    this.addEventListener("click", (e) => {
      const target = e.target.closest('[data-toggle="tab"]');
      if (target) {
        e.preventDefault();
        this._activateTab(target);
      }
    });

    this.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("hashchange", this._onHashChange);
  }

  /**
   * Keyboard navigation per W3C APG: Arrow keys navigate between tabs.
   * @private
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    const tabs = Array.from(this.querySelectorAll('[data-toggle="tab"]'));
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      tabs[nextIndex].focus();
      this._activateTab(tabs[nextIndex]);
    }
  }

  /**
   * Handles browser back/forward and deep linking to specific tab ids.
   * @private
   */
  _onHashChange() {
    this._handleFragmentNavigation(window.location.hash);
  }

  /**
   * Activates matching tab based on hash fragment.
   * @private
   * @param {string} hash
   */
  _handleFragmentNavigation(hash) {
    if (!hash) return;
    const tabId = hash.substring(1);
    const tabToFocus = this.querySelector(`[aria-controls="${tabId}"]`);
    if (tabToFocus) {
      this._activateTab(tabToFocus);
    }
  }

  /**
   * Toggles active and ARIA states across tabs and panel counterparts.
   * @private
   * @param {Element} clickedTab
   */
  _activateTab(clickedTab) {
    const targetPanelId = clickedTab.getAttribute("aria-controls");
    const targetPanel = targetPanelId ? this.querySelector(`#${targetPanelId}`) : null;

    const tabs = this.querySelectorAll('[data-toggle="tab"]');
    const tabPanels = this.querySelectorAll('[role="tabpanel"]');

    tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
      tab.classList.remove("is-active");
    });

    tabPanels.forEach((panel) => {
      panel.classList.remove("is-active");
      panel.setAttribute("hidden", "true");
    });

    clickedTab.setAttribute("aria-selected", "true");
    clickedTab.setAttribute("tabindex", "0");
    clickedTab.classList.add("is-active");

    if (targetPanel) {
      targetPanel.classList.add("is-active");
      targetPanel.removeAttribute("hidden");
    }
  }
}

if (!window.customElements.get("tab-panels")) {
  window.customElements.define("tab-panels", TabPanels);
}
