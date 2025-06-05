// fade.js

// 페이지가 로드되면 fade-out 상태 제거 → 자연스럽게 fade-in
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("fade-out");
});

/**
 * 페이지를 페이드아웃 후 이동
 * @param {string} url - 이동할 페이지 주소
 */
function navigateWithFade(url) {
  document.body.classList.add("fade-out");

  // CSS의 transition과 시간 맞추기 (0.4s)
  setTimeout(() => {
    window.location.href = url;
  }, 400);
}
