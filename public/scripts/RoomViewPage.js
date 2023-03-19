let countdown;
let paused = false;
let remainingTime = 0;

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
  document.getElementById('start').style.display='none';
  document.getElementById('pause').style.display='inline-block';
  document.getElementById('stop').style.display='inline-block';
}

function pauseTimer() {
  clearInterval(countdown);
  paused = true;
  document.getElementById('pause').style.display='none';
  document.getElementById('play').style.display='inline-block';
}

function playTimer() {
  paused = false;
  timer(remainingTime);
  document.getElementById('play').style.display='none';
  document.getElementById('pause').style.display='inline-block';
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
  document.getElementById('pause').style.display='none';
  document.getElementById('stop').style.display='none';
  document.getElementById('start').style.display='inline-block';
  document.getElementById('play').style.display='none';
  paused = false;
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

const isassignments = false;
const isresources = false;
document.getElementById("resources").onmousedown = function () {
  if (isassignments === false) {
    document.getElementById("resources-wrapper").style.display = "block";
    document.getElementById("assignments-wrapper").style.display = "none";
    isresources = true;
  }
}

document.getElementById("assignments").onmousedown = function () {
  if (isresources === false) {
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
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    if(!notes) return;
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
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
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

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
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

    // var allFolders = $(".directory-list li > ul");
    // allFolders.each(function() {
    //   var folderAndName = $(this).parent();
    //   folderAndName.addClass("folder");
  
    //   var backupOfThisFolder = $(this);
    //   $(this).remove();
    //   folderAndName.wrapInner("<a href='#' />");
    //   folderAndName.append(backupOfThisFolder);
  
      
    //   folderAndName.find("a").click(function(e) {
    //     $(this).siblings("ul").slideToggle("slow");
    //     e.preventDefault();
    //   });
  
    // });