from django.db import models

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    prodName = models.CharField(max_length=50)
    prodDes = models.TextField(max_length=300)
    prodDate = models.DateField()
    prodPrice = models.CharField(max_length=20)
    prodImage = models.ImageField(upload_to = "shop/images",default = "")

    def __str__(self):
        return self.prodName

class Product2(models.Model):
    id = models.AutoField(primary_key=True)
    prodName = models.CharField(max_length=50)
    prodDes = models.TextField(max_length=300)
    prodDate = models.DateField()
    prodPrice = models.CharField(max_length=20)
    prodImage = models.ImageField(upload_to = "shop/images",default = "")


    def __str__(self):
        return self.prodName
    
class Contact(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    email = models.TextField(max_length=40)
    phone = models.CharField(max_length = 50)
    message = models.TextField(max_length = 200)


    def __str__(self):
        return self.name

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    amount = models.CharField(max_length=10,default="")
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200)
    phone1 = models.CharField(max_length=10)
    phone2 = models.CharField(max_length=10)
    city = models.CharField(max_length=20)
    state = models.CharField(max_length=20)
    pin= models.CharField(max_length=10)

    def __str__(self):
        return self.name

class OrderUpdate(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.IntegerField(default=0)
    desc = models.CharField(max_length = 100)
    time = models.DateField(auto_now_add=True)  # auto_now_add ka matlab hai agar humne kuch bhi specify nhi kara hai to ye abhi ka time set kar dega 

    def __str__(self):
        return self.desc[0:10] + "..."