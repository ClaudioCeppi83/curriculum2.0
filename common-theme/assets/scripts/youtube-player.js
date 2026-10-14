/**
 * @fileoverview Custom element <youtube-player> for privacy-friendly lazy-loaded YouTube embeds.
 * Complies with W3C WAI-ARIA standards for keyboard navigation and defensive URL parsing.
 */

class YouTubePlayer extends HTMLElement {
  constructor() {
    super();
    this.src = this.getAttribute("data-src") || "";
    this.videoId = null;
    this.playlistId = null;
    this.startAt = null;

    this._parseSourceUrl(this.src);
    this.attachShadow({ mode: "open" });
  }

  /**
   * Defensively extracts video ID, playlist ID, and start timestamp from YouTube URL.
   * @private
   * @param {string} rawUrl
   */
  _parseSourceUrl(rawUrl) {
    if (!rawUrl) return;
    try {
      const url = new URL(rawUrl, window.location.origin);
      if (url.hostname === "youtu.be") {
        this.videoId = url.pathname.slice(1);
      } else {
        this.videoId = url.searchParams.get("v");
      }
      this.playlistId = url.searchParams.get("list");
      this.startAt = url.searchParams.get("index");
    } catch {
      // Invalid URL provided; videoId remains null
    }
  }

  connectedCallback() {
    if (!this.videoId) return;

    this.shadowRoot.innerHTML = `
      <style>
        .container {
          border-radius: var(--theme-border-radius, 8px);
          box-shadow: var(--theme-box-shadow, none);
          background-color: #000;
          overflow: hidden;
          width: 100%;
          max-width: 100%;
          aspect-ratio: 16 / 9;
          display: grid;
          grid-template: "thumbnail" auto / 1fr;
          place-items: center;
        }

        .thumbnail {
          grid-area: thumbnail;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          position: relative;
        }

        .thumbnail img {
          grid-area: 1 / 1;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .play-button {
          grid-area: 1 / 1;
          z-index: 2;
          cursor: pointer;
          font-size: 72px;
          filter: drop-shadow(var(--theme-drop-shadow, 0 4px 6px rgba(0,0,0,0.4)));
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
        }

        .play-button:hover,
        .play-button:focus-visible {
          transform: scale(1.2);
          outline: 2px solid var(--theme-color--accent, #5eead4);
          outline-offset: 4px;
          border-radius: 50%;
        }

        iframe {
          grid-area: thumbnail;
          aspect-ratio: 16 / 9;
          width: 100%;
          height: 100%;
          border: 0;
          animation: fade-in 0.3s ease-in-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      </style>

      <div class="container">
        <div class="thumbnail">
          <img src="//i.ytimg.com/vi/${this.videoId}/maxresdefault.jpg" alt="Video thumbnail">
          <div
            class="play-button"
            role="button"
            tabindex="0"
            aria-label="Play YouTube Video"
            title="Play video">📼</div>
        </div>
      </div>
    `;

    const playButton = this.shadowRoot.querySelector(".play-button");
    if (playButton) {
      playButton.addEventListener("click", () => this.injectIframe());
      playButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.injectIframe();
        }
      });
    }
  }

  /**
   * Swaps the static thumbnail with the responsive YouTube iframe upon interaction.
   */
  injectIframe() {
    const iframe = document.createElement("iframe");
    let iframeSrc = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&cc_load_policy=1`;
    if (this.playlistId) iframeSrc += `&list=${encodeURIComponent(this.playlistId)}`;
    if (this.startAt) iframeSrc += `&index=${encodeURIComponent(this.startAt)}`;

    iframe.setAttribute("src", iframeSrc);
    iframe.setAttribute("title", "YouTube Video Player");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );

    const container = this.shadowRoot.querySelector(".container");
    if (container) {
      container.classList.add("has-video");
      const thumb = this.shadowRoot.querySelector(".thumbnail");
      if (thumb) container.removeChild(thumb);
      container.appendChild(iframe);
      iframe.focus();
    }
  }
}

if (!customElements.get("youtube-player")) {
  customElements.define("youtube-player", YouTubePlayer);
}
