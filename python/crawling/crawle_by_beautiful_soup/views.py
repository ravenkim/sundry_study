from django.shortcuts import render
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests
import json


# Create your views here.
def crawle_page(request):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3"
    }

    try:
        res = requests.get(
            "https://www.coupang.com/np/categories/497135?page=3",
            headers=headers,
            # verify=False, #ssl인증
            timeout=10  # 10초 타임아웃
        )
        res.raise_for_status()  # 에러 발생 시 예외 처리
        soup = BeautifulSoup(res.content, 'html.parser')
        ul = soup.find('ul', class_='baby-product-list')

        products = []
        for product in ul.find_all('li', class_='baby-product'):
            title = product.find('div', class_='name').text.strip()
            product_url = "https://www.coupang.com" + product.find('a', class_='baby-product-link')['href']
            thumbnail_url = product.find('dt', class_='image').find('img')['src']
            product_id = product['data-product-id']

            products.append({
                'title': title,
                'product_url': product_url,
                'thumbnail_url': thumbnail_url,
                'product_id': product_id
            })

        json_output = json.dumps(products, ensure_ascii=False, indent=4)
        print(json_output)

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return HttpResponse('Error occurred while fetching data')

    return HttpResponse('hello bs!')


from django.shortcuts import render
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests
import json


# Create your views here.
def crawle_page(item):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3"
    }


    try:
        res = requests.get(
            "https://www.coupang.com/vp/products/6359373947?itemId=13418949659&vendorItemId=81165660205&sourceType=CATEGORY&categoryId=497035&isAddedCart=",
            headers=headers,
            # verify=False, #ssl인증
            timeout=10  # 10초 타임아웃
        )
        res.raise_for_status()  # 에러 발생 시 예외 처리
        soup = BeautifulSoup(res.content, 'html.parser')

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return HttpResponse('Error occurred while fetching data')

    return HttpResponse('hello bs!')

