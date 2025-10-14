# DB 스펙 (Supabase 기준, 최소 단순 구현)

이 문서는 `.docs/prd.md`와 `docs/ui.spec.md`에 정의된 요구사항을 기준으로, Supabase(Postgres)에서 가장 간단하게 구성한 데이터베이스 모델 스펙입니다.

요구사항/제약 요약
- 인증은 Supabase의 인증 기능을 사용하지 않고 애플리케이션에서 `user id` + `password` 방식으로 처리합니다.
- 가장 단순하게 `user id`를 기본키(PK)로 사용합니다.
- RLS(행 수준 보안) 및 기타 보안 정책은 본 스펙에서 모두 생략합니다.
- 예제 데이터나 SQL 스크립트는 포함하지 않습니다. 필요한 컬럼, 타입, 제약조건 목록만 간결히 제시합니다.

## 테이블 목록
- users
- todos

---

## users
간단한 사용자 계정 정보를 저장하는 테이블입니다. 애플리케이션 요구사항에 따라 이메일을 `user id`로 사용하거나 별도의 user id를 둘 수 있습니다. 본 스펙에서는 일반 문자열형 `id`를 기본키로 정의합니다.

- 테이블 이름: users
- 설명: 애플리케이션에서 사용하는 계정 정보(아이디, 비밀번호)를 저장

컬럼 명세:
- id (text) — NOT NULL, PRIMARY KEY
  - 설명: 애플리케이션 상의 고유 사용자 식별자. (예: 이메일 또는 임의의 문자열)
- password (text) — NOT NULL
  - 설명: 단순 구현을 위한 비밀번호 저장 필드(요구에 따라 평문 저장 가능). 실제 운영에서는 해시 저장 권장.
- display_name (text) — NULLABLE
  - 설명: 선택적 표시명
- created_at (timestamptz) — NOT NULL, DEFAULT now()
  - 설명: 계정 생성 시각
- updated_at (timestamptz) — NULLABLE
  - 설명: 마지막 수정 시각

제약/인덱스:
- PRIMARY KEY: id
- (선택) 이메일을 id로 사용 한다면 별도 unique 제약은 필요하지 않음(이미 PK).

비고:
- 본 스펙은 가장 단순한 형태를 목표로 하므로 비밀번호는 `password` 컬럼에 저장하도록 정의했습니다. 프로덕션에서는 반드시 비밀번호 해시(예: bcrypt) 저장 및 적절한 인증 흐름 사용을 권장합니다.

---

## todos
사용자별 TODO 항목을 저장하는 테이블입니다. UI에서 요구한 항목(텍스트, 완료 여부, 생성시간 등)을 반영합니다.

- 테이블 이름: todos
- 설명: 각 사용자에 종속되는 할 일 항목을 저장

컬럼 명세:
- id (uuid) — NOT NULL, PRIMARY KEY
  - 설명: 각 TODO 항목의 고유 식별자(또는 serial/int 사용 가능). 기본적으로 uuid 권장
- user_id (text) — NOT NULL, FOREIGN KEY -> users.id
  - 설명: 이 할 일을 소유한 사용자. `users.id`와 매핑
- text (text) — NOT NULL
  - 설명: 할 일 내용(텍스트)
- done (boolean) — NOT NULL, DEFAULT false
  - 설명: 완료 여부
- created_at (timestamptz) — NOT NULL, DEFAULT now()
  - 설명: 생성 시각
- updated_at (timestamptz) — NULLABLE
  - 설명: 마지막 수정 시각 (수정 API가 있으면 갱신)
- position (integer) — NULLABLE
  - 설명: 목록 순서 지정용(필요 시 사용)

제약/인덱스:
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- INDEX: index on user_id (빠른 사용자별 조회)

비고:
- 사용자별 todos는 `mock_todos_v1_${email}` 같은 로컬 스토리지 키를 사용하던 UI 목업과 달리, 이 스펙은 DB 중심으로 user_id 컬럼을 통해 분리합니다.

---

## 관계 다이어그램(간단)
- users(id) 1 --- * todos(user_id)

---

## 기타(운영/보안 관련 메모)
- 본 스펙은 요청에 따라 RLS 및 추가 보안 정책을 생략했습니다. 실제 서비스에서는 다음을 고려해야 합니다:
  - 비밀번호는 평문이 아닌 안전한 해시(예: bcrypt)로 저장
  - 인증은 Supabase Auth 또는 별도 인증 서버로 대체
  - RLS/정책을 통해 사용자별 접근 제어 적용

---

작성자 노트: 필요하면 이 스펙을 바탕으로 실제 Supabase 콘솔에서 테이블을 생성할 수 있도록 SQL DDL 또는 Supabase 테이블 생성 스크립트를 추가로 제공해 드리겠습니다. 간단한 스키마를 원하셨으므로 예제나 스크립트는 포함하지 않았습니다.
