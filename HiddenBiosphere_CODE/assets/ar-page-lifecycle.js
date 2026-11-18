(() => {
  "use strict";

  function stopAllCameras() {
    document.querySelectorAll("video").forEach((video) => {
      const stream = video.srcObject;
      if (stream && typeof stream.getTracks === "function") {
        stream.getTracks().forEach((track) => track.stop());
      }
      video.srcObject = null;
    });
  }

  // 기본 링크 이동을 막지 않고(preventDefault 없음), 이동 직전 카메라만 즉시 종료
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link && link.href) {
      stopAllCameras();
    }
  });

  // 페이지를 벗어날 때 카메라 자원 반납
  window.addEventListener("pagehide", stopAllCameras);
})();
