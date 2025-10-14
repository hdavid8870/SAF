# TODO 앱 UI 명세서 (UI Mock)

이 문서는 `docs/ui` 폴더에 있는 목업 구현(`index.html`, `styles.css`, `app.js`)을 기준으로 모든 UI 요소, 상태, 이벤트, 데이터 저장소와 동작을 누락 없이 정리한 스펙입니다. 디자이너/개발자/QA가 UI와 내비게이션, 상호작용을 빠르게 이해하고 테스트할 수 있도록 작성했습니다.

## 참조 파일
- `docs/ui/index.html` — 마크업
- `docs/ui/styles.css` — 스타일 변수와 클래스, 반응형 규칙
- `docs/ui/app.js` — 클라이언트 로직, 이벤트, localStorage 저장 키/형식

## 요약 계약 (Contract)
- 입력: 사용자 입력 (이메일, 비밀번호, 새로운 할일 텍스트)
- 출력: 화면 상태 전환(로그인/투두 화면), localStorage에 사용자/세션/투두 저장
- 데이터 형태:
  - 사용자 목록: 객체 map — { "email@example.com": { password: "plain" }, ... }
  - 세션: { email: "email@example.com" }
  - TODO 목록: 배열 — [ { text: string, done: boolean, created: number }, ... ]
- 에러 모드: 잘못된 로그인, 이미 존재하는 계정, 빈 입력 등은 브라우저 alert로 표시

## 전역/레이아웃 요소
- `.container` — 중앙 정렬된 컨테이너 (max-width:900px)
- `header.header` — 제목과 `nav#main-nav`
  - `h1` — 고정 텍스트 "TODO 앱 (UI Mock)"
  - `nav#main-nav.nav` (초기 클래스: `hidden`) — 로그인 이후 표시
    - `span#user-email.user-email` — 로그인한 사용자 이메일 표시
    - `button#logoutBtn.btn.small` — 로그아웃 버튼 (클릭 시 세션 제거 및 인증 화면 표시)
- `footer.footer` — 고정 푸터 텍스트

## 뷰(Section)
애플리케이션은 단일 페이지 내에서 두 개의 주요 뷰를 전환합니다:
- `section#auth-view.card` — 인증(로그인 / 회원가입) 뷰 (초기 표시)
- `section#todo-view.card.hidden` — TODO 목록 뷰 (초기 숨김)

뷰 전환 함수 (app.js):
- `showAuth()` — `auth-view` 보이기, `todo-view` 숨기기, `#main-nav` 숨기기
- `showTodos()` — `auth-view` 숨기기, `todo-view` 보이기, `#main-nav` 보이기

## 인증(로그인 / 회원가입) 뷰 상세
마크업 핵심 요소:
- `.tabs` 내 탭 버튼
  - `button#tab-login.tab.active` — 로그인 탭. 클릭 시 로그인 폼을 보여줌
  - `button#tab-signup.tab` — 회원가입 탭. 클릭 시 회원가입 폼을 보여줌

- 로그인 폼 (`form#login-form.form`)
  - `input#login-email[type=email]` — 이메일 (placeholder: you@example.com, required)
  - `input#login-password[type=password]` — 비밀번호 (required)
  - `button#loginBtn.btn.primary[type=submit]` — 제출(로그인)

- 회원가입 폼 (`form#signup-form.form.hidden`)
  - `input#signup-email[type=email]` — 이메일 (placeholder: you@example.com, required)
  - `input#signup-password[type=password]` — 비밀번호 (placeholder: 비밀번호 (4자 이상), required)
  - `button#signupBtn.btn.primary[type=submit]` — 제출(회원가입)

동작/유효성 (app.js):
- 탭 클릭:
  - `#tab-login` 클릭: `.active`를 `tab-login`에 추가, `tab-signup`에서 제거; `#login-form` 보이기, `#signup-form` 숨기기.
  - `#tab-signup` 클릭: 반대 동작.
- 회원가입 제출(`signupForm submit`):
  - 입력 읽기: `#signup-email` (소문자화, trim), `#signup-password`.
  - 유효성: 이메일 비어있거나 비밀번호 길이 < 4 => alert("이메일과 4자 이상의 비밀번호가 필요합니다")
  - 중복: users[email] 존재 => alert("이미 존재하는 계정입니다")
  - 성공: users 객체에 저장, localStorage에 KEY_USERS로 저장, alert으로 성공 메시지, setSession(email), loadForUser(email) 호출(바로 로그인된 상태로 전환)
- 로그인 제출(`loginForm submit`):
  - 입력 읽기: `#login-email`, `#login-password`.
  - 검증: users[email] 존재하지 않거나 비밀번호 불일치 => alert("이메일 또는 비밀번호가 올바르지 않습니다")
  - 성공: setSession(email), loadForUser(email)

저장 키:
- KEY_USERS = 'mock_users_v1' (형식: JSON.stringify({ email: { password } }))
- KEY_SESS = 'mock_session_v1' (형식: JSON.stringify({ email }))

## TODO 뷰 상세
마크업 핵심 요소:
- `div.todo-header`:
  - `input#new-todo-input[type=text]` — 새 할 일 입력 (placeholder: "새로운 할 일을 입력하세요")
  - `button#addTodoBtn.btn` — 추가 버튼
- `ul#todo-list.todo-list` — 할 일 항목이 동적으로 주입되는 리스트
  - 항목 템플릿(런타임 생성):
    - `li.todo-item` (+ `.completed` 상태일 수 있음)
      - `input[type=checkbox]` — 완료 여부 토글 (change 이벤트에서 항목의 done 상태 업데이트)
      - `div.content` — 할 일 텍스트
      - `div.todo-actions` — 버튼 그룹
        - `button.btn.ghost` (text: '수정') — 클릭 시 prompt로 텍스트 수정 후 저장
        - `button.btn` (스타일에 `borderColor`/`color`를 위험색으로 설정, text: '삭제') — 클릭 시 confirm, 확인하면 항목 삭제

동작/유효성 (app.js):
- 초기 로드: getSession() 확인. 세션 존재하면 loadForUser(email) 호출하여 `user-email` 표시 및 renderTodos(), 세션 없으면 showAuth().
- getTodos(): KEY_TODOS(sess.email) 키에서 로드. KEY_TODOS 함수: `mock_todos_v1_${email}`
- todo 저장 형식: 배열 of { text: string, done: boolean, created: number }
- 목록 렌더링(renderTodos):
  - 항목이 없으면 `li.hint`를 하나 추가해 "할 일이 없습니다. 새로 추가해보세요." 출력
  - 존재하면 각 항목을 위 템플릿으로 생성. 체크박스 변경 시 해당 항목의 done 업데이트하고 저장 및 재렌더
  - 수정 버튼 클릭: `prompt('할 일 수정', t.text)`로 입력받아 null(취소) 체크, 비어있을 경우 기존 텍스트 유지
  - 삭제 버튼 클릭: `confirm('삭제하시겠습니까?')`에서 확인 시 splice로 배열에서 제거, 저장 및 재렌더
- 추가 버튼(`#addTodoBtn`) 클릭: `#new-todo-input` 값 trim 후 빈 문자열이면 무시, 아니면 todos.unshift({text, done:false, created:Date.now()}) 저장 및 렌더, 입력 초기화

## 스타일/상태 클래스
- CSS 변수(주요 색상): `--bg`, `--card`, `--muted`, `--primary`, `--danger`, `--success`
- `.hidden` — display: none (뷰/폼 토글에 사용)
- `.tab.active` — 활성 탭 스타일(배경: --primary, 색: #fff)
- `.todo-item.completed .content` — 완료 시 취소선과 muted 색 적용
- `.btn.primary` — 주요 버튼 색상 (--primary)

## 이벤트 목록(요약)
- `#tab-login` click => show login form
- `#tab-signup` click => show signup form
- `#signup-form` submit => 회원가입 처리 (검증, users 저장, 세션 설정, loadForUser)
- `#login-form` submit => 로그인 처리 (검증, 세션 설정, loadForUser)
- `#logoutBtn` click => clearSession(), showAuth()
- `#addTodoBtn` click => 새 투두 추가
- 동적으로 생성된 체크박스 change => 항목 done 토글, 저장
- 동적으로 생성된 수정 버튼 click => editTodo(idx) => prompt로 수정
- 동적으로 생성된 삭제 버튼 click => confirm 삭제

## 저장 키 및 데이터 스키마(정리)
- KEY_USERS = 'mock_users_v1'
  - 값: JSON.stringify({ [email]: { password: string } })
- KEY_SESS = 'mock_session_v1'
  - 값: JSON.stringify({ email: string })
- KEY_TODOS(email) = `mock_todos_v1_${email}`
  - 값: JSON.stringify([ { text: string, done: boolean, created: number }, ... ])

## 접근성/UX 주의사항
- 모든 입력에 label 요소가 있으나, 레이블 텍스트가 인라인으로 존재하므로 스크린리더에서 잘 읽히려면 `for`/`id` 연결을 고려할 수 있음.
- 폼 제출 시 현재는 `alert`/`confirm`/`prompt`가 사용됨 — 접근성 및 UX 개선을 위해 인플레이스(in-place) 피드백(인라인 에러)으로 대체 권장.
- 버튼/입력에 키보드 인터랙션 보강(예: Enter로 새 할 일 추가) 권장.

## 에지케이스 및 예외 시나리오
- 회원가입: 이미 존재하는 이메일 시 가입 불가
- 비밀번호 길이 검증(최소 4자)
- 로그인: 존재하지 않는 이메일 또는 비밀번호 불일치 => 오류
- 세션 손상(존재하지 않는 세션으로 getTodos 호출) => 빈 배열 반환
- 빈 투두 입력은 무시

## 테스트 체크리스트 (QA용 수동 테스트 시나리오)
1. 브라우저에서 `docs/ui/index.html`을 연다. 인증 뷰가 보인다.
2. 회원가입 탭으로 전환 후 이메일/비밀번호 입력(짧은 비밀번호로 실패 케이스 확인)
3. 정상 회원가입 후 자동 로그인 되어 상단에 이메일이 표시되고 TODO 뷰가 보이는지 확인
4. 새 할 일 추가: 텍스트 입력 후 '추가' 클릭하여 리스트에 추가되는지 확인
5. 체크박스로 완료/미완료 토글하면 스타일(.completed)이 적용되고 localStorage에 반영되는지 확인
6. 수정 버튼 클릭하면 prompt가 열리고 변경 후 리스트가 갱신되는지 확인
7. 삭제 버튼 클릭 시 confirm 창이 뜨고 확인 시 항목이 제거되는지 확인
8. 로그아웃 버튼 클릭 후 인증 뷰로 돌아가는지 확인
9. 브라우저를 새로고침해도 사용자의 todos가 유지되는지(localStorage 기반) 확인

## 향후 개선 제안
- Enter 키로 할 일 추가 (keyboard handler 추가)
- 인라인 에러/토스트 메시지 UI로 alert/confirm/prompt 대체
- 비밀번호 암호화/해시 및 백엔드 연동 (프로덕션 요구사항)
- 접근성(ARIA, label-for 연결) 개선
- 필터(전체/완료/미완료) 및 정렬 기능

---
작성자: UI Mock 생성 스크립트 기준 자동 문서화
위 스펙에 누락된 항목이 있거나 다른 방식으로 정리하길 원하시면 어떤 형식(예: 표 형태, API 연동 명세 포함)으로 바꿀지 알려주세요.
