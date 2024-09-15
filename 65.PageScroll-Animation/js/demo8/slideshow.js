/** Direction constants */
const NEXT = 1;
const PREV = -1;

/**
 * Slideshow Class
 * Manages slideshow functionality including navigation and animations.
 * @export
 */
export class Slideshow {

	/**
     * Holds references to relevant DOM elements.
     * @type {Object}
     */
	DOM = {
		el: null,            // Main slideshow container
        slides: null,        // Individual slides
        slidesInner: null    // Inner content of slides (usually images)
	};
	/**
     * Index of the current slide being displayed.
     * @type {number}
     */
    current = 0;
    /**
     * Total number of slides.
     * @type {number}
     */
    slidesTotal = 0;

	/**  
	 * Flag to indicate if an animation is running.
	 * @type {boolean}
	 */
	isAnimating = false;
	
	/**
     * Slideshow constructor.
     * Initializes the slideshow and sets up the DOM elements.
     * @param {HTMLElement} DOM_el - The main element holding all the slides.
     */
	constructor(DOM_el) {
		// Initialize DOM elements
		this.DOM.el = DOM_el;
		this.DOM.slides = [...this.DOM.el.querySelectorAll('.slide')];
		this.DOM.slidesInner = this.DOM.slides.map(item => item.querySelector('.slide__img'));
		
		// Set initial slide as current
		this.DOM.slides[this.current].classList.add('slide--current');
		
		// Count total slides
		this.slidesTotal = this.DOM.slides.length;
	}

	/**
     * Navigate to the next slide.
     * @returns {void}
     */
    next() {
        this.navigate(NEXT);
    }

    /**
     * Navigate to the previous slide.
     * @returns {void}
     */
    prev() {
        this.navigate(PREV);
    }

    /**
     * Navigate through slides.
     * @param {number} direction - The direction to navigate. 1 for next and -1 for previous.
     * @returns {boolean} - Return false if the animation is currently running.
     */
	navigate(direction) {  
		// Check if animation is already running
		if ( this.isAnimating ) return false;
		this.isAnimating = true;
		
		// Update the current slide index based on direction
		const previous = this.current;
		this.current = direction === 1 ? 
						this.current < this.slidesTotal - 1 ? ++this.current : 0 :
						this.current > 0 ? --this.current : this.slidesTotal - 1

		// Get the current and upcoming slides and their inner elements
		const currentSlide = this.DOM.slides[previous];
		const currentInner = this.DOM.slidesInner[previous];
		const upcomingSlide = this.DOM.slides[this.current];
		const upcomingInner = this.DOM.slidesInner[this.current];
		
		// Animation sequence using GSAP
		gsap
		.timeline({
			onStart: () => {
				// Add class to the upcoming slide to mark it as current
				this.DOM.slides[this.current].classList.add('slide--current');
				gsap.set(upcomingSlide, {zIndex: 99});
			},
			onComplete: () => {
				// Remove class from the previous slide to unmark it as current
                this.DOM.slides[previous].classList.remove('slide--current');
				gsap.set(upcomingSlide, {zIndex: 1})
				// Reset animation flag
                this.isAnimating = false;
			}
		})
		// Defining animation steps
		.addLabel('start', 0)
		.fromTo(upcomingSlide, {
			autoAlpha: 1,
			scale: 0.1,
			xPercent: direction*100
		}, {
			duration: 0.7, 
			ease: 'expo',
			scale: 0.4,
			xPercent: 0
		}, 'start')
		.fromTo(upcomingInner, {
			filter: 'contrast(100%) saturate(100%)',
			transformOrigin: '100% 50%',
			scaleX: 4
		}, {
			duration: 0.7, 
			ease: 'expo',
			scaleX: 1
		}, 'start')
		.fromTo(currentInner, {
			filter: 'contrast(100%) saturate(100%)'
		}, {
			duration: 0.7, 
			ease: 'expo',
			filter: 'contrast(120%) saturate(140%)'
		}, 'start')

		.addLabel('middle', 'start+=0.6')
		.to(upcomingSlide, {
			duration: 1, 
			ease: 'power4.inOut',
			scale: 1
		}, 'middle')
		.to(currentSlide, {
			duration: 1, 
			ease: 'power4.inOut',
			scale: 0.98,
			autoAlpha: 0
		}, 'middle')
	}

}