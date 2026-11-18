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
      } catch (e) {}
    });
  }

  document.addEventListener(
    "click",
    (event) => {
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
      const nextUrl = new URL(link.href);
      nextUrl.searchParams.set("t", Date.now().toString());

      setTimeout(() => {
        window.location.replace(nextUrl.toString());
      }, 80);
    },
    true
  );

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
