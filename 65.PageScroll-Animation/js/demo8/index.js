import { preloadImages } from '../utils.js'; // Utility function to preload images
import { Slideshow } from './slideshow.js';

const slides = document.querySelector('.slides');
const slideshow = new Slideshow(slides);

document.querySelector('.slides-nav__item--prev').addEventListener('click', () => slideshow.prev());
document.querySelector('.slides-nav__item--next').addEventListener('click', () => slideshow.next());
// Initialize the GSAP Observer plugin
Observer.create({
    type: 'wheel,touch,pointer',
    onDown: () => slideshow.prev(),
    onUp: () => slideshow.next(),
    // invert the mouse wheel delta
    wheelSpeed: -1,
    tolerance: 10
});

// Preload all images. Once all images are preloaded, remove the 'loading' class from the body.
preloadImages('.slide__img').then(() => document.body.classList.remove('loading'));