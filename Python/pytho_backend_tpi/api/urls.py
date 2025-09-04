from django.urls import path
from . import views

urlpatterns = [
    path('saludo/', views.saludar, name='saludo'),
    path('saludo/<str:nombre>/', views.saludo_personalizado, name='saludo_personalizado'),
    path('procesar-lista/<str:nombre_lista>/', views.procesar_lista_productos, name='procesar_lista'),
]
