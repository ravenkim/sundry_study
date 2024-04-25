from selenium import webdriver
from bs4 import BeautifulSoup


def extract_color(keyword):
    base_url = "https://0to255.com/"
    final_url = f"{base_url}{keyword}"

    driver = webdriver.Chrome("./chromedriver")

    driver.get(final_url)
    driver.implicitly_wait(1)  # 페이지 로딩 기다리는거 국룰 3초?

    html = driver.page_source

    soup = BeautifulSoup(html, 'html.parser')
    colorsbox = soup.find('tbody')
    colorslist = colorsbox.find_all("tr")
    results = []
    for colors in colorslist:
        color_hex, color_rgb, color_hsl, color_distance, color_lightness = colors.find_all(
            "td")
        color_data = {
            'color_hex': color_hex.string,
            'color_rgb': color_rgb.string,
            'color_hsl': color_hsl.string,
            'color_distance': color_distance.string,
            'color_lightness': color_lightness.string,
        }
        results.append(color_data)

    return (results)

# print(soup.prettify()) << 이쁘게 프린트


# 웹이 유지되게
# while (True):
# pass
