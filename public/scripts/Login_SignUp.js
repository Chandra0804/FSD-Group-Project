const signUpBtn = document.querySelector('.card-back .btn');
const logInBtn = document.querySelector('.card-front .btn');

signUpBtn.addEventListener('click', signUpValidation);
logInBtn.addEventListener('click', logInValidation);

function signUpValidation(e) {
    e.preventDefault();

    // select input fields
    const name = document.querySelector('#signupname');
    const email = document.querySelector('#signupemail');
    const password = document.querySelector('#signuppass');
    const passwordRegex = /^(?=.*[!@#$%^&*])/;
    const confirmPassword = document.querySelector('#signuppass2');

    // check if input fields are filled out
    if (name.value.trim() === '') {
        alert('Please enter your full name');
        name.focus();
        return false;
    } 
    else if (email.value.trim() === '') {
        alert('Please enter your email address');
        email.focus();
        return false;
    } 
    else if (!validateEmail(email.value.trim())) {
        alert('Please enter a valid email address');
        email.focus();
        return false;
    } 
    else if (password.value.trim() === '') {
        alert('Please enter your password');
        password.focus();
        return false;
    } 
    else if (password.value.length < 8) {
        alert("Password should be at least 8 characters long");
        password.focus();
        return false;
    }
    else if (!passwordRegex.test(password.value)) {
        alert("Password should contain atleast one special character");
        password.focus();
        return false;
    } 
    else if (confirmPassword.value.trim() === '') {
        alert('Please confirm your password');
        confirmPassword.focus();
        return false;
    }
    else if (password.value.trim() !== confirmPassword.value.trim()) {
        alert('Passwords do not match');
        confirmPassword.focus();
        return false;
    } 
    else {
        // form is valid, submit
        alert('Form submitted successfully!');
        return true;
    }
}

function logInValidation(e) {
    e.preventDefault();

    // select input fields
    const email = document.querySelector('#logemail');
    const password = document.querySelector('#logpass');

    // check if input fields are filled out
    if (email.value.trim() === '') {
        alert('Please enter your email address');
        email.focus();
        return false;
    } else if (!validateEmail(email.value.trim())) {
        alert('Please enter a valid email address');
        email.focus();
        return false;
    } else if (password.value.trim() === '') {
        alert('Please enter your password');
        password.focus();
        return false;
    } else {
        // form is valid, submit
        alert('Form submitted successfully!');
        return true;
    }
}

// email validation function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
