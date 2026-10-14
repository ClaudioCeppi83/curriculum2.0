/**
 * @fileoverview StopWatch utility attaching interactive countdown timers to sprint blocks.
 * Employs Web Audio API synth tones for audible completion alerts with defensive user-interaction checks.
 */

class StopWatch {
  constructor() {
    if (StopWatch.instance) {
      return StopWatch.instance;
    }
    this.attachListener();
    StopWatch.instance = this;
  }

  /**
   * Binds click and keydown handlers to block time badges.
   */
  attachListener() {
    const timeElements = document.querySelectorAll(".c-block__time");

    timeElements.forEach((timeElement) => {
      timeElement.setAttribute("tabindex", "0");
      timeElement.setAttribute("role", "button");
      timeElement.setAttribute("aria-label", "Start countdown timer");

      timeElement.addEventListener("keydown", (event) => {
        if (
          (event.key === "Enter" || event.key === " ") &&
          !timeElement.classList.contains("is-active")
        ) {
          event.preventDefault();
          this.startTimer(timeElement);
        }
      });

      timeElement.addEventListener("click", () => {
        if (!timeElement.classList.contains("is-active")) {
          this.startTimer(timeElement);
        }
      });
    });
  }

  /**
   * Starts countdown timer on the clicked element.
   * @param {Element} timeElement
   */
  startTimer(timeElement) {
    const datetime = timeElement.getAttribute("datetime");
    const duration = this.parseDuration(datetime);

    if (!this.isValidDuration(duration)) {
      return;
    }

    const startTime = Date.now();
    timeElement.classList.add("is-active");

    const timerInterval = setInterval(() => {
      const remainingTime = this.updateTime(timeElement, startTime, duration);

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timeElement.classList.remove("is-active");
        this.playAlarm(2, 200, 200);
      }
    }, 1000);
  }

  /**
   * Plays audible completion chimes using Web Audio API synthesis.
   * @param {number} repetitions
   * @param {number} delayBetweenRepetitions
   * @param {number} delayBetweenSounds
   */
  playAlarm(repetitions, delayBetweenRepetitions, delayBetweenSounds) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();

      const playSound = async () => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
        oscillator.connect(audioCtx.destination);
        oscillator.start();

        await new Promise((resolve) => setTimeout(resolve, delayBetweenSounds));
        oscillator.stop();
      };

      const playNextRepetition = async (repetitionIndex) => {
        if (repetitionIndex <= repetitions) {
          await playSound();
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenRepetitions)
          );
          await playNextRepetition(repetitionIndex + 1);
        } else {
          audioCtx.close();
        }
      };

      if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => playNextRepetition(0));
      } else {
        playNextRepetition(0);
      }
    } catch {
      // Audio playback unavailable or blocked by browser policy
    }
  }

  /**
   * Parses duration string (e.g., PT30M, P15M) into milliseconds.
   * @param {string|null} datetime
   * @returns {number}
   */
  parseDuration(datetime) {
    if (!datetime) return NaN;
    const match = datetime.match(/P(?:T)?(\d+)M/);
    if (!match) return NaN;
    const minutes = parseInt(match[1], 10);
    return minutes * 60 * 1000;
  }

  isValidDuration(duration) {
    return !isNaN(duration) && duration > 0;
  }

  updateTime(element, startTime, duration) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const remainingTime = duration - elapsedTime;

    if (remainingTime <= 0) {
      element.textContent = "Finished! 🔔";
      return 0;
    }

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    element.textContent = `${minutes}m ${seconds.toString().padStart(2, "0")}s ⏱`;
    return remainingTime;
  }
}

const stopwatchInstance = new StopWatch();
export default stopwatchInstance;
