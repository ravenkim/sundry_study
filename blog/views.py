from django.shortcuts import render
from .models import Post
# Create your views here.


def post_list(request):
    qs = Post.objects.all()
    return render(request, 'blog/post_list.html', {
        'post_list': qs,
    })
