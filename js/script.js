var categories = ["uiux", "graphic", "thesis"];

$(document).ready(function () {
  var result = ``;
  $.each(categories, function (i, key) {
    var KeyArray = bookmarkData[key];
    result += `<div class="category-container ${key}">`;
    result += `<h2 class="separate">${key.toUpperCase()}</h2>`;
    $.each(KeyArray, function (i, context) {
      var timestamp = new Date(parseInt(context.addDate) * 1000);
      var savedTime = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;

      result += `<div class="card ${key}">
            <h1>${i + 1}</h1>
            <p class="bookmark-name "><a href="${context.url}">${
        context.description
      }</a></p>
            <p>${savedTime}</p>
        </div>`;
    });
    result += "</div>";
  });
  result += "";
  $(".container").append(result);

  $(".uiux-btn").on("click", function () {
    $(".category-container.uiux").css("display", "flex");
    $(".category-container.graphic").css("display", "none");
    $(".category-container.thesis").css("display", "none");
  });

  $(".graphic-btn").on("click", function () {
    $(".category-container.graphic").css("display", "flex");
    $(".category-container.uiux").css("display", "none");
    $(".category-container.thesis").css("display", "none");
  });

  $(".thesis-btn").on("click", function () {
    $(".category-container.thesis").css("display", "flex");
    $(".category-container.uiux").css("display", "none");
    $(".category-container.graphic").css("display", "none");
  });
});

// var result = "";
// var tiemconv = new Date(parseInt(item.addDate) * 1000);
// var todayString = `${tiemconv.getFullYear()}-${tiemconv.getMonth()}-${tiemconv.getDate()}`;

// result += `
//   <div class="card">
//         <h1>${index}</h1>
//     <p class="bookmark-name "><a href="${item.url}">${item.description}</a></p>
//     <p>${todayString}</p>
// </div>
// `;

// $(".container").append(result);

//double each
// $.each(categories, function (i, key) {
//     console.log(bookmarkData[key]);

//     var keyArray = bookmarkData[key];
//     $.each(keyArray, function (i, item) {
//       console.log(item);
//     });
//   });

// 다시 만들기
// 카테고리별 버튼 ui만들기
// 카테고리별 버튼을 클릭할때 해당 카테고리 card만 남게 하기
// jQuery on - click 메소드에 대한 이해, addClass Remove를 통한 스타일 컨트롤
// 시간이 된다면 Github Page로 퍼블리싱
