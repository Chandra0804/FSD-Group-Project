const openPopupButtons = document.querySelectorAll('[data-popup-target]')
const closePopupButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const openSidebarButtons = document.querySelectorAll('[data-sidebar-target]')
const closeSidebarButtons = document.querySelectorAll('[data-sideclose-button]')


// for popup

openPopupButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const popup = document.querySelector(button.dataset.popupTarget)
        openPopup(popup)
    })
})

closePopupButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const popup = button.closest('.popup');
        closePopup(popup);
        
    })
})

overlay.addEventListener('click',()=>{
    const activePopupElements = document.querySelectorAll('.popup.active');
    activePopupElements.forEach(popup =>{
        closePopup(popup);
    })
})

// for side bar
  

openSidebarButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const sidebar = document.querySelector(button.dataset.sidebarTarget)
        openSidebar(sidebar)
    })
})


closeSidebarButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const sidebar = button.closest('.sidebar');
        closeSidebar(sidebar);
    })
})


// makes the popup and the overlay visible by adding class 'active'.
function openPopup(popup){
    if(popup==null){
        return;
    }
    popup.classList.add('active');
    overlay.classList.add('active');
}

function closePopup(popup){
    if(popup==null){
        return;
    }
    popup.classList.remove('active');
    overlay.classList.remove('active');
}

// for sidebar:

function openSidebar(sidebar){
    if(sidebar==null){
        return;
    }
    sidebar.classList.add('active-sidebar');
}

function closeSidebar(sidebar){
    if(sidebar==null){
        return;
    }
    sidebar.classList.remove('active-sidebar');
}


