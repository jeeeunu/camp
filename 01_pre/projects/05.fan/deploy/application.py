from flask import Flask, render_template, request, jsonify
application = app = Flask(__name__)

from pymongo import MongoClient

client = MongoClient('mongodb+srv://sparta:test@cluster0.k23feze.mongodb.net/?retryWrites=true&w=majority') # mongo url입력
db = client.dbsparta

@app.route('/')
def home():
   return render_template('index.html')

@app.route("/guestbook", methods=["POST"])
def guestbook_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    doc = {
        'name': name_receive,
        'comment' : comment_receive
    }
    
    # db에 저장
    db.fan.insert_one(doc)
        
    return jsonify({'msg': "저장 완료"})

@app.route("/guestbook", methods=["GET"])
def guestbook_get():
    all_comment = list(db.fan.find({},{'_id':False}))
    
    return jsonify({'result': all_comment})

if __name__ == '__main__':
   app.run()