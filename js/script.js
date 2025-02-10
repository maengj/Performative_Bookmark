// script.js

// 마우스가 #scene 위에서 움직일 때, #room 컨테이너를 회전시켜 3D 패닝 효과를 줍니다.
$(document).ready(function () {
  $("#scene").on("mousemove", function (e) {
    var offset = $(this).offset();
    var sceneWidth = $(this).width();
    var sceneHeight = $(this).height();

    // 마우스 위치 (페이지 좌표에서 #scene 내 상대 좌표)
    var mouseX = e.pageX - offset.left;
    var mouseY = e.pageY - offset.top;

    // #scene 중앙에서의 상대 위치를 -1 ~ 1 사이 값으로 계산
    var percentX = (mouseX - sceneWidth / 2) / (sceneWidth / 2);
    var percentY = (mouseY - sceneHeight / 2) / (sceneHeight / 2);

    // 최대 회전 각도 (필요에 따라 조정)
    var maxRotateY = 15; // 좌우 회전
    var maxRotateX = 15; // 상하 회전

    // 마우스 위치에 따라 회전각 산출 (마우스가 오른쪽이면 왼쪽으로 회전하도록 부호 반전)
    var rotateY = -percentX * maxRotateY;
    var rotateX = percentY * maxRotateX;

    // #room의 기본 중심 정렬(transform: translate(-50%, -50%)) 위에 회전 변환 적용
    $("#room").css(
      "transform",
      "translate(-50%, -50%) rotateX(" +
        rotateX +
        "deg) rotateY(" +
        rotateY +
        "deg)"
    );
  });
});
