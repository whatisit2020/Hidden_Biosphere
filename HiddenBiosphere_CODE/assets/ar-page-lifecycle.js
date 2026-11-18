(() => {
  "use strict";

  let isNavigating = false;

  function releaseCamera() {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      try {
        const stream = video.srcObject;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((track) => {
            if (track.readyState !== "ended") {
              track.stop();
            }
          });
        }
        video.pause();
        video.srcObject = null;
        video.removeAttribute("src");
        video.load();
      } catch (e) {
      }
    });
  }

  function handleNavigationClick(event) {
    const link = event.target.closest("a");
    if (!link || !link.href) return;

    const hrefAttr = link.getAttribute("href") || "";
    if (
      link.target === "_blank" ||
      link.origin !== window.location.origin ||
      hrefAttr.startsWith("#") ||
      hrefAttr.startsWith("javascript:")
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isNavigating) return;
    isNavigating = true;

    releaseCamera();

    setTimeout(() => {
      window.location.href = link.href;
    }, 50);
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
  window.addEventListener("beforeunload", releaseCamera);

  document.addEventListener("click", handleNavigationClick, true);
})();
