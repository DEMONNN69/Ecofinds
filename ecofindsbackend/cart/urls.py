from django.urls import path
from . import views

urlpatterns = [
    path('', views.cart_list_add, name='cart_list_add'),
    path('items/<int:id>/', views.cart_item_update_remove, name='cart_item_update_remove'),
    path('clear/', views.cart_clear, name='cart_clear'),
]
