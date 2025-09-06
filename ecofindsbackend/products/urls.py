from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_list_create, name='product_list_create'),
    path('<int:id>/', views.product_detail, name='product_detail'),
    path('my-listings/', views.my_listings, name='my_listings'),
]
