from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_purchase, name='create_purchase'),
    path('history/', views.purchase_history, name='purchase_history'),
    path('<int:id>/', views.purchase_detail, name='purchase_detail'),
]
