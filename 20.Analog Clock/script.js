var hourHand = document.querySelector(".hour__hand");
var minHand = document.querySelector(".minute__hand");
var secHand = document.querySelector(".sec__hand");
function clock() {
    var date = new Date();
    var seconds = date.getSeconds() / 60;
    var mins = (seconds + date.getMinutes()) / 60;
    var hour = (mins + date.getHours()) / 12;

    rotateClockHand(secHand, seconds);
    rotateClockHand(minHand, mins);
    rotateClockHand(hourHand, hour);
}
function rotateClockHand(hand, rotation) {
    hand.style.setProperty ('--rotate', rotation * 360);

    let sound = new Audio('clock-ticking.mp3');
    sound.play();
}

setInterval(clock, 1000);