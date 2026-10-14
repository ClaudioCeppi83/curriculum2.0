/**
 * @fileoverview Handles flash alerts passed via URL query parameters (?message= or ?error=).
 * Remediated against DOM XSS by strictly utilizing textContent for parameter insertion.
 */

class AlertMessage {
  constructor() {
    /** @type {Element|null} */
    const alertEl = document.querySelector(".c-alert");
    if (!(alertEl instanceof Element)) return;

    this.alertEl = alertEl;
    this.attachCloseListener();
    this.show();
  }

  /**
   * Binds the click handler to close/hide the alert container.
   */
  attachCloseListener() {
    const alertClose = this.alertEl.querySelector(".close");
    if (alertClose instanceof Element) {
      alertClose.addEventListener("click", () => {
        this.alertEl.setAttribute("hidden", "true");
      });
    }
  }

  /**
   * Safely extracts and sanitizes query parameter values for alerts.
   * @returns {{ message: string|null, error: string|null }}
   */
  getUrlAlertParameters() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        message: urlParams.get("message"),
        error: urlParams.get("error"),
      };
    } catch {
      return { message: null, error: null };
    }
  }

  /**
   * Displays the alert box if either 'message' or 'error' exists.
   * Uses textContent to guarantee immunity against malicious script injection.
   */
  show() {
    const { message, error } = this.getUrlAlertParameters();
    const messageContainer = this.alertEl.querySelector(".alert__message");
    if (!messageContainer) return;

    if (message) {
      this.alertEl.removeAttribute("hidden");
      this.alertEl.classList.remove("c-alert--warning");
      this.alertEl.classList.add("c-alert--info");
      messageContainer.textContent = message;
    } else if (error) {
      this.alertEl.removeAttribute("hidden");
      this.alertEl.classList.remove("c-alert--info");
      this.alertEl.classList.add("c-alert--warning");
      messageContainer.textContent = error;
    }
  }
}

// Auto-initialize when script loads
new AlertMessage();
