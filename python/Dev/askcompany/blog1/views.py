from django.shortcuts import render
from .models import Post
# Create your views here.


# 리스트 출력
def post_list(request):
    qs = Post.objects.all()
    return render(request, 'blog1/post_list.html', {
        'post_list': qs
    })
