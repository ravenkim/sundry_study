from django.urls import path, re_path, register_converter
from . import views


urlpatterns = [
    path('', views.post_list),

]
