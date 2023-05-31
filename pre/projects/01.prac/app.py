# 1. 가상환경 만들기
# 2. flask 프레임워크 깔기

from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

# 링크연결
@app.route('/')
def home():
   return render_template('index.html')

# GET/다루기 위해서는 request,jsonify 필요
# @app.route('/test', methods=['GET'])
# def test_get():
#    title_receive = request.args.get('title_give')
#    print(title_receive)
#    return jsonify({'result':'success', 'msg': '이 요청은 GET!'})

# POST/
@app.route('/test', methods=['POST'])
def test_post():
   title_receive = request.form['title_give']
   print(title_receive)
   return jsonify({'result':'success', 'msg': '이 요청은 POST!'})

if __name__ == '__main__':  
   app.run('0.0.0.0',port=5000,debug=True)