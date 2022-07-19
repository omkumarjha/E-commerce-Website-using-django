var form = document.querySelector(".contact-form")
var submit_container = document.querySelector(".submit-contact")
let message1 = submit_container.querySelector(".left-part").firstElementChild
let message2 = submit_container.querySelector(".left-part").lastElementChild
    
function formValidation(){
    let validateVar = true;
    let nameInput = form.querySelector(".name").lastElementChild;
    let emailInput = form.querySelector(".email").lastElementChild;
    let phoneInput = form.querySelector(".phone").lastElementChild;
    let messageInput = form.querySelector(".message").lastElementChild;

    // Iska matlab ki agar nameInput mai numbers hai to error dedo , nameInput mai sirf alphabets hone chahiye.
    // This validation is for 'Name' input.
    if(isNumeric(nameInput.value)){
        submit_container.style.display = "flex"
        submit_container.classList.add("red")
        submit_container.classList.remove("green")
        message1.innerHTML = "Error!:"
        message2.innerHTML = "Name must contain only Alphabet letters."
        validateVar = false;
    }

    // This validation is for 'Email' input.
    if(emailInput.value.endsWith(".com") == false && emailInput.value.endsWith(".net") == false && emailInput.value.endsWith(".org") == false){
        submit_container.style.display = "flex"
        submit_container.classList.add("red")
        submit_container.classList.remove("green")
        message1.innerHTML = "Error!:"
        message2.innerHTML = "Enter a Valid email Address."
        validateVar = false;
    }

    // This validation is for 'Phone' input.
    if(phoneInput.value.length != 10){
        submit_container.style.display = "flex"
        submit_container.classList.add("red")
        submit_container.classList.remove("green")
        message1.innerHTML = "Error!:"
        message2.innerHTML = "Phone no must contain only 10 digits."
        validateVar = false;
    }
    if(phoneInput.value.startsWith("7") == false && phoneInput.value.startsWith("8") == false && phoneInput.value.startsWith("9") == false){
        submit_container.style.display = "flex"
        submit_container.classList.add("red")
        submit_container.classList.remove("green")
        message1.innerHTML = "Error!:"
        message2.innerHTML = "Enter a valid Phone number."
        validateVar = false;
    }


    // Ye 'if' statement mainly tab chalega jab user ne sara data sahi enter kara hai aur ab hume wo data server pe bhejna hai.
    if(validateVar){
        submit_container.style.display = "flex"
        submit_container.classList.add("green")
        submit_container.classList.remove("red")
        message1.innerHTML = "Success!:"
        message2.innerHTML = "Contact form has been submitted successfully!"
        return validateVar;
    }
}

// Matlab jaise hi form submit hoga waise hi page refresh hona nhi chahiye and create_post() function call ho jana chahiye.
$('.contact-form').on('submit', function(event){
    event.preventDefault();
    create_post();
});


// Yaha par form ke data ko server pe bhejne se pehle hum ye check karrahe hai ki data user ne sahi format mai daala hai ya nhi.
function create_post(){

    if(formValidation()){
            $.ajax({
            type: "POST",
            url: "/shop/contact",
            data:{
                name: $("#name").val(),
                email: $("#email").val(),
                phone: $("#phone").val(),
                message: $("#message").val(),
                csrfmiddlewaretoken: $("input[name = csrfmiddlewaretoken]").val(),
            },
            success: function(){
                $("#name").val("");
                $("#email").val("");
                $("#phone").val("");
                $("#message").val("");
            }
        })
    }
}

// Ye function string le raha hai and bata raha hai ki isme number hai ki nhi (true ya false mai).
function isNumeric(text){
    const hasNumber = /\d/;   
    return hasNumber.test(text)
}


// Agar Cross button pe click ho to Us container ko hi gayab kardo
function cross_clicked(){
    document.querySelector(".submit-contact").style.display = "none"
}
