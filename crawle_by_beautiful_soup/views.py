from django.shortcuts import render
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests


# Create your views here.
def home(request):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }

    res = requests.get("https://www.coupang.com/np/search?component=&q=%EC%95%84%EC%9D%B4%ED%8F%B0&channel=user", headers=headers)

    soup = BeautifulSoup(res.content, 'html.parser')

    print(soup)
    return HttpResponse('hello bs!')
