/* Source: https://codepen.io/tommyho tommyho510@gmail.com */

/*
// Template ${}
const ${} = document.getElementById('${}');
let ${}Val = document.getElementById('${}-value');

${}.addEventListener('change', (e) => {
  let val = e.target.value;
	${}Val.textContent = `${val}%`; // or `${val}px`;
	applyFilter();
});

// where ${} can be:
	blur()
	brightness()
	contrast()
	drop-shadow()
	grayscale()
	hue-rotate()
	invert()
	opacity()
	saturate()
	sepia()
	url() – (for applying SVG filters)
*/

// Define image
const filterImage = document.getElementById("filter-image");

// Define sliders
const brightness = document.getElementById("brightness");
let brightnessVal = document.getElementById("brightness-value");
const contrast = document.getElementById("contrast");
let contrastVal = document.getElementById("contrast-value");
const saturate = document.getElementById("saturate");
let saturateVal = document.getElementById("saturate-value");
const grayscale = document.getElementById("grayscale");
let grayscaleVal = document.getElementById("grayscale-value");
const sepia = document.getElementById("sepia");
let sepiaVal = document.getElementById("sepia-value");
const blur = document.getElementById("blur");
let blurVal = document.getElementById("blur-value");
const opacity = document.getElementById("opacity");
let opacityVal = document.getElementById("opacity-value");

// Define buttons
const resetBtn = document.getElementById("reset-filter");
const randBtn = document.getElementById("random-filter");
const showBtn = document.getElementById("show-filter");

// Brightness
brightness.addEventListener("change", (e) => {
	let val = e.target.value;
	brightnessVal.textContent = `${val}%`;
	applyFilter();
});

// Contrast
contrast.addEventListener("change", (e) => {
	let val = e.target.value;
	contrastVal.textContent = `${val}%`;
	applyFilter();
});

// Saturate
saturate.addEventListener("change", (e) => {
	let val = e.target.value;
	saturateVal.textContent = `${val}%`;
	applyFilter();
});

// Opacity
opacity.addEventListener("change", (e) => {
	let val = e.target.value;
	opacityVal.textContent = `${val}%`;
	applyFilter();
});

// Grayscale
grayscale.addEventListener("change", (e) => {
	let val = e.target.value;
	grayscaleVal.textContent = `${val}%`;
	applyFilter();
});

// Sepia
sepia.addEventListener("change", (e) => {
	let val = e.target.value;
	sepiaVal.textContent = `${val}%`;
	applyFilter();
});

// Blur
blur.addEventListener("change", (e) => {
	let val = e.target.value;
	blurVal.textContent = `${val}px`;
	applyFilter();
});

// Reset
resetBtn.addEventListener("click", () => {
	reset();
});

// Random Filter
randBtn.addEventListener("click", () => {
	randFilter();
});

// Run random filter 50x
showBtn.addEventListener("click", () => {
	count(50); 
});

// Loop filter
function count(num){
	setTimeout(function () {
		randFilter();
		console.log("Random Filter #" + num);
		if (num > 0) count(num - 1);
	}, 100);
}

// Reset settings
function reset() {
	brightness.value = 100;
	contrast.value = 100;
	saturate.value = 100;
	opacity.value = 100;
	grayscale.value = 0;
	sepia.value = 0;
	blur.value = 0;
	adjFilter();
	applyFilter();
}

// Apply random settings
function randFilter() {
	brightness.value = Math.floor(Math.random() * 200);
	contrast.value = Math.floor(Math.random() * 200);
	saturate.value = Math.floor(Math.random() * 100);
	opacity.value = Math.floor(Math.random() * 50) + 50; // limited to >50
	grayscale.value = 0; // limited to 0
	sepia.value = Math.floor(Math.random() * 100);
	blur.value = Math.floor(Math.random() * 5); // limited to <5
	adjFilter();
	applyFilter();
}

// update filter settings
function adjFilter() {
	brightnessVal.textContent = brightness.value + "%";
	contrastVal.textContent = contrast.value + "%";
	saturateVal.textContent = contrast.value + "%";
	opacityVal.textContent = opacity.value + "%";
	grayscaleVal.textContent = grayscale.value + "%";
	sepiaVal.textContent = sepia.value + "%";
	blurVal.textContent = blur.value + "px";
}

// Execute filter settings
function applyFilter() {
	filterImage.style.filter = `
	  brightness(${brightnessVal.textContent})
		contrast(${contrastVal.textContent})
		saturate(${saturateVal.textContent})
		opacity(${opacityVal.textContent})
		grayscale(${grayscaleVal.textContent})
		sepia(${sepiaVal.textContent})
		blur(${blurVal.textContent})
	`;
}
