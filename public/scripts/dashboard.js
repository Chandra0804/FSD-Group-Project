const usersBtn = document.getElementById("users-btn");
const roomsBtn = document.getElementById("rooms-btn");
const announcementsBtn = document.getElementById("announcements-btn");

const usersSection = document.getElementById("users-section");
const roomsSection = document.getElementById("rooms-section");
const announcementsSection = document.getElementById("announcements-section");
const adminInstruction = document.getElementById('admin-instructions');

// Show the users section by default
// usersSection.classList.remove("hidden");

usersBtn.addEventListener("click", () => {
  // Show the users section and hide the others
  usersSection.classList.remove("hidden");
  roomsSection.classList.add("hidden");
  announcementsSection.classList.add("hidden");
  adminInstruction.classList.add("hidden");

  // Highlight the users button and remove the highlight from the others
  usersBtn.classList.add("active");
  roomsBtn.classList.remove("active");
  announcementsBtn.classList.remove("active");
});

roomsBtn.addEventListener("click", () => {
  // Show the rooms section and hide the others
  roomsSection.classList.remove("hidden");
  usersSection.classList.add("hidden");
  announcementsSection.classList.add("hidden");
  adminInstruction.classList.add("hidden");

  // Highlight the rooms button and remove the highlight from the others
  roomsBtn.classList.add("active");
  usersBtn.classList.remove("active");
  announcementsBtn.classList.remove("active");
});

announcementsBtn.addEventListener("click", () => {
  // Show the announcements section and hide the others
  announcementsSection.classList.remove("hidden");
  usersSection.classList.add("hidden");
  roomsSection.classList.add("hidden");
  adminInstruction.classList.add("hidden");

  // Highlight the announcements button and remove the highlight from the others
  announcementsBtn.classList.add("active");
  usersBtn.classList.remove("active");
  roomsBtn.classList.remove("active");
});

var popup = document.getElementById("edit-popup");

// Get the button that opens the popup
var btns = document.querySelectorAll(".edit-button");

// Get the <span> element that closes the popup
var span = popup.querySelector(".close");

// When the user clicks the button, open the popup 
btns.forEach(btn=>{
  btn.onclick = function() {
    popup.style.display = "block";
  }
})


// When the user clicks on <span> (x), close the popup
span.onclick = function() {
  popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
}