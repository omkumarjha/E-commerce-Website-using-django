
//Code for Image-slider of home page
let flag = 1;
showSlides(flag)

function controller(num){
    flag = flag + num;
    showSlides(flag)
}

function showSlides(num){
    let slides = document.getElementsByClassName("slide")
    if(num == slides.length){
        flag  = 0;
    }
    if(num == -1){
        flag = slides.length-1;
    }
    Array.from(slides).forEach(function(element){
        element.style.display = "none";
    })
    slides[flag].style.display = "block";
    
}
setInterval(function(){
    controller(-1);
},5000)


//Code for product-Slider1 Of home page
let start = 1;
let end = 6;
let left_arrow = document.querySelector(".prev2")
let right_arrow = document.querySelector(".next2")
showProductSlider(start,end)

function showProductSlider(i,j){
    let child_slider = document.getElementsByClassName("child-slider")
    for(let k = i; k <= j; k++){
        child_slider[k-1].style.display = "block";
    }
}
var temp = document.getElementsByClassName("child-slider")
var n1 = temp.length;

function moveLeft(){
    
    if(start >= 1 && end <= n1){
        right_arrow.style.visibility = "visible";
        let child_slider = document.getElementsByClassName("child-slider")
        child_slider[end-1].style.display = "none"
        start -= 1;
        end -= 1;
        for(let k = start; k <= end; k++){
            child_slider[k-1].style.display = "block";
        }
    }
    if(start == 1){
        left_arrow.style.visibility = "hidden";
    }
}
function moveRight(){
    
    if(start >= 1 && end <= n1){
        left_arrow.style.visibility = "visible";
        let child_slider = document.getElementsByClassName("child-slider")
        child_slider[start-1].style.display = "none"
        start += 1;
        end += 1;
        for(let k = start; k <= end; k++){
            child_slider[k-1].style.display = "block";
        }
    }

    if(end == n1){
        right_arrow.style.visibility = "hidden";
    }
}
if(end == n1){
    right_arrow.style.visibility = "hidden";
}

// Code for product slider 2 of home page

let start2 = 1;
let end2 = 7;
showProductSlider2(start2,end2)

function showProductSlider2(i,j){
    let child_slider = document.getElementsByClassName("child-slider2")
    for(let k = i; k <= j; k++){
        child_slider[k-1].style.display = "block";
    }
}

let temp2 = document.getElementsByClassName("child-slider2")
var n2 = temp2.length
let left_arrow2 = document.querySelector(".product-slider2").firstElementChild
let right_arrow2 = document.querySelector(".product-slider2").lastElementChild

function moveLeft2(){
    
    if(start2 >= 1 && end2 <= n2){
        right_arrow2.style.visibility = "visible";
        let child_slider = document.getElementsByClassName("child-slider2")
        child_slider[end2-1].style.display = "none"
        start2 -= 1;
        end2 -= 1;
        for(let k = start2; k <= end2; k++){
            child_slider[k-1].style.display = "block";
        }
    }
    if(start2 == 1){
        left_arrow2.style.visibility = "hidden";
    }
}

function moveRight2(){
    
    if(start2 >= 1 && end2 <= n2){
        left_arrow2.style.visibility = "visible";
        let child_slider = document.getElementsByClassName("child-slider2")
        child_slider[start2-1].style.display = "none"
        start2 += 1;
        end2 += 1;
        for(let k = start2; k <= end2; k++){
            child_slider[k-1].style.display = "block";
        }
    }

    if(end2 == n2){
        right_arrow2.style.visibility = "hidden";
    }
}

if(end2 == n2){
    right_arrow.style.visibility = "hidden";
}

// Niche ka mainly code hai jab user login karlega tab usko message show kara ne ka code

function cross_clicked(){
    document.querySelector(".submit-contact").style.display = "none"
}
var element = document.querySelector(".submit-contact")
element.style.display = "flex"
