document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-in");
});

const ENG = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const KOR = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ".split("");
const SPECIAL_LABEL = "**"; // 사용자 표시용
const SPECIAL_ID = "SPECIAL"; // id용도 같게

const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function getInitialConsonant(s) {
  const code = s.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return null;
  return CHO[Math.floor(code / (21 * 28))];
}

const MODES = [
  { w: 700, h: 400, left: "50%", transform: "translateX(-50%)" },
  { w: 600, h: 350, left: "10%", transform: "translateX(0)" },
  { w: 800, h: 450, left: "calc(100% - 820px)", transform: "translateX(0)" },
];
let modeIndex = 0;

function shotURL(u) {
  const m = MODES[modeIndex];
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=${
    m.w
  }&h=${m.h}`;
}

$(document).ready(function () {
  // 1. nav 링크 생성
  ENG.forEach((ch) =>
    $("#anchor-nav-eng").append(`<a href="#idx-${ch}">${ch}</a>`)
  );
  KOR.forEach((ch) =>
    $("#anchor-nav-kor").append(`<a href="#idx-${ch}">${ch}</a>`)
  );
  $("#anchor-nav-spec").append(
    `<a href="#idx-${SPECIAL_ID}">${SPECIAL_LABEL}</a>`
  );

  // 2. 클릭 시 부드러운 스크롤
  $(".anchor-nav a").on("click", function (e) {
    e.preventDefault();

    const targetId = $(this).attr("href"); // "#idx-A" 등
    const target = $(targetId);
    if (target.length) {
      const navOffset =
        $("#anchor-nav-eng").outerHeight() +
        $("#anchor-nav-kor").outerHeight() +
        $("#anchor-nav-spec").outerHeight();

      // 애니메이션: 'easeInOutCubic' 직접 정의
      $.easing.easeInOutCubic = function (x, t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      };

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - navOffset - 8,
          },
          2000,
          "easeInOutCubic"
        );
    }
  });

  // 3. 데이터 불러오기
  fetch("data/bookmarks_flat.json")
    .then((res) => res.json())
    .then((categories) => {
      const allBms = [];
      var data = bookmark_flat["bookmarks"];
      console.log(data);

      $.each(data, function (i, d) {
        var type = d["meta"]["og:type"];
        var saved = convertTimestampToYYYYMMDD(d["date_added"]);
        var callNo = d.guid.slice(-17);
        var category = "";
        var eImg = d["meta"]["og:image"];
        console.log(eImg);
        if (saved == "1601-01-01") {
          saved = "";
        }
        var url = d.url;

        allBms.push({
          title: d.name,
          type: type ? type : "Website",
          saved: saved ? saved : "",
          url: url ? url : "",
          callno: callNo ? callNo : "",
          category: category ? category : "Category",
          extra_image: eImg ? eImg : "",
          thumbnail: eImg ? eImg : "",
          image: eImg ? eImg : "",
        });
      });

      // data.forEach((cat) => {
      //   if (Array.isArray(cat.bookmarks)) {
      //     cat.bookmarks.forEach((bm) => {
      //       console.log(bm);
      //       allBms.push({
      //         title: bm.title,
      //         url: bm.url,
      //         category: cat.category,
      //         timestamp: bm.timestamp,
      //         saveddate: bm.saveddate,
      //         image: bm.image || "",
      //         extra_image: bm.extra_image || "",
      //         thumbnail: bm.thumbnail || "",
      //       });
      //     });
      //   }
      // });

      const indexMap = {};
      [...ENG, ...KOR, SPECIAL_LABEL].forEach((key) => (indexMap[key] = []));

      allBms.forEach((item) => {
        const f = item.title.charAt(0);
        let key;
        if (/^[A-Za-z]$/.test(f)) {
          key = f.toUpperCase();
        } else {
          const init = getInitialConsonant(f);
          key = init || SPECIAL_ID;
        }
        indexMap[key]?.push(item);
      });

      [...ENG, ...KOR, SPECIAL_LABEL].forEach((key) => {
        const items = indexMap[key] || [];
        let id = key === SPECIAL_LABEL ? SPECIAL_ID : key;
        let html = `<div class="eng-list-item" id="idx-${id}">`;
        html += `<div class="label">${key}</div>`;
        html += `<div class="value-container">`;

        items.forEach((item) => {
          html += `<div class="value-row">`;
          html += `
          <div class="title"
              data-image="${item.image}"
              data-extra_image="${item.extra_image}"
              data-thumbnail="${item.thumbnail}">
            <a href="${item.url}" target="_blank">${item.title}</a>
          </div>`;

          // html += `<div class="type">${item}</div>`;
          html += `<div class="type">${item.type ? item.type : "-"}</div>`;
          html += `<div class="saved">${item.saved ? item.saved : "-"}</div>`;
          html += `<div class="category">${
            item.category ? item.category : "-"
          }</div>`;
          html += `<div class="callno">${item.callno}</div>`;

          html += `</div>`;
        });

        html += `</div></div>`;
        $("#list-all").append(html);
      });

      // hover시 preview
      $(document)
        .on("mouseenter", ".value-row", function (e) {
          const $title = $(this).children(".title");
          const src =
            $title.data("image") ||
            $title.data("extra_image") ||
            $title.data("thumbnail") ||
            "";

          if (src) {
            $("#preview")
              .css({
                top: e.pageY + 10 + "px",
                left: e.pageX + 10 + "px",
                opacity: 1,
              })
              .html(`<img src="${src}" style="width:500px; height:auto;">`);
          }
        })
        .on("mousemove", ".title a", function (e) {
          $("#preview").css({
            top: e.pageY + 10 + "px",
            left: e.pageX + 10 + "px",
          });
        })
        .on("mouseleave", ".title a", function () {
          $("#preview").css("opacity", 0);
        });
    });

  const indexMap = {};
  [...ENG, ...KOR, SPECIAL_LABEL].forEach((key) => (indexMap[key] = []));
  allBms.forEach((item) => {
    const f = item.title.charAt(0);
    let key = /^[A-Za-z]$/.test(f)
      ? f.toUpperCase()
      : getInitialConsonant(f) || SPECIAL_ID;
    indexMap[key]?.push(item);
  });

  [...ENG, ...KOR, SPECIAL_LABEL].forEach((key) => {
    const items = indexMap[key] || [];
    const id = key === SPECIAL_LABEL ? SPECIAL_ID : key;
    let html = `<div class="eng-list-item" id="idx-${id}">`;
    html += `<div class="label">${key}</div><div class="value-container">`;
    items.forEach((item) => {
      html += `<div class="value-row"><div class="title" data-url="${item.url}" data-image="${item.image}" data-extra_image="${item.extra_image}" data-thumbnail="${item.thumbnail}">${item.title}</div>`;
      html += `<div class="date">${item.saveddate.replace(
        /-/g,
        "."
      )}</div></div>`;
    });
    html += `</div></div>`;
    $("#list-all").append(html);
  });

  // 4. 미리보기 이미지 선택 (image > extra_image > thumbnail)
  $(document)
    .on("mouseenter", ".title", function (e) {
      const $el = $(this);
      const imgSrc =
        $el.data("image") || $el.data("extra_image") || $el.data("thumbnail");
      if (imgSrc) {
        $("#preview")
          .css({
            top: e.pageY + 10 + "px",
            left: e.pageX + 10 + "px",
            opacity: 1,
          })
          .html(`<img src="${imgSrc}" />`);
      }
    })
    .on("mousemove", ".title", function (e) {
      $("#preview").css({
        top: e.pageY + 10 + "px",
        left: e.pageX + 10 + "px",
      });
    })
    .on("mouseleave", ".title", function () {
      $("#preview").css("opacity", 0);
    });

  // 5. 클릭 시 새 탭으로 URL 열기
  $(document).on("click", ".title", function () {
    window.open($(this).data("url"), "_blank");
  });
});

function convertTimestampToYYYYMMDD(microTimestamp) {
  // 1. 마이크로초를 밀리초로 변환
  const milliTimestamp = Math.floor(microTimestamp / 1000);

  // 2. 크롬 에포크(1601-01-01)와 유닉스 에포크(1970-01-01) 차이(밀리초)
  const epochDiffMs = 11644473600000;

  // 3. 유닉스 타임스탬프(밀리초)로 변환
  const unixMilliTimestamp = milliTimestamp - epochDiffMs;

  // 4. Date 객체 생성 (UTC 기준)
  const date = new Date(unixMilliTimestamp);

  // 5. yyyy-mm-dd 포맷팅
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
$(document).ready(function () {
  $("#home").on("click", function () {
    window.location.href = "index.html";
  });
});
$(document).ready(function () {
  // “우측 상단 영역” 선택자 (예: .top-face)
  var $topArea = $(".top-face");

  $topArea.css("cursor", "pointer").on("click", function () {
    // 1) body에 클래스 붙여 커서 default로 변경
    $("body").addClass("show-default-cursor");

    // 2) 최상단으로 부드럽게 스크롤
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
});
// 커서 요소 가져오기
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

// 마우스 움직임 추적
document.addEventListener("mousemove", (e) => {
  const { clientX: x, clientY: y } = e;

  // 커서와 따라오는 원 위치 설정
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
  follower.style.left = `${x}px`;
  follower.style.top = `${y}px`;
});
// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const topArea = document.querySelector(".top-face");

  if (!topArea) return;

  // 클릭 가능하다는 시각적 힌트로 pointer 커서 설정
  topArea.style.cursor = "pointer";

  topArea.addEventListener("click", function () {
    // 1) 클릭 직후에는 기본 화살표 커서로 변경
    document.body.classList.add("show-default-cursor");

    // 2) 페이지를 최상단으로 부드럽게 스크롤
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // 3) 일정 시간 뒤(예: 1초 후)에 원래 상태로 되돌리기
    setTimeout(function () {
      document.body.classList.remove("show-default-cursor");
    }, 1000);
  });
});
