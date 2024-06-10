$(document).ready(function() {
    let menuToggle = document.querySelector(".menuToggle");
    let menu = document.querySelector(".menu");
  
    menuToggle.onclick = function () {
      menu.classList.toggle("active");
    };
  });