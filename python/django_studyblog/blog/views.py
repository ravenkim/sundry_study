from django.shortcuts import render, get_object_or_404, redirect
from .models import Post
# Create your views here.

# 리스트 출력


def post_list(request):
    qs = Post.objects.all()
    return render(request, 'blog/post_list.html', {
        'post_list': qs,
    })


# 디테일 출력
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {
        'post': post,
    })
