// HTML이 완전히 로드되고 파싱된 후 스크립트 실행 (fade-in 효과)
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-in");
});

// --- 전역 상수 및 변수 ---
const BOX_WIDTH = 600; // SCSS의 $box-width와 일치
const BOX_HEIGHT = 400; // SCSS의 $box-height와 일치
const BOX_DEPTH = 1000; // SCSS의 $box-depth와 일치

var currentX = 0; // 스테이지의 X축 현재 위치
var currentY = 0; // ← Y축 위치 추가
var currentZ = 800; // ⬅️ 시작 줌 레벨 (스크린샷에 맞춰 250으로 설정, 이 값으로 시작 깊이 조절)

const cursorElement = document.querySelector(".cursor"); // 커스텀 커서 요소
const followerElement = document.querySelector(".cursor-follower"); // 커스텀 커서 팔로워 요소

var cellNumData = {
  145: "209번째 셀 텍스트",
};
// --- 3D 스테이지 및 카메라 제어 함수 ---

// .stage 요소의 transform을 업데이트하는 함수
function updateStageTransform() {
  const initialStageZ = -(BOX_DEPTH / 2.5); // 박스 중심을 기준으로 초기 Z위치 (터널 입구가 z=0에 오도록)
  $(".stage").css(
    "transform",
    "translate(-50%, -50%)" +
      " translateX(" +
      currentX +
      "px)" +
      " translateY(" +
      currentY +
      "px)" + // ← 여기
      " translateZ(" +
      (initialStageZ + currentZ) +
      "px)" +
      " scale(1)"
  );
}

// bulb_light (커서 조명 효과) 위치 업데이트 함수
function updateBulbPosition(e_pageX, e_pageY) {
  const $frontGrid = $(".rect-front"); // 기준면: 터널 가장 안쪽 벽의 그리드 영역
  if (!$frontGrid.length) return;

  const frontGridOffset = $frontGrid.offset(); // .rect-front의 화면상 위치

  // 마우스 위치를 .rect-front 기준으로 변환
  let relativeX = e_pageX - frontGridOffset.left;
  let relativeY = e_pageY - frontGridOffset.top;

  // bulb_light의 중심이 마우스 커서를 따르도록 위치 조정 (너비/높이 300px의 절반인 150px 빼줌)
  const bulbOffsetX = 150;
  const bulbOffsetY = 150;

  $(".bulb_light").css({
    left: relativeX - bulbOffsetX + "px",
    top: relativeY - bulbOffsetY + "px",
  });
}

// --- jQuery 사용 이벤트 핸들러 ---

// 문서가 준비되면 실행 (DOM 요소 접근 가능 시점)
$(document).ready(function () {
  // 1. 그리드 셀 생성
  const cellSize = 50;
  const faceDimensions = {
    ".rect-front": { width: BOX_WIDTH, height: BOX_HEIGHT },
    ".rect-top": { width: BOX_WIDTH, height: BOX_DEPTH },
    ".rect-bottom": { width: BOX_WIDTH, height: BOX_DEPTH },
    ".rect-left": { width: BOX_DEPTH, height: BOX_HEIGHT },
    ".rect-right": { width: BOX_DEPTH, height: BOX_HEIGHT },
  };

  for (const selector in faceDimensions) {
    const dimensions = faceDimensions[selector];
    const $faceGridElement = $(selector);

    if ($faceGridElement.length) {
      const numCols = Math.floor(dimensions.width / cellSize);
      const numRows = Math.floor(dimensions.height / cellSize);
      var totalCells = 100;

      // $faceGridElement.css({
      //   "grid-template-columns": `repeat(${numCols}, 1fr)`,
      // });
      $faceGridElement.empty();

      if (selector == ".rect-front") {
        totalCells = 25;
      } else if (selector == ".rect-top") {
        totalCells = 75;
      } else if (selector == ".rect-bottom") {
        totalCells = 75;
      }

      for (let i = 0; i < totalCells; i++) {
        var html = `<div class="element grid-cell cell-${i}"></div>`;
        if (i == 46 && selector == ".rect-left") {
          html = `<div id="recommend" class="element grid-cell cell-${i}">Today's Recommendation</div>`;
        }
        if (i == 87 && selector == ".rect-right") {
          html = `<div id="unlabeled" class="element grid-cell cell-${i}">Unlabeled Items</div>`;
        }
        if (i == 50 && selector == ".rect-right") {
          html = `<div id="favorite" class="element grid-cell cell-${i}">Favorite</div>`;
        }
        if (i == 24 && selector == ".rect-left") {
          html = `<div id="next-step" class="element grid-cell cell-${i}">NEXT SPACE >></div>`;
        }
        $faceGridElement.append(html);
      }
    } else {
      console.warn(`Grid element not found for selector: ${selector}`);
    }
  }

  // 2. 페이지 전환 버튼 이벤트
  $("#index").click(function () {
    $("body")
      .addClass("fade-out")
      .one("transitionend", function () {
        window.location.href = "list_index.html";
      });
  });
  $("#cards").click(function () {
    $("body")
      .addClass("fade-out")
      .one("transitionend", function () {
        window.location.href = "card_stack.html";
      });
  });
  $("#drawer").click(function () {
    $("body")
      .addClass("fade-out")
      .one("transitionend", function () {
        window.location.href = "drawer2.html";
      });
  });

  // 3. Today's Recommend & Unlabeled 데이터 로드 및 표시 (내용 동일하므로 생략 가능, 필요시 아래 코드 블록 사용)
  //--------------------------------------today's Recommend
  $(function () {
    $.getJSON("results3.json", function (data) {
      // 1) "북마크바" 카테고리 제외
      const filtered = data.filter((cat) => cat.category !== "북마크바");

      // 2) 남은 카테고리의 모든 북마크 합치기
      let all = [];
      filtered.forEach((cat) => {
        if (Array.isArray(cat.bookmarks)) {
          all = all.concat(cat.bookmarks);
        }
      });
      if (!all.length) return;

      // 3) 랜덤 선택
      const choice = all[Math.floor(Math.random() * all.length)];

      // 4) 이미지 URL 결정
      const imgUrl =
        choice.image || choice.extra_image || choice.thumbnail || "";

      // 5) 설명 결정
      const desc =
        choice.description.og_description ||
        choice.description.meta_description ||
        choice.description.extra_text ||
        "";

      // 6) 저장일
      let saved = choice.saveddate || "";

      // 7) DOM 반영
      const $win = $("#recommend-window");

      $win
        .find(".rec-title .rec-link")
        .attr("href", choice.url || "#")
        .text(choice.title || "제목 없음");

      if (imgUrl) {
        $win
          .find(".ogimage")
          .attr("src", imgUrl)
          .attr("alt", choice.title || "")
          .show();
      } else {
        $win.find(".ogimage").hide();
      }

      $win.find(".desc").text(desc);
      $win.find(".date").text(saved);
    }).fail(function (_, status, err) {
      console.error("북마크 JSON 로드 실패:", status, err);
    });
  });
  //----------------------------unlabeled 불러오기
  $(function () {
    fetch("results3.json")
      .then((res) => res.json())
      .then((data) => {
        const bar = data.find((c) => c.category === "북마크바");
        if (!bar || !Array.isArray(bar.bookmarks)) return;
        const arr = bar.bookmarks.slice();

        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        [".list1", ".list2", ".list3"].forEach((sel, idx) => {
          const bm = arr[idx];
          const $p = $("#unlabeled-window").find(`p.url${sel}`);
          $p.empty();
          if (bm) {
            const $a = $("<a>")
              .attr({
                href: bm.url || "#",
                target: "_blank",
                rel: "noopener",
              })
              .text(bm.title || "제목 없음");
            $p.append($a);
          }
        });
      })
      .catch((err) => console.error("JSON 로드 실패:", err));
  });

  // 4. 버튼 클릭 윈도우 오픈/클로즈 토글
  $("#recommend, #unlabeled, #about, #favorite").on("click", function () {
    const windowId = "#" + $(this).attr("id") + "-window";
    const isActive = $(this).hasClass("active"); // 'active' 또는 'display' 클래스로 상태 관리 통일

    if (isActive) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
    }
    $(windowId).slideToggle(200);
  });

  // 초기 스테이지 위치 설정
  updateStageTransform();
});

// --- 전역 이벤트 핸들러 ---

// 마우스 휠 이벤트: Z축 줌 인/아웃
$(window).on("wheel", function (e) {
  if (e.originalEvent.deltaY > 0) {
    currentZ += 4; // 줌인
  } else {
    currentZ -= 4; // 줌아웃
  }
  // Z축 이동 범위 제한
  currentZ = Math.max(800, Math.min(BOX_DEPTH + 300, currentZ));
  updateStageTransform();
  e.preventDefault(); // 페이지 스크롤 방지

  var step_1 = 1000;
  var step_2 = 1080;
  var step_3 = 1160;
  var step_4 = 1220;
  console.log(currentZ);
  if (currentZ < step_1) {
    $(".face-img-1").fadeIn();
  } else {
    $(".face-img-1").fadeOut();
  }
  if (currentZ >= step_1 && currentZ < step_2) {
    $(".face-img-2").fadeIn();
  } else {
    $(".face-img-2").fadeOut();
  }
  if (currentZ >= step_2 && currentZ < step_3) {
    $(".face-img-3").fadeIn();
  } else {
    $(".face-img-3").fadeOut();
  }
  if (currentZ >= step_3 && currentZ < step_4) {
    $(".face-img-4").fadeIn();
  } else {
    $(".face-img-4").fadeOut();
  }
});

// 마우스 이동 이벤트: 스테이지 X축 이동, bulb_light 위치 업데이트, 커스텀 커서 위치 업데이트
$(document).on("mousemove", function (e) {
  // 1. 스테이지 X축 이동 (카메라 패닝 효과)
  const windowWidth = $(window).width();
  const centerX = windowWidth / 2;
  const diffX = e.clientX - centerX;
  const maxTranslation = 150;
  currentX = (diffX / centerX) * maxTranslation * 0.5;
  updateStageTransform();
  // Y축 추가
  const windowHeight = $(window).height();
  const centerY = windowHeight / 2;
  const diffY = e.clientY - centerY;
  currentY = (diffY / centerY) * maxTranslation * 0.2;

  // 2. bulb_light 위치 업데이트
  updateBulbPosition(e.pageX, e.pageY);

  // 3. 커스텀 커서 위치 업데이트
  if (cursorElement && followerElement) {
    cursorElement.style.left = `${e.clientX}px`;
    cursorElement.style.top = `${e.clientY}px`;
    followerElement.style.left = `${e.clientX}px`;
    followerElement.style.top = `${e.clientY}px`;
  }
});

// --- 배경 카메라 라이트 효과 ---
// (이 부분은 코드가 길고 독립적이므로, 기존 코드를 그대로 사용하시되,
//  다른 DOMContentLoaded 리스너와 충돌하지 않는지 확인하세요.
//  일반적으로 하나의 JS 파일에는 하나의 DOMContentLoaded 또는 $(document).ready를
//  최상위 레벨에 두는 것이 좋습니다. 또는 기능을 모듈화합니다.)
//  제공해주신 코드에서는 두 개의 DOMContentLoaded 리스너가 있었습니다.
//  아래는 그중 두 번째, 더 간결화된 버전을 사용합니다.
document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("videoFeed");
  const canvasElement = document.getElementById("debugCanvas");

  if (!videoElement || !canvasElement) {
    console.error(
      "비디오 또는 캔버스 요소를 찾을 수 없습니다. (카메라 라이트)"
    );
    return;
  }
  const ctx = canvasElement.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    console.error("2D 컨텍스트를 가져올 수 없습니다. (카메라 라이트)");
    return;
  }

  const lightSourceDivs = [
    document.getElementById("light-source-0"),
    document.getElementById("light-source-1"),
    document.getElementById("light-source-2"),
    document.getElementById("light-source-3"),
    document.getElementById("light-source-4"),
    document.getElementById("light-source-5"),
  ];
  lightSourceDivs.forEach((div, index) => {
    if (!div) console.warn(`light-source-${index} 요소를 찾을 수 없습니다.`);
  });

  let prevImageData = null;
  let streamActive = false;
  let effectTimeouts = [null, null, null, null, null, null];
  const LIGHT_EFFECT_DURATION = 800;
  const RENDER_WIDTH = 60;
  const RENDER_HEIGHT = 45;
  const pixelDiffThreshold = 30;
  const quadrantMotionThresholdFactor = 0.025;
  const numRows = 2;
  const numCols = 3;
  const quadWidth = RENDER_WIDTH / numCols;
  const quadHeight = RENDER_HEIGHT / numRows;
  const quadrantThreshold =
    quadWidth * quadHeight * quadrantMotionThresholdFactor;
  const quadrantCoords = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      quadrantCoords.push({
        x: c * quadWidth,
        y: r * quadHeight,
        name: `R${r}C${c}`,
      });
    }
  }

  async function setupCamera() {
    if (streamActive) return;
    console.log("카메라 라이트: setupCamera 시작");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 } },
        audio: false,
      });
      videoElement.srcObject = stream;
      await new Promise((resolve) => (videoElement.onloadedmetadata = resolve));
      canvasElement.width = RENDER_WIDTH;
      canvasElement.height = RENDER_HEIGHT;
      streamActive = true;
      console.log("카메라 라이트: 움직임 감지 활성화됨");
      requestAnimationFrame(detectMotionInQuadrants);
    } catch (error) {
      console.error("카메라 라이트: 카메라 접근 오류:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "카메라 접근 권한이 거부되었습니다. 배경 라이트 효과를 사용하려면 권한을 허용해야 합니다."
        );
      } else if (error.name === "NotFoundError") {
        alert("사용 가능한 카메라를 찾을 수 없습니다. (배경 라이트)");
      }
    }
  }

  function deactivateLightSource(quadrantIndex) {
    if (!lightSourceDivs[quadrantIndex]) return;
    lightSourceDivs[quadrantIndex].style.opacity = "0";
    if (effectTimeouts[quadrantIndex])
      clearTimeout(effectTimeouts[quadrantIndex]);
    effectTimeouts[quadrantIndex] = null;
  }

  function activateLightSource(quadrantIndex) {
    if (!lightSourceDivs[quadrantIndex]) return;
    if (effectTimeouts[quadrantIndex])
      clearTimeout(effectTimeouts[quadrantIndex]);
    lightSourceDivs[quadrantIndex].style.opacity = "0.5";
    effectTimeouts[quadrantIndex] = setTimeout(() => {
      deactivateLightSource(quadrantIndex);
    }, LIGHT_EFFECT_DURATION);
  }

  function detectMotionInQuadrants() {
    if (!streamActive) return;
    ctx.drawImage(videoElement, 0, 0, RENDER_WIDTH, RENDER_HEIGHT);
    const currentFrame = ctx.getImageData(0, 0, RENDER_WIDTH, RENDER_HEIGHT);
    const currentImageData = currentFrame.data;
    if (prevImageData) {
      for (let qIdx = 0; qIdx < quadrantCoords.length; qIdx++) {
        const qDef = quadrantCoords[qIdx];
        let changedPixelsInQuad = 0;
        for (
          let y = Math.floor(qDef.y);
          y < Math.floor(qDef.y + quadHeight);
          y++
        ) {
          for (
            let x = Math.floor(qDef.x);
            x < Math.floor(qDef.x + quadWidth);
            x++
          ) {
            const i = (y * RENDER_WIDTH + x) * 4;
            const rDiff = Math.abs(currentImageData[i] - prevImageData[i]);
            const gDiff = Math.abs(
              currentImageData[i + 1] - prevImageData[i + 1]
            );
            const bDiff = Math.abs(
              currentImageData[i + 2] - prevImageData[i + 2]
            );
            if ((rDiff + gDiff + bDiff) / 3 > pixelDiffThreshold) {
              changedPixelsInQuad++;
            }
          }
        }
        if (changedPixelsInQuad > quadrantThreshold) {
          if (
            lightSourceDivs[qIdx] &&
            (!effectTimeouts[qIdx] ||
              lightSourceDivs[qIdx].style.opacity === "0")
          ) {
            activateLightSource(qIdx);
          }
        }
      }
    }
    prevImageData = new Uint8ClampedArray(currentImageData);
    requestAnimationFrame(detectMotionInQuadrants);
  }
  setupCamera(); // 페이지 로드 시 카메라 직접 시작
});
$(document).ready(function () {
  $("#home").on("click", function () {
    window.location.href = "index.html";
  });
  $("#index-btn").on("click", function () {
    window.location.href = "list_index.html";
  });
  $("#cards-btn").on("click", function () {
    window.location.href = "card_stack.html";
  });
  $("#drawer-btn,#next-step").on("click", function () {
    window.location.href = "drawer2.html";
  });

  $(".step-circle").on("mouseover", function () {
    var t = $(this).attr("target");
    $("." + t).fadeIn();
  });
  $(".step-circle").on("mouseout", function () {
    $(".step-img img").fadeOut();
  });
});
