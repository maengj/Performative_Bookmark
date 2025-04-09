$(document).ready(function () {
  setInitCard();
});

//즐겨찾기 html > href, ADD_Date, Icon
//URL json > description, images

function setInitCard() {
  setBookShelf();
  setBookHeader();
  setCategoryFunction();
}
function setCategoryFunction() {
  ["Design", "Academic", "Designerswebsite", "AItools"].forEach(function (
    category
  ) {
    $(`.${category}.btn`).on("click", function () {
      const isActive = $(this).attr("active") === "true";
      $(this).toggleClass("active").attr("active", !isActive);
      $(`.cardBox.${category}`)
        .css("display", isActive ? "none" : "flex")
        .attr("active", !isActive);
    });
  });
}

function setBookHeader() {
  //헤더 카테고리 버튼 스크립트
  $.each(bookmarkData, function (header, name) {
    result = "";
    result += `<div class="${header} btn active" active="true">${header}</div>`;
    $(".Header").append(result);
  });
}

function setBookShelf() {
  $.each(bookmarkData, function (index, item) {
    result = "";
    result += `<div class="${index} cardBox" style="height:${
      item.length * 90
    }px"><div class="categoryTitle ${index}"><h1>${index}</h1></div>`;
    console.log(item.length);
    $.each(item, function (firstCategory, subitem) {
      result += `<div class="indexCard" style="background-image:url('${
        subitem.images
      }'); top:${
        80 * firstCategory
      }px;" clicked="false"><div class="overlay"></div>
        <div class="cardHeader">
            <h1>${firstCategory + 1}</h1>
            <p><a href="${subitem.url}">${subitem.sitename}</a></p>
        </div>
        <div class="cardContent">
            <div class="glassbg"></div>
            <div class="textContent">${subitem.description}</div>
        </div>
        </div>`;
    });
    result += "</div>";
    $(".cardList").append(result);
  });

  //카드 마우스무브 이벤트

  $(".indexCard").on("mouseenter", function () {
    if ($(this).attr("clicked") == "false") {
      $(this).css("transform", "translateY(-20px)");
    }
  });
  $(".indexCard").on("mouseleave", function () {
    if ($(this).attr("clicked") == "false") {
      $(this).css("transform", "translateY(0px)");
    }
  });

  $(".indexCard").on("click", function () {
    const $card = $(this);
    const clicked = $card.attr("clicked") === "true";

    // 모든 카드 초기화
    $(".indexCard")
      .removeClass("clicked")
      .css("z-index", 1)
      .attr("clicked", "false")
      .css({
        top: function () {
          return $(this).data("originalTop");
        },
        left: "5%",
        transform: "translateY(0px) scale(1) rotateY(0deg)",
      });

    if (!clicked) {
      const originalTop = $card.css("top"); // 기존 위치 저장
      $card.data("originalTop", originalTop);

      // 클릭된 카드 오른쪽으로 옮기고 확대
      $card.addClass("clicked").attr("clicked", "true").css({
        top: "50%",
        left: "calc(100% - 620px)", // 우측 고정 (카드 폭 고려)
        transform: "translateY(-50%) scale(1.25) rotateY(0deg)",
        zIndex: 10000,
      });
    }
  });

  $(".indexCard").on("mouseenter", function () {
    const $card = $(this);

    // 정보 추출
    const sitename = $card.find("a").text();
    const url = $card.find("a").attr("href");
    const description = $card.find(".textContent").text();
    const bg = $card.css("background-image");

    const detailHTML = `
      <div class="detailImage" style="background-image: ${bg}"></div>
      <div class="text-box">
        <h2>${sitename}</h2>
        <p class="textContent">${description}</p>
      </div>
      <iframe class="detailIframe" src="${url}" onerror="this.style.display='none';"></iframe>
    `;

    $(".cardDetail").html(detailHTML);
    enableHoverHighlighting(); // ✅ html 삽입 이후에 호출해야 함
  });

  // 텍스트 하이라이트 효과
  ///________________________________________________________________________________________________________________________

  function enableHoverHighlighting() {
    const $text = $(".cardDetail .textContent");
    const originalText = $text.text().trim();

    // ✅ 단어 단위로 분할
    const words = originalText.split(/\s+/).map((word, i) => {
      return `<span class="word" data-index="${i}">${word}</span>`;
    });
    $text.html(words.join(" "));
    $text.addClass("processed");

    // ✅ 마우스 위치 기반 하이라이팅
    $text.on("mousemove", function (e) {
      const offset = $(this).offset();
      const mouseX = e.pageX + 2;
      const mouseY = e.pageY + 1;

      let closestIndex = 0;
      let closestDistance = Infinity;

      $(this)
        .find(".word")
        .each(function () {
          const wordOffset = $(this).offset();
          const wordCenterX = wordOffset.left + $(this).outerWidth() / 2;
          const wordCenterY = wordOffset.top + $(this).outerHeight() / 2;

          const dx = mouseX - wordCenterX;
          const dy = mouseY - wordCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy); // ✅ x+y 모두 반영

          const index = parseInt($(this).data("index"));
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

      // ✅ 중심 기준 5단어 하이라이트
      $(this).find(".word").removeClass("highlighted");

      for (let i = closestIndex - 1; i <= closestIndex + 1; i++) {
        $(this).find(`.word[data-index="${i}"]`).addClass("highlighted");
      }
    });

    // ✅ 마우스 떠나면 초기화
    $text.on("mouseleave", function () {
      $(this).find(".word").removeClass("highlighted");
    });
  }
}
