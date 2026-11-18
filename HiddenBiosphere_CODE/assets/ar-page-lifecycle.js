(() => {
  "use strict";

  let isNavigating = false;

  // 1. 카메라 스트림 안전하게 종료
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

  // 2. 링크 클릭 시 URL에 파라미터를 붙이지 않고 깨끗한 원래 주소로 이동
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

      // URL을 변형하지 않고 원래 href 그대로 이동 (NFT 상대 경로 보호)
      const cleanUrl = link.href.split("?")[0];
      setTimeout(() => {
        window.location.href = cleanUrl;
      }, 250);
    },
    true
  );

  // 3. AR 페이지 도착 후 2.5초 뒤에도 비디오 태그 자체가 없으면 딱 1번만 새로고침
  window.addEventListener("load", () => {
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const reloadFlagKey = "ar_auto_reloaded:" + window.location.pathname;

    // 이미 자동 새로고침을 한 번 했다면 플래그를 지우고 종료 (무한 루프 방지)
    if (sessionStorage.getItem(reloadFlagKey) === "1") {
      sessionStorage.removeItem(reloadFlagKey);
      return;
    }

    setTimeout(() => {
      // 권한 팝업이 떠 있거나 승인 직후라면 <video> 태그는 이미 생성되어 있음
      const arVideo = document.querySelector("#arjs-video, video");

      // 비디오 태그조차 아예 생성되지 않은 먹통 상태일 때만 1회 새로고침
      if (!arVideo) {
        sessionStorage.setItem(reloadFlagKey, "1");
        releaseCamera();
        window.location.reload();
      }
    }, 2500);
  });

  // 브라우저 뒤로가기(bfcache) 복원 시 새로고침
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
