from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_FILE = 'books.pkl'

def load_books():
    """pickle 파일에서 책 데이터 로드"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'rb') as f:
            return pickle.load(f)
    return []

def save_books(books):
    """책 데이터를 pickle 파일에 저장"""
    with open(DATA_FILE, 'wb') as f:
        pickle.dump(books, f)

@app.route('/api/books', methods=['GET'])
def get_books():
    """모든 책 조회"""
    books = load_books()
    return jsonify(books)

@app.route('/api/books', methods=['POST'])
def add_book():
    """새 책 추가"""
    data = request.json
    books = load_books()

    new_book = {
        'id': len(books) + 1,
        'title': data.get('title'),
        'author': data.get('author'),
        'summary': data.get('summary'),
        'rating': data.get('rating', 0),
        'start_date': data.get('start_date'),
        'end_date': data.get('end_date'),
        'book_type': data.get('book_type', 'paper'),
        'category': data.get('category', '기타'),
        'date_added': datetime.now().strftime('%Y-%m-%d')
    }

    books.append(new_book)
    save_books(books)

    return jsonify(new_book), 201

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """책 정보 수정"""
    data = request.json
    books = load_books()

    for book in books:
        if book['id'] == book_id:
            book['title'] = data.get('title', book['title'])
            book['author'] = data.get('author', book['author'])
            book['summary'] = data.get('summary', book['summary'])
            book['rating'] = data.get('rating', book['rating'])
            book['start_date'] = data.get('start_date', book.get('start_date'))
            book['end_date'] = data.get('end_date', book.get('end_date'))
            book['book_type'] = data.get('book_type', book.get('book_type', 'paper'))
            book['category'] = data.get('category', book.get('category', '기타'))
            save_books(books)
            return jsonify(book)

    return jsonify({'error': '책을 찾을 수 없습니다'}), 404

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """책 삭제"""
    books = load_books()
    books = [book for book in books if book['id'] != book_id]
    save_books(books)
    return jsonify({'message': '삭제되었습니다'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)