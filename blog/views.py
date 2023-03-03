from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from .models import Post

# Create your views here.


# 리스트 출력
def post_list(request):
    posts = Post.objects.filter(
        published_date__lte=timezone.now()).order_by('published_date')
    # 쿼리 확인
    print(posts.query)
    return render(request, 'blog/post_list.html', {'post': posts})


# 디테일 출력
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {
        'post': post,
    })
