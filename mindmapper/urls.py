from django.urls import path
from . import views

app_name = 'mindmapper'

urlpatterns = [
    path('', views.home, name='home'),
    path('generate/', views.generate_mindmap, name='generate'),
]