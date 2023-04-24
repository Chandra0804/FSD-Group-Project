const navigation_items_elms = document.querySelectorAll(
  ".navigation-bar .list-items .item"
);
const navigation_pointer = document.querySelector(".navigation-bar .pointer");

navigation_items_elms.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navigation_items_elms.forEach((itm) => itm.classList.remove("active"));
    item.classList.add("active");

    const parentWidth = item.parentElement.clientWidth;
    const lefPercent = (parentWidth / navigation_items_elms.length) * index;
    navigation_pointer.style.left = lefPercent + "px";
  });
});

var home = document.getElementById("home");
var openassignments = document.getElementById("assignments");
var openresources = document.getElementById("resources");
var openinfo = document.getElementById("info");
var openparticipants = document.getElementById("participants");
var screencontent = document.getElementById("screen");
var leftsidebar = document.getElementById("left-sidebar");
var rightsidebar = document.getElementById("right-sidebar");
const assignmentWrapper = document.getElementById("assignment-wrapper");
const resourceswrapper = document.getElementById("resources-wrapper");
var isleft = false;
var isright = false;

openassignments.addEventListener("click", function () {
  if(isright){
    rightsidebar.classList.remove("open");
    screencontent.classList.remove("right");
    isright = false;
  }
  leftsidebar.classList.add("open");
  screencontent.classList.add("left");
  showAssignments();
  isleft = true;
});

openresources.addEventListener("click", function () {
  if(isright){
    rightsidebar.classList.remove("open");
    screencontent.classList.remove("right");
    isright = false;
  }
  leftsidebar.classList.add("open");
  screencontent.classList.add("left");
  showResources();
  isleft = true;
})

openparticipants.addEventListener("click", function () {
  if(isleft){
    leftsidebar.classList.remove("open");
    screencontent.classList.remove("left");
    isleft = false;
  }
  rightsidebar.classList.add("open");
  screencontent.classList.add("right");
  isright = true;
})

home.addEventListener("click", function () {
  leftsidebar.classList.remove("open");
  rightsidebar.classList.remove("open");
  screencontent.classList.remove("left");
  screencontent.classList.remove("right");
});

function showAssignments() {
  assignmentWrapper.style.display = "block";
  resourceswrapper.style.display = "none";
}

function showResources(){
  assignmentWrapper.style.display = "none";
  resourceswrapper.style.display = "block";
}

const chatInput = document.getElementById('chat-input');
const chatLogs = document.querySelector('.chat-logs');

const boldButton = document.getElementById('bold-button');
const italicButton = document.getElementById('italic-button');
const underlineButton = document.getElementById('underline-button');
const colorButton = document.getElementById('color-picker');
const strikethroughButton = document.getElementById('strikethrough-button');

const exitButton1 = document.querySelector('.close-button');
exitButton1.addEventListener('click', () => {
  window.close();
});


const exitButton2 = document.querySelector('.close-button');
exitButton2.addEventListener('click', () => {
  window.close();
});

let boldActive = false;
let italicActive = false;
let underlineActive = false;
let colorValue = '#000000';
let strikethroughActive = false;

function resetInputStyles() {
  chatInput.style.fontWeight = 'normal';
  chatInput.style.fontStyle = 'normal';
  chatInput.style.textDecoration = 'none';
  chatInput.style.color = '#000000';
  boldButton.classList.remove('active');
  italicButton.classList.remove('active');
  underlineButton.classList.remove('active');
  colorButton.style.backgroundColor = colorValue;
  strikethroughButton.classList.remove('active');
  boldActive = false;
  italicActive = false;
  underlineActive = false;
  colorValue = '#000000';
  colorButton.value = '#000000';
  strikethroughActive = false;
}

boldButton.addEventListener('click', (event) => {
  event.preventDefault();
  boldActive = !boldActive;
  chatInput.style.fontWeight = boldActive ? 'bold' : 'normal';
  boldButton.classList.toggle('active', boldActive);
});

italicButton.addEventListener('click', (event) => {
  event.preventDefault();
  italicActive = !italicActive;
  chatInput.style.fontStyle = italicActive ? 'italic' : 'normal';
  italicButton.classList.toggle('active', italicActive);
});

underlineButton.addEventListener('click', (event) => {
  event.preventDefault();
  underlineActive = !underlineActive;
  chatInput.style.textDecoration = underlineActive ? 'underline' : 'none';
  underlineButton.classList.toggle('active', underlineActive);
});

colorButton.addEventListener('input', (event) => {
  event.preventDefault();
  colorValue = event.target.value;
  chatInput.style.color = colorValue;
  colorButton.style.backgroundColor = colorValue;
});

strikethroughButton.addEventListener('click', (event) => {
  event.preventDefault();
  strikethroughActive = !strikethroughActive;
  chatInput.style.textDecoration = strikethroughActive ? 'line-through' : 'none';
  strikethroughButton.classList.toggle('active', strikethroughActive);
});

chatInput.form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the user's input from the chat input field
  const userInput = chatInput.value.trim();

  // Clear the chat input field and reset styles
  chatInput.value = '';

  // Create a new chat log element with the user's input
  const newChatLog = document.createElement('div');
  newChatLog.classList.add('chat-log');
  newChatLog.innerHTML = `
    <div class="chat-msg" style="font-weight: ${boldActive ? 'bold' : 'normal'}; font-style: ${italicActive ? 'italic' : 'normal'}; text-decoration: ${underlineActive ? 'underline' : 'none'}; text-decoration: ${strikethroughActive ? 'line-through' : 'none'}; color: ${colorValue};">${userInput}</div>
  `;

  resetInputStyles();

  // Add the new chat log element to the chat logs container
  chatLogs.appendChild(newChatLog);
});

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

const addBox = document.querySelector(".add-box"),
  popupBox = document.querySelector(".popup-box"),
  popupTitle = popupBox.querySelector("header p"),
  closeIcon = popupBox.querySelector("header i"),
  titleTag = popupBox.querySelector("input"),
  descTag = popupBox.querySelector("textarea"),
  addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = "";
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>');
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = noteId;
  isUpdate = true;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
    description = descTag.value.trim();

  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();

    let noteInfo = { title, description, date: `${month} ${day}, ${year}` }
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});

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

//Timer
let countdown;
let paused = false;
let remainingTime = 0;
const alarmSound = new Audio('/audio/alarm.mp3');

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  if (paused) {
    then += remainingTime * 1000;
    paused = false;
  }

  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    remainingTime = secondsLeft;

    if (secondsLeft < 0) {
      clearInterval(countdown);
      alarmSound.play();
      return;
    }

    if (!paused) {
      displayTimeLeft(secondsLeft);
    }
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;

  document.title = display;
  const timerDisplay = document.querySelector('.display');
  timerDisplay.textContent = display;
}

function startTimer() {
  const seconds = parseInt(document.querySelector('input[name="item"]:checked').getAttribute('data-time'));
  timer(seconds);
  document.getElementById('start').style.display = 'none';
  document.getElementById('pause').style.display = 'inline-block';
  document.getElementById('stop').style.display = 'inline-block';
}

function pauseTimer() {
  clearInterval(countdown);
  paused = true;
  document.getElementById('pause').style.display = 'none';
  document.getElementById('play').style.display = 'inline-block';
}

function playTimer() {
  paused = false;
  timer(remainingTime);
  document.getElementById('play').style.display = 'none';
  document.getElementById('pause').style.display = 'inline-block';
}

const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const playButton = document.getElementById('play');

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
playButton.addEventListener('click', playTimer);
stopButton.addEventListener('click', () => {
  clearInterval(countdown);
  displayTimeLeft(0);
  document.getElementById('pause').style.display = 'none';
  document.getElementById('stop').style.display = 'none';
  document.getElementById('start').style.display = 'inline-block';
  document.getElementById('play').style.display = 'none';
  paused = false;
});

//Participants part
const moreOptionsBtns = document.querySelectorAll('.more-options');

moreOptionsBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const dropdown = e.target.nextElementSibling;
    if (dropdown.style.display === 'none' || !dropdown.style.display) {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
  });
});

document.addEventListener('click', e => {
  const dropdowns = document.querySelectorAll('.options-dropdown');
  dropdowns.forEach(dropdown => {
    if (e.target !== dropdown.previousElementSibling && e.target !== dropdown && dropdown.style.display !== 'none') {
      dropdown.style.display = 'none';
    }
  });
});

//Resources section
const toggleFiles = document.querySelectorAll('.toggle-files');

toggleFiles.forEach(button => {
  button.addEventListener('click', () => {
    const filelist = button.nextElementSibling;
    filelist.classList.toggle('file-list');
  });
});
const addResourceBtn = document.querySelector('.add-resource-btn');
const addResourcePopup = document.querySelector('.add-resource-popup');
const resourceForm = document.querySelector('.add-resource-popup form');
const resourceList = document.querySelector('.file-list');

addResourceBtn.addEventListener('click', () => {
  addResourcePopup.style.display = 'block';
});

resourceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleInput = document.querySelector('#resource-title');
  const linkInput = document.querySelector('#resource-link');
  const title = titleInput.value;
  const link = linkInput.value;
  const currentDate = new Date();

  // format the date to display in the required format
  const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  // create a new list item with the resource details
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <div class="resource-title">${title}</div>
    <div class="resource-link"><a href="${link}" target="_blank">${link}</a></div>
    <div class="resource-date">${formattedDate}</div>
  `;
  resourceList.appendChild(listItem);

  // clear the input fields and hide the popup
  titleInput.value = '';
  linkInput.value = '';
  addResourcePopup.style.display = 'none';
});


//Assignment section
const addAssignmentBtn = document.querySelector('.add-assignment-btn');
const addAssignmentPopup = document.querySelector('.add-assignment-popup');
const assignmentForm = document.querySelector('.add-assignment-popup form');

addAssignmentBtn.addEventListener('click', () => {
  addAssignmentPopup.style.display = 'block';
});

assignmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleInput = document.querySelector('#assignment-title');
  const linkInput = document.querySelector('#assignment-link');
  const title = titleInput.value;
  const link = linkInput.value;
  // do something with the title and link inputs, e.g. add them to a list
  titleInput.value = '';
  linkInput.value = '';
  addAssignmentPopup.style.display = 'none';
});

//Music
const playBtn = document.getElementById("playBtn");
const musicPlayer = document.getElementById("musicPlayer");

playBtn.addEventListener("click", function() {
  if (musicPlayer.paused) {
    musicPlayer.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause" style="color: #013049; font-size: 25px;"></i>';
  } else {
    musicPlayer.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-music" style="color: #013049; font-size: 25px;"></i>';
  }
});


//Info section
const infoIcon = document.querySelector('.fa-circle-info');
const roomModal = document.querySelector('.room-modal');
const roomModalTitle = document.querySelector('.room-modal-title');
const roomModalMentor = document.querySelector('.room-modal-mentor');
const roomModalTags = document.querySelector('.room-modal-tags');
const roomModalSyllabus = document.querySelector('.room-modal-syllabus');
const roomModalClose = document.createElement('span');
const modalBackground = document.querySelector('.modal-background');
roomModalClose.classList.add('room-modal-close');
roomModalClose.innerHTML = '&times;';

infoIcon.addEventListener('click', async () => {
  // Populate the room modal with hardcoded values
  roomModalTitle.textContent = 'Example Room';
  roomModalMentor.textContent = 'Mentor: John Doe';
  roomModalTags.textContent = 'Tags: Math, Science';
  roomModalSyllabus.src = 'https://github.com/Chandra0804/FSD-Group-Project/blob/70724472697105f0bf354fe0a371a26d18a6125e/3-9.pdf';

  // Show the room modal and modal background
  roomModal.style.display = 'block';
  modalBackground.style.display = 'block';
  roomModal.appendChild(roomModalClose);
});

// Hide the room modal and modal background when the user clicks the close button or outside of it
roomModal.addEventListener('click', (event) => {
  if (event.target === roomModalClose || event.target === roomModal) {
    roomModal.style.display = 'none';
    modalBackground.style.display = 'none';
    roomModal.removeChild(roomModalClose);
  }
});

//Focus section
const focusButton = document.querySelector('.focus-popup-button');
const focusPopup = document.querySelector('#focus-popup');
const closePopupButton = document.querySelector('.close-button');
const rightWrapper = document.querySelector('.right-wrapper');
const leftWrapper = document.querySelector('.left-wrapper');

focusButton.addEventListener('click', function() {
  focusPopup.style.display = 'block';
  rightWrapper.classList.add('hidden');
  leftWrapper.style.zIndex = '10000';
  leftWrapper.style.width = '200%';
});

closePopupButton.addEventListener('click', function() {
  focusPopup.style.display = 'none';
  rightWrapper.classList.remove('hidden');
  leftWrapper.style.zIndex = '0';
  leftWrapper.style.width = '100%';
});