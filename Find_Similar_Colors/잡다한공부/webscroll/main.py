from requests import get
from bs4 import BeautifulSoup
from extractors.naverweb import extract_naverwebtoon

keyword = input("무슨 요일 웹툰이 궁금한가요?")


# 네이버 웹툰에서 요일로 검색
naverWeb = extract_naverwebtoon(keyword)
webtoons = naverWeb  # + 추가 사이트 구현mo

print(extract_naverwebtoon(keyword))

"""
file = open(f"{keyword}.csv", "w")

file.write("Title, Author, Rating, Link\n")

for webtoon in webtoons:
    file.write(
        f"{webtoon['title']},{webtoon['author']},{webtoon['rating']},{webtoon['link']}\n")


file.close()
"""
