from requests import get
from bs4 import BeautifulSoup


def extract_naverwebtoon(keyword):
    base_url = 'https://comic.naver.com/webtoon?tab='
    day_of_webtoon = 'keyword'

    response = get(f"{base_url}{day_of_webtoon}")
    # url

    if response.status_code != 200:
        print("에러")
        print(response.headers)
    else:
        results = []
        soup = BeautifulSoup(response.text, "html.parser")
        webtoonslist = soup.find_all("ul", class_="img_list")
        for webtoons in webtoonslist:
            # 옆에 ,recursive=False  추가하면 1깊이만 검색해서 찾음
            webtoon = webtoons.find_all("li")
            for info in webtoon:
                anchors = info.find_all("a")
                anchor = anchors[1]
                link = anchor['href']
                title = info.find("dt")
                author, rating, view = info.find_all("dd")
                webtoon_data = {
                    'title': title.get_text(),
                    'author': author.get_text(),
                    'rating': rating.get_text(),
                    'link': f"https://comic.naver.com{link}"
                }
                results.append(webtoon_data)
        return results


extract_naverwebtoon("mon")
