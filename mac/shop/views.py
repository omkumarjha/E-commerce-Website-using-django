from django.shortcuts import render , redirect
from .models import Product,Contact,Order,OrderUpdate
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import razorpay
from django.http import HttpResponseBadRequest
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate , login , logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.http import JsonResponse

@login_required(login_url='/shop/login')   # Matlab agar user ne login nhi kiya hua to wo jis bhi page pe jaane ki koshish kare ko login_url wale path mai chala jayega
def home(request):
    products1 = Product.objects.all()  # it will return a Query set Containing all the product objects
    mobiles = Product.objects.filter(category = "M")

    params = {
        "product" : products1,
        "Mobile" : mobiles
    }
    return render(request,"shop/home.html",params)

@login_required(login_url='/shop/login')
def productView(request,id):

    product = Product.objects.filter(id=id)
    return render(request,"shop/productView.html",{"product":product[0]})

@login_required(login_url='/shop/login')
def cart(request):
    products1 = Product.objects.all()

    params = {
        "product" : products1,
    }
    return render(request, "shop/cart.html",params)

@login_required(login_url='/shop/login')
def contact(request):

    if request.method =='POST':
        name = request.POST.get("name","")
        phone = request.POST.get("phone","")
        email = request.POST.get("email","")
        message = request.POST.get("message","")

        contact = Contact(name = name,phone = phone,email = email, message = message)

        contact.save()
        # Contact.objects.all().delete()   #this function is used to delete all data from a django table

    return render(request,"shop/contact.html")


def razorInitialization(prodPrice = 3000):
    # authorize razorpay client with API Keys.
    razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

    amount =  prodPrice * 100  # Amount razorpay mai paise mai hota hai
    currency = "INR"
    
    # Create a Razorpay Order
    razorpay_order = razorpay_client.order.create(dict(amount=amount,currency=currency,payment_capture='0'))

    # order id of newly created order.
    razorpay_order_id = razorpay_order['id']
    callback_url = 'http://127.0.0.1:8000/shop/paymenthandler'

    # we need to pass these details to frontend.
    context = {}
    context['razorpay_order_id'] = razorpay_order_id
    context['razorpay_merchant_key'] = settings.RAZOR_KEY_ID
    context['razorpay_amount'] = amount
    context['currency'] = currency
    context['callback_url'] = callback_url

    return context

@login_required(login_url='/shop/login')
def checkout(request,belong,id):

    # iska matlab hai ki user eak specific product ko kharid raha hai.
    if belong == 1:
        product = Product.objects.filter(id=id)

        amount = product[0].prodPrice[1 : ]
        amount = amount.replace(",","")
        amount = int(amount)
        # print("if statement")

        context = razorInitialization(amount)
        context["product"] = product[0]

        return render(request,"shop/checkout.html",context=context)

    # iska matlab user ne cart page ke andar place order pe click kara hai.
    else:
        context = razorInitialization()
        return render(request,"shop/checkout.html",context=context)

# yeh variable humare order ki id ko contain karega takki agar user ki payment fail hojaye to iss id ki madat se uski information ko database mai se remove kar paye.
# order_id = 0

def paymentsuccess(request):
    # Jaise hi user ne place order pe click kara then uski sari information ko hum database mai dal rahe hai. matlab advance mai hi hum uska order place kar rahe hai.
    if request.method =='POST':
        
        name = request.POST.get("name","")
        email = request.POST.get("email","")
        phone1 = request.POST.get("phone1","")
        phone2 = request.POST.get("phone2","")
        address1 = request.POST.get("address1","")
        address2 = request.POST.get("address2","")
        city = request.POST.get("city","")
        state = request.POST.get("state","")
        pin = request.POST.get("pin","")
        amount = request.POST.get("amount","")

        if(name != "" and email != "" and phone1 != "" and phone2 != ""  and address1 != "" and address2 != "" and city != "" and state != "" and pin != "" and amount != ""):

            order = Order(name=name,email=email,amount = amount,phone1=phone1,phone2=phone2,address1=address1,address2=address2,city=city,state=state,pin=pin)
            order.save()
            update = OrderUpdate(order_id = order.id , desc = "Your Order has been Placed")
            update.save()
    
    # yeh below code tab chalega jab user ne successfull payement kar di ho.
    count = Order.objects.all().count()
    store = Order.objects.all()[count-1]

    return render(request,"shop/paymentsuccess.html",{"order_id": store.id})

def paymentfail(request):
    # Agar user ka payment fail hogaya hai then hum uski information ko database mai se remove kar denge.
    count = Order.objects.all().count()
    count2 = OrderUpdate.objects.all().count()

    temp = Order.objects.all()[count-1]
    temp2 = OrderUpdate.objects.all()[count2-1]

    temp.delete()
    temp2.delete()

    return render(request,"shop/paymentfail.html")

# Callback URL is the address at which Razorpay should send the transaction response.
@csrf_exempt # because koi external source hamare website pe request nhi mar sakta but we want ki razorpay transaction detail show kare isliye we exempted it.
def paymenthandler(request):

    if request.method == "POST":

             # authorize razorpay client with API Keys.
            razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))
 
            # get the required parameters from post request.
            razorpay_payment_id = request.POST.get('razorpay_payment_id', '')
            razorpay_order_id = request.POST.get('razorpay_order_id', '')
            razorpay_signature = request.POST.get('razorpay_signature', '')  # ye signature razor pay ne banaya hai
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
 
            try:
                # verify the payment signature.
                result = razorpay_client.utility.verify_payment_signature(params_dict) # isse hum ye dekh rahe hai ki jo razor pay ka signature hai wahi humne use kara tha payment karne ke liye if yes then ye True return karega otherwise error dega. or jab user final failure of the payment pe click kare.
                return paymentsuccess(request)
            except: 
                print("Payment failed")
                return paymentfail(request)
                

@login_required(login_url='/shop/login')
def tracker(request):
    # if statement tab chalega jab user order id and email dalke track order pe click karega tracker wale page pe.
    if(request.method == "POST"):

        order_id = request.POST.get("order_id","")
        email = request.POST.get("email","")

        if(order_id.isdigit() == True):  # isdigit() method true tab deta hai jab sare characters digit hote hai otherwise false deta hai
            id = int(order_id)
            count = Order.objects.filter(id = id,email = email).count()

            if(count == 1):
                # update variable ke aandar multiple entries ho sakti hai .
                update = OrderUpdate.objects.filter(order_id = id) # it is a Query set.
                updateLst = []
                for item in update:
                    updateLst.append({"text":item.desc,"time":item.time})
                # below code mai hum python object ko JSON mai convert kar rahe hai and use waha send kar rahe hai jaha se yeh request aayi hai.
                response = json.dumps(updateLst,default=str)
                return HttpResponse(response)  # yaha par isne ajax ko response send kara data ki form mai.
            else:
                # below code tab chalega jab user ne jo order id and email daala hai uska koi presence nhi hai database mai.
                updateLst = [{}]
                response = json.dumps(updateLst)
                return HttpResponse(updateLst)   
        
    return render(request,"shop/tracker.html")


def handleSignup(request):

        if(request.method == "POST"):

            username = request.POST.get("username","")
            email = request.POST.get("email","")
            password = request.POST.get("password","")

            # checking some common validitions

            if(User.objects.filter(username = username)):
                messages.error(request,"Username alredy exists! Please Try some another username")
                return redirect("/shop/signup")

            if(User.objects.filter(email = email)):
                messages.error(request,"Email Already Registered! ")
                return redirect("/shop/signup")

            if(username.isalnum() == False):
                messages.error(request,"Username should only contain Alpha numeric characters! ")
                return redirect("/shop/signup")




            myuser = User.objects.create_user(username = username , email = email , password = password) # create_user password ko hashed form mai store karta hai

            myuser.save()
            

            messages.success(request, "SignUp Process is completed!! We have send you a Welcome Email.")

            # sending Welcome Email

            subject = "Welcome to EStore - Shopping Website"
            message = "Hello " + username + "!! \n" + "Welcome to EStore!! \nThank you for visiting our website \n You can Shop here and find Different type of products in a good quality \n\n Thanking you \n Omkumarjha and Manasvi Thakur"
            from_email = settings.EMAIL_HOST_USER
            to_email = [email]  # to_email list or tuple ki form mai hota hai
            send_mail(subject,message,from_email,to_email,fail_silently = True) # fail_silently means agar email send nhi ho pata to usse website crash nhi honi chaiye.

            return redirect("/shop/login")

        return render(request,"shop/signup.html")


def handleLogin(request):

        if(request.method == "POST"):

            email = request.POST.get("email","")
            password = request.POST.get("password","")
            username = User.objects.get(email = email.lower()).username

            # Authenticate function username and password ko leta hai argument mai na ki email ko.
            user = authenticate(username = username , password = password) # authenticate() sirf ye dekhe ga ki jo creadentials user ne dale hai us type ki koi information database mai exist bhi kar rahi hai ya nhi agar kar rahi hai to user object reture karega otherwise none return karega.

            if(user is not None):
                login(request,user)
                messages.success(request, f"You have successfully logged In {username} ")
                return redirect("/shop/home")
            else:
                messages.error(request, "Please Enter Valid credentials")
                return redirect("/shop/login")
                

        return render(request,"shop/login.html")

def handleLogout(request):
    logout(request)
    messages.success(request, "Logged Out Successfully")
    return redirect("/shop/login")


# This view is used to handle the traffic for header catagories eg --> Offers,Electronics,Fashion.
def headerView(request,titleNumber):
    title = ""

    if(titleNumber == 1):
        title = "offers"
        product = Product.objects.all()

    elif(titleNumber == 2):
        title = "Grocery"
        product = Product.objects.filter(category = "G")

    elif(titleNumber == 3):
        title = "Mobiles"
        product = Product.objects.filter(category = "M")

    elif(titleNumber == 4):
        title = "Fashion"
        product = Product.objects.filter(category = "C")

    elif(titleNumber == 5):
        title = "Electronics"
        product = Product.objects.filter(category = "E")

    elif(titleNumber == 6):
        title = "Home"
        product = Product.objects.filter(category = "BS")

    elif(titleNumber == 7):
        title = "Appliances"
        product = Product.objects.filter(category = "A")

    else:
        title = "Beauty,Toys"
        product = Product.objects.filter(category = "T")

    dict = {
        "title" : title,
        "product" : product,
    }

    return render(request,"shop/headerView.html",context=dict)