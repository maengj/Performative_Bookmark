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
// 각 벽면에 빼곡하게 책이 차있는 것 처럼 그리드를 넣어서 책장을 반복해서 그려낸다.
// 각 책은 실제 즐겨찾기 데이터의 타이틀을 포함하고 있고, 클릭하면 페이지로 이동할 수 있다 (A태그)

$(document).ready(function () {
  // grid에 속한 클래스에 div를 반복해서 100개씩 삽입한다.
  var arr = [
    ".rect-front",
    ".rect-bottom",
    ".rect-top", // 여기 .이 빠져있었음
    ".rect-left",
    ".rect-right",
  ];

  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 20; j++) {
      $(".grid").append(`<div class="element">${j + 1}</div>`);
    }
  }
});
$(document).ready(function () {
  // pageToCard 버튼 클릭시 indexCard.html의 내용을 불러옴
  $("#pageToCard").click(function () {
    $("body").fadeOut(300, function () {
      $("body").load("indexCard.html", function () {
        $("body").fadeIn(300);
      });
    });
  });

  // pageToBox 버튼 클릭 시 indexBox.html의 내용을 불러옴
  $("#pageToBox").click(function () {
    $("body").fadeOut(300, function () {
      $("body").load("indexBox.html", function () {
        $("body").fadeIn(300);
      });
    });
  });
});
