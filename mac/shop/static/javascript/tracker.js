
$('.tracker-form').on('submit', function (event) {
    event.preventDefault()
    check_post()
})
function check_post() {
    $.ajax({
        type: "POST",
        url: "/shop/tracker",
        data: {
            order_id: $("#order_id").val(),
            email: $("#email").val(),
            csrfmiddlewaretoken: $("input[name = csrfmiddlewaretoken]").val(),
        },
        success: function () {
            $("#order_id").val("");
            $("#email").val("");
        }
    })
        // below done method tab chalega jab use response mil jayega uss route se.
        .done(function (data) {
            // JSON.pase se humne string data ko javascript ki form mai convert kar liya
            data = JSON.parse(data)
            let order_child = document.querySelector(".order-child")
            let order_summary = document.querySelector(".order-summary")
            
            // iska matlab user ne jo order id and email provide karaya hai uska koi entry nhi hai db mai.
            if (data.length == undefined) {
                order_summary.setAttribute("style","display: flex !important")
                order_child.innerHTML = "<h3>Sorry we can not find your order regarding your order Id . Kindly check your Order id and email and Then try again</h3>"
            }
            else {
                order_summary.setAttribute("style","display: flex !important")
                content = ""

                for (let i = 0; i < data.length; i++) {
                    text = data[i]["text"]
                    time = data[i]["time"]
                    content += ` <div class="place-order">
                                    <div class="left">
                                        <h4>${text}</h4>
                                    </div>
                                    <div class="right">
                                    <h5>${time}</h5>
                                </div>
                                </div>`
                }
                order_child.innerHTML = content
                order_child.lastElementChild.style.borderBottom = "ridge"
            }
        })
}