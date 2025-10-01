from django.urls import path
from . import views

urlpatterns = [
    path('saludo/', views.saludar, name='saludo'),
    path('saludo/<str:nombre>/', views.saludo_personalizado, name='saludo_personalizado'),
    path('procesar-lista/<str:nombre_lista>/', views.procesar_lista_productos, name='procesar_lista'),
    path('procesar-lista/', views.error_funcion, name='error_funcion'),
    path('', views.error_funcion, name='eror_funcion'),
    path('productos/nuevo/', views.crear_producto, name='crear_producto'), 
    path('productos/db/', views.listar_productos_db, name='lista_producto_db'),
]