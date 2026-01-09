# 📚 나의 독서 목록

개인 독서 기록을 관리할 수 있는 웹 애플리케이션입니다. 읽은 책, 읽고 있는 책, 읽을 예정인 책을 체계적으로 관리하고 간단한 리뷰와 평점을 기록할 수 있습니다.

## ✨ 주요 기능

- 📖 책 정보 등록 (제목, 저자, 요약, 평점)
- 📅 독서 기간 추적 (시작일, 완료일)
- 🔍 책 검색 (제목, 저자, 요약)
- 📚 카테고리 분류 (소설, 재테크, 자기계발, 에세이, 역사, 과학, 철학, 시, 기술, 경제, 기타)
- 📖📱 책 형태 구분 (종이책, 전자책)
- ⭐ 5점 척도 평점 시스템
- 🎯 독서 상태 표시 (읽을 예정, 독서중, 완독)
- ✏️ 책 정보 수정 및 삭제

## 🛠️ 기술 스택

### Frontend
- React 19.2.0
- Vite 7.2.4
- CSS3

### Backend
- Python
- Flask
- Flask-CORS
- Pickle (데이터 저장)

## 📋 사전 요구사항

- Node.js (버전 14 이상)
- Python (버전 3.7 이상)
- npm 또는 yarn

## 🚀 설치 및 실행 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd read_book_list
```

### 2. Backend 실행

```bash
cd backend

# Python 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 필요한 패키지 설치
pip install flask flask-cors

# Flask 서버 실행
python app.py
```

Backend 서버는 `http://localhost:5000`에서 실행됩니다.

### 3. Frontend 실행

새 터미널을 열어서:

```bash
cd frontend/book-manager

# 의존성 패키지 설치
npm install

# 서버 실행
npx vite
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

## 📁 프로젝트 구조

```
read_book_list/
├── backend/
│   ├── app.py           # Flask 서버
│   └── books.pkl        # 책 데이터 저장 파일
└── frontend/
    └── book-manager/
        ├── src/
        │   ├── App.jsx  # 메인 React 컴포넌트
        │   └── App.css  # 스타일시트
        └── package.json
```

## 🎯 사용 방법

1. 웹 브라우저에서 `http://localhost:3000` 접속
2. **"+ 책 추가"** 버튼 클릭하여 새 책 등록
3. 책 정보 입력:
   - 제목, 저자 (필수)
   - 시작 날짜, 완료 날짜 (선택)
   - 요약 (완독한 경우 필수)
   - 카테고리 선택
   - 책 형태 선택 (종이책/전자책)
   - 평점 선택 (1-5점)
4. 등록된 책은 카드 형태로 표시됩니다
5. 검색창을 통해 책 검색 가능
6. 각 카드에서 **수정** 또는 **삭제** 가능

## 📊 API 엔드포인트

### 책 목록 조회
```
GET /api/books
```

### 책 추가
```
POST /api/books
Content-Type: application/json

{
  "title": "책 제목",
  "author": "저자명",
  "summary": "요약",
  "rating": 5,
  "start_date": "2024-01-01",
  "end_date": "2024-01-15",
  "book_type": "paper",
  "category": "소설"
}
```

### 책 수정
```
PUT /api/books/:id
Content-Type: application/json
```

### 책 삭제
```
DELETE /api/books/:id
```

## 🔧 개발 스크립트

## 💾 데이터 저장

- 데이터는 `backend/books.pkl` 파일에 pickle 형식으로 저장됩니다
- 서버 재시작 시에도 데이터가 유지됩니다

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.
