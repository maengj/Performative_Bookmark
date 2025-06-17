document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-in");
});

var eventCount = 0;
const stack = document.getElementById("stack");
const toggleBtn = document.getElementById("toggle-view");
const imageBase = "https://framerusercontent.com/images";
const imageList = [
  "OzIOiaueSBUytIE3Wtmo785pKOk.webp",
  "IyQvv53Mfc9MZengNELB2nwQwU.webp",
  "pLwB0PWZ1jAF6hd6lPuOt28njk.webp",
  "rev5YyMdjW1Z9kfHKTcmGQn9aSE.webp",
  "MgIR8I4Bru0qxx09QiUiBNYerqg.webp",
  "D38V78HBnMkwfcJ4qBPR6UYzbmA.webp",
  "hcOa8YUZIaWNMauqwrUTKGhQCbs.webp",
];

const books = [];
let currentTopIndex = 0;
let isGrid = false;

const params = new URLSearchParams(window.location.search);
const category = params.get("cate"); // "Development"
const bigcategory = params.get("bigcate"); // "Development"
if (bigcategory) {
  $(".big-cate").html(" > " + bigcategory);
  $(".big-cate").attr("href", `drawer2.html?bigcate=${bigcategory}`);
} else {
  $(".big-cate").html("");
}
if (category) {
  $(".cates").html(" > " + category);
} else {
  $(".cates").html("> All");
}

var modelData = bookmark_flat["bookmarks"];
var folderArr = [
  "Design",
  "Academic",
  "Development",
  "AI Tools",
  "Research",
  "Class",
];
var tagArr = [
  "Design",
  "AI",
  "Thesis",
  "interactive",
  "code",
  "Art",
  "document",
];
var dateArr = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
$.each(folderArr, function (i, d) {
  if (bigcategory == "folder") {
    if (category == d) {
      const myCategory = category_sorted.find((cat) => cat.name === d);
      modelData = myCategory["items"];
    }
  }
});
$.each(tagArr, function (i, d) {
  if (bigcategory == "tag") {
    if (category == d) {
      const myCategory = tagcat_sorted.find((cat) => cat.name === d);
      modelData = myCategory["items"];
    }
  }
});
$.each(dateArr, function (i, d) {
  if (bigcategory == "tag") {
    if (category == d) {
      const myCategory = datecat_sorted.find((cat) => cat.name === d);
      modelData = myCategory["items"];
    }
  }
});
console.log(modelData);

$.each(modelData, function (i, d) {
  // 1) 카드 생성 & 이벤트 등록

  const book = document.createElement("div");
  book.className = "book";
  book.style.transform = `rotateX(90deg) translateZ(${i * 100}px)`;

  // ─── card-content 래퍼 ───
  const content = document.createElement("div");
  content.className = "card-content";

  // 앞면
  const front = document.createElement("div");
  front.className = "face front";
  front.style.backgroundImage = `url('${d["meta"]["og:image"]}')`;

  // 뒷면
  var callNo = d["guid"].slice(-17);
  const back = document.createElement("div");
  back.className = "face back card";
  back.innerHTML = `
    <div class="card-table">
      <div class="row card-header">
        <div class="icon" style="background-image:url(${
          d["icons"][0]
        });background-size:cover"></div>
        
        <a href="${d["url"]}" target="_blank" class="card_title"> ${
    d["name"]
  }</a>
      </div>
      <div class="row">
        <div class="mono-left">Call.No</div>
        <div class="mono-right">${
          d["category"] ? d["category"] : ""
        } ${callNo}</div>
      </div>
      <div class="row">
        <div class="mono-left">SAVED DATE</div>
        <div class="mono-right">${
          convertTimestampToYYYYMMDD(d["date_added"]) == "1601-01-01"
            ? "-"
            : convertTimestampToYYYYMMDD(d["date_added"])
        }</div>
      </div>
      <div class="row">
        <div class="mono-left">DESCRIPTION</div>
        <div class="desc">${
          d["meta"]["description"] ? d["meta"]["description"] : "-"
        }</div>
      </div>
      <div class="row">
          <div class="mono-left">LOCATION.</div>
          <div class="mono-right" style="text-transform:uppercase">SPACE / ${bigcategory} / ${category} ${i}</div>
      </div>
      <div class="row">
        <div class="center">
          MEMO. <span class="serif-right">Please add a memo!</span>
        </div>
      </div>
      <div class="row">
        <div class="center">TAGS. <span class="mono-right">AI/DESIGN/TOOLS/ORG</span></div>
      </div>
    </div>
  
    `;
  // <div class="memo" contenteditable="true">memo</div>

  content.append(front, back);
  book.appendChild(content);
  stack.appendChild(book);
  books.push(book);
  book.style.transition = "transform 2s ease-in";

  // ─── 클릭(뒤집기 또는 preview) ───
  book.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    if (document.body.classList.contains("grid-view")) {
      // 그리드 모드: .book 요소에 flipped 클래스 토글
      book.classList.toggle("flipped");
      // 그림자나 transform 인라인 스타일을 초기화하려면 아래 두 줄을 유지하거나 삭제하세요.
      const content = book.querySelector(".card-content");
      content.style.transform = ""; // 호버로 인한 transform 초기화
      content.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
      return;
    } else {
      // Stack 모드: 기존 preview-layer 로직
      const existing = document.querySelector(".preview-layer");
      if (existing) {
        existing.remove();
        if (existing.dataset.bookIndex === i.toString()) {
          return;
        }
      }

      const preview = document.createElement("div");
      preview.className = "preview-layer";
      preview.dataset.bookIndex = i.toString(); // 어떤 책에서 열렸는지 인덱스 저장

      const pf = document.createElement("div");
      pf.className = "preview-front";
      pf.style.backgroundImage = front.style.backgroundImage;

      const pb = document.createElement("div");
      pb.className = "preview-back";
      pb.innerHTML = back.innerHTML;

      preview.append(pf, pb);
      preview.addEventListener("click", (e) => {
        e.stopPropagation(); // preview-layer 내부 클릭 시 document 클릭 이벤트 방지
        preview.style.transform = preview.style.transform.includes(
          "rotateY(180deg)"
        )
          ? "rotateY(0deg)"
          : "rotateY(180deg)";
      });
      document.body.appendChild(preview);
    }
  });

  // ─── 마우스 이동(3D 기울기 + 쉐도우) ───
  book.addEventListener("mousemove", (e) => {
    if (!document.body.classList.contains("grid-view")) return;
    const r = book.getBoundingClientRect();

    const px = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const py = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    const rotX = py * 2;
    const rotY = -px * 2;
    const shadowX = -px * 2;
    const shadowY = py * 2;
    const base = book.classList.contains("flipped")
      ? "rotateY(180deg)"
      : "rotateY(0deg)";

    content.style.transform = `${base} rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    content.style.boxShadow = `${shadowX}px ${shadowY}px 60px rgba(0,0,0,0.2)`;
  });

  book.addEventListener("mouseleave", () => {
    if (!document.body.classList.contains("grid-view")) return;
    const base = book.classList.contains("flipped")
      ? "rotateY(180deg)"
      : "rotateY(0deg)";
    content.style.transform = `${base} rotateX(0deg) rotateY(0deg)`;
    content.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
  });
});

// `document`에 클릭 이벤트 리스너 추가 (가장 바깥 클릭 감지)
document.addEventListener("click", (event) => {
  const existingPreview = document.querySelector(".preview-layer");
  if (existingPreview) {
    // 클릭된 요소가 preview-layer 자신이거나 그 자손이 아니라면 preview-layer를 닫음
    if (!existingPreview.contains(event.target)) {
      existingPreview.remove();
    }
  }
});

// 2) Grid/Stack 토글
toggleBtn.addEventListener("click", () => {
  document.querySelectorAll(".preview-layer").forEach((el) => el.remove());
  isGrid = !isGrid;
  document.body.classList.toggle("grid-view", isGrid);
  toggleBtn.textContent = isGrid ? "Stack" : "Grid";

  if (!isGrid) {
    currentTopIndex = 0;
    updateBookTransforms();
    books.forEach((b) => {
      const c = b.querySelector(".card-content");
      b.classList.remove("flipped");
      c.style.transform = "";
      c.style.boxShadow = "";
    });
  }
});

// 3) 휠 스크롤 (Stack 모드에서만)
window.addEventListener("wheel", (e) => {
  eventCount++;
  console.log(eventCount);
  if (document.body.classList.contains("grid-view")) return;
  // if (document.querySelector(".preview-layer")) return; // 이 줄은 이제 필요 없습니다.
  if (eventCount > 3) {
    if (e.deltaY > 0 && currentTopIndex < books.length - 1) currentTopIndex++;
    else if (e.deltaY < 0 && currentTopIndex > 0) currentTopIndex--;
    updateBookTransforms();
    eventCount = 0;
  }
});

function updateBookTransforms() {
  books.forEach((book, i) => {
    const offset = i - currentTopIndex;
    book.style.transform = `rotateX(90deg) translateZ(${offset * 40}px)`;
  });
}

// 4) 중간 클릭 카메라 회전(기존 로직)
let isMiddle = false,
  lastX = 0,
  lastY = 0,
  rotX = 0,
  rotY = 0;
document.addEventListener("mousedown", (e) => {
  if (e.button === 1) {
    e.preventDefault();
    isMiddle = true;
    lastX = e.clientX;
    lastY = e.clientY;
  }
});
document.addEventListener("mousemove", (e) => {
  if (!isMiddle) return;
  rotY += (e.clientX - lastX) * 0.5;
  rotX -= (e.clientY - lastY) * 0.5;
  stack.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  lastX = e.clientX;
  lastY = e.clientY;
});
document.addEventListener("mouseup", (e) => {
  if (e.button === 1) isMiddle = false;
});

//sidebar
$("#toggle").click(function () {
  $(".sidemenu").toggleClass("inactive");
});

$(document).ready(function () {
  //   var html;
  //   for (var i = 0; i < 10; i++) {
  //     $(".my-img").attr("src", `img/img_${i}.jpeg`);
  //     html += `<img src="img/img_${i}.jpeg">`;
  //     }
  //       height: 400px;
  //     width: 400px;
  //     object-fit: cover;
});

// //sidemenu 이벤튼
const items = document.querySelectorAll(".item");

items.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const angle = (Math.random() * 60 - 30).toFixed(1); // -30 ~ +30
    item.style.transform = `rotateZ(${angle}deg)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "rotateZ(0deg)";
  });
});
// const items = document.querySelectorAll(".item");

// items.forEach((item, i) => {
//   item.addEventListener("mouseenter", () => {
//     const angle = (Math.random() * 60 - 30).toFixed(1); // -30 ~ +30
//     item.style.transform = `rotateZ(${angle}deg)`;

//     // 왼쪽 이웃 (있다면)
//     if (items[i - 1]) {
//       items[i - 1].style.transform = "translateX(-4px)";
//     }
//     // 오른쪽 이웃 (있다면)
//     if (items[i + 1]) {
//       items[i + 1].style.transform = "translateX(4px)";
//     }
//   });

//   item.addEventListener("mouseleave", () => {
//     // 본인 초기화
//     item.style.transform = "none";
//     // 이웃도 초기화
//     if (items[i - 1]) {
//       items[i - 1].style.transform = "none";
//     }
//     if (items[i + 1]) {
//       items[i + 1].style.transform = "none";
//     }
//   });
// });
$(document).ready(function () {
  $("#home").on("click", function () {
    window.location.href = "index.html";
  });

  currentTopIndex = 15;
  updateBookTransforms();
  setTimeout(() => {
    books.forEach((book) => {
      book.style.transition = "transform 0.2s ease";
    });
  }, 1000);
  // 3000 - 3초
  $("body").on("click", function () {
    $("");
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

function convertTimestampToYYYYMMDD(microTimestamp) {
  // 1. 마이크로초를 밀리초로 변환
  const milliTimestamp = Math.floor(microTimestamp / 1000);

  // 2. 크롬 에포크(1601-01-01)와 유닉스 에포크(1970-01-01) 차이(밀리초)
  const epochDiffMs = 11644473600000;

  // 3. 유닉스 타임스탬프(밀리초)로 변환
  const unixMilliTimestamp = milliTimestamp - epochDiffMs;

  // 4. Date 객체 생성 (UTC 기준)
  const date = new Date(unixMilliTimestamp);

  // 5. YYYY-mm-dd 포맷팅
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
