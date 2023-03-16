// Get HTML elements
const timeSelect = document.querySelector('#time');
const startBtn = document.querySelector('#start');
const pauseBtn = document.querySelector('#pause');
const stopBtn = document.querySelector('#stop');
const display = document.querySelector('.display');

let timeLeft, timerId;

// Format remaining time as a string (mm:ss)
function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}

// Start the timer
function startTimer() {
  timeLeft = parseInt(timeSelect.value);
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      stopTimer();
    }
    display.textContent = formatTime(timeLeft);
  }, 1000);
  startBtn.hidden = true;
  pauseBtn.hidden = false;
  stopBtn.hidden = false;
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerId);
  startBtn.hidden = false;
  pauseBtn.hidden = true;
}

// Stop the timer
function stopTimer() {
  clearInterval(timerId);
  display.textContent = '00:00';
  startBtn.hidden = false;
  pauseBtn.hidden = true;
  stopBtn.hidden = true;
}

// Add event listeners to buttons
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);
