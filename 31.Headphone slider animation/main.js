// Get all the background divs
var backgrounds = document.querySelectorAll('.background');
// Get the slider and the images
const slider = document.querySelector('.slider-images');
const images = Array.from(slider.children);

// Set the initial image index
let imageIndex = 0;

// Update the slider
function updateSlider() {
    // Remove the 'active', 'previous', 'next', and 'inactive' classes from all images
    images.forEach(image => {
        image.classList.remove('active', 'previous', 'next', 'inactive');
    });

    // Add the 'active' class to the current image
    images[imageIndex].classList.add('active');

    // Add the 'previous' class to the image before the current one
    if (imageIndex - 1 >= 0) {
        images[imageIndex - 1].classList.add('previous');
    } else {
        images[images.length - 1].classList.add('previous');
    }

    // Add the 'next' class to the image after the current one
    if (imageIndex + 1 < images.length) {
        images[imageIndex + 1].classList.add('next');
    } else {
        images[0].classList.add('next');
    }

    // Add the 'inactive' class to the other images
    images.forEach((image, index) => {
        if (index !== imageIndex && index !== (imageIndex - 1 + images.length) % images.length && index !== (imageIndex + 1) % images.length) {
            image.classList.add('inactive');
        }
    });

    // Set the opacity of all the background divs to 0
    backgrounds.forEach((background) => {
        background.style.opacity = 0;
    });
    // If the current image is active, set the opacity of the corresponding background div to 1
    if (images[imageIndex].classList.contains('active')) {
        backgrounds[imageIndex].style.opacity = 1;
    }
    // Update the image index
    imageIndex = (imageIndex + 1) % images.length;
}
updateSlider();
// Update the slider every 3 seconds
setInterval(updateSlider, 3000);

images[1].classList.add('next');
images[2].classList.add('inactive');
images[3].classList.add('inactive');
images[4].classList.add('previous');
images[0].classList.add('active');