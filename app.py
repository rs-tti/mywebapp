from flask import Flask, render_template, jsonify, request
import os
# import pyodbc
# from sqlalchemy import create_engine, MetaData, Column, Integer, String
# from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.ext.automap import automap_base
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
books = []

connStr = os.environ.get('SqlConnectionString')
app.config['SQLALCHEMY_DATABASE_URI']= connStr
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO']=True

db = SQLAlchemy(app)

class Book(db.Model):
    __tablename__ = 'book'
    id = db.Column(db.Integer, db.Sequence('book_id_seq', start=1, increment=1), primary_key=True,)
    title = db.Column(db.String(50))
    author = db.Column(db.String(50))
    description = db.Column(db.String(4000))

    def to_dict(self):
        return {
            "id":self.id,
            "title":self.title,
            "author":self.author,
            "description":self.description
        }

class Reference(db.Model):
    __tablename__ = 'reference'
    id =  id = db.Column(db.Integer, db.Sequence('ref_id_seq', start=1, increment=1), primary_key=True)
    bookid = db.Column(db.Integer, db.ForeignKey('book.id'))
    path = db.Column(db.String(500))

    def to_dict(self):
        return {
            "id":self.id,
            "bookid":self.bookid,
            "path":self.path,
        }

with app.app_context():
    db.create_all()
    


@app.route("/")
def hello_world():
    
    books = getBooks()

    return render_template("home.html", name="SETO", todos=books, num=1)

@app.route('/todos', methods=['GET', 'POST'])
def handle_todos():
    if request.method == 'POST':
        data = request.get_json()
        book = Book(title=data.get('title'), author=data.get('author'), description=data.get('description'))
        db.session.add(book)
        db.session.commit()
        # book.id #自動採番のidには、行追加すると値が入っているのでこれを使って他テーブルを更新

        ref = Reference(bookid=book.id, path=data.get("reference"))
        db.session.add(ref)
        db.session.commit()
    
    books = getBooks()

    return jsonify(books)

def getBooks():
    data = Book.query.all()
    global books
    books = []

    #flask-sqlalchemyの型→Pythonの単純な構造体に変換する必要あり
    for row in data:
        #ここでID一致するreference行を持ってくる
        reference = Reference.query.filter_by(bookid=row.id)
        book = row.to_dict()
        book["reference"]=[r.path for r in reference]
        books.append(book)

    return books

if __name__ == "__main__":
    app.run(debug=True)