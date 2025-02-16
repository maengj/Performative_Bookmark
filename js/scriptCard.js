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

  $(".indexCard").on("click", function (e) {
    if ($(this).attr("clicked") == "false") {
      $(this).addClass("clicked", "true");
      $(this).attr("clicked", "true");
      $(this).css({ transform: "translateY(-600px)" });
    } else {
      $(this).removeClass("clicked");
      $(this).css({ transform: "translateY(0px)" });
      $(this).attr("clicked", "false");
    }
  });
}
