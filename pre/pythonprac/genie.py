import requests
from bs4 import BeautifulSoup

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
URL = "https://www.genie.co.kr/chart/top200?ditc=M&rtm=N&ymd=20230101"
data = requests.get(URL,headers=headers)
soup = BeautifulSoup(data.text, 'html.parser')

# print(soup)

music_list = soup.select("#body-content > div.newest-list > div > table > tbody > tr")

for v in music_list:
  # print(v)
  rank = v.select_one(".number").text[0:2].strip()
  title = v.select_one(".info .title").text.strip()
  rate = v.select_one(".info .artist").text.strip()
  doc = rank,title,rate
  
  print(doc)
  
  