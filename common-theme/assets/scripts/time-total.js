/**
 * @fileoverview Custom element <time-total> calculating aggregated sprint time estimates.
 * Defensively extracts ISO duration values from datetime attributes and formats hours/minutes.
 */

class TimeTotal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.showTotalTime();
  }

  /**
   * Sums minute duration across all matching .c-block__time nodes.
   * @param {NodeList|Array<Element>} timeElements
   * @returns {number} Total duration in minutes
   */
  getTotalMinutes(timeElements) {
    return Array.from(timeElements).reduce((sum, el) => {
      const raw = el.getAttribute("datetime");
      if (!raw) return sum;
      // Handles formats like PT30M, P30M, PT1H30M
      const match = raw.match(/P(?:T)?(?:(\d+)H)?(?:(\d+)M)?/);
      if (!match) return sum;
      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      return sum + hours * 60 + minutes;
    }, 0);
  }

  /**
   * Decomposes total minutes into hours and remaining minutes.
   * @param {number} totalMinutes
   * @returns {{ hours: number, minutes: number }}
   */
  formatTime(totalMinutes) {
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    };
  }

  showTotalTime() {
    const timelineEntries = document.querySelectorAll(".c-block__time");
    const totalMinutes = this.getTotalMinutes(timelineEntries);
    if (totalMinutes <= 0) return;

    const { hours, minutes } = this.formatTime(totalMinutes);
    const timeElement = document.createElement("time");
    timeElement.textContent = `${hours}h ${minutes}m`;
    timeElement.setAttribute("datetime", `PT${hours}H${minutes}M`);
    timeElement.setAttribute("title", "Total time estimate for this session");

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(timeElement);
  }
}

if (!customElements.get("time-total")) {
  customElements.define("time-total", TimeTotal);
}
