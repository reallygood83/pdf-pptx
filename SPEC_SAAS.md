# 📄 NotebookLM PDF to PPTX SaaS - 서비스 상세 설계도 (SPEC)

## 1. 프로젝트 개요
- **서비스명**: NotePPT (가칭)
- **주요 기능**: NotebookLM PDF 슬라이드를 편집 가능한 PPTX로 변환 + AI 스피커 노트 자동 생성
- **타겟 유저**: 자기계발러, 강사, 학생, 직장인 (누적 500명 이상 수용 목표)
- **배포 목표**: 프론트엔드(Vercel), 백엔드(Google Cloud Run), 기반 서비스(Firebase)

---

## 2. 기술 스택 (Tech Stack)

### 2.1 Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Framer Motion (Neo-brutalism 스타일 구현)
- **State Management**: React Query (SWR)
- **Deployment**: Vercel

### 2.2 Backend
- **Core Logic**: FastAPI (Python 3.11+)
- **PDF Engine**: PyMuPDF (fitz) - *Vercel/CloudRun 환경 최적화를 위해 Poppler 없이 구현*
- **AI Integration**: Google Gemini 2.0, OpenAI GPT-4o, xAI Grok-2
- **Deployment**: Google Cloud Run (Docker 기반)

### 2.3 Database & Infrastructure
- **Authentication**: Firebase Auth (Google Login)
- **Storage**: Firebase Storage (이미지 및 결과 파일 보관)
- **Database**: Firebase Firestore (변환 이력 및 유저 설정 저장)

---

## 3. 핵심 아키텍처 및 흐름

1.  **사용자 접속**: Vercel 프론트엔드 접속 → 구글 로그인 (Firebase Auth)
2.  **파일 업로드**: 사용자가 PDF 업로드 → 프론트엔드에서 Firebase Storage로 직접 업로드 (보안 서명된 업로드)
3.  **변환 요청**: 프론트엔드 → Cloud Run 백엔드 API 호출 (업로드된 파일 경로 전달)
4.  **AI 변환 프로세스**:
    - Cloud Run에서 PDF 다운로드 및 이미지 렌더링
    - 선택된 AI 모델로 슬라이드 분석 및 노트 생성
    - `python-pptx`를 이용해 최종 파일 생성 및 Storage 업로드
5.  **완료 알림**: 백엔드 → 프론트엔드로 완료 통보 및 다운로드 링크 제공
6.  **이력 관리**: Firestore에 변환 시간, 파일명, 성공 여부 기록

---

## 4. UI/UX 디자인 컨셉 (Neo-brutalism)

- **색상**: 고대비(High Contrast) 컬러 조합 (#A3FFAC(그린), #FF90E8(핑크), #FFD046(옐로우))
- **그림자**: 강력한 5px~10px의 하드 섀도우 (Hard Shadows)
- **보더**: 모든 요소에 2px 이상의 블랙 테두리 적용
- **폰트**: 'Space Grotesk' 혹은 'Outfit' 등 모던한 볼드 폰트 사용
- **상호작용**: 버튼 클릭 시 섀도우가 사라지는 눌림 효과 구현

---

## 5. 단계별 구현 계획 (Roadmap)

### 1단계: 프로젝트 기초 공사 (MVP)
- [ ] `/backend`: FastAPI 기본 구조 및 `converter.py` 이식 (PyMuPDF로 전환)
- [ ] Dockerize 백엔드 및 Google Cloud Run 테스트 배포
- [ ] `/frontend`: Next.js 프로젝트 생성 및 네오 브루탈리즘 테마 설정

### 2단계: 서비스 연동
- [ ] Firebase 프로젝트 설정 (Auth, Storage, Firestore)
- [ ] 프론트엔드 - 백엔드 간 API 통신 구현
- [ ] 구글 로그인 연동 및 사용자별 파일 격리

### 3단계: 사용자 고도화 (SaaS)
- [ ] 대시보드(변환 이력 조회) 페이지 구현
- [ ] API 사용량 제한 (Rate Limiting)
- [ ] 변환 중 실시간 진행 상황(Websocket/Polling) 표시

---

## 6. 보안 및 운영 전략
- **파일 보호**: 업로드된 원본 및 결과물은 1시간 후 자동 삭제 (Lifecycle 설정)
- **API 보안**: 백엔드 호출 시 Firebase ID Token 검증 (JWT)
- **확장성**: 사용자 급증 시 Cloud Run 정적 인스턴스 자동 증설 (Auto-scaling)

---

## 7. 기대 효과
- **프로급 퀄리티**: Streamlit의 한계를 넘어선 정교한 상용 웹 서비스 경험 제공
- **수익화 발판**: 향후 횟수 제한 및 구독 모델(멤버십) 도입의 완벽한 기반 마련
- **데이터 자산**: 어떤 사용자가 어떤 자료를 많이 변환하는지 파악하여 서비스 개선 아이디어 획기적 도출
