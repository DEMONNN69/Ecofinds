from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile, name='user_profile'),
    path('dashboard/', views.dashboard, name='user_dashboard'),
]
