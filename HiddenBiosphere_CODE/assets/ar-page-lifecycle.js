(() => {
  "use strict";

  let leaving = false;

  function stopCamera() {
    const streams = new Set();

    document.querySelectorAll("video").forEach((video) => {
      if (video.srcObject instanceof MediaStream) {
        streams.add(video.srcObject);
      }
    });

    const scene = document.querySelector("a-scene");

    if (scene && scene.systems && scene.systems.arjs) {
      const arjsSystem = scene.systems.arjs;
      const source = arjsSystem._arToolkitSource;

      if (source && source.domElement) {
        const element = source.domElement;

        if (element.srcObject instanceof MediaStream) {
          streams.add(element.srcObject);
        }
      }
    }

    streams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        if (track.readyState !== "ended") {
          track.stop();
        }
      });
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

      const destination = backButton.href;

      if (!destination) return;

      event.preventDefault();
      leaveARPage(destination);
    });
  });

  window.addEventListener("pagehide", () => {
    stopCamera();
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
  const navigation = performance.getEntriesByType("navigation")[0];
  const isReload = navigation && navigation.type === "reload";

  if (!isReload) {
    window.location.reload();
  }
})();
