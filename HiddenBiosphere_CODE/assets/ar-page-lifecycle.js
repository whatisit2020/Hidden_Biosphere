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

      // URL에 ?t= 등을 붙이지 않고 깨끗한 원래 주소로 이동 (NFT 오류 방지)
      const cleanUrl = link.href.split("?")[0];
      setTimeout(() => {
        window.location.href = cleanUrl;
      }, 250);
    },
    true
  );

  // 3. AR 페이지 진입 시 실제 카메라 영상이 나오는지 검사 후 1회 자동 새로고침
  window.addEventListener("load", () => {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const reloadFlagKey = "ar_force_reload:" + window.location.pathname;

    // 이미 자동 새로고침을 1회 실행했다면 플래그를 지우고 종료 (무한 루프 차단)
    if (sessionStorage.getItem(reloadFlagKey) === "1") {
      sessionStorage.removeItem(reloadFlagKey);
      return;
    }

    // 1.2초 뒤 실제 카메라 영상이 재생 중인지 확인
    setTimeout(() => {
      const arVideo = document.querySelector("#arjs-video, video");
      const isCameraWorking =
        arVideo &&
        arVideo.srcObject &&
        arVideo.readyState >= 2 &&
        arVideo.videoWidth > 0;

      // 껍데기 video만 있고 실제 카메라 영상이 안 나오면 1회 자동 새로고침 실행
      if (!isCameraWorking) {
        sessionStorage.setItem(reloadFlagKey, "1");
        releaseCamera();
        window.location.reload();
      }
    }, 1200);
  });

  // 브라우저 뒤로가기(bfcache) 복원 시 새로고침
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
