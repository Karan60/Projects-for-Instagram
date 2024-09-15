/**
 * Preload images function
 * @param {string} selector - The CSS selector for the images to be preloaded. Default is 'img'.
 * @returns {Promise} A promise that resolves when all the images are loaded.
 */
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        // Use the imagesLoaded library to ensure all images are fully loaded.
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    });
};

export {
    preloadImages,
};


