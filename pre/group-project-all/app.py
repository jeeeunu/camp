from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# MongoDB에 연결하기
from pymongo import MongoClient

# MongoDB 클라이언트 생성
client = MongoClient('mongodb+srv://sparta:test@cluster0.k23feze.mongodb.net/?retryWrites=true&w=majority')

# 메인 index.html에 접근하는 라우트
@app.route('/')
def index():
    return render_template('index.html')

# 각 페이지에 접근하는 라우트
@app.route('/<region>')
def setPage(region):
    return render_template('region.html', region=region)

# 후기를 저장하는 라우트
@app.route("/<region>/review", methods=["POST"])
def review_post(region):
    
    # MongoDB 콜렉션 가져오기
    coll = client.review[region]

    # 폼 데이터 가져오기
    img_receive = request.form['img_give']
    name_receive = request.form['name_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    address_receive = request.form['address_give']

    # 후기 문서
    doc = {
        'img': img_receive,
        'name': name_receive,
        'star': star_receive,
        'comment': comment_receive,
        'address': address_receive
    }

    # MongoDB 콜렉션에 후기 저장
    coll.insert_one(doc)

    return jsonify({'msg': '저장완료!'})

# 후기 가져오기
@app.route("/<region>/review", methods=["GET"])
def review_get(region):
    # MongoDB 콜렉션 가져오기
    coll = client.review[region]

    # 모든 후기 가져오기
    all_review = list(coll.find({}, {'_id': False}))

    return jsonify({'result': all_review})

if __name__ == '__main__':
    app.run()
