import requests # requests 라이브러리 설치필요

r = requests.get('http://spartacodingclub.shop/sparta_api/seoulair')
rjson = r.json()

rows = rjson['RealtimeCityAir']['row']

for a in rows :
    gu_name = a['MSRSTE_NM']
    gu_mise = a['IDEX_MVL']
    print(gu_name,gu_mise)