var CategoryData = [
  "UIdesign",
  "AItools",
  "School",
  "category1",
  "category2",
  "category3",
  "category4",
];

//위 categorydata 배열을 불러온다
//배열을 console log로 출력해본다
//log 에 나오는 것을 확인하고 그 값을 가지는 drawer를 .box에 i가 끝날때까지 반복해서 생성한다.
$(document).ready(function () {
  loadpage();
});

function loadpage() {
  $.each(CategoryData, function (i, category) {
    console.log(i, category);
    var result = `<div class="drawer" style="z-index:${
      100 - i
    }"><div class="drawerOpen">${category}</div></div>`;
    $(".box").append(result);
  });
}

function loadpage() {
  var result = "";
  $.each(CategoryData, function (i, category) {
    console.log(i, category, result);
    result += `<div class="drawer" style="z-index:${
      100 - i
    }"><div class="drawerOpen textstyle">${category}</div></div>`;
  });
  $(".box").append(result);
}
