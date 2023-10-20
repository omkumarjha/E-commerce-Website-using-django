var cart = JSON.parse(localStorage.getItem("cart"))
var cart_items = document.getElementsByClassName("cart-items")
if(cart != null){
    var keys = Object.keys(cart).length;    
}
else{
    var keys = 0
}

// iska matlab ye hai ki agar koi bhi item user ne cart nhi kara then 'Your Cart is Empty' Wala message show kardo.
if(keys == 0){
    document.querySelector(".cart-container").innerHTML = "<h3> Your Cart is Empty, Add your Products to the cart! </h3>"
    let cartContainer = document.querySelector(".cart-container")
    cartContainer.setAttribute("class","cart-container-sibling")
}
else{
    document.querySelector(".left-cart").firstElementChild.innerHTML = `My Cart(${keys})`
    for(let key in cart){
        Array.from(cart_items).forEach(function(element){
            if(element.id == key){
                element.style.display = "flex"
                element.setAttribute("class","present")
            }
            else{
                if(element.classList.contains("present") == false){
                    element.style.display = "none"
                }
            }
        })
    }
    updateProductPrice(document.getElementsByClassName("present"))

    // Calling updateProductDetails function
    updateProductDetails()
    
    // Logic when we click Remove cart then the item should be delete from the local storage
    
    var cart_items = document.getElementsByClassName("present")
    var cart = JSON.parse(localStorage.getItem("cart"))
    
    function buttonClick(id){
        delete cart[id]
        localStorage.setItem("cart",JSON.stringify(cart));
        document.getElementById(id).style.display = "none"
        document.getElementById(id).classList.remove("present");
        document.getElementById(id).classList.add("cart-items");
        var keys = Object.keys(cart).length;
        if(keys == 0){
            document.querySelector(".cart-container").innerHTML = "<h3> Your Cart is Empty, Add your Products to the cart! </h3>"
            let cartContainer = document.querySelector(".cart-container")
            cartContainer.setAttribute("class","cart-container-sibling")
        }
        else{
            document.querySelector(".left-cart").firstElementChild.innerHTML = `My Cart(${keys})`
        }
        updateProductDetails()
    }
}

// Logic when we click + and - buttons then we have to update the number of items of the product

// Below Code sare ke sare product items ke count ko set kardega.
Array.from(cart_items).forEach(function(element){
    id = element.id;
    document.querySelector("#btn"+id).innerHTML = cart[id][1]
})

$(".minus").click(function(){
    id = this.id.slice(5,)
    console.log("Minus clicked : ",id)
    if(cart[id][1] > 1){
        decreaseProductPrice(id,cart[id][1])
        cart[id][1] = cart[id][1] - 1;
        localStorage.setItem("cart",JSON.stringify(cart))
        document.querySelector("#btn"+id).innerHTML = cart[id][1]
        updateProductDetails()
    }
})

$(".plus").click(function(){
    id = this.id.slice(4,)
    increaseProductPrice(id,cart[id][1])
    cart[id][1] = cart[id][1] + 1;
    localStorage.setItem("cart",JSON.stringify(cart))
    document.querySelector("#btn"+id).innerHTML = cart[id][1]
    updateProductDetails()
})

// If user has added or subtracted product items then price of the product should also increase or decrease

function increaseProductPrice(id,count){
    element = document.getElementById(id).getElementsByTagName("h4")
    str = element[0].innerHTML.slice(1,);
    temp = str.replace(',',"")
    final_value = parseInt(temp)
    initial_value = parseInt(final_value / count)
    ans = final_value + initial_value;
    ans = ans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.getElementById(id).getElementsByTagName("h4")[0].innerHTML = `₹${ans}`;
}

function decreaseProductPrice(id,count){
        element = document.getElementById(id).getElementsByTagName("h4")
        str = element[0].innerHTML.slice(1,);
        str = str.replace(',',"")
        initialValue = parseInt(str)
        baseValue = parseInt(initialValue / parseInt(count))
        finalValue = initialValue - baseValue;
        str = finalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        document.getElementById(id).getElementsByTagName("h4")[0].innerHTML = `₹${str}`;
}

// Ye function humne tab chalaya hai jab user iss cart page pe aaya hai , takki jaise ko cart page pe aaye usko price jo hai update hoke mil jaye 
function updateProductPrice(cart_items){
    Array.from(cart_items).forEach(function(element){
        id = element.id;
        count = cart[id][1]
        heading = document.getElementById(id).getElementsByTagName("h4")
        str = heading[0].innerHTML.slice(1,);
        str = str.replace(',',"")
        num = parseInt(str)
        num = num * count;
        str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        document.getElementById(id).getElementsByTagName("h4")[0].innerHTML = `₹${str}`;
    })
}

// Ye function sare products ka price sum karke return karega

function sumOfAllProductPrice(){
    let sum = 0;
    let items = document.getElementsByClassName("present")

    Array.from(items).forEach(function(element){
        heading = element.getElementsByTagName("h4")
        str = heading[0].innerHTML.slice(1,);
        str = str.replace(',',"")
        num = parseInt(str)
        sum = sum + num;
    })
    sessionStorage.setItem("totalPrice",sum);
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ye function hamare product details wale div ke aandar prices ko update karega through the help of sumOfProductPrice()

function updateProductDetails(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    let count = Object.keys(cart).length;
    let heading1 = document.querySelector(".price").firstElementChild;
    heading1.innerHTML = `Price(${count} items)`

    let totalPrice = sumOfAllProductPrice()
    let heading2 = document.querySelector(".price").lastElementChild;
    heading2.innerHTML = `₹${totalPrice}`;

    let heading3 = document.querySelector(".total-amount").lastElementChild;
    heading3.innerHTML = `₹${totalPrice}`;
}

// Using media queries in javascript

    media = window.matchMedia("(max-width: 1150px)")

    if(media.matches){
        place_order = document.querySelector(".place-order")
        document.querySelector(".cart-container").append(place_order)
    }
    else{
        place_order = document.querySelector(".place-order")
        // document.querySelector(".cart-container").removeChild(document.querySelector(".place-order"))
        document.querySelector(".left-cart").appendChild(place_order)
    }

// Regular expression to add commas to a number
// num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
