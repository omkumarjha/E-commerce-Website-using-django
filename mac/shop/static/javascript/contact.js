// Logic jab user cross pe click kare to div hide kardo and agar user ne form acche se fill nhi kara to usko error show karo

var form = document.querySelector(".contact-form")
var submit_container = document.querySelector(".submit-contact")


// Ye function humko 0 value tab dega jab sare input khali nhi hai and 1 tab dega jab koi bhi eak element empty hai
function button_clicked(){
    let name = form.querySelector(".name").lastElementChild;
    let email = form.querySelector(".email").lastElementChild;
    let phone = form.querySelector(".phone").lastElementChild;
    let message = form.querySelector(".message").lastElementChild;


    if(name.value == "" || email.value == "" || phone.value == "" || message.value == ""){
        let message1 = submit_container.querySelector(".left-part").firstElementChild
        let message2 = submit_container.querySelector(".left-part").lastElementChild

        submit_container.style.display = "flex"
        submit_container.classList.add("red")
        submit_container.classList.remove("green")

        message1.innerHTML = "Error!:"
        message2.innerHTML = "Error Submitting Contact form"
    }
    else{
        let message1 = submit_container.querySelector(".left-part").firstElementChild
        let message2 = submit_container.querySelector(".left-part").lastElementChild

        submit_container.style.display = "flex"
        submit_container.classList.add("green")
        submit_container.classList.remove("red")

        message1.innerHTML = "Success!:"
        message2.innerHTML = "Contact form has been submitted successfully"
    }

    // name.value = ""
    // email.value = ""
    // phone.value = ""
    // message.value = ""



}


// Ab agar Cross button pe click ho to submit container ki display "none" ho jani chahiye

function cross_clicked(){
    document.querySelector(".submit-contact").style.display = "none"
}
