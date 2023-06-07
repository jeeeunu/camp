from pymongo import MongoClient

client = MongoClient('mongodb+srv://sparta:test@cluster0.k23feze.mongodb.net/?retryWrites=true&w=majority') # mongo url입력
db = client.dbsparta

all_movies = list(db.movies.find({}))


# title 찾기
movie = db.movies.find_one({'title':'자전거 도둑'})
target_star = movie['star']

# 같은 평점 영화 찾기
movies = list(db.movies.find({'star':target_star},{'_id':False}))
for item in movies:
    print(item['title'])
    
# 평점 0 만들기
target_movie = db.movies.find_one({'title':'슬픔의 삼각형'})
db.movies.update_one(target_movie,{'$set':{'star':0}})