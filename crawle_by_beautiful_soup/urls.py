from django.urls import path
from . import views
urlpatterns = [
    path('', views.crawle_page),
    path('item', views.crawle_page),
]