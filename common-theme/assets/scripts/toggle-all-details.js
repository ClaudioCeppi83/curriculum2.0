/**
 * @fileoverview Custom element <toggle-all-details> expanding/collapsing all <details> elements on page.
 */

class ToggleAllDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.toggleDetails = this.toggleDetails.bind(this);
    this.details = [];
    this.toggleButton = null;
  }

  connectedCallback() {
    this.render();
    this.cacheDOM();
    this.attachListener();
    this.toggleOnHashChange();
  }

  disconnectedCallback() {
    this.toggleButton?.removeEventListener("click", this.toggleDetails);
  }

  cacheDOM() {
    this.details = Array.from(document.querySelectorAll("details"));
    this.toggleButton = this.querySelector('[slot="button"]');
  }

  toggleDetails() {
    this.details.forEach((detail) => {
      detail.open = !detail.open;
    });
  }

  attachListener() {
    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", this.toggleDetails);
    }
  }

  toggleOnHashChange() {
    if (window.location.hash === "#toggle-details") {
      this.toggleDetails();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `<slot name="button"></slot>`;
  }
}

if (!customElements.get("toggle-all-details")) {
  customElements.define("toggle-all-details", ToggleAllDetails);
}
