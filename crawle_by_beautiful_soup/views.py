from django.shortcuts import render
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests


# Create your views here.
def home(request):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36', "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3"
    }

    try:
        res = requests.get(
            "https://www.coupang.com/np/search?component=&q=노트북&channel=user",
            headers=headers,
            verify=False,
            timeout=10  # 10초 타임아웃
        )
        res.raise_for_status()  # 에러 발생 시 예외 처리
        soup = BeautifulSoup(res.content, 'html.parser')
        print(soup)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return HttpResponse('Error occurred while fetching data')

    print(soup)
    return HttpResponse('hello bs!')
