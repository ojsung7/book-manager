import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [books, setBooks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    summary: '',
    rating: 0,
    start_date: '',
    end_date: '',
    book_type: 'paper',
    category: '소설'
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('책 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBook) {
        // 수정
        const response = await fetch(`${API_URL}/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedBook = await response.json();
        setBooks(books.map(book => book.id === updatedBook.id ? updatedBook : book));
        setEditingBook(null);
      } else {
        // 추가
        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const newBook = await response.json();
        setBooks([...books, newBook]);
      }
      
      setFormData({ title: '', author: '', summary: '', rating: 0, start_date: '', end_date: '', book_type: 'paper', category: '소설' });
      setIsAdding(false);
    } catch (error) {
      console.error('저장에 실패했습니다:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
        setBooks(books.filter(book => book.id !== id));
      } catch (error) {
        console.error('삭제에 실패했습니다:', error);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      summary: book.summary,
      rating: book.rating,
      start_date: book.start_date || '',
      end_date: book.end_date || '',
      book_type: book.book_type || 'paper',
      category: book.category || '소설'
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', summary: '', rating: 0, start_date: '', end_date: '', book_type: 'paper', category: '소설' });
  };

  const getBookStatus = (book) => {
    if (book.end_date) {
      return { status: '완독', color: 'completed' };
    } else if (book.start_date) {
      return { status: '독서중', color: 'reading' };
    } else {
      return { status: '읽을 예정', color: 'planned' };
    }
  };

  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.summary && book.summary.toLowerCase().includes(query))
    );
  });

  return (
    <div className="App">
      <header className="header">
        <h1>
          <span className="title-emoji">📚</span>
          <span className="title-text">나의 독서 목록</span>
        </h1>
        <button
          className="btn-add"
          onClick={() => {
            if (isAdding) {
              // 취소할 때
              setIsAdding(false);
              setEditingBook(null);
              setFormData({ title: '', author: '', summary: '', rating: 0, start_date: '', end_date: '', book_type: 'paper', category: '소설' });
            } else {
              // 새로 추가할 때
              setEditingBook(null);
              setFormData({ title: '', author: '', summary: '', rating: 0, start_date: '', end_date: '', book_type: 'paper', category: '소설' });
              setIsAdding(true);
            }
          }}
        >
          {isAdding ? '취소' : '+ 책 추가'}
        </button>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 책 제목, 저자, 요약으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isAdding && (
        <form className="book-form" onSubmit={handleSubmit}>
          <h2>{editingBook ? '책 수정' : '새 책 추가'}</h2>
          <div className="date-inputs">
            <div className="date-input-group">
              <label>읽기 시작한 날짜</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="date-input-group">
              <label>다 읽은 날짜</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="책 제목"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="저자"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required
          />
          <textarea
            placeholder="간단한 요약 (완독한 경우 필수)"
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            rows="4"
            required={!!formData.end_date}
          />
          <div className="category-input">
            <label>카테고리:</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="소설">📚 소설</option>
              <option value="재테크">💰 재테크</option>
              <option value="자기계발">🎯 자기계발</option>
              <option value="에세이">✍️ 에세이</option>
              <option value="역사">📜 역사</option>
              <option value="과학">🔬 과학</option>
              <option value="철학">🤔 철학</option>
              <option value="시">📝 시</option>
              <option value="기술">💻 기술</option>
              <option value="경제">📈 경제</option>
              <option value="기타">🔖 기타</option>
            </select>
          </div>
          <div className="book-type-input">
            <label>책 형태:</label>
            <div className="book-type-options">
              <button
                type="button"
                className={`book-type-btn ${formData.book_type === 'paper' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, book_type: 'paper'})}
              >
                📖 종이책
              </button>
              <button
                type="button"
                className={`book-type-btn ${formData.book_type === 'ebook' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, book_type: 'ebook'})}
              >
                📱 전자책
              </button>
            </div>
          </div>
          <div className="rating-input">
            <label>평점:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, rating: star})}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              {editingBook ? '수정' : '추가'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
          </div>
        </form>
      )}

      <div className="books-grid">
        {books.length === 0 ? (
          <p className="empty-message">아직 등록된 책이 없습니다. 첫 책을 추가해보세요!</p>
        ) : filteredBooks.length === 0 ? (
          <p className="empty-message">검색 결과가 없습니다.</p>
        ) : (
          filteredBooks.map(book => {
            const bookStatus = getBookStatus(book);
            return (
              <div key={book.id} className="book-card">
                <div className="book-status-badge" data-status={bookStatus.color}>
                  {bookStatus.status}
                </div>
                <div className="book-header">
                  <h3>{book.title}</h3>
                  <div className="rating">{'⭐'.repeat(book.rating)}</div>
                </div>
                <p className="author">저자: {book.author}</p>
                <div className="badges-row">
                  <div className="category-badge">
                    {book.category || '기타'}
                  </div>
                  <div className="book-type-badge">
                    {book.book_type === 'ebook' ? '📱 전자책' : '📖 종이책'}
                  </div>
                </div>
                <p className="summary">{book.summary}</p>
                <div className="book-dates">
                {book.start_date && (
                  <p className="date">
                    <span className="date-icon">📖</span>
                    시작: {book.start_date}
                  </p>
                )}
                {book.end_date && (
                  <p className="date">
                    <span className="date-icon">✅</span>
                    완료: {book.end_date}
                  </p>
                )}
                <p className="date">
                  <span className="date-icon">📅</span>
                  등록: {book.date_added}
                </p>
              </div>
              <div className="book-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEdit(book)}
                >
                  수정
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(book.id)}
                >
                  삭제
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;