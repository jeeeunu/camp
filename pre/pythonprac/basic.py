# 변수선언
a = '대한'
b = '민국'
print(a+b)

# 자료형
a2 = ['사과','배','감']
print(a2[2])

# 딕셔너리
a3 = {'name':'영수','age':24}
print(a3['name'])

# 함수
def hey():
  print('헤헤이') # 파이썬에서는 탭 필수
  
hey();

# 함수2
def sum(a,b,c) :
  return a+b+c

result = sum(1,2,3)

print(result)

# 조건문
age = 25
if age > 20 :
  print('성인임')
else:
  print('청소년임다')
  

# 반복문
ages = [5,10,13,23,25,9]

for a in ages :
  if a > 20 :
    print('성인입니다')
  else:
    print('청소년입니다')