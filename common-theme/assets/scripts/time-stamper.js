/**
 * @fileoverview Custom element <time-stamper> annotating blocks with chronological timestamps.
 * Increments starting schedule time sequentially per block duration.
 */

class TimeStamper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.timelineEntries = this.querySelectorAll(
      ".c-block:not(.is-nested .c-block)"
    );
    this.startTime = this.getAttribute("start-time") || "10:00";
  }

  connectedCallback() {
    this.stampTime();
  }

  /**
   * Iterates through timetable blocks and assigns progressive clock times.
   */
  stampTime() {
    let currentTime = new Date(`1970-01-01T${this.startTime}`);
    if (isNaN(currentTime.getTime())) {
      currentTime = new Date("1970-01-01T10:00:00");
    }

    this.timelineEntries.forEach((entry) => {
      const timeElement = entry.querySelector(".c-block__time");
      if (!timeElement) return;

      const raw = timeElement.getAttribute("datetime");
      let minutes = 0;
      if (raw) {
        const match = raw.match(/P(?:T)?(?:(\d+)H)?(?:(\d+)M)?/);
        if (match) {
          const h = parseInt(match[1] || "0", 10);
          const m = parseInt(match[2] || "0", 10);
          minutes = h * 60 + m;
        }
      }

      const hours = currentTime.getHours().toString().padStart(2, "0");
      const mins = currentTime.getMinutes().toString().padStart(2, "0");
      timeElement.textContent = `⏰ ${hours}:${mins}`;

      currentTime.setMinutes(currentTime.getMinutes() + minutes);
    });
  }
}

if (!customElements.get("time-stamper")) {
  customElements.define("time-stamper", TimeStamper);
}
