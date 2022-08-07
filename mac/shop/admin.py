from django.contrib import admin
from .models import Contact,Product , Order , OrderUpdate

admin.site.register(Product)
admin.site.register(Contact)
admin.site.register(Order)
admin.site.register(OrderUpdate)