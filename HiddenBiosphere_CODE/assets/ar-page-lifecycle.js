(() => {
  "use strict";

  // 1. 현재 켜진 카메라 스트림 강제 종료
  function releaseCamera() {
    const videos = document.querySelectorAll("video");
    for (let i = 0; i < videos.length; i++) {
      try {
        const video = videos[i];
        const stream = video.srcObject;
        if (stream && typeof stream.getTracks === "function") {
          const tracks = stream.getTracks();
          for (let j = 0; j < tracks.length; j++) {
            tracks[j].stop();
          }
        }
        video.pause();
        video.srcObject = null;
        video.remove();
      } catch (e) {}
    }
  }

  // 2. 모든 링크 클릭 시 카메라 끄고 강제 페이지 이동
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a");
      if (!link) return;

      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      releaseCamera();

      // 다음 페이지가 AR 페이지라면 도착 직후 1회 새로고침하도록 예약 플래그 저장
      try {
        sessionStorage.setItem("force_ar_reload", "true");
      } catch (e) {}

      setTimeout(() => {
        window.location.href = link.href;
      }, 200);
    },
    true
  );

  // 3. AR 페이지에 도착했을 때 예약 플래그가 있으면 즉시 1회 새로고침 실행
  const isARPage = document.querySelector("a-scene") !== null || window.location.pathname.includes("AR");
  
  try {
    if (sessionStorage.getItem("force_ar_reload") === "true") {
      sessionStorage.removeItem("force_ar_reload");
      // AR 페이지에 도착한 직후라면 수동 새로고침과 똑같이 1회 리로드
      if (document.querySelector("a-scene") || window.location.href.includes("Deadwood")) {
        window.location.reload();
      }
    }
  } catch (e) {}

  // 4. 브라우저 자체 뒤로가기(캐시 복원) 시에도 무조건 새로고침
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      releaseCamera();
      window.location.reload();
    }
  });

  window.addEventListener("pagehide", releaseCamera);
})();
