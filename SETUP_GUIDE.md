# 프로젝트 설정 가이드

## 📚 중고서점 지도 서비스

---

## 🔥 Firebase 설정 방법

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "bookstore-map")
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 2. Firebase 앱 등록

1. Firebase 프로젝트 개요에서 "</>" (웹) 아이콘 클릭
2. 앱 닉네임 입력 (예: "bookstore-web")
3. "Firebase Hosting 설정" 체크 (선택사항)
4. "앱 등록" 클릭

### 3. Firebase 설정 정보 복사

앱 등록 후 표시되는 설정 정보를 복사합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

### 4. 프로젝트에 설정 적용

`src/config/firebase.ts` 파일을 열고 복사한 설정을 붙여넣습니다:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",  // ← 여기에 복사한 값 붙여넣기
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Firebase Authentication 설정

1. Firebase Console에서 "Authentication" 메뉴 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭 선택
4. "이메일/비밀번호" 클릭
5. "사용 설정" 토글을 켜고 "저장"

### 6. Firestore Database 설정

1. Firebase Console에서 "Firestore Database" 메뉴 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 모드 선택:
   - **테스트 모드**: 개발용 (30일간 누구나 읽기/쓰기 가능)
   - **프로덕션 모드**: 배포용 (인증된 사용자만 접근)
4. 위치 선택 (asia-northeast3: 서울 권장)
5. "사용 설정" 클릭

### 7. Firestore 보안 규칙 설정 (권장)

Firestore Database > 규칙 탭에서 아래 규칙을 설정:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // userBookstores 컬렉션
    match /userBookstores/{document} {
      // 모든 사용자가 읽기 가능
      allow read: if true;
      
      // 로그인한 사용자만 작성 가능
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.createdBy;
      
      // 작성자만 수정/삭제 가능
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.createdBy;
    }
  }
}
```

이 규칙의 의미:
- 읽기: 모든 사람이 서점 목록을 볼 수 있음
- 생성: 로그인한 사용자만 서점을 추가할 수 있음
- 수정/삭제: 자신이 추가한 서점만 수정/삭제 가능

---

## 🗺️ 공공데이터 API 설정 방법

### 1. 공공데이터포털 회원가입

1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 진행

### 2. API 신청

1. 공공데이터포털에서 "중고서점" 검색
2. "한국문화정보원_전국 중고서점 및 운영정보" 선택
3. "활용신청" 버튼 클릭
4. 상세정보 입력:
   - 활용목적: 학습/교육용
   - 상세기능설명: 중고서점 지도 서비스
5. 신청 완료

### 3. 서비스 키 발급

1. 마이페이지 > 오픈API > 개발계정 상세보기
2. "일반 인증키(Encoding)" 복사
3. 승인 완료까지 약 1-2시간 소요

### 4. API 키 프로젝트에 적용

`src/services/bookstoreApi.ts` 파일을 열고 서비스 키를 붙여넣습니다:

```typescript
const SERVICE_KEY = 'YOUR_SERVICE_KEY'; // ← 여기에 복사한 키 붙여넣기
```

### 5. API 테스트

개발 서버를 실행하고 홈페이지에서 서점 목록이 제대로 로드되는지 확인합니다.

**참고**: API 키 승인이 완료되지 않았거나 잘못된 경우, 사용자가 추가한 서점만 표시됩니다.

---

## 🚀 프로젝트 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 3. 빌드

```bash
npm run build
```

### 4. 빌드 미리보기

```bash
npm run preview
```

---

## 📋 기능 체크리스트

### ✅ 필수 요구사항

- [x] Vite + TypeScript + React 19
- [x] Tailwind CSS 4
- [x] 반응형 디자인 (sm, md, lg 브레이크포인트)
- [x] React Router (3페이지: 홈, 로그인, 서점추가)
- [x] 공공데이터 API 연동 (중고서점 API)
- [x] Firebase Authentication (로그인/회원가입)
- [x] Firestore CRUD
  - [x] CREATE: 서점 추가
  - [x] READ: 서점 목록 조회
  - [x] UPDATE: 서점 정보 수정
  - [x] DELETE: 서점 삭제
- [x] 다국어 지원 (한국어 + 영어)
- [x] UI 스타일 가이드 (readme.txt)
- [x] 로딩/성공/오류 상태 표시

### 🔧 추가 기능

- [x] Leaflet 지도 연동 (무료 오픈소스)
- [x] 지도에서 클릭으로 위치 선택
- [x] 서점 검색 기능
- [x] 사용자 추가 서점 구분 표시
- [x] 반응형 네비게이션

---

## 🎨 사용된 기술 스택

### Frontend
- React 19 (함수형 컴포넌트 + Hooks)
- TypeScript
- Tailwind CSS 4
- React Router DOM
- React i18next (다국어)

### Map
- React Leaflet (오픈소스 무료 지도)
- OpenStreetMap

### Backend
- Firebase Authentication
- Firebase Firestore

### API
- 한국문화정보원 중고서점 API

### Build Tool
- Vite

---

## 📱 주요 페이지

### 1. 홈 페이지 (/)
- 지도에 서점 위치 표시
- 서점 목록 (카드 형식)
- 검색 기능
- 공공 API + 사용자 추가 서점 통합 표시

### 2. 로그인 페이지 (/login)
- 이메일/비밀번호 로그인
- 회원가입
- 에러/성공 메시지 표시

### 3. 서점 추가 페이지 (/add)
- 로그인 필요
- 지도 클릭으로 위치 선택
- 서점 정보 입력 폼
- 실시간 위치 미리보기

---

## 🔐 보안 주의사항

**중요**: Firebase 설정 파일과 API 키는 절대 GitHub에 커밋하지 마세요!

`.gitignore`에 다음을 추가하는 것을 권장합니다:

```
# Environment variables
.env
.env.local

# Firebase config (if you move it to .env)
src/config/firebase.ts
```

환경 변수를 사용하는 방법 (권장):

1. `.env.local` 파일 생성:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_PUBLIC_API_KEY=your-public-data-api-key
```

2. `firebase.ts`에서 환경 변수 사용:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

---

## 🐛 문제 해결

### Firebase 오류
- "Permission denied": Firestore 보안 규칙 확인
- "API key not valid": Firebase 설정 정보 재확인

### API 오류
- "API 요청 실패": 서비스 키 승인 상태 확인
- CORS 오류: 공공데이터포털에서 도메인 등록 필요

### 지도 표시 안됨
- Leaflet CSS 임포트 확인
- 마커 아이콘 URL 확인

---

## 📞 도움말

문제가 발생하면:
1. 브라우저 콘솔에서 에러 메시지 확인
2. Firebase Console에서 로그 확인
3. 공공데이터포털 API 사용 통계 확인

---

**프로젝트 완성을 축하합니다! 🎉**
