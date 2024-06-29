const swiper = new Swiper(".swiper-container", {
    direction: "vertical",
    effect: "fade",
    speed: 1000,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    mousewheel: {
      invert: false,
      forceToAxis: false,
      thresholdDelta: 50,
      sensitivity: 1,
    },
    on: {
      init: function () {
        let activeSlide = this.slides[this.activeIndex];
        let background = activeSlide.querySelector(".background");
        background.classList.add("animation");
      },
      slideChange: function () {
        this.slides.forEach((slide) => {
          let background = slide.querySelector(".background");
          if (background) {
            background.classList.remove("animation");
          }
        });
        let activeSlide = this.slides[this.activeIndex];
        let background = activeSlide.querySelector(".background");
        if (background) {
          background.classList.add("animation");
        }
      },
    },
  });
  