
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.matchMedia("(pointer: coarse)").matches) {
  if (cursor) cursor.style.display = 'none';
  if (ring) ring.style.display = 'none';
}
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button, .cmd-list li, .recent-list li, .slash-item, .send-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('big'); ring.classList.add('big'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('big'); ring.classList.remove('big'); });
});


const API_BASE = '/api';
const API_URL = `${API_BASE}/chat`;
const HISTORY_KEY = 'chat_history_data';
const SESSION_KEY = 'chat_session_id';
let isLoading = false;
let loadingInterval = null;
let loadingIntervalFlag = 200;
const loadingPhrases = [
  "Thinking", "Analyzing", "Processing", "Computing",
  "Reasoning", "Synthesizing", "Generating", "Inferring",
  "Parsing", "Indexing", "Querying", "Optimizing"
];


const localCommands = {
  '/help': () => `Available commands:\n<ul class="focus-list" style="margin-top:10px"><li>/projects - List all projects</li><li>/skills - Tech stack overview</li><li>/experience - Work history</li><li>/contact - Contact info</li><li>/clear - Clear chat history</li></ul>`,
  '/projects': () => `<p>Here are Sasidhar's key projects:</p><ul class="focus-list" style="margin-top:12px"><li>VirtuHire AI - Autonomous recruitment system (Django, Gemini, YOLOv8)</li><li>Project VEGA - Desktop AI assistant (Electron, FastAPI, Gemini Live)</li><li>RoboSwift - Tauri 2 + Rust desktop robocopy GUI</li><li>Project-T - Universal Tunnel Server (FastAPI, HTTP/2, TCP)</li><li>Axon File Manager - 4-stage Neural Search engine</li><li>VenvDrop - Zero-dependency Python env bundler (PyPI)</li><li>AI-Interviewer - WebRTC + Whisper live interview platform</li></ul>`,
  '/skills': () => `<p>Core technical skills:</p><div class="focus-block"><div class="focus-title">Backend</div><ul class="focus-list"><li>FastAPI, Django, Node.js, Express</li><li>PostgreSQL, MySQL, MongoDB, Redis</li></ul></div><div class="focus-block" style="margin-top:10px"><div class="focus-title">AI / ML</div><ul class="focus-list"><li>LLM Orchestration, RAG Systems, Multi-Agent</li><li>YOLOv8, MediaPipe, Whisper, Gemini API</li></ul></div><div class="focus-block" style="margin-top:10px"><div class="focus-title">DevOps</div><ul class="focus-list"><li>Docker, GitHub Actions, AWS, Nginx, n8n</li></ul></div>`,
  '/experience': () => `<p>Work history:</p><ul class="focus-list" style="margin-top:12px"><li>Associate Software Engineer - InfoSpoke (May 2026-Present)</li><li>Project Intern (Backend) - InfoSpoke (Jan-Apr 2026)</li><li>DevOps Intern - Swecha AP (Jun-Jul 2024)</li><li>Cybersecurity Intern - Supraja Technologies (May-Aug 2024)</li></ul>`,
  '/contact': () => `<p>Get in touch with Sasidhar:</p><ul class="focus-list" style="margin-top:12px"><li>Email: akurathisasidhar4@gmail.com</li><li>GitHub: github.com/sasidharakurathi</li><li>LinkedIn: linkedin.com/in/sasidhar-akurathi</li><li>Portfolio: sasidharakurathi-portfolio.vercel.app</li></ul>`,
  '/clear': () => {
    sessionStorage.removeItem(HISTORY_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    document.getElementById('messagesArea').innerHTML = '';
    setTimeout(() => location.reload(), 100);
    return 'Session Cleared';
  }
};


function addMessage(sender, htmlContent, isUser = false, shouldSave = true) {
  const area = document.getElementById('messagesArea');
  if (!area) return;

  if (isUser) {
    const row = document.createElement('div');
    row.className = 'msg-row user';
    row.innerHTML = `
      <div class="msg-avatar user-avatar"><i data-lucide="user" style="width:16px;height:16px;"></i></div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-sender user">USER</span>
        </div>
        <div class="user-bubble"><p>${sender === 'user' ? escHtml(htmlContent) : htmlContent}</p></div>
      </div>`;
    area.appendChild(row);
  } else {
    const row = document.createElement('div');
    row.className = 'msg-row';
    row.innerHTML = `
      <div class="msg-avatar bot-avatar"><i data-lucide="bot" style="width:16px;height:16px;"></i></div>
      <div class="msg-body">
        <div class="msg-header">
          <span class="msg-sender bot">SASIDHAR_AI_CLONE</span>
          <span class="msg-badge">FASTAPI/GEMINI</span>
        </div>
        <div class="bot-bubble"><div class="bot-content">${htmlContent}</div></div>
      </div>`;
    area.appendChild(row);
  }

  if (shouldSave) {
    saveMessage(sender, htmlContent, isUser);
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
  area.scrollTop = area.scrollHeight;
}

function saveMessage(sender, content, isUser) {
  let history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
  history.push({ sender, content, isUser });
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadChatHistory() {
  const history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
  const area = document.getElementById('messagesArea');
  if (history.length > 0 && area) {
    area.innerHTML = '';
    history.forEach(msg => {
      addMessage(msg.sender, msg.content, msg.isUser, false);
    });
  }
}


function addTyping() {
  const area = document.getElementById('messagesArea');
  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typingRow';
  row.innerHTML = `
    <div class="msg-avatar bot-avatar"><i data-lucide="bot" style="width:16px;height:16px;"></i></div>
    <div class="typing-bubble">
      <div class="t-dot"></div>
      <div class="t-dot"></div>
      <div class="t-dot"></div>
    </div>`;
  area.appendChild(row);
  if (typeof lucide !== 'undefined') lucide.createIcons();
  area.scrollTop = area.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typingRow');
  if (t) t.remove();
}


function addRecent(query) {
  const list = document.getElementById('recentList');
  if (!list) return;
  Array.from(list.querySelectorAll('li')).forEach(li => {
    if (li.textContent.trim() === query.trim()) li.remove();
  });
  const li = document.createElement('li');
  li.textContent = query.length > 28 ? query.slice(0, 28) + '…' : query;
  li.onclick = () => runCommand(query);
  list.insertBefore(li, list.firstChild);
  while (list.children.length > 5) list.removeChild(list.lastChild);
}

function getSessionID() {
  let sessionID = sessionStorage.getItem(SESSION_KEY);
  if (!sessionID) {
    sessionID = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem(SESSION_KEY, sessionID);
  }
  return sessionID;
}


async function sendConsoleMessage() {
  const input = document.getElementById('consoleInput');
  const sendBtn = document.getElementById('sendBtn');
  const query = input.value.trim();
  if (!query || isLoading) return;

  input.value = '';
  hideSlash();
  addMessage('user', query, true);
  addRecent(query);

  if (localCommands[query.toLowerCase()]) {
    const html = localCommands[query.toLowerCase()]();
    if (html !== 'Session Cleared') {
      addMessage('bot', html);
    }
    return;
  }

  isLoading = true;
  sendBtn.disabled = true;
  startLoadingAnimation();
  addTyping();

  const t0 = Date.now();

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, is_mini_widget: false, session_id: getSessionID() })
    });
    const data = await res.json();
    const latency = Date.now() - t0;
    const latencyDisp = document.getElementById('latencyDisplay');
    if (latencyDisp) latencyDisp.textContent = latency + 'ms';

    const reply = data.response || data.message || data.answer || data.reply || '...';

    removeTyping();
    const formatted = formatBotReply(reply);
    stopLoadingAnimation();
    addMessage('bot', formatted);

  } catch (err) {
    removeTyping();
    stopLoadingAnimation();
    addMessage('bot', `<span style="color:rgba(239,68,68,0.85)"><i data-lucide="alert-triangle" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i> CONNECTION_ERROR: Backend unreachable. Ensure the API server is running.</span>`);
  }

  isLoading = false;
  sendBtn.disabled = false;
}

function startLoadingAnimation() {
  const input = document.getElementById('consoleInput');
  if (!input) return;

  const phrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
  input.disabled = true;
  input.classList.add('loading-state');

  let step = 0;
  let dots = 0;

  const animate = () => {
    if (!isLoading) return;

    if (step < phrase.length) {
      loadingIntervalFlag = 50;
      input.value = phrase.slice(0, step + 1);
      step++;
    } else {
      loadingIntervalFlag = 200;
      dots = (dots + 1) % 4;
      input.value = phrase + ".".repeat(dots);
    }
    loadingInterval = setTimeout(animate, loadingIntervalFlag);
  };

  animate();
}

function stopLoadingAnimation() {
  if (loadingInterval) {
    clearTimeout(loadingInterval);
    loadingInterval = null;
  }
  const input = document.getElementById('consoleInput');
  if (input) {
    input.value = '';
    input.disabled = false;
    input.classList.remove('loading-state');
    input.focus();
  }
}

function runCommand(cmd) {
  const input = document.getElementById('consoleInput');
  if (input) {
    input.value = cmd;
    input.focus();
    sendConsoleMessage();
  }
}

function formatBotReply(text) {
  if (typeof marked !== 'undefined') {
    const renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ');
    };

    marked.setOptions({
      renderer: renderer,
      breaks: true,
      gfm: true
    });
    return marked.parse(text);
  }
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function escHtml(t) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(t));
  return d.innerHTML;
}


const consoleInput = document.getElementById('consoleInput');
if (consoleInput) {
  consoleInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendConsoleMessage();
  });
  consoleInput.addEventListener('input', e => {
    if (e.target.value === '/') showSlash();
    else hideSlash();
  });
}


const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

function showSlash() {
  const pop = document.getElementById('slashPopover');
  if (pop) pop.classList.add('show');
}
function hideSlash() {
  const pop = document.getElementById('slashPopover');
  if (pop) pop.classList.remove('show');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.slash-popover') && !e.target.closest('.console-input')) {
    hideSlash();
  }
});


const existingHistory = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
if (existingHistory.length === 0) {
  setTimeout(() => {
    addMessage('bot', `Sasidhar is a Backend Engineer specialized in high-performance API architectures and AI integration.
      <div class="focus-block">
        <div class="focus-title">Key Focus Areas:</div>
        <ul class="focus-list">
          <li>Scalable backend systems (FastAPI, Django, Python)</li>
          <li>LLM Orchestration &amp; RAG pipelines</li>
          <li>Computer Vision &amp; Multi-Agent AI tooling</li>
          <li>Tauri + Rust desktop application development</li>
        </ul>
      </div>
      <p class="bot-cta">Would you like to know more about specific <a class="cmd-link" onclick="runCommand('/projects');">/projects</a> or <a class="cmd-link" onclick="runCommand('/skills');">/skills</a>?</p>`);
  }, 600);
}


getSessionID();
loadChatHistory();

async function checkConsoleStatus() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const indicator = document.querySelector('.status-indicator');
  if (!dot || !text || !indicator) return;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${API_BASE}/ping`, { signal: controller.signal });
    clearTimeout(id);

    if (response.ok) {
      indicator.classList.remove('offline');
      text.textContent = 'Online';
      text.classList.remove('red');
      text.classList.add('green');
    } else {
      throw new Error('Offline');
    }
  } catch (e) {
    indicator.classList.add('offline');
    text.textContent = 'Offline';
    text.classList.remove('green');
    text.classList.add('red');
  }
}

setInterval(checkConsoleStatus, 30000);
checkConsoleStatus();
