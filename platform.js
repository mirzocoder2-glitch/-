// ===== AUTH =====
const Auth = {
  getUsers(){ return JSON.parse(localStorage.getItem('plt_users')||'[]'); },
  saveUsers(u){ localStorage.setItem('plt_users', JSON.stringify(u)); },
  getCurrent(){ 
    // sessionStorage эвазига localStorage ишлатамиз - GitHub Pages учун
    return JSON.parse(localStorage.getItem('plt_me')||'null'); 
  },
  setCurrent(u){ localStorage.setItem('plt_me', JSON.stringify(u)); },
  logout(){ localStorage.removeItem('plt_me'); location.href='login.html'; },
  requireAdmin(){ 
    const u=this.getCurrent(); 
    if(!u){ location.href='login.html'; return null; }
    if(u.role!=='admin'){ location.href='pupil.html'; return null; }
    return u; 
  },
  requirePupil(){ 
    const u=this.getCurrent(); 
    if(!u){ location.href='login.html'; return null; }
    if(u.role!=='pupil'){ location.href='admin.html'; return null; }
    return u; 
  },
  require(){ const u=this.getCurrent(); if(!u){location.href='login.html';return null;} return u; }
};

// ===== DB =====
const DB = {
  // Курсҳо
  getCourses(){ return JSON.parse(localStorage.getItem('plt_courses')||'[]'); },
  saveCourses(d){ localStorage.setItem('plt_courses', JSON.stringify(d)); },
  addCourse(c){ const d=this.getCourses(); c.id=Date.now(); c.createdAt=new Date().toISOString(); d.push(c); this.saveCourses(d); return c; },
  updateCourse(id,upd){ const d=this.getCourses().map(c=>c.id===id?{...c,...upd}:c); this.saveCourses(d); },
  deleteCourse(id){ this.saveCourses(this.getCourses().filter(c=>c.id!==id)); },

  // Видеоҳо
  getVideos(){ return JSON.parse(localStorage.getItem('plt_videos')||'[]'); },
  saveVideos(d){ localStorage.setItem('plt_videos', JSON.stringify(d)); },
  addVideo(v){ const d=this.getVideos(); v.id=Date.now(); v.createdAt=new Date().toISOString(); d.push(v); this.saveVideos(d); return v; },
  deleteVideo(id){ this.saveVideos(this.getVideos().filter(v=>v.id!==id)); },
  getVideosByCourse(cid){ return this.getVideos().filter(v=>v.courseId===cid); },

  // Тестҳо
  getTests(){ return JSON.parse(localStorage.getItem('plt_tests')||'[]'); },
  saveTests(d){ localStorage.setItem('plt_tests', JSON.stringify(d)); },
  addTest(t){ const d=this.getTests(); t.id=Date.now(); t.createdAt=new Date().toISOString(); d.push(t); this.saveTests(d); return t; },
  deleteTest(id){ this.saveTests(this.getTests().filter(t=>t.id!==id)); },

  // Вазифаҳо
  getTasks(){ return JSON.parse(localStorage.getItem('plt_tasks')||'[]'); },
  saveTasks(d){ localStorage.setItem('plt_tasks', JSON.stringify(d)); },
  addTask(t){ const d=this.getTasks(); t.id=Date.now(); t.createdAt=new Date().toISOString(); d.push(t); this.saveTasks(d); return t; },
  deleteTask(id){ this.saveTasks(this.getTasks().filter(t=>t.id!==id)); },

  // Натиҷаҳо
  getResults(){ return JSON.parse(localStorage.getItem('plt_results')||'[]'); },
  addResult(r){ const d=this.getResults(); r.id=Date.now(); r.date=new Date().toISOString(); d.push(r); localStorage.setItem('plt_results', JSON.stringify(d)); },

  // Пешрафт
  getProgress(uid){ return JSON.parse(localStorage.getItem('plt_prog_'+uid)||'{}'); },
  setProgress(uid,cid,pct){ const d=this.getProgress(uid); d[cid]=pct; localStorage.setItem('plt_prog_'+uid, JSON.stringify(d)); },

  // Чат
  getMessages(){ return JSON.parse(localStorage.getItem('plt_msgs')||'[]'); },
  addMessage(m){ const d=this.getMessages(); m.id=Date.now(); m.date=new Date().toISOString(); d.push(m); localStorage.setItem('plt_msgs',JSON.stringify(d)); return m; },
  deleteMessage(id){ const d=this.getMessages().filter(m=>m.id!==id); localStorage.setItem('plt_msgs',JSON.stringify(d)); },

  // Ҷадвал
  getSchedule(){ return JSON.parse(localStorage.getItem('plt_schedule')||'[]'); },
  saveSchedule(d){ localStorage.setItem('plt_schedule',JSON.stringify(d)); },
  addScheduleItem(s){ const d=this.getSchedule(); s.id=Date.now(); d.push(s); this.saveSchedule(d); return s; },
  deleteScheduleItem(id){ this.saveSchedule(this.getSchedule().filter(s=>s.id!==id)); },

  // Видео тик (пешрафти дарс)
  getWatched(uid){ return JSON.parse(localStorage.getItem('plt_watched_'+uid)||'[]'); },
  markWatched(uid,vid){ const d=this.getWatched(uid); if(!d.includes(vid)){d.push(vid);} localStorage.setItem('plt_watched_'+uid,JSON.stringify(d)); },
  isWatched(uid,vid){ return this.getWatched(uid).includes(vid); },

  // Сертификат
  getCerts(uid){ return JSON.parse(localStorage.getItem('plt_certs_'+uid)||'[]'); },
  addCert(uid,cid){ const d=this.getCerts(uid); if(!d.includes(cid)){d.push(cid); localStorage.setItem('plt_certs_'+uid,JSON.stringify(d));} },
  hasCert(uid,cid){ return this.getCerts(uid).includes(cid); },

  // Вазифаи иҷрошуда
  getSubmissions(){ return JSON.parse(localStorage.getItem('plt_subs')||'[]'); },
  addSubmission(s){ const d=this.getSubmissions(); s.id=Date.now(); s.date=new Date().toISOString(); d.push(s); localStorage.setItem('plt_subs', JSON.stringify(d)); }
};

// ===== SEED =====
(function seed(){
  const users = Auth.getUsers();
  if(!users.find(u=>u.role==='admin')){
    users.push({id:1, name:'Администратор', username:'admin', password:'admin123', role:'admin'});
    Auth.saveUsers(users);
  }
  if(DB.getCourses().length===0){
    DB.addCourse({title:'Python — Асосҳо', desc:'Синтаксис, функсияҳо, OOP', emoji:'🐍', level:'Осон'});
    DB.addCourse({title:'JavaScript Пурра', desc:'DOM, ES6+, Async/Await', emoji:'⚡', level:'Миёна'});
    DB.addCourse({title:'HTML & CSS', desc:'Асосҳои веб-дизайн', emoji:'🌐', level:'Осон'});
  }
  if(DB.getTests().length===0){
    const cid = DB.getCourses()[0].id;
    DB.addTest({
      title:'Python — Тести аввал', courseId:cid, timeLimit:120,
      questions:[
        {q:'Рӯйхат дар Python?', opts:['(1,2)', '[1,2]', '{1,2}', '<1,2>'], ans:1},
        {q:'Функсия эълон?', opts:['function', 'func', 'def', 'fn'], ans:2},
        {q:'Шарҳ?', opts:['// шарҳ','/* */', '# шарҳ','<!-- -->'], ans:2},
        {q:'len("Тоҷик")?', opts:['4','5','6','3'], ans:1},
        {q:'Нодуруст?', opts:['x=5','x="a"','x=[1]','x==5=int'], ans:3}
      ]
    });
  }
  if(DB.getTasks().length===0){
    const cid = DB.getCourses()[0].id;
    DB.addTask({title:'Калкулятор', desc:'Python-да калкулятор созед: +, -, *, /', courseId:cid, deadline:'2026-06-01', points:10});
    DB.addTask({title:'Саҳифаи HTML', desc:'Резюмеи шахсии худро бо HTML созед', courseId:DB.getCourses()[2].id, deadline:'2026-06-10', points:15});
  }
  if(DB.getVideos().length===0){
    const cid = DB.getCourses()[0].id;
    DB.addVideo({title:'Муқаддима ба Python', courseId:cid, url:'https://www.youtube.com/embed/dQw4w9WgXcQ', duration:'12 дақ', order:1});
    DB.addVideo({title:'Тағйирёбандаҳо', courseId:cid, url:'https://www.youtube.com/embed/dQw4w9WgXcQ', duration:'18 дақ', order:2});
  }
})();

// ===== HELPERS =====
function showToast(msg, type='success'){
  let t=document.getElementById('_toast');
  if(!t){t=document.createElement('div');t.id='_toast';t.className='toast';document.body.appendChild(t);}
  t.className=`toast ${type}`;
  t.innerHTML=(type==='success'?'✓ ':'✗ ')+msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
function fmtDate(iso){ if(!iso)return'—'; return new Date(iso).toLocaleDateString('ru-RU'); }
function initials(name){ return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2); }
