/**
 * @fileoverview Custom element <word-limit> enforcing live character countdown.
 */

const CHARACTER_LIMIT = 200;

class WordLimit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.charactersLeft = CHARACTER_LIMIT;
    this.handleInput = this.updateCharacterLimitInfo.bind(this);
    this.textarea = null;
    this.message = null;
  }

  connectedCallback() {
    this.render();
    this.textarea = this.shadowRoot.querySelector("textarea");
    this.message = this.shadowRoot.querySelector("p");
    this.textarea?.addEventListener("input", this.handleInput);
  }

  disconnectedCallback() {
    this.textarea?.removeEventListener("input", this.handleInput);
  }

  updateCharacterLimitInfo() {
    const characterCount = this.getCharacterCount();
    this.charactersLeft = CHARACTER_LIMIT - characterCount;
    if (this.message) {
      this.message.textContent = `You have ${this.charactersLeft} characters remaining`;
    }
  }

  getCharacterCount() {
    return this.textarea?.value.length ?? 0;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          gap: var(--theme-spacing--1, 8px);
          border: 0;
          background: var(--theme-color--block, #f0f0f0);
          border-radius: var(--theme-border-radius, 8px);
          box-shadow: var(--theme-box-shadow, none);
          max-width: var(--theme-spacing--linelength, 70ch);
          padding: 0 var(--theme-spacing--1, 8px) var(--theme-spacing--3, 16px);
        }
        textarea {
          background: var(--theme-color--paper, #fff);
          border: 1px solid var(--theme-color--outline, #ccc);
          border-radius: var(--theme-border-radius, 8px);
          padding: 8px;
          font-family: inherit;
        }
        p {
          margin: 0;
          font-size: 0.9em;
        }
      </style>
      <h3>Character limit feedback</h3>
      <label for="comment-textarea">Your comments</label>
      <textarea
        id="comment-textarea"
        name="comment"
        rows="5"
        maxlength="${CHARACTER_LIMIT}"></textarea>
      <p aria-live="polite">You have <strong>${CHARACTER_LIMIT}</strong> characters remaining</p>
    `;
  }
}

if (!window.customElements.get("word-limit")) {
  window.customElements.define("word-limit", WordLimit);
}
