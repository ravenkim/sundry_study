from requests import get
from bs4 import BeautifulSoup

# 명도 변환


def extract_simularColor(keyword):
    base_url = 'https://0to255.com/'
    color_for_figureout = 'keyword'

    response = get(f"{base_url}{color_for_figureout}")

    if response.status_code != 200:
        print("에러")
        print(response.status_code)
    else:
        soup = BeautifulSoup(response.text, "html.parser")
        colors = soup.find_all('td', class_="hex")
        print(len(colors))


extract_simularColor(000000)
