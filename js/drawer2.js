// js/drawer.js

document.addEventListener("DOMContentLoaded", () => {
  const leftContainer = document.getElementById("left-container");
  const rightContainer = document.getElementById("right-container");
  // 기존 static folder-item 제거 (HTML에 미리 남아있던 경우)
  // leftContainer.innerHTML = "";

  $(document).ready(function () {
    $("#home").on("click", function () {
      console.log("ddd");

      window.location.href = "index.html";
    });
  });

  fetch("category.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((categories) => {
      categories.forEach((cat) => {
        // 1) folder-item wrapper
        const item = document.createElement("div");
        item.classList.add("folder-item");

        // 2) folder-name
        const nameEl = document.createElement("div");
        nameEl.classList.add("folder-name");
        const p = document.createElement("p");
        p.classList.add("catname");
        p.textContent = cat.name;
        nameEl.appendChild(p);
        item.appendChild(nameEl);

        // 2-2) handle
        const handle = document.createElement("div");
        handle.classList.add("handle");
        nameEl.appendChild(handle);

        // 3) folder-cover
        const cover = document.createElement("div");
        cover.classList.add("folder-cover");
        item.appendChild(cover);

        // 3-2) folder-side
        const side = document.createElement("div");
        side.classList.add("folder-side");
        item.appendChild(side);

        // 4) folder-list-container
        const listContainer = document.createElement("div");
        listContainer.classList.add("folder-list-container");

        // 5) child1~childN 키 순서대로 꺼내서 리스트 아이템 생성
        Object.keys(cat)
          .filter((key) => key.startsWith("child"))
          .sort((a, b) => {
            return (
              parseInt(a.replace("child", ""), 10) -
              parseInt(b.replace("child", ""), 10)
            );
          })
          .map((key) => cat[key])
          .filter((text) => text && text.trim().length > 0)
          .forEach((text) => {
            const listItem = document.createElement("div");
            listItem.classList.add("folder-list-item");

            const titleEl = document.createElement("div");
            titleEl.classList.add("title");
            titleEl.textContent = text;

            listItem.appendChild(titleEl);
            listContainer.appendChild(listItem);
          });

        item.appendChild(listContainer);
        if (leftContainer) {
          // leftContainer.appendChild(item);
        }
      });
    })
    .catch((err) =>
      console.error("category.json을 불러오는 중 오류 발생:", err)
    );
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

// js/drawer2.js

/**
 * #left-container에 JSON 데이터를 로드하여 렌더링하는 함수
 * (기존 loadLeftContainer 로직을 그대로 사용합니다)
 */
function loadLeftContainer(jsonUrl) {
  const leftContainer = document.getElementById("left-container");
  if (!leftContainer) return;

  // 로딩 중 표시
  leftContainer.innerHTML = "<p>Loading...</p>";

  fetch(jsonUrl)
    .then((res) => {
      if (!res.ok)
        throw new Error(`HTTP ${res.status} - '${jsonUrl}' 로드 실패`);
      return res.json();
    })
    .then((data) => {
      // JSON 구조에 따라 렌더링 분기
      if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].hasOwnProperty("name")
      ) {
        // datecat.json 포맷
        renderDatecatFormat(data);
      } else if (
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].hasOwnProperty("title")
      ) {
        // [{ title, url }, ...] 포맷
        renderSimpleListFormat(data);
      } else {
        // category.json 포맷
        renderCategoryFormat(data);
      }
    })
    .catch((err) => {
      console.error(">> JSON 파싱/로드 중 오류:", err);
      leftContainer.innerHTML = "<p style='color:red;'>데이터 로드 실패</p>";
    });
}

/**
 * category.json 포맷([{ name, child1, child2, ... }, ...]) 렌더링
 */
function renderCategoryFormat(categoryArray) {
  const leftContainer = document.getElementById("left-container");
  leftContainer.innerHTML = "";

  categoryArray.forEach((cat) => {
    const item = document.createElement("div");
    item.classList.add("folder-item");

    const nameEl = document.createElement("div");
    nameEl.classList.add("folder-name");
    const p = document.createElement("p");
    p.classList.add("catname");
    p.textContent = cat.name;
    nameEl.appendChild(p);

    const handle = document.createElement("div");
    handle.classList.add("handle");
    nameEl.appendChild(handle);

    item.appendChild(nameEl);

    const cover = document.createElement("div");
    cover.classList.add("folder-cover");
    item.appendChild(cover);

    const side = document.createElement("div");
    side.classList.add("folder-side");
    item.appendChild(side);

    const listContainer = document.createElement("div");
    listContainer.classList.add("folder-list-container");

    Object.keys(cat)
      .filter((key) => key.startsWith("child"))
      .sort((a, b) => {
        return (
          parseInt(a.replace("child", ""), 10) -
          parseInt(b.replace("child", ""), 10)
        );
      })
      .map((key) => cat[key])
      .filter((text) => text && text.trim().length > 0)
      .forEach((text) => {
        const listItem = document.createElement("div");
        listItem.classList.add("folder-list-item");
        const titleEl = document.createElement("div");
        titleEl.classList.add("title");
        titleEl.textContent = text;
        listItem.appendChild(titleEl);
        listContainer.appendChild(listItem);
      });

    item.appendChild(listContainer);
    leftContainer.appendChild(item);
  });
}

/**
 * datecat.json 포맷 렌더링
 */
function renderDatecatFormat(dataArray) {
  const leftContainer = document.getElementById("left-container");
  leftContainer.innerHTML = ` <div class="cross-line cross-1">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-2">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-3">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-4">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-5">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-6">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-7">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-8">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>

      <div class="cross-line cross-9">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-10">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>
      <div class="cross-line cross-11">
        <div class="vertical"></div>
        <div class="horizontal"></div>
      </div>`;

  dataArray.forEach((obj) => {
    const item = document.createElement("div");
    item.classList.add("folder-item");

    const nameEl = document.createElement("div");
    nameEl.classList.add("folder-name");
    const pYear = document.createElement("p");
    pYear.classList.add("catname");
    pYear.textContent = obj.name;
    nameEl.appendChild(pYear);

    const handle = document.createElement("div");
    handle.classList.add("handle");
    nameEl.appendChild(handle);

    item.appendChild(nameEl);

    const cover = document.createElement("div");
    cover.classList.add("folder-cover");
    item.appendChild(cover);

    // const side = document.createElement("div");
    // side.classList.add("folder-side");
    // item.appendChild(side);

    const listContainer = document.createElement("div");
    listContainer.classList.add("folder-list-container");

    const childKeys = Object.keys(obj)
      .filter((key) => key.startsWith("child"))
      .sort((a, b) => {
        const na = parseInt(a.replace("child", ""), 10);
        const nb = parseInt(b.replace("child", ""), 10);
        return na - nb;
      });

    childKeys.forEach((key) => {
      const text = obj[key];
      if (text && text.trim().length > 0) {
        const listItem = document.createElement("div");
        listItem.classList.add("folder-list-item");
        const titleEl = document.createElement("div");
        titleEl.classList.add("title");
        titleEl.textContent = text;
        listItem.appendChild(titleEl);
        listContainer.appendChild(listItem);
      }
    });

    item.appendChild(listContainer);
    leftContainer.appendChild(item);
  });
}

/**
 * [{ title, url }, ...] 배열 형태 렌더링
 */
function renderSimpleListFormat(dataArray) {
  const leftContainer = document.getElementById("left-container");
  leftContainer.innerHTML = "";

  const ul = document.createElement("ul");
  ul.classList.add("folder-list");

  dataArray.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("folder-list-item");
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.textContent = item.title;
    li.appendChild(a);
    ul.appendChild(li);
  });

  leftContainer.appendChild(ul);
}

/**
 * 문서 로드 후 초기화 및 클릭 이벤트 설정
 */
document.addEventListener("DOMContentLoaded", function () {
  // 1) 버튼 요소 참조
  const btnFolder = document.getElementById("sortedfoldr"); // FOLDER_YOU_SORTED
  const btnTags = document.getElementById("tags"); // AUTO_TAGS
  const btnDate = document.getElementById("sorteddate"); // DATE_YOU_ADDED

  // 2) 초기 로드: category.json 불러오고 FOLDER_YOU_SORTED 버튼을 selected 상태로
  loadLeftContainer("category.json");
  if (btnFolder) btnFolder.classList.add("selected");

  // 3) 'selected' 클래스 토글 함수
  function highlightClicked(clickedElem) {
    [btnFolder, btnTags, btnDate].forEach((el) => {
      if (!el) return;
      if (el === clickedElem) {
        el.classList.add("selected");
      } else {
        el.classList.remove("selected");
      }
    });
  }

  // 4) 버튼 클릭 이벤트
  if (btnFolder) {
    btnFolder.addEventListener("click", function () {
      loadLeftContainer("category.json");
      highlightClicked(btnFolder);
    });
  }

  if (btnTags) {
    btnTags.addEventListener("click", function () {
      loadLeftContainer("tagcat.json");
      highlightClicked(btnTags);
    });
  }

  if (btnDate) {
    btnDate.addEventListener("click", function () {
      loadLeftContainer("datecat.json");
      highlightClicked(btnDate);
    });
  }
});
