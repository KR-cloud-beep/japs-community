# 잽스 커뮤니티

Next.js + Supabase로 만든 잽스 커뮤니티입니다.

## 현재 구현
- 반응형 메인 커뮤니티 UI
- 이메일 로그인 / 회원가입
- 게시글 목록 및 작성
- 게시글 상세
- 좋아요
- 댓글
- 프로필 편집
- 알림 페이지
- Supabase RLS 기본 정책
- GitHub Actions 빌드 검사

## 환경변수
`.env.local`에 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

구형 anon key를 사용 중이면 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 지원합니다.

## Supabase
`supabase/schema.sql`은 커뮤니티 핵심 테이블과 RLS/Data API 권한을 포함합니다. 이미 만들어진 운영 DB가 있다면 기존 정책과 충돌하지 않는지 확인한 뒤 적용하세요.

현재 Supabase 연결은 프로젝트 접근 권한이 이 세션에 노출되지 않아 여기서 직접 실행/검증할 수 없습니다. 코드는 연결 정보가 들어오면 바로 동작하도록 작성되어 있습니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.
