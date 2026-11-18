
(() => {
  "use strict";

  let leaving = false;
  
  function stopCamera() {
    document.querySelectorAll("video").forEach((video) => {
      const stream = video.srcObject;

      if (stream && typeof stream.getTracks === "function") {
        stream.getTracks().forEach((track) => {
          if (track.readyState !== "ended") {
            track.stop();
          }
        });
      }
    });
  }

  function leaveARPage(destination) {
    if (leaving) return;

    leaving = true;
    stopCamera();

    window.setTimeout(() => {
      window.location.assign(destination);
    }, 200);
  }

  function initializeBackButton() {
    const backButton = document.querySelector("a.back");

    if (!backButton) return;

    backButton.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button > 0
      ) {
        return;
      }

      event.preventDefault();
      leaveARPage(backButton.href);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeBackButton
    );
  } else {
    initializeBackButton();
  }

  window.addEventListener("pagehide", stopCamera);

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    const key =
      "hb-ar-entry-reload:" +
      window.location.pathname;

    try {
      sessionStorage.setItem(key, String(Date.now()));
    } catch (error) {
      console.warn("Session storage unavailable", error);
    }

    window.location.reload();
  });
})();
