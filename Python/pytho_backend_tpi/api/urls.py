from django.urls import path
from . import views

urlpatterns = [
    path('productos-firebase/', views.listar_productos_firebase, name='listar_productos_firebase'),
]
