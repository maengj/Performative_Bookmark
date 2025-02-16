// 전역 변수: x축 이동(currentX)와 z축 이동(currentZ)
var currentX = 0;
var currentZ = 0;

// .stage 요소의 transform을 업데이트하는 함수
function updateStageTransform() {
  $(".stage").css(
    "transform",
    "translate(-50%, -50%) translateX(" +
      currentX +
      "px) translateZ(" +
      currentZ +
      "px) scale(1.3)"
  );
}

// 마우스 이동 이벤트: x축 좌우 이동 (최대 ±200px)
$(document).mousemove(function (e) {
  var windowWidth = $(window).width();
  var centerX = windowWidth / 2;
  var diffX = e.clientX - centerX;
  var maxTranslation = 200; // 최대 ±200px
  currentX = (diffX / centerX) * maxTranslation;
  updateStageTransform();
});

// 휠(스크롤) 이벤트: z축 줌 인/줌 아웃 (10px 단위, 최대 ±1000px)
$(window).on("wheel", function (e) {
  e.preventDefault(); // 기본 스크롤 동작 방지
  if (e.originalEvent.deltaY > 0) {
    currentZ += 10;
  } else {
    currentZ -= 10;
  }
  // z축 이동 범위를 0px ~ 100px로 제한
  currentZ = Math.max(-100, Math.min(200, currentZ));
  updateStageTransform();
});

$(document).ready(function () {
  // 페이지 1 버튼 클릭 시 page1.html의 내용을 불러옴
  $("#pageToCard").click(function () {
    $(".scene").fadeOut(300, function () {
      $(".scene").load("indexCard.html", function () {
        $(".scene").fadeIn(300);
      });
    });
  });

  // 페이지 2 버튼 클릭 시 page2.html의 내용을 불러옴
  $("#pageToMain").click(function () {
    $(".page-1").fadeOut(300, function () {
      $(".page-1").load("index.html", function () {
        $(".page-1").fadeIn(300);
      });
    });
  });
});
