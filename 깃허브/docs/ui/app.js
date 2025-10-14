// Simple UI mock logic using localStorage
(function(){
  const qs = s=> document.querySelector(s);
  const $ = id => document.getElementById(id);

  // Views
  const authView = qs('#auth-view');
  const todoView = qs('#todo-view');
  const nav = qs('#main-nav');

  // Auth elements
  const tabLogin = qs('#tab-login');
  const tabSignup = qs('#tab-signup');
  const loginForm = qs('#login-form');
  const signupForm = qs('#signup-form');
  const userEmailSpan = qs('#user-email');
  const logoutBtn = qs('#logoutBtn');

  // Todo elements
  const newTodoInput = qs('#new-todo-input');
  const addTodoBtn = qs('#addTodoBtn');
  const todoList = qs('#todo-list');

  // Storage keys
  const KEY_USERS = 'mock_users_v1';
  const KEY_SESS = 'mock_session_v1';
  const KEY_TODOS = id => `mock_todos_v1_${id}`;

  // helpers
  function readJSON(key, fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch(e){return fallback}}
  function writeJSON(key,val){localStorage.setItem(key,JSON.stringify(val))}

  // users: { email: {password} }
  function getUsers(){return readJSON(KEY_USERS, {})}
  function saveUsers(u){writeJSON(KEY_USERS,u)}

  function setSession(email){writeJSON(KEY_SESS,{email})}
  function clearSession(){localStorage.removeItem(KEY_SESS)}
  function getSession(){return readJSON(KEY_SESS,null)}

  // UI navigation
  function showAuth(){authView.classList.remove('hidden'); todoView.classList.add('hidden'); nav.classList.add('hidden')}
  function showTodos(){authView.classList.add('hidden'); todoView.classList.remove('hidden'); nav.classList.remove('hidden')}

  // tabs
  tabLogin.addEventListener('click', ()=>{tabLogin.classList.add('active');tabSignup.classList.remove('active');loginForm.classList.remove('hidden');signupForm.classList.add('hidden')})
  tabSignup.addEventListener('click', ()=>{tabSignup.classList.add('active');tabLogin.classList.remove('active');signupForm.classList.remove('hidden');loginForm.classList.add('hidden')})

  // signup
  signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = qs('#signup-email').value.trim().toLowerCase();
    const pwd = qs('#signup-password').value;
    const users = getUsers();
    if(!email||pwd.length<4){alert('이메일과 4자 이상의 비밀번호가 필요합니다');return}
    if(users[email]){alert('이미 존재하는 계정입니다');return}
    users[email] = {password: pwd};
    saveUsers(users);
    alert('회원가입 완료 — 바로 로그인됩니다');
    setSession(email);
    loadForUser(email);
  })

  // login
  loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = qs('#login-email').value.trim().toLowerCase();
    const pwd = qs('#login-password').value;
    const users = getUsers();
    if(!users[email] || users[email].password !== pwd){alert('이메일 또는 비밀번호가 올바르지 않습니다');return}
    setSession(email);
    loadForUser(email);
  })

  logoutBtn.addEventListener('click', ()=>{clearSession(); showAuth();})

  // Todos
  function loadForUser(email){
    userEmailSpan.textContent = email;
    renderTodos();
    showTodos();
  }

  function getTodos(){
    const sess = getSession(); if(!sess) return [];
    return readJSON(KEY_TODOS(sess.email), []);
  }
  function saveTodos(list){ const sess = getSession(); if(!sess) return; writeJSON(KEY_TODOS(sess.email), list)}

  function renderTodos(){
    const todos = getTodos();
    todoList.innerHTML = '';
    if(todos.length===0){
      const li = document.createElement('li'); li.className='hint'; li.textContent='할 일이 없습니다. 새로 추가해보세요.'; todoList.appendChild(li); return
    }
    todos.forEach((t,idx)=>{
      const li = document.createElement('li'); li.className='todo-item'+(t.done? ' completed':'');
      const checkbox = document.createElement('input'); checkbox.type='checkbox'; checkbox.checked = !!t.done; checkbox.addEventListener('change', ()=>{t.done = checkbox.checked; saveTodos(todos); renderTodos()});
      const content = document.createElement('div'); content.className='content'; content.textContent = t.text;
      const actions = document.createElement('div'); actions.className='todo-actions';
      const editBtn = document.createElement('button'); editBtn.className='btn ghost'; editBtn.textContent='수정'; editBtn.addEventListener('click', ()=>{editTodo(idx)});
      const delBtn = document.createElement('button'); delBtn.className='btn'; delBtn.style.borderColor='var(--danger)'; delBtn.style.color='var(--danger)'; delBtn.textContent='삭제'; delBtn.addEventListener('click', ()=>{if(confirm('삭제하시겠습니까?')){todos.splice(idx,1); saveTodos(todos); renderTodos()}})
      actions.appendChild(editBtn); actions.appendChild(delBtn);
      li.appendChild(checkbox); li.appendChild(content); li.appendChild(actions);
      todoList.appendChild(li);
    })
  }

  function editTodo(idx){
    const todos = getTodos();
    const t = todos[idx];
    const newText = prompt('할 일 수정', t.text);
    if(newText===null) return;
    t.text = newText.trim() || t.text;
    saveTodos(todos); renderTodos();
  }

  addTodoBtn.addEventListener('click', ()=>{
    const txt = newTodoInput.value.trim();
    if(!txt) return; const todos = getTodos(); todos.unshift({text:txt, done:false, created: Date.now()}); saveTodos(todos); newTodoInput.value=''; renderTodos();
  })

  // init
  (function init(){
    const sess = getSession();
    if(sess && sess.email){ loadForUser(sess.email); } else { showAuth(); }
  })();

})();
