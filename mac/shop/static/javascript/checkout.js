// Ye belong variable show karraha hai ki humne Buy now wale button ko click kara hai ya Place order wale button ko click kara hai
var belong = location.href.toString()
belong = parseInt(belong.slice(38, 39))

// JS code for Order summary 

var review_order = document.querySelector(".review-order")

var cart = JSON.parse(localStorage.getItem("cart"))
var count = 0;


if (belong == 1) {  //Means buy now wala button click hua hai

    document.querySelector(".buy-now").style.display = "flex";
    count = 1;

}
else {   //Means place order wala button click hua hai
    document.querySelector(".buy-now").style.display = "none";
    var place_order = ""

    for (item in cart) {
        let name = cart[item][0]
        let qty = cart[item][1]

        place_order += `<div class="place-order">
        <div class="left">
            <h4>${name}</h4>
        </div>
        <div class="right">
                <h5>${qty}</h5>
        </div>
            </div>
            `
            count += 1;
    }
    review_order.innerHTML = place_order
    review_order.lastElementChild.style.borderBottom = "ridge"
}

// JS code for Payment jo ki user karega

var priceHeading = document.querySelector(".price").firstElementChild;
priceHeading.innerHTML = `Price(${count} items)`;


var sum = sessionStorage.getItem("totalPrice")
sum = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

var priceNumber = document.querySelector(".price").lastElementChild;
priceNumber.innerHTML = `₹${sum}`;
