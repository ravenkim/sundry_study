from django.shortcuts import render


# Create your views here.
def index(request):

    msg = 'My Message'
    return render(request, 'main.html', {'message': msg})
