
from croller import extract_color
from file import save_to_file

keyword = input("변환 하고자 하는 색상의 HEX값을 입력하세요")
colors = extract_color(keyword)


save_to_file(keyword, colors)
