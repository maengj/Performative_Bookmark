$(document).ready(function () {
  function sayHello(name) {
    return "Hello, " + name + "!";
  }
  document.getElementById("result").textContent = sayHello("World");
});
