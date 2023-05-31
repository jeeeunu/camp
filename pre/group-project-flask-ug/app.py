from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

# mongo db 연결하기
from pymongo import MongoClient

client = MongoClient('mongodb+srv://sparta:test@cluster0.k23feze.mongodb.net/?retryWrites=true&w=majority') # mongo url입력
db = client.dbsparta


@app.route('/')
def home():
    return render_template('seoul.html')

# db 저장하기
@app.route("/seoulReview", methods=["POST"])
def review_post():
    img_receive = request.form['img_give']
    name_receive = request.form['name_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']
    address_receive = request.form['address_give']
    
    doc = {
        'img' :img_receive,
        'name' :name_receive,
        'star' :star_receive,
        'comment' :comment_receive,
        'address' :address_receive
    }
    db.seoulReview.insert_one(doc)
    
    return jsonify({'msg': '저장완료!'})
    
# db 가져오기
@app.route("/seoulReview", methods=["GET"])
def review_get():
    all_buckets = list(db.seoulReview.find({},{'_id':False}))
    
    return jsonify({'result': all_buckets})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)