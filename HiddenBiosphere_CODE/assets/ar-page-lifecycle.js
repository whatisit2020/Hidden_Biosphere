(() => {
  "use strict";

  const RELOAD_FLAG = "hidden-biosphere-ar-reload";
  let leaving = false;

  const navigation = performance.getEntriesByType("navigation")[0];
  const isReload = navigation && navigation.type === "reload";

  if (!isReload) {
    window.location.reload();
    return;
  }

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

  document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.querySelector("a.back");

    if (!backButton) return;

    backButton.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      leaveARPage(backButton.href);
    });
  });

  window.addEventListener("pagehide", stopCamera);

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
})();
