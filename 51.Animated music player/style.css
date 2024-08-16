@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600&display=swap");

:root {
  --primary-clr: rgba(228, 228, 229, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Nunito", sans-serif;
}

body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background: url(/Images/background.png);
  background-repeat: no-repeat;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: slidein 120s forwards infinite alternate;
}

@keyframes slidein {
  0%,
  100% {
    background-position: 20% 0%;
    background-size: 3400px;
  }
  50% {
    background-position: 100% 0%;
    background-size: 2400px;
  }
}

.album-cover {
  width: 90%;
}

.swiper {
  width: 100%;
  padding: 40px 0 100px;
}

.swiper-slide {
  position: relative;
  max-width: 200px;
  aspect-ratio: 1/1;
  border-radius: 10px;
}

.swiper-slide img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  -webkit-box-reflect: below -5px linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.4));
  transform-origin: center;
  transform: perspective(800px);
  transition: 0.3s ease-out;
  pointer-events: none;
  user-select: none;
}

.swiper-slide-active .overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 98%;
  background-color: rgba(28, 22, 37, 0.6);
  border-radius: inherit;
  opacity: 0;
  transition: all 0.4s linear;
}

.swiper-slide:hover .overlay {
  opacity: 1;
}

.swiper-slide .overlay ion-icon {
  opacity: 0;
}

.swiper-slide-active:hover .overlay ion-icon {
  font-size: 4rem;
  color: #eb0b0b;
  opacity: 1;
  cursor: pointer;
}

/* Music Player */

.music-player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--primary-clr);
  width: 380px;
  padding: 10px 30px;
  border-radius: 20px;
}

.music-player h1 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6;
}

.music-player p {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.6;
}

/* Music Player Progress */

#progress {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 7px;
  background: rgba(163, 162, 164, 0.4);
  border-radius: 4px;
  margin: 32px 0 24px;
  cursor: pointer;
}

#progress::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(163, 162, 164, 0.9);
  width: 16px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  outline: 4px solid var(--primary-clr);
  box-shadow: 0 6px 10px rgba(5, 36, 28, 0.3);
}

/* Music Player Controls */

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
}

.controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  aspect-ratio: 1/1;
  margin: 20px;
  background: rgba(163, 162, 164, 0.3);
  color: var(--primary-clr);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  outline: 0;
  font-size: 1.1rem;
  box-shadow: 0 10px 20px rgba(5, 36, 28, 0.3);
  cursor: pointer;
  transition: all 0.3s linear;
}

.controls button:is(:hover, :focus-visible) {
  transform: scale(0.96);
}

.controls button:nth-child(2) {
  transform: scale(1.3);
}

.controls button:nth-child(2):is(:hover, :focus-visible) {
  transform: scale(1.25);
}