from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time


keyword = input("변환 하고자 하는 색상의 HEX값을 입력하세요")
base_url = "https://0to255.com/"
final_url = f"{base_url}{keyword}"

driver = webdriver.Chrome("./chromedriver")
333
driver.get(final_url)
driver.implicitly_wait(3)  # 페이지 로딩 기다리는거 국룰 3초?

html = driver.page_source


soup = BeautifulSoup(html, 'html.parser')
print(soup.prettify())


# 웹이 유지되게
# while (True):
pass
