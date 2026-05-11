from django import forms
from .models import Post


class PostForm(forms.models):
    class Meta:
        model = Post
        fileds = ['title', 'text']
