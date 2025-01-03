$(document).ready(function () {
  setInitCard();
});

//즐겨찾기 html > href, ADD_Date, Icon
//URL json > description, images

function setInitCard() {
  setBookHeader();
  setBookShelf();
}

function setBookShelf() {
  $.each(bookmarkData, function (index, item) {
    // console.log(index, item);
    result = "";
    result += `<div class="${index} cardBox"><div class="categoryTitle"><h1>${index}</h1></div>`;

    $.each(item, function (firstCategory, subitem) {
      //   console.log(firstCategory, subitem);
      //하단에 카드 불러오는 결과

      result += `<div class="indexCard" style="background-image:url('${
        subitem.images
      }');"><div class="overlay"></div>
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
  $(".indexCard").on("mousemove", function (e) {
    var x = e.offsetX;
    var y = e.offsetY;

    var rotateX = y / 30 - 20;
    var rotateY = x / 30 + 20;
    // console.log(rotateX, rotateY);
    $(this).css("perspective", "250px");
    $(this).css("transform", `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);

    //카드 반짝이 이벤트
    $(this).children(".overlay").css("perspective", "300px");
    // $(this)
    //   .children(".overlay")
    //   .css("background-position", `${x / 5 + 150}px ${y / 5 + 95}px`);
    $(this)
      .children(".overlay")
      .css("transform", `translate(${-x / 5}px,${-y / 5}px`);

    $(".indexCard").on("mouseout", function (e) {
      $(this).css("transform", `rotateY(0deg) rotateX(0deg)`);
      $(this).children(".overlay").css("background-position", `center`);
    });
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

  $.each(bookmarkData, function (header, name) {
    $(`.${header}.btn`).on("click", function () {
      console.log(header);
      if ($(this).attr("active") == "false") {
        $(this).addClass("active");
        $(this).attr("active", "true");
        $(`.${header}.cardBox`).css("display", "flex");
      } else {
        $(this).removeClass("active");
        $(this).attr("active", "false");
        $(`.${header}.cardBox`).css("display", "none");
      }
    });
  });
}
