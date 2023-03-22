const submit = document.querySelector("#submit-button");
const cardnumber = document.querySelector("#card-number");
const cardholder = document.querySelector("#card-holder");
const expirymonth = document.querySelector("#expiry-month");
const expiryyear = document.querySelector("#expiry-year");
const cvvValue = document.querySelector("#cvv");
submit.addEventListener("click",(event)=>{
    event.preventDefault();

    const cardNumberRegex = /^\d{16}$/;
    const cardHolderRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
    const expiryMonthRegex = /^(0?[1-9]|1[0-2])$/;
    const expiryYearRegex = /^\d{4}$/;
    const cvvRegex = /^\d{3}$/;

    let errorMessage = "";

    if (!cardNumberRegex.test(cardnumber.value)) {
        errorMessage += "Please enter a valid credit card number (16 digits)\n";
    }

    if (!cardHolderRegex.test(cardholder.value)) {
        errorMessage += "Please enter the cardholder name in the format 'First Name Last Name'\n";
    }

    if (!expiryMonthRegex.test(expirymonth.value)) {
        errorMessage += "Please enter a valid expiration month (MM)\n";
    }

    if (!expiryYearRegex.test(expiryyear.value)) {
        errorMessage += "Please enter a valid expiration year (YYYY)\n";
    }         

    if (!cvvRegex.test(cvvValue.value)) {
        errorMessage += "Please enter a valid CVV (3 digits)\n";
    }

    if (errorMessage !== "") {
        alert(errorMessage);
    } 

    else {
        window.location="/paymentstatus";
    }
            
    return false;
});