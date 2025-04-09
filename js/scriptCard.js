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
  $(".Design.btn").on("click", function () {
    if ($(this).attr("active") == "true") {
      $(this).removeClass("active").attr("active", "false");
      $(".cardBox.Design").css("display", "none");
    } else {
      $(this).attr("active", "true").addClass("active");
      $(".cardBox.Design").css("display", "flex").attr("active", "true");
    }

    // $(".cardBox.Academic").css("display", "none");
    // $(".cardBox.Designerswebsite").css("display", "none");
    // $(".cardBox.AItools").css("display", "none");
  });
}

function setBookHeader() {
  //헤더 카테고리 버튼 스크립트
  $.each(bookmarkData, function (header, name) {
    //   console.log(header, name);
    result = "";
    result += `<div class="${header} btn active" active="true">${header}</div>`;
    $(".Header").append(result);
  });
}

function setBookShelf() {
  $.each(bookmarkData, function (index, item) {
    // console.log(index, item);
    result = "";
    result += `<div class="${index} cardBox" style="height:${
      item.length * 90
    }px"><div class="categoryTitle ${index}"><h1>${index}</h1></div>`;
    console.log(item.length);
    $.each(item, function (firstCategory, subitem) {
      //   console.log(firstCategory, subitem);
      //하단에 카드 불러오는 결과

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
    $(".canvas").append(result);
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

  // $(".indexCard").on("click", function (e) {
  //   if ($(this).attr("clicked") == "false") {
  //     $(this).addClass("clicked", "true");
  //     $(this).attr("clicked", "true");
  //     $(this).css({ transform: "translateY(-600px)" });
  //   } else {
  //     $(this).removeClass("clicked");
  //     $(this).css({ transform: "translateY(0px)" });
  //     $(this).attr("clicked", "false");
  //   }
  // });
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

      //     // 클릭된 카드 오른쪽으로 옮기고 확대
      // $card.addClass("clicked").attr("clicked", "true").css({
      //   top: "50%",
      //   left: "calc(100% - 620px)", // 우측 고정 (카드 폭 고려)
      //   transform: "translateY(-50%) scale(1.25) rotateY(0deg)",
      //   zIndex: 10000,
      // });
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
        <p>${description}</p>
      </div>
      <iframe class="detailIframe" src="${url}" onerror="this.style.display='none';"></iframe>
    `;

    $(".cardDetail").html(detailHTML);
  });

  // 텍스트 하이라이트 효과
  function enableHoverHighlighting() {
    const $text = $(".textContent");
    const originalText = $text.text().trim();

    // 텍스트를 글자 단위로 span으로 감싸기
    const split = originalText.split("").map((char, i) => {
      return `<span class="char" data-index="${i}">${char}</span>`;
    });

    $text.html(split.join(""));

    // 마우스 움직일 때 글자 위치 계산
    $text.on("mousemove", function (e) {
      const offset = $(this).offset();
      const x = e.pageX - offset.left;

      let closestIndex = 0;
      let closestDistance = Infinity;

      // 현재 마우스와 가장 가까운 글자 찾기
      $(this)
        .find(".char")
        .each(function () {
          const charOffset = $(this).position().left;
          const distance = Math.abs(charOffset - x);
          const index = parseInt($(this).data("index"));
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

      // 모든 글자 초기화
      $(this).find(".char").removeClass("highlighted");

      // 기준 인덱스 전후 5글자 하이라이트
      for (let i = closestIndex - 2; i <= closestIndex + 2; i++) {
        $(this).find(`.char[data-index="${i}"]`).addClass("highlighted");
      }
    });

    // 마우스 나가면 하이라이트 제거
    $text.on("mouseleave", function () {
      $(this).find(".char").removeClass("highlighted");
    });
    $(".indexCard").on("mouseenter", function () {
      // 기존 정보 추출 및 .cardDetail HTML 구성 ...

      $(".cardDetail").html(detailHTML);
      // 하이라이트 기능 활성화
      enableHoverHighlighting();
    });
  }
}
