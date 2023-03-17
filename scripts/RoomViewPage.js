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


const istasks = false;
const isnotes = false;
document.getElementById("tasks").onmousedown = function () {
  if (isnotes === false) {
    document.getElementById("tasks-wrapper").style.display = "block";
    document.getElementById("notes-wrapper").style.display = "none";
    istasks = true;
  }
}

document.getElementById("notes").onmousedown = function () {
  if (istasks === false) {
    document.getElementById("notes-wrapper").style.display = "block";
    document.getElementById("tasks-wrapper").style.display = "none";
    isnotes = true;
  }
}

const isassignments = false;
const isrsources = false;
document.getElementById("resources").onmousedown = function () {
  if (isassignments === false) {
    document.getElementById("resources-wrapper").style.display = "block";
    document.getElementById("assignments-wrapper").style.display = "none";
    isrsources = true;
  }
}

document.getElementById("assignments").onmousedown = function () {
  if (isnotes === false) {
    document.getElementById("assignments-wrapper").style.display = "block";
    document.getElementById("resources-wrapper").style.display = "none";
    isassignments = true;
  }
}

const submitForm = document.querySelector('.add');
const addButton = document.querySelector('.add-todo');
const todoList = document.querySelector('.todos');
const list = document.querySelectorAll('.todos li'); //gives a NodeList of all li's
let listLength = list.length;

const generateTemplate = (todo) => {

    const html = `<li>
                    <input type="checkbox" id="todo_${listLength}" />
                    <label for="todo_${listLength}">
                        <span class="check"></span>${todo}
                    </label>
                    <i class="far fa-trash-alt delete"></i>
                  </li>`
    todoList.innerHTML += html;
};

function addTodos(e) {
    e.preventDefault();
    const todo = submitForm.add.value.trim(); //trim extra space in input
    if (todo.length) { // to check whether the input is empty
        listLength = listLength + 1; // to update the checkbox id when we add a new list item
        generateTemplate(todo);
        submitForm.reset();
    }

}
//add todos
submitForm.addEventListener('submit', addTodos);
addButton.addEventListener('click', addTodos);

function deleteTodos(e) {
    if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
    }
}
//delete todos
todoList.addEventListener('click', deleteTodos);