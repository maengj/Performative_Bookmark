var category = ["uiux", "graphic", "thesis"];

$(document).ready(function () {
  // console.log(bookmarkData);

  $.each(bookmarkData, function (category, item) {
    // console.log(index, item);

    //상단 카테고리 분할
    result = "";
    result += `<div class="${category} box"><div class="title"><h1>${category}</h1></div>`;

    var timestamp = new Date();
    var dateAdded = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;

    $.each(item, function (index, data) {
      result += `
      <div class="card">
        <p>${index + 1}</p>
        <a href=${data.url}>${data.description}</a>
        <p>${dateAdded}</p>
      </div>`;
    });
    //위에 상단 카테고리 묶어주는 div
    result += `</div>`;

    //아래 카드 내용 불러오는 부분
    $(".category-container").append(result);
  });
  //상단 카테고리 분류 바 (버튼)
  $.each(bookmarkData, function (barname, i) {
    result = "";
    result += `<div class="${barname} btn" asdf="false">${barname}</div>`;

    $(".top-bar").append(result);
  });
  $(".uiux.btn").on("click", function () {
    if ($(this).attr("asdf") == "false") {
      $(this).addClass("asdf");
      $(this).attr("asdf", "true");
      $(".uiux.box").css("display", "flex");
    } else {
      $(this).removeClass("asdf");
      $(this).attr("asdf", "false");
      $(".uiux.box").css("display", "none");
    }
  });
  $(".graphic.btn").on("click", function () {
    $(this).addClass("asdf");
  });
  $(".thesis.btn").on("click", function () {
    $(this).addClass("asdf");
  });
});

// var btn_array = $(".btn");
// var btn_asdf_array = [];

// $.each(btn_array, function (i, d) {
//   console.log($(d).attr("asdf"));
//   btn_asdf_array[i + "btn"] = $(d).attr("asdf");
// });

// console.log(btn_asdf_array);

// num 이라는 이름을 가진 attribute의 값 반환
// $(this).attr("num");

// num 이라는 이름을 가진 attribute의 값을 2로 정의
// $(this).attr("num", 2);

// $(“”).on(“click”, function (){ $().css(“”,””);});
