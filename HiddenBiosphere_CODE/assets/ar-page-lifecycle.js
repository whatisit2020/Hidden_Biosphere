(() => {
  "use strict";

  let isNavigating = false;

  // 1. 카메라 스트림 완전히 종료
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
        video.remove();
      } catch (e) {}
    });
  }

  // 2. 링크 클릭 시 URL 변경 없이 카메라 정리 후 이동
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

      // URL에 파라미터를 붙이지 않고 깨끗한 원래 주소로 이동 (NFT 보호)
      const cleanUrl = link.href.split("?");
      setTimeout(() => {
        window.location.href = cleanUrl;
      }, 250);
    },
    true
  );

  // 3. 실제 카메라 영상이 나오는지 검사 후 필요 시 자동 새로고침 (무한 루프 방지 포함)
  function checkAndReloadIfNeeded() {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const reloadTimeKey = "ar_last_reload:" + window.location.pathname;
    const lastReloadTime = Number(sessionStorage.getItem(reloadTimeKey) || 0);

    // 방금(4초 이내에) 자동 새로고침을 이미 실행했다면 무한 루프 방지를 위해 중단
    if (Date.now() - lastReloadTime < 4000) {
      return;
    }

    setTimeout(() => {
      const arVideo = document.querySelector("#arjs-video, video");
      const isCameraWorking =
        arVideo &&
        arVideo.srcObject &&
        arVideo.readyState >= 2 &&
        arVideo.videoWidth > 0;

      // 카메라 영상이 안 나오고 있으면 현재 시각을 기록하고 즉시 새로고침
      if (!isCameraWorking) {
        try {
          sessionStorage.setItem(reloadTimeKey, String(Date.now()));
        } catch (e) {}
        releaseCamera();
        window.location.reload();
      }
    }, 1200);
  }

  // 일반 페이지 로드 시 검사
  window.addEventListener("load", checkAndReloadIfNeeded);

  // 뒤로가기/캐시 복원(pageshow) 시에도 검사 및 즉시 새로고침
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      releaseCamera();
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
