document.querySelector("#show-login").addEventListener("click",function() {
    document.querySelector(".popup").classList.add("active");
});

document.querySelector(".popup .close-btn").addEventListener("click",function() {
    document.querySelector(".popup").classList.remove("active");
});

const btn = document.querySelector('#submitForm');

btn.addEventListener('click', validateForm);

function validateForm(e) {
    e.preventDefault();

    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName');
    const nationality = document.querySelector('#nationality');
    const institute = document.querySelector('#institute'); 
    const transcript = document.querySelector('#transcript');
    const file = transcript.file;

    if(firstName.value === '') {
        alert('Please enter your first name');
        firstName.focus();
        return false;
    }

    else if(lastName.value === '') {
        alert('Please enter your last name');
        lastName.focus();
        return false;
    }

    else if(nationality.value === '') {
        alert('Please enter your nationality');
        nationality.focus();
        return false;
    }

    else if(institute.value === '') {
        alert('Please enter your institute name');
        institute.focus();
        return false;
    }

    else if(file.length == 0) {
        alert("Please choose a file");
        return false;
    }
    
    else if(file.length == 1) {
        var fileName = file.name;

        var extension = fileName.substr(fileName.lastIndexOf("."));

        var allowedExtensionRegx = /(\.pdf)$/i;
        
        var isAllowed = allowedExtensionRegx.test(extension);

        if(isAllowed) {
            alert('File uploaded successfully');
        }
        else {
            alert('Invalid file type');
            return false;
        }
    }

    else {
        alert('Application submitted successfully');
        return true;
    }
}   
