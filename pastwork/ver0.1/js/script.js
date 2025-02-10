var category = ["uiux", "graphic", "thesis"];

$(document).ready(function () {
  // console.log(bookmarkData);

  $.each(bookmarkData, function (category, item) {
    // console.log(index, item);

    //상단 카테고리 분할
    result = "";
    result += `<div class="${category} box"><div class="title"><h1>${category}</h1></div>`;

    $.each(item, function (index, data) {
      // var timestamp = new Date(parseInt(data.addDate) * 1000);
      // var dateAdded = `${timestamp.getFullYear()}-${
      //   timestamp.getMonth() + 1
      // }-${timestamp.getDate()}`;

      result += `
      <div class="card"><div class="overlay"></div>
        <p>${index + 1}</p>
        <a href=${data.url}>${data.description}</a>
        <p>${dateAdded}</p>
      </div>`;
    });
    //위에 상단 카테고리 묶어주는 div
    result += `</div>`;

    //아래 카드 내용 불러오는 부분
    $(".container").append(result);
  });
  //마우스 올리면 카드가 회전하는 효과 jsx
  //var card = document.querySelector('container')
  //var overlay = document.querySelector('overlay')
  //container.addEventListener('mousemove', function(e){
  // var x = e.offsetX
  // var y = e.offsetY
  // console.log(x,y);
  //var rotateY = -1.5 * x + 20
  //var rotateX = 4/30 * y - 20
  //overlay.style = `transform : perspective(350px)
  // rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  // container.style = 'transform : perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)'})

  //마우스 올리면 카드가 회전하는 효과 jquery
  $(".card").on("mousemove", function (e) {
    var x = e.offsetX;
    var y = e.offsetY;

    var rotateY = y / 8 - 20;
    var rotateX = x / 8 - 20;

    console.log(rotateX, rotateY, y);
    //var rotateY = a * x(마우스가 가진 x값) + b

    $(this).children(".overlay").css("perspective", "100px");
    $(this)
      .children(".overlay")
      .css("background-position", `${x / 5 + y / 5}`);
    // $(this)
    //   .children(".overlay")
    //   .css("transform", `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);

    $(this).css("perspective", "100px");
    $(this).css("transform", `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
  });

  $(".card").on("mouseout", function (e) {
    $(this).css("transform", `rotateY(0deg) rotateX(0deg)`);
  });
  $(".overlay").on("mouseout", function (e) {
    $(this).css("transform", `rotateY(0deg) rotateX(0deg)`);
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
    if ($(this).attr("asdf") == "false") {
      $(this).addClass("asdf");
      $(this).attr("asdf", "true");
      $(".graphic.box").css("display", "flex");
    } else {
      $(this).removeClass("asdf");
      $(this).attr("asdf", "false");
      $(".graphic.box").css("display", "none");
    }
  });
  $(".thesis.btn").on("click", function () {
    if ($(this).attr("asdf") == "false") {
      $(this).addClass("asdf");
      $(this).attr("asdf", "true");
      $(".thesis.box").css("display", "flex");
    } else {
      $(this).removeClass("asdf");
      $(this).attr("asdf", "false");
      $(".thesis.box").css("display", "none");
    }
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
