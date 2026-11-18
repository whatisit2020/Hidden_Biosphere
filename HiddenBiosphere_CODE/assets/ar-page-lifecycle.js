(() => {
  "use strict";

  let isNavigating = false;

  // 1. 실행 중인 카메라 스트림 완전히 종료
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

  // 2. 모든 이동 링크(<a>) 클릭 시 카메라를 끄고 깨끗한 원래 주소로 이동
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

      // [0]을 붙여 순수 URL 문자열만 추출 (NFT 경로 오류 방지)
      const cleanUrl = link.href.split("?")[0];

      setTimeout(() => {
        window.location.href = cleanUrl;
      }, 300);
    },
    true
  );

  // 3. AR 페이지 도착 후 카메라 영상이 정상 재생되는지 확인하고 안 나오면 1회 새로고침
  function ensureCameraStarts() {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const reloadTimeKey = "ar_last_reload:" + window.location.pathname;
    const lastReloadTime = Number(sessionStorage.getItem(reloadTimeKey) || 0);

    // 방금(5초 이내에) 자동 새로고침을 실행했다면 무한 루프 방지를 위해 대기
    if (Date.now() - lastReloadTime < 5000) {
      return;
    }

    setTimeout(() => {
      const arVideo = document.querySelector("#arjs-video, video");
      const isCameraWorking =
        arVideo &&
        arVideo.srcObject &&
        arVideo.readyState >= 2 &&
        arVideo.videoWidth > 0;

      if (!isCameraWorking) {
        try {
          sessionStorage.setItem(reloadTimeKey, String(Date.now()));
        } catch (e) {}
        releaseCamera();
        window.location.reload();
      }
    }, 1500);
  }

  if (document.readyState === "complete") {
    ensureCameraStarts();
  } else {
    window.addEventListener("load", ensureCameraStarts);
  }

  // 뒤로가기/캐시 복원(pageshow) 시 즉시 새로고침
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      releaseCamera();
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
