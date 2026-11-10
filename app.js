/**
 * Aksaray Belediyesi - Basın Yayın & Reji Koordinasyon Portalı
 * JavaScript Uygulama Mantığı
 */

// Soyisimleri Türkçe Kurallarına Uygun Olarak BÜYÜK Yapan Yardımcı Fonksiyon
function formatSurnameUpper(fullName) {
  if (!fullName || typeof fullName !== 'string') return fullName || '';
  let titlePart = '';
  let cleanName = fullName.trim();
  const titleMatch = cleanName.match(/^(.*?)\s*(\([^)]+\))$/);
  if (titleMatch) {
    cleanName = titleMatch[1].trim();
    titlePart = ' ' + titleMatch[2];
  }
  const parts = cleanName.split(/\s+/);
  if (parts.length <= 1) return fullName;
  const surname = parts.pop();
  const upperSurname = surname.toLocaleUpperCase('tr-TR');
  const firstNames = parts.map(p => {
    if (!p) return '';
    return p[0].toLocaleUpperCase('tr-TR') + p.slice(1);
  }).join(' ');
  return `${firstNames} ${upperSurname}${titlePart}`;
}

// Uygulama Durumu (State)
let appState = {
  jobs: [],
  staff: [],
  departments: [],
  reports: {},
  isLoggedIn: false,
  isViewOnly: false,
  activeRejiOperator: "Levent AKYAYLA",
  adminPassword: "basin68",
  currentFilter: {
    search: '',
    dateMode: 'all',
    customDate: '',
    status: 'all',
    urgency: 'all',
    employer: 'all',
    staff: 'all'
  },
  currentView: 'table',
  editingJobId: null,
  currentJobStaff: [],
  currentJobShootingCrew: [],
  currentJobEditors: [],
  currentJobNewsStaff: [],
  currentJobSpikers: [],
  isApiMode: false
};

// Başlangıç Verileri (Soyisimleri Büyük)
const initialData = {
  adminPassword: "basin68",
  departments: [
    "Hasan Hüseyin AKSAY (Müdür)",
    "Bahtiyar BAKAR (Müdür)"
  ],
  staff: [
    // Haber Birimi
    { id: "stf-1", name: "Serdar YALÇINKAYA", unit: "Haber", active: true },
    { id: "stf-2", name: "Bayram SATILMIŞ", unit: "Haber", active: true },
    { id: "stf-3", name: "Hasan TEVATIR", unit: "Haber", active: true },
    // Sosyal Medya Ekibi
    { id: "stf-4", name: "Rabia ÖZKAYA", unit: "Sosyal Medya", active: true },
    { id: "stf-5", name: "Muharrem SELÇUK", unit: "Sosyal Medya", active: true },
    { id: "stf-6", name: "Tamer Efe ÇAR", unit: "Sosyal Medya", active: true },
    // Reji Ekibi
    { id: "stf-7", name: "Levent AKYAYLA", unit: "Reji", active: true },
    { id: "stf-8", name: "Ahmet Can UYAR", unit: "Reji", active: true },
    { id: "stf-9", name: "Serhat IŞIKTAN", unit: "Reji", active: true },
    // Çekim Ekibi
    { id: "stf-10", name: "Doğanay PARMAKSIZ", unit: "Çekim", active: true },
    { id: "stf-11", name: "Asude ÖZTÜRK", unit: "Çekim", active: true },
    { id: "stf-12", name: "Oktay İNCE", unit: "Çekim", active: true },
    { id: "stf-13", name: "Kamilla", unit: "Çekim", active: true },
    { id: "stf-14", name: "Emirhan ÜNAL", unit: "Çekim", active: true },
    // Spikerler
    { id: "stf-15", name: "Büşra Seda BOYAR", unit: "Spikerler", active: true },
    { id: "stf-16", name: "Şirin ERDOĞAN", unit: "Spikerler", active: true },
    { id: "stf-17", name: "Tolga YALÇINKAYA", unit: "Spikerler", active: true }
  ],
  jobs: [
    {
      id: "job-101",
      title: "Millet Bahçesi Fidan Dikim Töreni ve Başkan Röportajı",
      employer: "Hasan Hüseyin Aksay (Müdür)",
      rejiStaff: "Levent AKYAYLA",
      category: "Haber & Video",
      location: "Aksaray Millet Bahçesi",
      shootingCrew: [
        "Doğanay Parmaksız",
        "Hasan Tevatır",
        "Emirhan Ünal"
      ],
      assignedStaff: [
        { id: "stf-1", name: "Serdar Yalçınkaya", role: "Haber" },
        { id: "stf-7", name: "Levent AKYAYLA", role: "Reji" },
        { id: "stf-4", name: "Rabia Özkaya", role: "Sosyal Medya" }
      ],
      timeRequested: "09:30",
      timeDeparted: "09:55",
      timeFootageDelivered: "12:15",
      timeEditDelivered: "14:30",
      timeRevision: "15:00",
      timeOutput: "15:45",
      urgency: "Yüksek",
      status: "Teslim Edildi",
      date: getTodayString(),
      notes: "Hasan Hüseyin Aksay Müdürümüzün koordinasyonunda çekim tamamlandı ve yayınlandı.",
      createdAt: new Date().toISOString()
    },
    {
      id: "job-102",
      title: "Somuncu Baba Külliyesi Çevre Düzenlemesi Sahası Takip ve Röportaj",
      employer: "Bahtiyar Bakar (Müdür)",
      rejiStaff: "Ahmet Can Uyar",
      category: "Saha Haberi",
      location: "Somuncu Baba Külliyesi",
      shootingCrew: [
        "Oktay İnce",
        "Asude Öztürk",
        "Rabia Özkaya"
      ],
      assignedStaff: [
        { id: "stf-2", name: "Bayram Satılmış", role: "Haber Metni" },
        { id: "stf-8", name: "Ahmet Can Uyar", role: "Reji Montaj" },
        { id: "stf-5", name: "Muharrem Selçuk", role: "Sosyal Medya" }
      ],
      timeRequested: "11:00",
      timeDeparted: "11:20",
      timeFootageDelivered: "13:45",
      timeEditDelivered: "",
      timeRevision: "",
      timeOutput: "",
      urgency: "Orta",
      status: "Kurguda",
      date: getTodayString(),
      notes: "Bahtiyar Bakar Müdürümüzün talimatıyla çekildi, montaj sürüyor.",
      createdAt: new Date().toISOString()
    },
    {
      id: "job-103",
      title: "Aksaray Bilim Merkezi Gençlik Çalıştayı Çekimleri ve Canlı Yayın",
      employer: "Hasan Hüseyin Aksay (Müdür)",
      rejiStaff: "Serhat Işıktan",
      category: "Canlı Yayın & Çekim",
      location: "Aksaray Bilim Merkezi",
      shootingCrew: [
        "Kamilla",
        "Doğanay Parmaksız",
        "Tamer Efe Çar"
      ],
      assignedStaff: [
        { id: "stf-9", name: "Serhat Işıktan", role: "Reji" },
        { id: "stf-6", name: "Tamer Efe Çar", role: "Sosyal Medya" },
        { id: "stf-1", name: "Serdar Yalçınkaya", role: "Haber" }
      ],
      timeRequested: "14:00",
      timeDeparted: "14:15",
      timeFootageDelivered: "",
      timeEditDelivered: "",
      timeRevision: "",
      timeOutput: "",
      urgency: "Normal",
      status: "Sahada",
      date: getTodayString(),
      notes: "Reji: Serhat Işıktan saatleri girdi.",
      createdAt: new Date().toISOString()
    }
  ],
  reports: {
    [getTodayString()]: {
      date: getTodayString(),
      summaryNote: "Bugün Hasan Hüseyin Aksay ve Bahtiyar Bakar müdürlerimizin koordinasyonunda Reji ekibimiz tüm saha çekimlerini ve yayın saatlerini takip etmiştir.",
      pendingNote: "Somuncu Baba sahasının kurgusu yarın sabah teslim edilecektir.",
      issuesNote: "Tüm ekipmanlar eksiksiz ve çalışır vaziyettedir.",
      preparedBy: "Reji Koordinasyonu",
      updatedAt: new Date().toISOString()
    }
  }
};

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getNowTimeString() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ----------------------------------------------------
// BAŞLATMA
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  await loadInitialState();
  initDropdowns();
  checkInitialLoginState();
  renderApp();
  if (window.lucide) lucide.createIcons();

  // Arka planda sunucu ile otomatik senkronizasyon (Canlı Reji Takibi)
  setInterval(async () => {
    if (appState.isApiMode && !appState.editingJobId) {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && JSON.stringify(data.jobs.map(j => j.id + j.status + j.timeOutput)) !== JSON.stringify(appState.jobs.map(j => j.id + j.status + j.timeOutput))) {
            appState.jobs = data.jobs;
            renderApp();
          }
        }
      } catch (e) {}
    }
  }, 6000);
});

function startClock() {
  const timeEl = document.getElementById('liveTime');
  const dateEl = document.getElementById('liveDate');
  function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
    if (timeEl) timeEl.textContent = timeStr;
    if (dateEl) dateEl.textContent = dateStr;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// ----------------------------------------------------
// REJİ GİRİŞ EKRANI KONTROLLERİ (KALICI OTURUM)
// ----------------------------------------------------
function checkInitialLoginState() {
  // Kalıcı oturum kontrolü: localStorage veya sessionStorage'dan oku
  // Böylece tarayıcı kapansa veya diğer bilgisayardan girilse dahi çıkış yapılmaz!
  const localAuth = localStorage.getItem('aksaray_reji_auth');
  const sessionAuth = sessionStorage.getItem('aksaray_reji_auth');
  const auth = localAuth || sessionAuth;

  const savedReji = localStorage.getItem('aksaray_reji_user') || sessionStorage.getItem('aksaray_reji_user');

  if (auth === 'true' || auth === 'admin') {
    appState.isLoggedIn = true;
    appState.isViewOnly = false;
    if (savedReji) appState.activeRejiOperator = savedReji;
    showAppScreen();
  } else if (auth === 'view') {
    appState.isLoggedIn = false;
    appState.isViewOnly = true;
    showAppScreen();
  } else {
    // İlk açılışta doğrudan Reji Giriş Ekranı gösterilir
    showLoginScreen();
  }
}

function showLoginScreen() {
  const loginScreen = document.getElementById('rejiLoginScreen');
  const mainApp = document.getElementById('mainAppWrapper');
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (mainApp) mainApp.classList.add('hidden');
}

function showAppScreen() {
  const loginScreen = document.getElementById('rejiLoginScreen');
  const mainApp = document.getElementById('mainAppWrapper');
  if (loginScreen) loginScreen.classList.add('hidden');
  if (mainApp) mainApp.classList.remove('hidden');

  const btnNewJob = document.getElementById('btnHeaderNewJob');
  const btnAddPerson = document.getElementById('btnHeaderAddPerson');
  const btnAdmin = document.getElementById('btnHeaderAdmin');
  const bannerViewOnly = document.getElementById('viewOnlyAlertBanner');
  const btnEmptyNewJob = document.getElementById('btnEmptyNewJob');

  if (appState.isViewOnly) {
    if (btnNewJob) btnNewJob.classList.add('hidden');
    if (btnAddPerson) btnAddPerson.classList.add('hidden');
    if (btnAdmin) btnAdmin.classList.add('hidden');
    if (bannerViewOnly) bannerViewOnly.classList.remove('hidden');
    if (btnEmptyNewJob) btnEmptyNewJob.classList.add('hidden');

    const headerReji = document.getElementById('headerActiveRejiName');
    if (headerReji) {
      const parentDiv = headerReji.closest('div');
      if (parentDiv) {
        parentDiv.className = "bg-slate-800/90 border border-slate-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-slate-300";
        parentDiv.innerHTML = `<i data-lucide="eye" class="w-3.5 h-3.5 text-amber-400"></i><span>Personel / <b class="text-amber-300">İzleme Modu</b></span>`;
      }
    }
  } else {
    if (btnNewJob) btnNewJob.classList.remove('hidden');
    if (btnAddPerson) btnAddPerson.classList.remove('hidden');
    if (btnAdmin) btnAdmin.classList.remove('hidden');
    if (bannerViewOnly) bannerViewOnly.classList.add('hidden');
    if (btnEmptyNewJob) btnEmptyNewJob.classList.remove('hidden');

    const headerReji = document.getElementById('headerActiveRejiName');
    if (headerReji) {
      const parentDiv = headerReji.closest('div');
      if (parentDiv) {
        if (appState.activeRejiOperator.includes('Müdür') || appState.activeRejiOperator.includes('Bahtiyar')) {
          parentDiv.className = "bg-amber-950/70 border border-amber-400/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-amber-200 shadow-sm";
          parentDiv.innerHTML = `<i data-lucide="crown" class="w-3.5 h-3.5 text-amber-400"></i><span>Müdür: <b id="headerActiveRejiName" class="text-white">${escapeHtml(appState.activeRejiOperator)}</b></span>`;
        } else {
          parentDiv.className = "bg-indigo-950/60 border border-indigo-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-indigo-200 shadow-sm";
          parentDiv.innerHTML = `<i data-lucide="sliders" class="w-3.5 h-3.5 text-indigo-400"></i><span>Reji: <b id="headerActiveRejiName" class="text-white">${escapeHtml(appState.activeRejiOperator)}</b></span>`;
        }
      }
    }
  }

  const phoneBadge = document.getElementById('phoneConnectPassBadge');
  if (phoneBadge) phoneBadge.textContent = appState.adminPassword || "basin68";

  if (window.lucide) lucide.createIcons();
}

function selectLoginRejiName(name) {
  name = formatSurnameUpper(name);
  if (name.includes('Ahmetcan') || name.includes('AHMETCAN')) name = 'Ahmet Can UYAR';
  document.getElementById('loginRejiNameInput').value = name;
  appState.activeRejiOperator = name;

  const btnBahtiyar = document.getElementById('loginPill-Bahtiyar');
  const btnHasan = document.getElementById('loginPill-HasanHuseyin');
  const btnLevent = document.getElementById('loginPill-Levent');
  const btnAhmet = document.getElementById('loginPill-Ahmetcan');
  const btnSerhat = document.getElementById('loginPill-Serhat');

  const isBahtiyar = name.includes('Bahtiyar');
  const isHasan = name.includes('Hasan');
  const isLevent = name.includes('Levent');
  const isAhmet = name.includes('Ahmet');
  const isSerhat = name.includes('Serhat');

  if (btnBahtiyar) {
    btnBahtiyar.className = isBahtiyar 
      ? "py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-amber-600 text-white border-amber-700 shadow-md"
      : "py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-white text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm";
    const icon = btnBahtiyar.querySelector('svg, i');
    if (icon) icon.className = isBahtiyar ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5 text-amber-600";
  }

  if (btnHasan) {
    btnHasan.className = isHasan 
      ? "py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-amber-600 text-white border-amber-700 shadow-md"
      : "py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
    const icon = btnHasan.querySelector('svg, i');
    if (icon) icon.className = isHasan ? "w-3.5 h-3.5 text-white" : "w-3.5 h-3.5 text-slate-400";
  }

  if (btnLevent) {
    btnLevent.className = isLevent
      ? "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
  }

  if (btnAhmet) {
    btnAhmet.className = isAhmet
      ? "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
  }

  if (btnSerhat) {
    btnSerhat.className = isSerhat
      ? "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2.5 px-1 text-center rounded-xl border text-xs font-bold transition bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
  }

  if (window.lucide) lucide.createIcons();
}

async function handleInitialRejiLogin(e) {
  e.preventDefault();
  const pass = (document.getElementById('loginPasswordInput').value || '').trim();
  const rejiName = document.getElementById('loginRejiNameInput').value || 'Levent AKYAYLA';
  const errorMsg = document.getElementById('loginScreenErrorMsg');

  if (!pass) return;

  const normalizePass = (s) => (s || '').replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/\./g, '').toLowerCase().trim();

  try {
    if (appState.isApiMode) {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        errorMsg.textContent = data.message || "Hatalı şifre! (Standart şifre: basin68)";
        errorMsg.classList.remove('hidden');
        return;
      }
    } else {
      const storedPass = localStorage.getItem('aksaray_admin_pass') || appState.adminPassword || "basin68";
      const cleanInput = normalizePass(pass);
      const cleanStored = normalizePass(storedPass);
      if (cleanInput !== cleanStored && cleanInput !== "basin68") {
        errorMsg.textContent = "Hatalı şifre! (Standart şifre: basin68)";
        errorMsg.classList.remove('hidden');
        return;
      }
    }

    appState.isLoggedIn = true;
    appState.isViewOnly = false;
    appState.activeRejiOperator = rejiName;

    // KALICI OTURUM: localStorage'a kaydedilir, tarayıcı veya bilgisayar kapansa bile ÇIKIŞ YAPILMAZ!
    localStorage.setItem('aksaray_reji_auth', 'true');
    localStorage.setItem('aksaray_reji_user', rejiName);
    sessionStorage.setItem('aksaray_reji_auth', 'true');
    sessionStorage.setItem('aksaray_reji_user', rejiName);

    errorMsg.classList.add('hidden');
    showAppScreen();
    renderApp();
  } catch (err) {
    errorMsg.textContent = "Giriş hatası: " + err.message;
    errorMsg.classList.remove('hidden');
  }
}

function enterViewOnlyMode() {
  appState.isLoggedIn = false;
  appState.isViewOnly = true;

  // İzleme modu da kalıcı olarak kaydedilir, çıkış yapılmaz
  localStorage.setItem('aksaray_reji_auth', 'view');
  sessionStorage.setItem('aksaray_reji_auth', 'view');
  showAppScreen();
  renderApp();
}

function logoutToLoginScreen() {
  if (appState.isLoggedIn && !appState.isViewOnly) {
    if (!confirm("Reji / Müdürlük oturumunu kapatmak istediğinize emin misiniz?\n\n(Çıkış yaparsanız tekrar şifre girmeniz gerekecektir.)")) return;
  }
  appState.isLoggedIn = false;
  appState.isViewOnly = false;
  sessionStorage.removeItem('aksaray_reji_auth');
  sessionStorage.removeItem('aksaray_reji_user');
  localStorage.removeItem('aksaray_reji_auth');
  localStorage.removeItem('aksaray_reji_user');
  showLoginScreen();
}

// ----------------------------------------------------
// VERİ ÇEKME & SAKLAMA
// ----------------------------------------------------
async function loadInitialState() {
  try {
    const response = await fetch('/api/data', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      appState.jobs = (data.jobs && data.jobs.length > 0) ? data.jobs : initialData.jobs;
      appState.staff = (data.staff && data.staff.length > 0) ? data.staff : initialData.staff;
      appState.departments = data.departments || initialData.departments;
      appState.reports = data.reports || initialData.reports;
      appState.isApiMode = true;
      return;
    }
  } catch (e) {
    console.log("Sunucu API bulunamadı, LocalStorage kullanılıyor.");
  }

  const stored = localStorage.getItem('aksaray_is_takip_state');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      appState.jobs = data.jobs || initialData.jobs;
      appState.staff = data.staff || initialData.staff;
      appState.departments = data.departments || initialData.departments;
      appState.reports = data.reports || initialData.reports;
    } catch (err) {
      useDefaultData();
    }
  } else {
    useDefaultData();
  }

  // Spikerler ekibinin listede yer aldığından emin ol
  const ensureSpikers = [
    { id: "stf-15", name: "Büşra Seda Boyar", unit: "Spikerler", active: true },
    { id: "stf-16", name: "Şirin Erdoğan", unit: "Spikerler", active: true }
  ];
  ensureSpikers.forEach(sp => {
    if (!appState.staff.some(s => s.name === sp.name)) {
      appState.staff.push(sp);
    }
  });
}

function useDefaultData() {
  appState.jobs = JSON.parse(JSON.stringify(initialData.jobs));
  appState.staff = JSON.parse(JSON.stringify(initialData.staff));
  appState.departments = JSON.parse(JSON.stringify(initialData.departments));
  appState.reports = JSON.parse(JSON.stringify(initialData.reports));
  persistState();
}

async function persistState() {
  const fullData = {
    jobs: appState.jobs,
    staff: appState.staff,
    departments: appState.departments,
    reports: appState.reports
  };
  localStorage.setItem('aksaray_is_takip_state', JSON.stringify(fullData));
}

// Dropdown Doldurma (Sade İsimler ve Sadece 2 İş Veren Müdür)
function initDropdowns() {
  const filterEmployer = document.getElementById('filterEmployer');
  const jobEmployerSelect = document.getElementById('jobEmployerSelect');

  const employerList = [
    "Hasan Hüseyin Aksay (Müdür)",
    "Bahtiyar Bakar (Müdür)"
  ];

  if (filterEmployer) {
    filterEmployer.innerHTML = '<option value="all">Tüm Müdürler (Hepsi)</option>' + 
      employerList.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  if (jobEmployerSelect) {
    jobEmployerSelect.innerHTML = employerList.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  updateStaffSelectDropdowns();
}

function updateStaffSelectDropdowns() {
  const filterStaff = document.getElementById('filterStaff');
  const staffPickerSelect = document.getElementById('staffPickerSelect');

  if (filterStaff) {
    let html = '<option value="all">Tüm Personel</option>';
    appState.staff.forEach(s => {
      html += `<option value="${s.name}">${s.name}</option>`;
    });
    filterStaff.innerHTML = html;
  }

  if (staffPickerSelect) {
    let html = '<option value="">-- Personel Seçiniz --</option>';
    appState.staff.filter(s => s.active).forEach(s => {
      html += `<option value="${s.id}" data-name="${s.name}">${s.name}</option>`;
    });
    staffPickerSelect.innerHTML = html;
  }
}

// ----------------------------------------------------
// PERSONEL VE GÖREV YARDIMCILARI (SOYİSİMLERİ BÜYÜK)
// ----------------------------------------------------
const ALLOWED_EDITORS = ["Levent AKYAYLA", "Ahmet Can UYAR", "Serhat IŞIKTAN"];
const ALLOWED_NEWS_STAFF = ["Serdar YALÇINKAYA", "Bayram SATILMIŞ", "Hasan TEVATIR", "Rabia ÖZKAYA", "Muharrem SELÇUK", "Tamer Efe ÇAR"];

function getJobEditorStaff(job) {
  if (Array.isArray(job.editorStaff) && job.editorStaff.length > 0) {
    return job.editorStaff.map(n => formatSurnameUpper(n === 'Ahmetcan Uyar' ? 'Ahmet Can UYAR' : n));
  }
  const editors = [];
  const rejiNorm = formatSurnameUpper(job.rejiStaff === 'Ahmetcan Uyar' ? 'Ahmet Can UYAR' : job.rejiStaff);
  if (rejiNorm && ALLOWED_EDITORS.includes(rejiNorm) && !editors.includes(rejiNorm)) {
    editors.push(rejiNorm);
  }
  if (Array.isArray(job.assignedStaff)) {
    job.assignedStaff.forEach(s => {
      const rawName = typeof s === 'string' ? s : s.name;
      const sName = formatSurnameUpper(rawName === 'Ahmetcan Uyar' ? 'Ahmet Can UYAR' : rawName);
      if (ALLOWED_EDITORS.includes(sName) && !editors.includes(sName)) {
        editors.push(sName);
      }
    });
  }
  return editors;
}

function getJobNewsStaff(job) {
  if (Array.isArray(job.newsStaff) && job.newsStaff.length > 0) {
    return job.newsStaff.map(formatSurnameUpper);
  }
  const news = [];
  if (Array.isArray(job.assignedStaff)) {
    job.assignedStaff.forEach(s => {
      const rawName = typeof s === 'string' ? s : s.name;
      const sName = formatSurnameUpper(rawName);
      if (ALLOWED_NEWS_STAFF.includes(sName) && !news.includes(sName)) {
        news.push(sName);
      }
    });
  }
  return news;
}

// Spikerler: Büşra Seda BOYAR, Şirin ERDOĞAN, Tolga YALÇINKAYA
const ALLOWED_SPIKERS = ["Büşra Seda BOYAR", "Şirin ERDOĞAN", "Tolga YALÇINKAYA"];

function getSpikerList() {
  const list = [...ALLOWED_SPIKERS];
  if (Array.isArray(appState.staff)) {
    appState.staff.forEach(s => {
      if (s.active !== false && (s.unit === 'Spikerler' || (s.role && s.role.toLowerCase().includes('spiker')))) {
        const formatted = formatSurnameUpper(s.name);
        if (!list.includes(formatted)) {
          list.push(formatted);
        }
      }
    });
  }
  return list;
}

function getJobSpikers(job) {
  if (Array.isArray(job.spikerStaff) && job.spikerStaff.length > 0) {
    return job.spikerStaff.map(formatSurnameUpper);
  }
  const spikers = [];
  const spikerList = getSpikerList();
  if (Array.isArray(job.assignedStaff)) {
    job.assignedStaff.forEach(s => {
      const sName = formatSurnameUpper(typeof s === 'string' ? s : s.name);
      if (spikerList.includes(sName) && !spikers.includes(sName)) {
        spikers.push(sName);
      }
    });
  }
  return spikers;
}

// ----------------------------------------------------
// FİLTRELEME & GÖRÜNÜM
// ----------------------------------------------------
function getFilteredJobs() {
  const { search, dateMode, customDate, status, urgency, employer, staff } = appState.currentFilter;
  const today = getTodayString();

  return appState.jobs.filter(job => {
    if (search) {
      const term = search.toLowerCase();
      const inTitle = (job.title || '').toLowerCase().includes(term);
      const inEmployer = (job.employer || '').toLowerCase().includes(term);
      const inReji = (job.rejiStaff || '').toLowerCase().includes(term);
      const inNotes = (job.notes || '').toLowerCase().includes(term);
      const inLocation = (job.location || '').toLowerCase().includes(term);
      const inShooting = (job.shootingCrew || []).some(name => name.toLowerCase().includes(term));
      const inEditors = getJobEditorStaff(job).some(name => name.toLowerCase().includes(term));
      const inNews = getJobNewsStaff(job).some(name => name.toLowerCase().includes(term));
      const inSpikers = getJobSpikers(job).some(name => name.toLowerCase().includes(term));
      const inAssigned = (job.assignedStaff || []).some(s => s.name.toLowerCase().includes(term));
      if (!inTitle && !inEmployer && !inReji && !inNotes && !inLocation && !inShooting && !inEditors && !inNews && !inSpikers && !inAssigned) return false;
    }

    if (dateMode === 'today' && job.date !== today) return false;
    if (dateMode === 'custom' && customDate && job.date !== customDate) return false;
    if (status !== 'all' && job.status !== status) return false;
    if (urgency !== 'all' && job.urgency !== urgency) return false;

    // Sadece Hasan Hüseyin Aksay ve Bahtiyar Bakar kontrolü (Unvanlı veya unvansız eşleşir)
    if (employer !== 'all') {
      const filterClean = employer.replace(/\s*\(Müdür\)/gi, '').trim().toLowerCase();
      const jobClean = (job.employer || '').replace(/\s*\(Müdür\)/gi, '').trim().toLowerCase();
      if (!jobClean.includes(filterClean) && !filterClean.includes(jobClean)) return false;
    }

    if (staff !== 'all') {
      const inShooting = (job.shootingCrew || []).includes(staff);
      const inEditors = getJobEditorStaff(job).includes(staff);
      const inNews = getJobNewsStaff(job).includes(staff);
      const inSpikers = getJobSpikers(job).includes(staff);
      const inAssigned = (job.assignedStaff || []).some(s => s.name === staff || s.id === staff);
      const isReji = (job.rejiStaff === staff);
      if (!inShooting && !inEditors && !inNews && !inSpikers && !inAssigned && !isReji) return false;
    }

    return true;
  });
}

function applyFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterDateSelect = document.getElementById('filterDateSelect');
  const filterCustomDate = document.getElementById('filterCustomDate');
  const filterStatus = document.getElementById('filterStatus');
  const filterUrgency = document.getElementById('filterUrgency');
  const filterEmployer = document.getElementById('filterEmployer');
  const filterStaff = document.getElementById('filterStaff');

  if (filterDateSelect && filterDateSelect.value === 'custom') {
    if (filterCustomDate) filterCustomDate.classList.remove('hidden');
  } else {
    if (filterCustomDate) filterCustomDate.classList.add('hidden');
  }

  appState.currentFilter = {
    search: searchInput ? searchInput.value.trim() : '',
    dateMode: filterDateSelect ? filterDateSelect.value : 'all',
    customDate: filterCustomDate ? filterCustomDate.value : '',
    status: filterStatus ? filterStatus.value : 'all',
    urgency: filterUrgency ? filterUrgency.value : 'all',
    employer: filterEmployer ? filterEmployer.value : 'all',
    staff: filterStaff ? filterStaff.value : 'all'
  };

  renderApp();
}

function resetFiltersSilently() {
  const searchInput = document.getElementById('searchInput');
  const filterDateSelect = document.getElementById('filterDateSelect');
  const filterCustomDate = document.getElementById('filterCustomDate');
  const filterStatus = document.getElementById('filterStatus');
  const filterUrgency = document.getElementById('filterUrgency');
  const filterEmployer = document.getElementById('filterEmployer');
  const filterStaff = document.getElementById('filterStaff');

  if (searchInput) searchInput.value = '';
  if (filterDateSelect) filterDateSelect.value = 'all';
  if (filterCustomDate) {
    filterCustomDate.value = '';
    filterCustomDate.classList.add('hidden');
  }
  if (filterStatus) filterStatus.value = 'all';
  if (filterUrgency) filterUrgency.value = 'all';
  if (filterEmployer) filterEmployer.value = 'all';
  if (filterStaff) filterStaff.value = 'all';

  appState.currentFilter = {
    search: '',
    dateMode: 'all',
    customDate: '',
    status: 'all',
    urgency: 'all',
    employer: 'all',
    staff: 'all'
  };
}

function resetFilters() {
  resetFiltersSilently();
  renderApp();
}

function switchView(viewName) {
  appState.currentView = viewName;
  const tableView = document.getElementById('tableView');
  const kanbanView = document.getElementById('kanbanView');
  const btnTable = document.getElementById('viewBtnTable');
  const btnKanban = document.getElementById('viewBtnKanban');

  if (viewName === 'table') {
    tableView.classList.remove('hidden');
    kanbanView.classList.add('hidden');
    btnTable.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-aksaray-800 shadow-sm";
    btnKanban.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5";
  } else {
    tableView.classList.add('hidden');
    kanbanView.classList.remove('hidden');
    btnKanban.className = "px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white text-aksaray-800 shadow-sm";
    btnTable.className = "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5";
  }
  renderApp();
}

function renderApp() {
  updateStats();
  if (appState.currentView === 'table') {
    renderTable();
  } else {
    renderKanban();
  }
  if (window.lucide) lucide.createIcons();
}

function updateStats() {
  const isTodayOnly = appState.currentFilter.dateMode === 'today';
  const today = getTodayString();
  const relevantJobs = isTodayOnly ? appState.jobs.filter(j => j.date === today) : appState.jobs;

  document.getElementById('statTotal').textContent = relevantJobs.length;
  document.getElementById('statField').textContent = relevantJobs.filter(j => j.status === 'Sahada').length;
  document.getElementById('statEditing').textContent = relevantJobs.filter(j => j.status === 'Kurguda' || j.status === 'Görüntü Teslim').length;
  document.getElementById('statRevision').textContent = relevantJobs.filter(j => j.status === 'Revizede').length;
  document.getElementById('statCompleted').textContent = relevantJobs.filter(j => j.status === 'Teslim Edildi').length;
  document.getElementById('statUrgent').textContent = relevantJobs.filter(j => j.urgency === 'Çok Acil' || j.urgency === 'Yüksek').length;
}

// ----------------------------------------------------
// TABLO GÖRÜNÜMÜ RENDER
// ----------------------------------------------------
function renderTable() {
  const tbody = document.getElementById('jobsTableBody');
  const emptyState = document.getElementById('emptyTableState');
  const filtered = getFilteredJobs();

  if (!filtered || filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  tbody.innerHTML = filtered.map((job, index) => {
    const urgencyBadge = getUrgencyBadgeHtml(job.urgency);
    const statusSelect = getStatusSelectHtml(job.id, job.status);

    // Çekim Ekibi (Unvansız Sade İsimler - Soyisim Büyük)
    const shootingBadges = (job.shootingCrew && job.shootingCrew.length > 0)
      ? job.shootingCrew.map(name => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
            <i data-lucide="video" class="w-3 h-3 text-indigo-600"></i>
            <span>${escapeHtml(formatSurnameUpper(name))}</span>
          </span>
        `).join('')
      : '<span class="text-xs text-slate-400 italic">Seçilmedi</span>';

    // Kurgu ve Montaj Ekibi (SADECE LEVENT, SERHAT, AHMETCAN)
    const editors = getJobEditorStaff(job);
    const editorBadges = editors.length > 0
      ? editors.map(name => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs">
            <i data-lucide="film" class="w-3 h-3 text-purple-600"></i>
            <span>${escapeHtml(formatSurnameUpper(name))}</span>
          </span>
        `).join('')
      : '<span class="text-xs text-slate-400 italic">Atanmadı</span>';

    // Haber Birimi & Sosyal Medya Ekibi
    const newsStaff = getJobNewsStaff(job);
    const newsBadges = newsStaff.length > 0
      ? newsStaff.map(name => `
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
            <i data-lucide="newspaper" class="w-3 h-3 text-emerald-600"></i>
            <span>${escapeHtml(formatSurnameUpper(name))}</span>
          </span>
        `).join('')
      : '<span class="text-xs text-slate-400 italic">Atanmadı</span>';

    // Spiker / Sunucu Ekibi
    const spikers = getJobSpikers(job);
    const spikerBadgesHtml = spikers.length > 0
      ? spikers.map(name => `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
            <i data-lucide="mic" class="w-3 h-3 text-rose-600"></i>
            <span>${escapeHtml(formatSurnameUpper(name))}</span>
          </span>
        `).join('')
      : '';

    // Saat Çizelgesi (SADE & NET - REJİ DAMGALA BUTONLARI KALDIRILDI)
    const canEditTime = !appState.isViewOnly;
    const timelineHtml = `
      <div class="flex flex-wrap items-center gap-1.5 text-[11px] font-mono ${canEditTime ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}" ${canEditTime ? `onclick="openQuickTimeModal('${job.id}')" title="Saatleri düzenlemek için tıklayınız"` : 'title="Saat Çizelgesi (İzleme Modu)"'}>
        <span class="px-2 py-1 rounded-lg bg-slate-100/90 text-slate-700 border border-slate-200 shadow-2xs" title="İşin İstendiği Saat">
          <span class="text-[9px] text-slate-400 block font-sans font-bold">İSTENDİ</span>
          <b>${job.timeRequested || '--:--'}</b>
        </span>
        <span class="text-slate-300 font-bold">&rarr;</span>
        <span class="px-2 py-1 rounded-lg bg-indigo-50/90 text-indigo-800 border border-indigo-200 shadow-2xs" title="Sahaya Çıkılan Saat">
          <span class="text-[9px] text-indigo-500 block font-sans font-bold">ÇIKIŞ</span>
          <b>${job.timeDeparted || '--:--'}</b>
        </span>
        <span class="text-slate-300 font-bold">&rarr;</span>
        <span class="px-2 py-1 rounded-lg bg-sky-50/90 text-sky-800 border border-sky-200 shadow-2xs" title="Görüntü Teslim Saati">
          <span class="text-[9px] text-sky-500 block font-sans font-bold">GÖRÜNTÜ</span>
          <b>${job.timeFootageDelivered || '--:--'}</b>
        </span>
        <span class="text-slate-300 font-bold">&rarr;</span>
        <span class="px-2 py-1 rounded-lg bg-amber-50/90 text-amber-800 border border-amber-200 shadow-2xs" title="Kurgu Teslim Saati">
          <span class="text-[9px] text-amber-500 block font-sans font-bold">KURGU</span>
          <b>${job.timeEditDelivered || '--:--'}</b>
        </span>
        <span class="text-slate-300 font-bold">&rarr;</span>
        <span class="px-2 py-1 rounded-lg bg-purple-50/90 text-purple-800 border border-purple-200 shadow-2xs" title="Revize Saati">
          <span class="text-[9px] text-purple-500 block font-sans font-bold">REVİZE</span>
          <b>${job.timeRevision || '--:--'}</b>
        </span>
        <span class="text-slate-300 font-bold">&rarr;</span>
        <span class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold shadow-2xs" title="Çıktı / Yayın Saati">
          <span class="text-[9px] text-emerald-600 block font-sans font-bold">ÇIKTI</span>
          <b>${job.timeOutput || '--:--'}</b>
        </span>
      </div>
    `;

    return `
      <tr id="jobRow-${job.id}" class="hover:bg-slate-50/90 transition border-b border-slate-100">
        <td class="py-3 px-3 text-center font-mono text-xs text-slate-400">${index + 1}</td>
        
        <!-- 1. İş Tanımı & Detay -->
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900 leading-snug">${escapeHtml(job.title)}</div>
          <div class="flex flex-wrap items-center gap-1.5 mt-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-aksaray-50 text-aksaray-700 border border-aksaray-200">
              ${escapeHtml(job.category || 'Haber')}
            </span>
            ${spikerBadgesHtml}
            ${job.location ? `
              <span class="text-[11px] text-slate-500 flex items-center gap-0.5">
                <i data-lucide="map-pin" class="w-3 h-3 text-slate-400"></i>
                ${escapeHtml(job.location)}
              </span>
            ` : ''}
          </div>
          ${job.notes ? `<div class="text-[11px] text-slate-500 mt-1 italic line-clamp-1">${escapeHtml(job.notes)}</div>` : ''}
        </td>

        <!-- 2. İŞ DURUMU (PLANLANIYOR, TESLİM EDİLDİ VB. - SAYFAYI KAYDIRMA GEREKTİRMEDEN HEMEN BAŞTA) -->
        <td class="py-3 px-3 text-center bg-amber-50/25 border-x border-amber-100/70">
          ${statusSelect}
        </td>

        <!-- 3. Aciliyet -->
        <td class="py-3 px-3 text-center">
          ${urgencyBadge}
        </td>

        <!-- 4. İş Veren Müdür & Reji Sorumlusu -->
        <td class="py-3 px-3">
          <div>
            <span class="inline-flex items-center gap-1 font-bold text-slate-900 text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-600"></i>
              <span>${escapeHtml(formatSurnameUpper(job.employer || 'Müdürlük'))}</span>
            </span>
          </div>
          <div class="mt-1 flex items-center gap-1 text-[11px] text-indigo-900 font-bold">
            <i data-lucide="sliders" class="w-3.5 h-3.5 text-indigo-600"></i>
            <span>Reji: ${escapeHtml(formatSurnameUpper(job.rejiStaff || 'Levent AKYAYLA'))}</span>
          </div>
          <div class="text-[10px] text-slate-400 mt-0.5">${formatDateTr(job.date)}</div>
        </td>

        <!-- 5. Çekim Ekibi (Kim Çekti?) -->
        <td class="py-3 px-3">
          <div class="flex flex-wrap gap-1 max-w-[160px]">
            ${shootingBadges}
          </div>
        </td>

        <!-- 6. Kurgu ve Montaj (SADECE LEVENT, SERHAT, AHMETCAN) -->
        <td class="py-3 px-3">
          <div class="flex flex-wrap gap-1 max-w-[150px]">
            ${editorBadges}
          </div>
        </td>

        <!-- 7. Haber Ekibi -->
        <td class="py-3 px-3">
          <div class="flex flex-wrap gap-1 max-w-[150px]">
            ${newsBadges}
          </div>
        </td>

        <!-- 8. Saat Çizelgesi (Sade ve Net) -->
        <td class="py-3 px-3">
          ${timelineHtml}
        </td>

        <!-- 9. İşlem -->
        <td class="py-3 px-3 text-right whitespace-nowrap">
          ${appState.isViewOnly ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs" title="İzleme Modu (Düzenlenemez)">
              <i data-lucide="lock" class="w-3 h-3 text-slate-400"></i>
              <span>İzleme</span>
            </span>
          ` : `
            <button onclick="handleEditJobClick('${job.id}')" class="p-1.5 text-slate-500 hover:text-aksaray-700 hover:bg-aksaray-50 rounded-lg transition" title="Düzenle">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteJobDirect('${job.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Sil">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

async function rejiQuickStamp(jobId, timeField, newStatus) {
  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda saat damgalanamaz.");
    return;
  }

  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  const nowTime = getNowTimeString();
  job[timeField] = nowTime;
  if (newStatus) job.status = newStatus;
  job.updatedAt = new Date().toISOString();

  await syncJobUpdate(job);
  renderApp();
}

// ----------------------------------------------------
// KANBAN GÖRÜNÜMÜ RENDER
// ----------------------------------------------------
function renderKanban() {
  const columns = {
    'Planlanıyor': document.getElementById('kanbanCol-Planlanıyor'),
    'Sahada': document.getElementById('kanbanCol-Sahada'),
    'Görüntü Teslim': document.getElementById('kanbanCol-Görüntü-Teslim'),
    'Kurguda': document.getElementById('kanbanCol-Kurguda'),
    'Revizede': document.getElementById('kanbanCol-Revizede'),
    'Teslim Edildi': document.getElementById('kanbanCol-Teslim-Edildi')
  };

  const countBadges = {
    'Planlanıyor': document.getElementById('colCount-planlanıyor'),
    'Sahada': document.getElementById('colCount-sahada'),
    'Görüntü Teslim': document.getElementById('colCount-goruntu'),
    'Kurguda': document.getElementById('colCount-kurguda'),
    'Revizede': document.getElementById('colCount-revizede'),
    'Teslim Edildi': document.getElementById('colCount-teslim')
  };

  Object.keys(columns).forEach(k => {
    if (columns[k]) columns[k].innerHTML = '';
    if (countBadges[k]) countBadges[k].textContent = '0';
  });

  const filtered = getFilteredJobs();
  const counts = { 'Planlanıyor': 0, 'Sahada': 0, 'Görüntü Teslim': 0, 'Kurguda': 0, 'Revizede': 0, 'Teslim Edildi': 0 };

  filtered.forEach(job => {
    const colKey = job.status || 'Planlanıyor';
    if (!columns[colKey]) return;

    counts[colKey] = (counts[colKey] || 0) + 1;

    const urgencyBadge = getUrgencyBadgeHtml(job.urgency);
    const shootingList = (job.shootingCrew || []).map(name => `
      <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
        <i data-lucide="video" class="w-2.5 h-2.5"></i> ${escapeHtml(formatSurnameUpper(name))}
      </span>
    `).join('');

    const card = document.createElement('div');
    if (appState.isViewOnly) {
      card.className = "bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2 cursor-default";
      card.title = "İzleme Modu (Düzenleme yetkisi Reji ve Müdürlüktedir)";
    } else {
      card.className = "bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-2 cursor-pointer";
      card.onclick = () => handleEditJobClick(job.id);
    }

    card.innerHTML = `
      <div class="flex items-start justify-between gap-1.5">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          ${escapeHtml(job.category || 'Haber')}
        </span>
        ${urgencyBadge}
      </div>

      <div>
        <h5 class="text-xs font-bold text-slate-900 leading-snug">${escapeHtml(job.title)}</h5>
        <p class="text-[11px] text-amber-800 font-bold mt-0.5 flex items-center gap-1">
          <i data-lucide="crown" class="w-3 h-3 text-amber-600"></i>
          <span>${escapeHtml(formatSurnameUpper(job.employer))}</span>
        </p>
        <span class="text-[10px] text-indigo-800 block mt-0.5 font-semibold">Reji: ${escapeHtml(formatSurnameUpper(job.rejiStaff || 'Levent AKYAYLA'))}</span>
      </div>

      <div class="space-y-1 text-[10px]">
        <div><span class="font-bold text-indigo-700">🎥 Çekim:</span> ${(job.shootingCrew || []).map(formatSurnameUpper).join(', ') || '<span class="italic text-slate-400">Belirtilmedi</span>'}</div>
        <div><span class="font-bold text-purple-700">🎬 Kurgu:</span> ${getJobEditorStaff(job).map(formatSurnameUpper).join(', ') || '<span class="italic text-slate-400">-</span>'}</div>
        <div><span class="font-bold text-emerald-700">📰 Haber:</span> ${getJobNewsStaff(job).map(formatSurnameUpper).join(', ') || '<span class="italic text-slate-400">-</span>'}</div>
        ${getJobSpikers(job).length > 0 ? `<div><span class="font-bold text-rose-700">🎙️ Spiker:</span> ${getJobSpikers(job).map(formatSurnameUpper).join(', ')}</div>` : ''}
      </div>

      <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-600">
        <div>🕒 İstendi: <b>${job.timeRequested || '--'}</b></div>
        ${job.timeOutput ? `<div class="text-emerald-700 font-bold">🚀 Çıktı: ${job.timeOutput}</div>` : ''}
      </div>
    `;

    columns[colKey].appendChild(card);
  });

  Object.keys(counts).forEach(key => {
    if (countBadges[key]) countBadges[key].textContent = counts[key];
  });
}

function getUrgencyBadgeHtml(urgency) {
  switch (urgency) {
    case 'Çok Acil':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-xs badge-pulse"><i data-lucide="flame" class="w-3 h-3"></i> ÇOK ACİL</span>`;
    case 'Yüksek':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">Yüksek</span>`;
    case 'Orta':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Orta</span>`;
    case 'Normal':
    default:
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Normal</span>`;
  }
}

function getStatusBadgeOnlyHtml(status) {
  switch (status) {
    case 'Planlanıyor':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">📋 Planlanıyor</span>`;
    case 'Sahada':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">🎥 Sahada</span>`;
    case 'Görüntü Teslim':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs">📥 Görüntü Teslim</span>`;
    case 'Kurguda':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">⚙️ Kurguda / Rejide</span>`;
    case 'Revizede':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">🔄 Revizede</span>`;
    case 'Teslim Edildi':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">✅ Teslim Edildi</span>`;
    default:
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">${escapeHtml(status || 'Planlanıyor')}</span>`;
  }
}

function getStatusSelectHtml(jobId, currentStatus) {
  if (appState.isViewOnly) {
    return getStatusBadgeOnlyHtml(currentStatus);
  }

  const statuses = [
    { value: "Planlanıyor", label: "📋 Planlanıyor", color: "text-slate-700" },
    { value: "Sahada", label: "🎥 Sahada", color: "text-indigo-700 font-bold" },
    { value: "Görüntü Teslim", label: "📥 Görüntü Teslim", color: "text-sky-700 font-bold" },
    { value: "Kurguda", label: "⚙️ Kurguda / Rejide", color: "text-amber-700 font-bold" },
    { value: "Revizede", label: "🔄 Revizede", color: "text-purple-700 font-bold" },
    { value: "Teslim Edildi", label: "✅ Teslim Edildi", color: "text-emerald-700 font-bold" }
  ];

  return `
    <select onchange="updateJobStatusDirect('${jobId}', this.value)" class="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-aksaray-600 cursor-pointer shadow-2xs">
      ${statuses.map(s => `
        <option value="${s.value}" ${s.value === currentStatus ? 'selected' : ''} class="${s.color}">
          ${s.label}
        </option>
      `).join('')}
    </select>
  `;
}

async function updateJobStatusDirect(jobId, newStatus) {
  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda iş durumu değiştirilemez. Lütfen Reji veya Müdürlük şifresi ile giriş yapınız.");
    return;
  }

  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  job.status = newStatus;
  job.updatedAt = new Date().toISOString();

  const nowTime = getNowTimeString();
  if (newStatus === 'Sahada' && !job.timeDeparted) job.timeDeparted = nowTime;
  if (newStatus === 'Görüntü Teslim' && !job.timeFootageDelivered) job.timeFootageDelivered = nowTime;
  if (newStatus === 'Teslim Edildi' && !job.timeOutput) job.timeOutput = nowTime;

  await syncJobUpdate(job);
  renderApp();
}

// ----------------------------------------------------
// İŞ EKLEME & DÜZENLEME (REJİ & MÜDÜR SEÇİCİ)
// ----------------------------------------------------
function handleEditJobClick(jobId) {
  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız.\nİş kaydını düzenleme yetkisi sadece Reji ve Müdürlüktedir.");
    return;
  }
  editJob(jobId);
}

function openNewJobModal() {
  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız.\nYeni iş ve çekim ekleme yetkisi sadece Reji ve Müdürlüktedir. Lütfen şifre ile giriş yapınız.");
    return;
  }

  appState.editingJobId = null;
  appState.currentJobStaff = [];
  appState.currentJobShootingCrew = [];

  let defaultEditor = "Levent AKYAYLA";
  if (ALLOWED_EDITORS.includes(appState.activeRejiOperator)) {
    defaultEditor = appState.activeRejiOperator;
  }
  appState.currentJobEditors = [defaultEditor];
  appState.currentJobNewsStaff = [];
  appState.currentJobSpikers = [];

  document.getElementById('modalJobTitle').textContent = "Reji Masası: Yeni İş, Çekim & Saat Girişi";
  document.getElementById('jobForm').reset();
  document.getElementById('jobEditId').value = "";
  document.getElementById('jobDateInput').value = getTodayString();
  document.getElementById('btnDeleteJob').classList.add('hidden');

  selectJobRejiPerson(defaultEditor);

  if (appState.activeRejiOperator === 'Bahtiyar Bakar (Müdür)') {
    selectJobEmployer('Bahtiyar Bakar (Müdür)');
  } else {
    selectJobEmployer("Hasan Hüseyin Aksay (Müdür)");
  }

  document.getElementById('timeRequestedInput').value = getNowTimeString();

  renderShootingCrewPills();
  renderEditorStaffPills();
  renderNewsStaffPills();
  renderSpikerStaffPills();

  document.getElementById('jobModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function editJob(jobId) {
  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız.\nİş kaydını düzenleme yetkisi sadece Reji ve Müdürlüktedir.");
    return;
  }

  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  appState.editingJobId = jobId;
  appState.currentJobShootingCrew = JSON.parse(JSON.stringify(job.shootingCrew || []));
  appState.currentJobEditors = JSON.parse(JSON.stringify(getJobEditorStaff(job)));
  appState.currentJobNewsStaff = JSON.parse(JSON.stringify(getJobNewsStaff(job)));
  appState.currentJobSpikers = JSON.parse(JSON.stringify(getJobSpikers(job)));

  document.getElementById('modalJobTitle').textContent = "Reji: İş ve Çekim Kaydını Düzenle";
  document.getElementById('jobEditId').value = job.id;
  document.getElementById('jobTitleInput').value = job.title || '';
  document.getElementById('jobCategoryInput').value = job.category || 'Haber & Video';
  document.getElementById('jobLocationInput').value = job.location || '';
  document.getElementById('jobDateInput').value = job.date || getTodayString();
  document.getElementById('jobNotesInput').value = job.notes || '';
  document.getElementById('jobStatusSelect').value = job.status || 'Planlanıyor';

  selectJobRejiPerson(job.rejiStaff || "Levent AKYAYLA");
  selectJobEmployer(job.employer || "Hasan Hüseyin Aksay (Müdür)");

  document.getElementById('timeRequestedInput').value = job.timeRequested || '';
  document.getElementById('timeDepartedInput').value = job.timeDeparted || '';
  document.getElementById('timeFootageDeliveredInput').value = job.timeFootageDelivered || '';
  document.getElementById('timeEditDeliveredInput').value = job.timeEditDelivered || '';
  document.getElementById('timeRevisionInput').value = job.timeRevision || '';
  document.getElementById('timeOutputInput').value = job.timeOutput || '';

  const radio = document.querySelector(`input[name="urgencyRadio"][value="${job.urgency}"]`);
  if (radio) radio.checked = true;

  document.getElementById('btnDeleteJob').classList.remove('hidden');

  renderShootingCrewPills();
  renderEditorStaffPills();
  renderNewsStaffPills();
  renderSpikerStaffPills();

  document.getElementById('jobModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeJobModal() {
  document.getElementById('jobModal').classList.add('hidden');
}

function selectJobRejiPerson(name) {
  name = formatSurnameUpper(name);
  if (name.includes('Ahmetcan') || name.includes('AHMETCAN')) name = 'Ahmet Can UYAR';
  document.getElementById('jobRejiStaffInput').value = name;

  const btnLevent = document.getElementById('btnJobReji-Levent');
  const btnAhmet = document.getElementById('btnJobReji-Ahmetcan');
  const btnSerhat = document.getElementById('btnJobReji-Serhat');

  const isLevent = name.includes('Levent') || name.includes('LEVENT');
  const isAhmet = name.includes('Ahmet') || name.includes('AHMET');
  const isSerhat = name.includes('Serhat') || name.includes('SERHAT');

  if (btnLevent) {
    btnLevent.className = isLevent
      ? "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
  }
  if (btnAhmet) {
    btnAhmet.className = isAhmet
      ? "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
  }
  if (btnSerhat) {
    btnSerhat.className = isSerhat
      ? "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-indigo-700 text-white border-indigo-800 shadow-sm"
      : "py-2 px-1 text-center rounded-xl border text-xs font-bold transition bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
  }
}

function selectJobEmployer(name) {
  name = formatSurnameUpper(name);
  const select = document.getElementById('jobEmployerSelect');
  if (select) {
    for (let opt of select.options) {
      if (opt.value === name || (name.includes('Hasan') && opt.value.includes('Hasan')) || (name.includes('Bahtiyar') && opt.value.includes('Bahtiyar'))) {
        select.value = opt.value;
        break;
      }
    }
  }

  const btnHasan = document.getElementById('btnEmp-Hasan');
  const btnBahtiyar = document.getElementById('btnEmp-Bahtiyar');

  if (btnHasan && btnBahtiyar) {
    const isHasan = name.includes('Hasan') || name.includes('HASAN');
    if (isHasan) {
      btnHasan.className = "p-2.5 text-left rounded-xl border text-xs font-bold transition flex items-center gap-2 bg-amber-600 text-white border-amber-700 shadow-sm";
      btnBahtiyar.className = "p-2.5 text-left rounded-xl border text-xs font-bold transition flex items-center gap-2 bg-white text-slate-700 border-amber-200 hover:bg-amber-50";
    } else {
      btnBahtiyar.className = "p-2.5 text-left rounded-xl border text-xs font-bold transition flex items-center gap-2 bg-amber-600 text-white border-amber-700 shadow-sm";
      btnHasan.className = "p-2.5 text-left rounded-xl border text-xs font-bold transition flex items-center gap-2 bg-white text-slate-700 border-amber-200 hover:bg-amber-50";
    }
  }
}

function stampNowToInput(inputId) {
  const el = document.getElementById(inputId);
  if (el) el.value = getNowTimeString();
}

// ----------------------------------------------------
// ÇEKİM EKİBİ ÇOKLU SEÇİMİ (UNVANSIZ SADE İSİMLER)
// Sosyal medyacılar da bu listededir!
// ----------------------------------------------------
function renderShootingCrewPills() {
  const container = document.getElementById('shootingCrewPillsContainer');
  const countSpan = document.getElementById('selectedShootingCount');
  if (!container) return;

  if (countSpan) countSpan.textContent = appState.currentJobShootingCrew.length;

  container.innerHTML = appState.staff.map(person => {
    const isSelected = appState.currentJobShootingCrew.includes(person.name);
    const activeClass = isSelected 
      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm font-bold' 
      : 'bg-white text-slate-800 border-slate-200 hover:bg-indigo-50 font-semibold';

    // SADE İSİM (Kameraman gibi ifadeler kaldırıldı)
    return `
      <button type="button" onclick="toggleShootingCrewPerson('${escapeHtml(person.name)}')" class="px-3 py-1.5 rounded-xl text-xs border transition flex items-center gap-1.5 ${activeClass}">
        <i data-lucide="${isSelected ? 'check-circle-2' : 'user'}" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}"></i>
        <span>${escapeHtml(person.name)}</span>
      </button>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleShootingCrewPerson(name) {
  const index = appState.currentJobShootingCrew.indexOf(name);
  if (index > -1) {
    appState.currentJobShootingCrew.splice(index, 1);
  } else {
    appState.currentJobShootingCrew.push(name);
  }
  renderShootingCrewPills();
}

// ----------------------------------------------------
// KURGU VE MONTAJ (SADECE 3 REJİ GÖREVLİSİ)
// Levent Akyayla, Serhat Işıktan, Ahmetcan Uyar
// ----------------------------------------------------
function renderEditorStaffPills() {
  const container = document.getElementById('editorStaffPillsContainer');
  const countSpan = document.getElementById('selectedEditorCount');
  if (!container) return;

  if (countSpan) countSpan.textContent = appState.currentJobEditors.length;

  container.innerHTML = ALLOWED_EDITORS.map(name => {
    const isSelected = appState.currentJobEditors.includes(name);
    const activeClass = isSelected 
      ? 'bg-purple-700 text-white border-purple-800 shadow-sm font-bold scale-[1.02]' 
      : 'bg-white text-slate-800 border-purple-200 hover:bg-purple-50 font-semibold';

    return `
      <button type="button" onclick="toggleEditorPerson('${escapeHtml(name)}')" class="px-3.5 py-2 rounded-xl text-xs border transition flex items-center gap-1.5 ${activeClass}">
        <i data-lucide="${isSelected ? 'check-circle-2' : 'film'}" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-600'}"></i>
        <span>${escapeHtml(name)}</span>
      </button>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleEditorPerson(name) {
  const index = appState.currentJobEditors.indexOf(name);
  if (index > -1) {
    appState.currentJobEditors.splice(index, 1);
  } else {
    appState.currentJobEditors.push(name);
  }
  renderEditorStaffPills();
}

// ----------------------------------------------------
// HABER BİRİMİ & SOSYAL MEDYA EKİBİ
// Serdar Yalçınkaya, Bayram Satılmış, Hasan Tevatır,
// Rabia Özkaya, Muharrem Selçuk, Tamer Efe Çar
// ----------------------------------------------------
function renderNewsStaffPills() {
  const container = document.getElementById('newsStaffPillsContainer');
  const countSpan = document.getElementById('selectedNewsCount');
  if (!container) return;

  if (countSpan) countSpan.textContent = appState.currentJobNewsStaff.length;

  container.innerHTML = ALLOWED_NEWS_STAFF.map(name => {
    const isSelected = appState.currentJobNewsStaff.includes(name);
    const activeClass = isSelected 
      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-bold scale-[1.02]' 
      : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-50 font-semibold';

    return `
      <button type="button" onclick="toggleNewsPerson('${escapeHtml(name)}')" class="px-3 py-1.5 rounded-xl text-xs border transition flex items-center gap-1.5 ${activeClass}">
        <i data-lucide="${isSelected ? 'check-circle-2' : 'newspaper'}" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}"></i>
        <span>${escapeHtml(name)}</span>
      </button>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleNewsPerson(name) {
  const index = appState.currentJobNewsStaff.indexOf(name);
  if (index > -1) {
    appState.currentJobNewsStaff.splice(index, 1);
  } else {
    appState.currentJobNewsStaff.push(name);
  }
  renderNewsStaffPills();
}

// ----------------------------------------------------
// SPİKER / SUNUCU EKİBİ
// Büşra Seda Boyar, Şirin Erdoğan, Tolga Yalçınkaya
// ----------------------------------------------------
function renderSpikerStaffPills() {
  const container = document.getElementById('spikerStaffPillsContainer');
  const countSpan = document.getElementById('selectedSpikerCount');
  if (!container) return;

  if (countSpan) countSpan.textContent = appState.currentJobSpikers.length;

  const spikers = getSpikerList();
  container.innerHTML = spikers.map(name => {
    const isSelected = appState.currentJobSpikers.includes(name);
    const activeClass = isSelected 
      ? 'bg-rose-700 text-white border-rose-800 shadow-sm font-bold scale-[1.02]' 
      : 'bg-white text-slate-800 border-rose-200 hover:bg-rose-50 font-semibold';

    return `
      <button type="button" onclick="toggleSpikerPerson('${escapeHtml(name)}')" class="px-3.5 py-2 rounded-xl text-xs border transition flex items-center gap-1.5 ${activeClass}">
        <i data-lucide="${isSelected ? 'check-circle-2' : 'mic'}" class="w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-600'}"></i>
        <span>${escapeHtml(name)}</span>
      </button>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleSpikerPerson(name) {
  const index = appState.currentJobSpikers.indexOf(name);
  if (index > -1) {
    appState.currentJobSpikers.splice(index, 1);
  } else {
    appState.currentJobSpikers.push(name);
  }
  renderSpikerStaffPills();
}

async function handleSaveJob(e) {
  e.preventDefault();

  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda iş kaydı eklenemez veya güncellenemez. Reji veya Müdürlük şifresi ile giriş yapınız.");
    return;
  }

  const title = document.getElementById('jobTitleInput').value.trim();
  const category = document.getElementById('jobCategoryInput').value;
  const employer = (document.getElementById('jobEmployerSelect') && document.getElementById('jobEmployerSelect').value) || "Hasan Hüseyin Aksay (Müdür)";
  const rejiStaff = document.getElementById('jobRejiStaffInput').value || appState.activeRejiOperator || "Levent AKYAYLA";
  const location = document.getElementById('jobLocationInput').value.trim();
  const date = (document.getElementById('jobDateInput') && document.getElementById('jobDateInput').value) || getTodayString();
  const notes = document.getElementById('jobNotesInput').value.trim();
  const status = document.getElementById('jobStatusSelect').value || 'Planlanıyor';

  const timeRequested = document.getElementById('timeRequestedInput').value;
  const timeDeparted = document.getElementById('timeDepartedInput').value;
  const timeFootageDelivered = document.getElementById('timeFootageDeliveredInput').value;
  const timeEditDelivered = document.getElementById('timeEditDeliveredInput').value;
  const timeRevision = document.getElementById('timeRevisionInput').value;
  const timeOutput = document.getElementById('timeOutputInput').value;

  const urgencyRadio = document.querySelector('input[name="urgencyRadio"]:checked');
  const urgency = urgencyRadio ? urgencyRadio.value : 'Normal';

  if (!title) {
    alert("Lütfen iş tanımını giriniz.");
    return;
  }

  const jobPayload = {
    title,
    category,
    employer,
    rejiStaff,
    location,
    date,
    notes,
    status,
    urgency,
    shootingCrew: [...appState.currentJobShootingCrew],
    editorStaff: [...appState.currentJobEditors],
    newsStaff: [...appState.currentJobNewsStaff],
    spikerStaff: [...appState.currentJobSpikers],
    assignedStaff: [
      ...appState.currentJobEditors.map(name => ({ name, role: 'Kurgu & Montaj' })),
      ...appState.currentJobNewsStaff.map(name => ({ name, role: 'Haber' })),
      ...appState.currentJobSpikers.map(name => ({ name, role: 'Spiker / Sunucu' }))
    ],
    timeRequested,
    timeDeparted,
    timeFootageDelivered,
    timeEditDelivered,
    timeRevision,
    timeOutput,
    updatedAt: new Date().toISOString()
  };

  let savedJobId = null;

  if (appState.editingJobId) {
    savedJobId = appState.editingJobId;
    const idx = appState.jobs.findIndex(j => j.id === appState.editingJobId);
    if (idx > -1) {
      appState.jobs[idx] = { ...appState.jobs[idx], ...jobPayload };
      await syncJobUpdate(appState.jobs[idx]);
    }
  } else {
    savedJobId = 'job-' + Date.now();
    const newJob = {
      id: savedJobId,
      createdAt: new Date().toISOString(),
      ...jobPayload
    };
    appState.jobs.unshift(newJob);
    await syncJobCreate(newJob);
  }

  closeJobModal();

  // KRİTİK: Yeni eklenen işin ekranda doğrudan ve anında görünmesi için:
  resetFiltersSilently();
  switchView('table');
  renderApp();

  showToastNotification(`✅ "${title}" başarıyla reji çizelgesine eklendi!`);
  highlightJobRow(savedJobId);
}

function highlightJobRow(jobId) {
  setTimeout(() => {
    const row = document.getElementById(`jobRow-${jobId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('bg-amber-100', 'ring-2', 'ring-amber-400');
      setTimeout(() => {
        row.classList.remove('bg-amber-100', 'ring-2', 'ring-amber-400');
      }, 3500);
    }
  }, 150);
}

function showToastNotification(message) {
  let toast = document.getElementById('globalToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToastNotification';
    toast.className = 'fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-2xl border border-emerald-500/50 flex items-center gap-2 transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i> <span>${escapeHtml(message)}</span>`;
  toast.style.display = 'flex';
  toast.style.opacity = '1';
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 300);
  }, 4000);
}

async function handleDeleteCurrentJob() {
  if (!appState.editingJobId) return;
  if (!confirm("Bu iş kaydını silmek istediğinize emin misiniz?")) return;

  await deleteJobDirect(appState.editingJobId);
  closeJobModal();
}

async function deleteJobDirect(jobId) {
  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda iş kaydı silinemez. Reji veya Müdürlük şifresi ile giriş yapınız.");
    return;
  }

  if (!confirm("İş kaydını silmek istediğinize emin misiniz?")) return;

  appState.jobs = appState.jobs.filter(j => j.id !== jobId);
  try {
    if (appState.isApiMode) {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    }
  } catch (err) {}
  await persistState();
  renderApp();
}

async function syncJobCreate(job) {
  try {
    if (appState.isApiMode) {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
    }
  } catch (e) {}
  await persistState();
}

async function syncJobUpdate(job) {
  try {
    if (appState.isApiMode) {
      await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
    }
  } catch (e) {}
  await persistState();
}

// ----------------------------------------------------
// HIZLI SAAT DÜZENLEME MODALI
// ----------------------------------------------------
function openQuickTimeModal(jobId) {
  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız.\nSaatleri düzenleme yetkisi sadece Reji ve Müdürlüktedir. Lütfen şifre ile giriş yapınız.");
    return;
  }

  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById('quickTimeJobId').value = job.id;
  document.getElementById('quickTimeJobTitle').textContent = `İş: ${job.title} (${job.employer})`;
  document.getElementById('qtTimeRequested').value = job.timeRequested || '';
  document.getElementById('qtTimeDeparted').value = job.timeDeparted || '';
  document.getElementById('qtTimeFootage').value = job.timeFootageDelivered || '';
  document.getElementById('qtTimeEdit').value = job.timeEditDelivered || '';
  document.getElementById('qtTimeRevision').value = job.timeRevision || '';
  document.getElementById('qtTimeOutput').value = job.timeOutput || '';

  document.getElementById('quickTimeModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeQuickTimeModal() {
  document.getElementById('quickTimeModal').classList.add('hidden');
}

async function saveQuickTimeModal() {
  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda saatler kaydedilemez.");
    return;
  }

  const jobId = document.getElementById('quickTimeJobId').value;
  const job = appState.jobs.find(j => j.id === jobId);
  if (!job) return;

  job.timeRequested = document.getElementById('qtTimeRequested').value;
  job.timeDeparted = document.getElementById('qtTimeDeparted').value;
  job.timeFootageDelivered = document.getElementById('qtTimeFootage').value;
  job.timeEditDelivered = document.getElementById('qtTimeEdit').value;
  job.timeRevision = document.getElementById('qtTimeRevision').value;
  job.timeOutput = document.getElementById('qtTimeOutput').value;

  if (job.timeOutput) job.status = 'Teslim Edildi';
  else if (job.timeRevision) job.status = 'Revizede';
  else if (job.timeEditDelivered) job.status = 'Kurguda';
  else if (job.timeFootageDelivered) job.status = 'Görüntü Teslim';
  else if (job.timeDeparted) job.status = 'Sahada';

  await syncJobUpdate(job);
  closeQuickTimeModal();
  renderApp();
}

// ----------------------------------------------------
// YÖNETİM & EKİP PANELİ (SADE İSİMLER)
// ----------------------------------------------------
function openAdminPanelModal() {
  if (appState.isViewOnly) {
    alert("⚠️ Yönetim & Ekip paneli sadece Reji ve Müdürlük yetkililerine açıktır. Lütfen şifre ile giriş yapınız.");
    return;
  }

  switchAdminTab('staff');
  renderSimpleStaffList();
  document.getElementById('adminPanelModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeAdminPanelModal() {
  document.getElementById('adminPanelModal').classList.add('hidden');
}

function switchAdminTab(tabName) {
  const tabBtnStaff = document.getElementById('adminTabBtnStaff');
  const tabBtnPassword = document.getElementById('adminTabBtnPassword');
  const tabBtnBackup = document.getElementById('adminTabBtnBackup');

  const contentStaff = document.getElementById('adminTabContentStaff');
  const contentPassword = document.getElementById('adminTabContentPassword');
  const contentBackup = document.getElementById('adminTabContentBackup');

  [contentStaff, contentPassword, contentBackup].forEach(el => el.classList.add('hidden'));
  [tabBtnStaff, tabBtnPassword, tabBtnBackup].forEach(el => {
    el.className = "pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-1.5";
  });

  if (tabName === 'staff') {
    contentStaff.classList.remove('hidden');
    tabBtnStaff.className = "pb-2.5 border-b-2 border-aksaray-700 text-aksaray-900 flex items-center gap-1.5";
    renderSimpleStaffList();
  } else if (tabName === 'password') {
    contentPassword.classList.remove('hidden');
    tabBtnPassword.className = "pb-2.5 border-b-2 border-aksaray-700 text-aksaray-900 flex items-center gap-1.5";
  } else if (tabName === 'backup') {
    contentBackup.classList.remove('hidden');
    tabBtnBackup.className = "pb-2.5 border-b-2 border-aksaray-700 text-aksaray-900 flex items-center gap-1.5";
  }

  if (window.lucide) lucide.createIcons();
}

function renderSimpleStaffList() {
  const container = document.getElementById('staffListContainer');
  if (!container) return;

  container.innerHTML = appState.staff.map(person => `
    <div class="p-2.5 px-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:bg-slate-50 transition">
      <div class="flex items-center space-x-2">
        <i data-lucide="user" class="w-4 h-4 text-slate-400"></i>
        <span class="font-bold text-slate-900">${escapeHtml(person.name)}</span>
      </div>
      <button onclick="handleDeleteStaff('${person.id}')" class="text-slate-400 hover:text-rose-600 p-1 rounded transition" title="Kaldır">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

async function handleAddNewStaffSimple() {
  const nameInput = document.getElementById('newStaffName');
  const name = nameInput.value.trim();

  if (!name) {
    alert("Lütfen personelin adını soyadını giriniz.");
    return;
  }

  const formattedName = formatSurnameUpper(name);

  const newStaff = {
    id: 'stf-' + Date.now(),
    name: formattedName,
    unit: 'Ekip',
    active: true
  };

  appState.staff.push(newStaff);

  try {
    if (appState.isApiMode) {
      await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
    }
  } catch (e) {}

  await persistState();
  nameInput.value = '';
  renderSimpleStaffList();
  renderAddPersonModalStaffList();
  initDropdowns();
  renderApp();
}

async function handleDeleteStaff(staffId) {
  if (!confirm("Bu personeli listeden çıkarmak istediğinize emin misiniz?")) return;

  appState.staff = appState.staff.filter(s => s.id !== staffId);

  try {
    if (appState.isApiMode) {
      await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
    }
  } catch (e) {}

  await persistState();
  renderSimpleStaffList();
  renderAddPersonModalStaffList();
  initDropdowns();
  renderApp();
}

// ----------------------------------------------------
// DOĞRUDAN KİŞİ / PERSONEL EKLEME MODALI FONKSİYONLARI
// ----------------------------------------------------
function openAddPersonModal() {
  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız.\nKişi ekleme yetkisi sadece Reji ve Müdürlüktedir. Lütfen şifre ile giriş yapınız.");
    return;
  }
  const modal = document.getElementById('addPersonModal');
  if (!modal) return;

  const nameInput = document.getElementById('newPersonFullName');
  const roleInput = document.getElementById('newPersonRole');
  const unitSelect = document.getElementById('newPersonUnit');

  if (nameInput) nameInput.value = '';
  if (roleInput) roleInput.value = '';
  if (unitSelect) unitSelect.value = 'Spikerler';

  renderAddPersonModalStaffList();
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    if (nameInput) nameInput.focus();
  }, 100);
}

function closeAddPersonModal() {
  const modal = document.getElementById('addPersonModal');
  if (modal) modal.classList.add('hidden');
}

function renderAddPersonModalStaffList() {
  const container = document.getElementById('addPersonModalStaffList');
  const countSpan = document.getElementById('addPersonModalStaffCount');
  if (!container) return;

  const staff = appState.staff || [];
  if (countSpan) countSpan.textContent = `${staff.length} Kişi Kayıtlı`;

  if (staff.length === 0) {
    container.innerHTML = '<div class="text-xs text-slate-400 text-center py-3">Henüz kayıtlı personel bulunmuyor.</div>';
    return;
  }

  // Sort by unit then name
  const sorted = [...staff].sort((a, b) => {
    const unitComp = (a.unit || '').localeCompare(b.unit || '', 'tr');
    if (unitComp !== 0) return unitComp;
    return (a.name || '').localeCompare(b.name || '', 'tr');
  });

  container.innerHTML = sorted.map(s => {
    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
    let icon = 'user';
    if (s.unit === 'Spikerler' || (s.role && s.role.toLowerCase().includes('spiker'))) {
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
      icon = 'mic';
    } else if (s.unit === 'Haber') {
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      icon = 'newspaper';
    } else if (s.unit === 'Sosyal Medya') {
      badgeColor = 'bg-sky-100 text-sky-800 border-sky-200';
      icon = 'share-2';
    } else if (s.unit === 'Reji') {
      badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
      icon = 'sliders';
    } else if (s.unit === 'Çekim') {
      badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
      icon = 'video';
    } else if (s.unit === 'Müdürlük') {
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
      icon = 'crown';
    }

    return `
      <div class="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200 transition">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="p-1 rounded-lg ${badgeColor} border text-xs shrink-0">
            <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
          </span>
          <div class="min-w-0">
            <span class="text-xs font-bold text-slate-800 block truncate">${escapeHtml(s.name)}</span>
            <span class="text-[10px] text-slate-500 block truncate font-medium">${escapeHtml(s.unit || 'Ekip')}${s.role && s.role !== s.unit ? ' • ' + escapeHtml(s.role) : ''}</span>
          </div>
        </div>
        <button type="button" onclick="handleDeleteStaffFromAddModal('${s.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0" title="Kişiyi Sil">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

async function handleDeleteStaffFromAddModal(staffId) {
  if (appState.isViewOnly) {
    alert("Yetkiniz bulunmamaktadır.");
    return;
  }
  const staffMember = (appState.staff || []).find(s => s.id === staffId);
  const name = staffMember ? staffMember.name : "Bu kişiyi";
  if (!confirm(`"${name}" isimli personeli listeden çıkarmak istediğinize emin misiniz?`)) return;

  appState.staff = (appState.staff || []).filter(s => s.id !== staffId);

  try {
    if (appState.isApiMode) {
      await fetch(`/api/staff/${staffId}`, { method: 'DELETE' });
    }
  } catch (e) {
    console.warn("Staff delete error:", e);
  }

  await persistState();
  initDropdowns();
  renderApp();
  renderSpikerStaffPills();
  renderShootingCrewPills();
  renderSimpleStaffList();
  renderAddPersonModalStaffList();
}

async function handleSaveNewPersonSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  if (appState.isViewOnly) {
    alert("⚠️ Personel İzleme Modundasınız. Kişi ekleme yetkisi sadece Reji ve Müdürlüktedir.");
    return;
  }

  const nameInput = document.getElementById('newPersonFullName');
  const unitSelect = document.getElementById('newPersonUnit');
  const roleInput = document.getElementById('newPersonRole');

  let rawName = nameInput ? nameInput.value.trim() : '';
  if (!rawName || rawName.length < 2) {
    alert("Lütfen geçerli bir ad ve soyad giriniz.");
    if (nameInput) nameInput.focus();
    return;
  }

  // Soyisimleri otomatik BÜYÜK yap
  const formattedName = formatSurnameUpper(rawName);
  const unit = unitSelect ? unitSelect.value : 'Spikerler';
  let role = roleInput ? roleInput.value.trim() : '';
  if (!role) {
    if (unit === 'Spikerler') role = 'Spiker / Sunucu';
    else if (unit === 'Çekim') role = 'Kamera / Kurgu';
    else if (unit === 'Haber') role = 'Muhabir / Editör';
    else if (unit === 'Sosyal Medya') role = 'Sosyal Medya';
    else if (unit === 'Reji') role = 'Reji Masası';
    else role = unit;
  }

  // Aynı isimde biri var mı kontrol et
  const existing = (appState.staff || []).find(s => s.name.toLowerCase() === formattedName.toLowerCase());
  if (existing) {
    alert(`"${formattedName}" isimli personel zaten listede kayıtlıdır.`);
    return;
  }

  const newStaff = {
    id: 'stf-' + Date.now(),
    name: formattedName,
    unit: unit,
    role: role,
    canShoot: (unit === 'Çekim' || unit === 'Spikerler'),
    active: true
  };

  appState.staff.push(newStaff);

  // Spiker ise ALLOWED_SPIKERS listesine de ekle
  if (unit === 'Spikerler' && !ALLOWED_SPIKERS.includes(formattedName)) {
    ALLOWED_SPIKERS.push(formattedName);
  }

  try {
    if (appState.isApiMode) {
      await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
    }
  } catch (err) {
    console.warn("API staff save error:", err);
  }

  await persistState();

  if (nameInput) nameInput.value = '';
  if (roleInput) roleInput.value = '';

  initDropdowns();
  renderApp();
  renderSpikerStaffPills();
  renderShootingCrewPills();
  renderSimpleStaffList();
  renderAddPersonModalStaffList();

  alert(`✅ "${formattedName}" (${unit}) başarıyla eklendi!`);
  closeAddPersonModal();
}

// ----------------------------------------------------
// ÖZEL ŞİFRE DEĞİŞTİRME MODALI & FONKSİYONLARI
// ----------------------------------------------------
function openStandalonePasswordModal() {
  const modal = document.getElementById('standalonePasswordModal');
  if (!modal) return;
  document.getElementById('modalCurrentPassInput').value = '';
  document.getElementById('modalNewPassInput').value = '';
  document.getElementById('modalNewPassConfirmInput').value = '';
  const msgEl = document.getElementById('modalPassChangeMsg');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.className = 'hidden text-xs font-bold p-3 rounded-xl border';
  }
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeStandalonePasswordModal() {
  const modal = document.getElementById('standalonePasswordModal');
  if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------
// ŞİFREMİ UNUTTUM & SIFIRLAMA MODALI FONKSİYONLARI
// ----------------------------------------------------
function handleForgotPasswordClick() {
  const modal = document.getElementById('forgotPasswordModal');
  if (!modal) return;
  const msgEl = document.getElementById('forgotPassStatusMsg');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.className = 'hidden text-xs font-bold p-3 rounded-xl border';
  }
  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeForgotPasswordModal() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.classList.add('hidden');
}

function autoFillAndLoginDefault() {
  const passInput = document.getElementById('loginPasswordInput');
  if (passInput) passInput.value = 'basin68';
  closeForgotPasswordModal();
  const form = document.querySelector('#rejiLoginScreen form');
  if (form) {
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

async function resetPasswordToDefault() {
  const msgEl = document.getElementById('forgotPassStatusMsg');
  if (msgEl) {
    msgEl.textContent = "Şifre standart 'basin68' olarak sıfırlanıyor...";
    msgEl.className = "text-xs font-bold p-3 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 block";
  }

  try {
    if (appState.isApiMode) {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Sıfırlama başarısız');
      }
    }
    localStorage.removeItem('aksaray_admin_pass');
    appState.adminPassword = 'basin68';

    if (msgEl) {
      msgEl.textContent = "✅ Şifre başarıyla standart 'basin68' olarak sıfırlandı! Artık 'basin68' ile giriş yapabilirsiniz.";
      msgEl.className = "text-xs font-bold p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 block";
    }

    const passInput = document.getElementById('loginPasswordInput');
    if (passInput) passInput.value = 'basin68';
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = "❌ " + (err.message || "Sıfırlama işlemi yapılamadı");
      msgEl.className = "text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 block";
    }
  }
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btnEl.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" class="w-4 h-4 text-aksaray-600"></i>`;
  if (window.lucide) lucide.createIcons();
}

async function handleStandalonePasswordSubmit(e) {
  e.preventDefault();
  const currentPass = document.getElementById('modalCurrentPassInput').value;
  const newPass = document.getElementById('modalNewPassInput').value;
  const confirmPass = document.getElementById('modalNewPassConfirmInput').value;
  const msgEl = document.getElementById('modalPassChangeMsg');
  const btnSubmit = document.getElementById('btnSubmitChangePass');

  if (newPass !== confirmPass) {
    msgEl.textContent = "Yeni şifreler eşleşmiyor! Lütfen iki kutucuğa da aynı şifreyi yazınız.";
    msgEl.className = "text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 block";
    return;
  }

  if (newPass.trim().length < 3) {
    msgEl.textContent = "Yeni şifre en az 3 karakter olmalıdır!";
    msgEl.className = "text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 block";
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Kaydediliyor...</span>`;
  if (window.lucide) lucide.createIcons();

  try {
    let success = false;
    let message = '';

    if (appState.isApiMode) {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Mevcut şifre hatalı!');
      }
      success = true;
      message = data.message || "Şifre başarıyla güncellendi.";
    } else {
      const storedPass = localStorage.getItem('aksaray_admin_pass') || appState.adminPassword || "basin68";
      if (currentPass !== storedPass && currentPass !== "basin68") {
        throw new Error("Mevcut şifre hatalı!");
      }
      success = true;
      message = "Şifre başarıyla güncellendi.";
    }

    if (success) {
      appState.adminPassword = newPass.trim();
      localStorage.setItem('aksaray_admin_pass', newPass.trim());

      const phoneBadge = document.getElementById('phoneConnectPassBadge');
      if (phoneBadge) phoneBadge.textContent = newPass.trim();

      msgEl.textContent = "✅ Şifreniz başarıyla değiştirildi! Yeni şifreniz kaydedildi ve aktif edildi.";
      msgEl.className = "text-xs font-bold p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 block";

      setTimeout(() => {
        closeStandalonePasswordModal();
      }, 1500);
    }
  } catch (err) {
    msgEl.textContent = "❌ " + (err.message || "Şifre değiştirilemedi!");
    msgEl.className = "text-xs font-bold p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 block";
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i><span>Şifreyi Kaydet ve Güncelle</span>`;
    if (window.lucide) lucide.createIcons();
  }
}

async function handleChangeAdminPassword(e) {
  e.preventDefault();
  const currentPass = document.getElementById('currentPassInput').value;
  const newPass = document.getElementById('newPassInput').value;
  const confirmPass = document.getElementById('newPassConfirmInput').value;
  const resultMsg = document.getElementById('passChangeResultMsg');

  if (newPass !== confirmPass) {
    resultMsg.textContent = "Yeni şifreler eşleşmiyor!";
    resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 block";
    return;
  }

  if (newPass.trim().length < 3) {
    resultMsg.textContent = "Yeni şifre en az 3 karakter olmalıdır!";
    resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 block";
    return;
  }

  try {
    if (appState.isApiMode) {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        resultMsg.textContent = data.message || "Şifre değiştirilemedi!";
        resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 block";
        return;
      }
    } else {
      const storedPass = localStorage.getItem('aksaray_admin_pass') || appState.adminPassword || "basin68";
      if (currentPass !== storedPass && currentPass !== "basin68") {
        resultMsg.textContent = "Mevcut şifre hatalı!";
        resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 block";
        return;
      }
    }

    appState.adminPassword = newPass.trim();
    localStorage.setItem('aksaray_admin_pass', newPass.trim());
    const phoneBadge = document.getElementById('phoneConnectPassBadge');
    if (phoneBadge) phoneBadge.textContent = newPass.trim();

    resultMsg.textContent = "✅ Şifre başarıyla güncellendi!";
    resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 block";
    document.getElementById('currentPassInput').value = '';
    document.getElementById('newPassInput').value = '';
    document.getElementById('newPassConfirmInput').value = '';
  } catch (err) {
    resultMsg.textContent = "Hata: " + err.message;
    resultMsg.className = "text-xs font-bold p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 block";
  }
}

// ----------------------------------------------------
// GÜN SONU RAPORU
// ----------------------------------------------------
function openDailyReportModal() {
  const reportDatePicker = document.getElementById('reportDatePicker');
  reportDatePicker.value = getTodayString();
  loadDailyReportForDate();
  document.getElementById('dailyReportModal').classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeDailyReportModal() {
  document.getElementById('dailyReportModal').classList.add('hidden');
}

function loadDailyReportForDate() {
  const date = document.getElementById('reportDatePicker').value || getTodayString();
  const dayJobs = appState.jobs.filter(j => j.date === date);

  document.getElementById('repStatTotal').textContent = dayJobs.length;
  document.getElementById('repStatCompleted').textContent = dayJobs.filter(j => j.status === 'Teslim Edildi').length;
  document.getElementById('repStatPending').textContent = dayJobs.filter(j => j.status !== 'Teslim Edildi').length;
  document.getElementById('repStatUrgent').textContent = dayJobs.filter(j => j.urgency === 'Çok Acil' || j.urgency === 'Yüksek').length;

  const reportData = appState.reports[date] || {};
  document.getElementById('repSummaryNote').value = reportData.summaryNote || '';
  document.getElementById('repPendingNote').value = reportData.pendingNote || '';
  document.getElementById('repIssuesNote').value = reportData.issuesNote || '';
  document.getElementById('repPreparedBy').value = reportData.preparedBy || `Reji: ${appState.activeRejiOperator}`;

  const isView = appState.isViewOnly;
  const btnSaveContainer = document.getElementById('btnSaveDailyReportContainer');
  if (btnSaveContainer) {
    if (isView) btnSaveContainer.classList.add('hidden');
    else btnSaveContainer.classList.remove('hidden');
  }

  ['repSummaryNote', 'repPendingNote', 'repIssuesNote', 'repPreparedBy'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.readOnly = isView;
      if (isView) {
        el.classList.add('bg-slate-100', 'cursor-not-allowed');
      } else {
        el.classList.remove('bg-slate-100', 'cursor-not-allowed');
      }
    }
  });

  const tbody = document.getElementById('reportJobsTableBody');
  if (dayJobs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400 italic">Bu tarihe ait kayıtlı iş bulunmuyor.</td></tr>`;
  } else {
    tbody.innerHTML = dayJobs.map(j => {
      const editors = getJobEditorStaff(j).join(', ') || '-';
      const news = getJobNewsStaff(j).join(', ') || '-';
      const spikers = getJobSpikers(j).join(', ');
      return `
      <tr class="hover:bg-slate-50">
        <td class="p-2.5 font-bold text-slate-800">
          <div>${escapeHtml(j.title)}</div>
          ${spikers ? `<div class="text-[10px] text-rose-700 font-semibold mt-0.5">🎙️ ${escapeHtml(spikers)}</div>` : ''}
        </td>
        <td class="p-2.5 font-bold text-amber-800">${escapeHtml(j.employer)}</td>
        <td class="p-2.5 text-[11px] font-semibold text-purple-900">${escapeHtml(editors)}</td>
        <td class="p-2.5 text-[11px] font-semibold text-emerald-900">${escapeHtml(news)}</td>
        <td class="p-2.5 text-[11px] text-indigo-800 font-semibold">${(j.shootingCrew || []).join(', ') || '-'}</td>
        <td class="p-2.5 font-mono text-[11px]">İstendi: ${j.timeRequested || '--'} &rarr; Çıktı: ${j.timeOutput || '--'}</td>
        <td class="p-2.5 text-center font-bold text-xs">${escapeHtml(j.status)}</td>
      </tr>
    `}).join('');
  }

  if (window.lucide) lucide.createIcons();
}

async function saveDailyReportManual() {
  if (appState.isViewOnly) {
    alert("⚠️ Yetkisiz işlem: Personel İzleme Modunda gün sonu raporu kaydedilemez. Reji veya Müdürlük şifresi ile giriş yapınız.");
    return;
  }

  const date = document.getElementById('reportDatePicker').value || getTodayString();
  const summaryNote = document.getElementById('repSummaryNote').value.trim();
  const pendingNote = document.getElementById('repPendingNote').value.trim();
  const issuesNote = document.getElementById('repIssuesNote').value.trim();
  const preparedBy = document.getElementById('repPreparedBy').value.trim();

  const reportPayload = {
    date,
    summaryNote,
    pendingNote,
    issuesNote,
    preparedBy,
    updatedAt: new Date().toISOString()
  };

  appState.reports[date] = reportPayload;

  try {
    if (appState.isApiMode) {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
      });
    }
  } catch (e) {}

  await persistState();
  alert(`✅ ${formatDateTr(date)} tarihli Gün Faaliyet Raporu başarıyla kaydedildi!`);
}

function getDailyReportPrintHtml(date) {
  const dayJobs = (appState.jobs || []).filter(j => j.date === date);
  const rep = (appState.reports && appState.reports[date]) || {};

  // Form alanlarında anlık yazılan notları öncelikli al
  const summaryNote = (document.getElementById('repSummaryNote')?.value || '').trim() || rep.summaryNote || '';
  const pendingNote = (document.getElementById('repPendingNote')?.value || '').trim() || rep.pendingNote || '';
  const issuesNote = (document.getElementById('repIssuesNote')?.value || '').trim() || rep.issuesNote || '';
  const preparedBy = (document.getElementById('repPreparedBy')?.value || '').trim() || rep.preparedBy || `Reji: ${appState.activeRejiOperator}`;

  const completedCount = dayJobs.filter(j => j.status === 'Teslim Edildi').length;
  const inProgressCount = dayJobs.filter(j => j.status !== 'Teslim Edildi').length;
  const urgentCount = dayJobs.filter(j => j.urgency === 'Çok Acil' || j.urgency === 'Yüksek').length;

  return `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; max-width: 920px; margin: 0 auto; padding: 10px;">
      
      <!-- BAŞLIK & ANTET -->
      <div style="text-align: center; border-bottom: 3px solid #005b7a; padding-bottom: 12px; margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 800; color: #d97706; letter-spacing: 2px; text-transform: uppercase;">T.C. AKSARAY BELEDİYE BAŞKANLIĞI</div>
        <div style="font-size: 16px; font-weight: 900; color: #005b7a; margin-top: 4px;">Basın Yayın ve Halkla İlişkiler Müdürlüğü • Reji Servisi</div>
        <div style="font-size: 13px; font-weight: 700; color: #b45309; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">GÜNLÜK MEDYA, ÇEKİM VE REJİ FAALİYET RAPORU</div>
      </div>

      <!-- BİLGİ ŞERİDİ -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 14px; margin-bottom: 14px; font-size: 11px;">
        <div><b>📅 TARİH:</b> <span style="color: #005b7a; font-weight: bold;">${formatDateTr(date)}</span></div>
        <div><b>👔 İŞ VEREN MÜDÜRLER:</b> Hasan Hüseyin AKSAY • Bahtiyar BAKAR</div>
        <div><b>🎛️ REJİ:</b> <span style="color: #1e3a8a; font-weight: bold;">${escapeHtml(appState.activeRejiOperator)}</span></div>
      </div>

      <!-- İSTATİSTİK ÖZETİ -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; text-align: center;">
        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px;">
          <div style="font-size: 9px; color: #475569; font-weight: bold; text-transform: uppercase;">Toplam İş</div>
          <div style="font-size: 16px; font-weight: 900; color: #0f172a;">${dayJobs.length}</div>
        </div>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 6px 8px;">
          <div style="font-size: 9px; color: #047857; font-weight: bold; text-transform: uppercase;">Teslim Edilen / Yayın</div>
          <div style="font-size: 16px; font-weight: 900; color: #047857;">${completedCount}</div>
        </div>
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 8px;">
          <div style="font-size: 9px; color: #b45309; font-weight: bold; text-transform: uppercase;">Sahada / Kurguda</div>
          <div style="font-size: 16px; font-weight: 900; color: #b45309;">${inProgressCount}</div>
        </div>
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 6px 8px;">
          <div style="font-size: 9px; color: #be123c; font-weight: bold; text-transform: uppercase;">Acil / Flaş İşler</div>
          <div style="font-size: 16px; font-weight: 900; color: #be123c;">${urgentCount}</div>
        </div>
      </div>

      <!-- 1. GÜNÜN GENEL FAALİYET ÖZETİ -->
      <div style="margin-bottom: 14px; padding: 10px 14px; background: #f8fafc; border-left: 4px solid #005b7a; border-radius: 0 8px 8px 0; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
        <div style="font-size: 11px; font-weight: bold; color: #005b7a; margin-bottom: 4px; text-transform: uppercase;">1. GÜNÜN GENEL FAALİYET DEĞERLENDİRMESİ:</div>
        <div style="font-size: 11px; line-height: 1.5; color: #334155; white-space: pre-wrap;">${summaryNote ? escapeHtml(summaryNote) : '<span style="color: #94a3b8; font-style: italic;">Bugün için girilmiş özel bir özet notu bulunmuyor.</span>'}</div>
      </div>

      <!-- 2. PRODÜKSİYON, ÇEKİM VE KURGU ÇİZELGESİ -->
      <div style="margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: bold; color: #0f172a; margin-bottom: 6px; text-transform: uppercase;">2. ÇEKİM, KURGU VE YAYIN ÇİZELGESİ:</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #e2e8f0;">
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 22%;">İş Tanımı</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 14%;">İş Veren Müdür</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 13%;">Spiker</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 13%;">Kurgu / Montaj</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 13%;">Haber Ekibi</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; width: 13%;">Çekim Ekibi</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: center; width: 12%;">İstendi ➔ Çıktı</th>
              <th style="border: 1px solid #94a3b8; padding: 6px 8px; text-align: center; width: 10%;">Durum</th>
            </tr>
          </thead>
          <tbody>
            ${dayJobs.length === 0 ? `
              <tr>
                <td colspan="8" style="border: 1px solid #cbd5e1; padding: 14px; text-align: center; color: #94a3b8; font-style: italic;">Bu tarihe ait kayıtlı iş bulunmamaktadır.</td>
              </tr>
            ` : dayJobs.map((j, idx) => {
              const editors = getJobEditorStaff(j).join(', ') || '-';
              const news = getJobNewsStaff(j).join(', ') || '-';
              const spikers = getJobSpikers(j).join(', ') || '-';
              const shooting = (j.shootingCrew || []).join(', ') || '-';
              const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
              return `
                <tr style="background: ${bg};">
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; font-weight: bold; color: #0f172a;">
                    ${escapeHtml(j.title)}
                    ${j.category ? `<div style="font-size: 9px; color: #64748b; font-weight: normal;">${escapeHtml(j.category)}</div>` : ''}
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; font-weight: bold; color: #92400e;">${escapeHtml(j.employer || '-')}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; color: #be123c; font-weight: bold;">${escapeHtml(spikers)}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; color: #6b21a8; font-weight: 600;">${escapeHtml(editors)}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; color: #047857; font-weight: 600;">${escapeHtml(news)}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; color: #1e3a8a; font-weight: 600;">${escapeHtml(shooting)}</td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; text-align: center; font-family: monospace; font-size: 9.5px; white-space: nowrap;">
                    ${j.timeRequested || '--:--'} &rarr; ${j.timeOutput || '--:--'}
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 5px 7px; text-align: center; font-weight: bold; font-size: 9.5px;">
                    ${escapeHtml(j.status || 'Bekliyor')}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- 3. YARINKİ PLANLAMA & 4. AKSAKLIKLAR -->
      ${pendingNote ? `
        <div style="margin-bottom: 10px; padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 11px;">
          <b style="color: #166534;">3. YARINKİ PLANLAMA & DEVAM EDEN İŞLER:</b>
          <div style="color: #14532d; margin-top: 3px; white-space: pre-wrap;">${escapeHtml(pendingNote)}</div>
        </div>
      ` : ''}

      ${issuesNote ? `
        <div style="margin-bottom: 14px; padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; font-size: 11px;">
          <b style="color: #991b1b;">4. AKSAKLIKLAR & EKİPMAN DURUMU:</b>
          <div style="color: #7f1d1d; margin-top: 3px; white-space: pre-wrap;">${escapeHtml(issuesNote)}</div>
        </div>
      ` : ''}

      <!-- RESMİ İMZA ALANI -->
      <div style="display: flex; justify-content: space-between; margin-top: 35px; padding: 0 40px; font-size: 11px; text-align: center;">
        <div style="width: 200px;">
          <b style="color: #0f172a;">Raporu Düzenleyen</b><br>
          <span style="font-size: 10px; color: #475569;">${escapeHtml(preparedBy)}</span><br><br><br>
          <div style="border-top: 1px dashed #94a3b8; padding-top: 4px; font-size: 10px; color: #64748b;">İmza</div>
        </div>
        <div style="width: 200px;">
          <b style="color: #0f172a;">Müdürlük Onayı</b><br>
          <span style="font-size: 10px; color: #475569;">Hasan Hüseyin AKSAY / Bahtiyar BAKAR</span><br><br><br>
          <div style="border-top: 1px dashed #94a3b8; padding-top: 4px; font-size: 10px; color: #64748b;">İmza / Mühür</div>
        </div>
      </div>

    </div>
  `;
}

function copyReportAsWhatsApp() {
  const date = document.getElementById('reportDatePicker').value || getTodayString();
  const dayJobs = appState.jobs.filter(j => j.date === date);
  const rep = appState.reports[date] || {};

  // Formdaki anlık yazılan notları al
  const summaryNote = (document.getElementById('repSummaryNote')?.value || '').trim() || rep.summaryNote || '';
  const pendingNote = (document.getElementById('repPendingNote')?.value || '').trim() || rep.pendingNote || '';
  const issuesNote = (document.getElementById('repIssuesNote')?.value || '').trim() || rep.issuesNote || '';
  const preparedBy = (document.getElementById('repPreparedBy')?.value || '').trim() || rep.preparedBy || `Reji: ${appState.activeRejiOperator}`;

  let msg = `🏛️ *T.C. AKSARAY BELEDİYESİ*\n`;
  msg += `*Basın Yayın & Reji Koordinasyon Masası*\n`;
  msg += `👔 *İş Veren Müdürler:* Hasan Hüseyin Aksay • Bahtiyar Bakar\n`;
  msg += `📅 *GÜNLÜK FAALİYET & ÇEKİM RAPORU* (${formatDateTr(date)})\n`;
  msg += `──────────────────────────────\n\n`;

  msg += `📊 *GÜNÜN İSTATİSTİKLERİ:*\n`;
  msg += `• Toplam İş: ${dayJobs.length}\n`;
  msg += `• Tamamlanan / Yayın: ${dayJobs.filter(j => j.status === 'Teslim Edildi').length}\n`;
  msg += `• Sahada / Kurguda: ${dayJobs.filter(j => j.status !== 'Teslim Edildi').length}\n\n`;

  if (summaryNote) {
    msg += `📝 *MÜDÜRLÜK DEĞERLENDİRMESİ:*\n${summaryNote}\n\n`;
  }

  msg += `🎬 *PRODÜKSİYON & ÇEKİM ÇİZELGESİ:*\n`;
  if (dayJobs.length === 0) {
    msg += `(Kayıtlı iş bulunmuyor)\n`;
  } else {
    dayJobs.forEach((j, i) => {
      const shooting = (j.shootingCrew || []).join(', ') || 'Belirtilmedi';
      const editors = getJobEditorStaff(j).join(', ') || '-';
      const news = getJobNewsStaff(j).join(', ') || '-';
      const spikers = getJobSpikers(j).join(', ');
      msg += `${i + 1}️⃣ *${j.title}* [${j.status}]\n`;
      msg += `   👔 *İş Veren:* ${j.employer}\n`;
      msg += `   🎥 *Çekim Ekibi:* ${shooting}\n`;
      if (spikers) msg += `   🎙️ *Spiker / Sunucu:* ${spikers}\n`;
      msg += `   🎬 *Kurgu & Montaj:* ${editors}\n`;
      msg += `   📰 *Haber Ekibi:* ${news}\n`;
      msg += `   ⏰ *Saatler:* İstendi: ${j.timeRequested || '--:--'} | Çıkış: ${j.timeDeparted || '--:--'} | Görüntü: ${j.timeFootageDelivered || '--:--'} | Kurgu: ${j.timeEditDelivered || '--:--'} | Çıktı: ${j.timeOutput || '--:--'}\n`;
      if (j.notes) msg += `   💬 *Not:* ${j.notes}\n`;
      msg += `\n`;
    });
  }

  if (pendingNote) msg += `📌 *YARINKİ PLANLAR:* ${pendingNote}\n\n`;
  if (issuesNote) msg += `⚠️ *EKİPMAN / NOTLAR:* ${issuesNote}\n\n`;
  msg += `✍️ *Raporu Düzenleyen:* ${preparedBy}\n`;
  msg += `──────────────────────────────`;

  navigator.clipboard.writeText(msg).then(() => {
    alert("✅ WhatsApp formatındaki Gün Raporu panoya kopyalandı!\nWhatsApp grubuna yapıştırabilirsiniz.");
  }).catch(() => {
    alert("Kopyalanamadı, lütfen tarayıcı iznini kontrol edin.");
  });
}

async function printOfficialReport() {
  const date = document.getElementById('reportDatePicker')?.value || getTodayString();

  // 1. Ekrandaki metinleri otomatik olarak kaydet
  const summaryNote = (document.getElementById('repSummaryNote')?.value || '').trim();
  const pendingNote = (document.getElementById('repPendingNote')?.value || '').trim();
  const issuesNote = (document.getElementById('repIssuesNote')?.value || '').trim();
  const preparedBy = (document.getElementById('repPreparedBy')?.value || '').trim() || `Reji: ${appState.activeRejiOperator}`;

  if (!appState.reports) appState.reports = {};
  appState.reports[date] = {
    date,
    summaryNote,
    pendingNote,
    issuesNote,
    preparedBy,
    updatedAt: new Date().toISOString()
  };

  try {
    if (appState.isApiMode) {
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appState.reports[date])
      }).catch(() => {});
    }
  } catch (e) {}
  persistState();

  // 2. Rapor HTML içeriğini oluştur
  const reportHtml = getDailyReportPrintHtml(date);

  // 3. Fallback olarak ana sayfadaki div'e de doldur
  const printableContainer = document.getElementById('printableDailyReport');
  if (printableContainer) {
    printableContainer.innerHTML = reportHtml;
    printableContainer.style.display = 'block';
  }

  // 4. İzole iframe üzerinden hatasız yazdır (Hiçbir zaman boş sayfa çıkmaz)
  let printIframe = document.getElementById('aksarayReportPrintIframe');
  if (!printIframe) {
    printIframe = document.createElement('iframe');
    printIframe.id = 'aksarayReportPrintIframe';
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);
  }

  const iframeDoc = printIframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Aksaray Belediyesi Günlük Rapor - ${formatDateTr(date)}</title>
      <style>
        @page { size: A4 portrait; margin: 10mm 12mm; }
        * { box-sizing: border-box; }
        body {
          font-family: Arial, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          color: #0f172a !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      </style>
    </head>
    <body>
      ${reportHtml}
    </body>
    </html>
  `);
  iframeDoc.close();

  setTimeout(() => {
    try {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
    } catch (err) {
      window.print();
    }
  }, 250);
}

function openReportInNewTab() {
  const date = document.getElementById('reportDatePicker')?.value || getTodayString();
  const reportHtml = getDailyReportPrintHtml(date);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Aksaray Belediyesi Günlük Rapor - ${formatDateTr(date)}</title>
        <style>
          @page { size: A4 portrait; margin: 10mm 12mm; }
          * { box-sizing: border-box; }
          body {
            font-family: Arial, -apple-system, sans-serif;
            margin: 20px auto;
            max-width: 920px;
            background: #ffffff;
            color: #0f172a;
            padding: 10px;
          }
          @media print {
            body { margin: 0; max-width: 100%; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 10px 16px; border-radius: 8px;">
          <span style="font-size: 13px; font-weight: bold; color: #005b7a;">Aksaray Belediyesi Günlük Faaliyet Raporu Önizleme</span>
          <button onclick="window.print()" style="padding: 8px 18px; background: #005b7a; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer;">
            🖨️ Yazdır / PDF Olarak Kaydet
          </button>
        </div>
        ${reportHtml}
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}

// ----------------------------------------------------
// EXCEL & YEDEKLEME
// ----------------------------------------------------
function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Excel modülü yüklenemedi.");
    return;
  }
  const filtered = getFilteredJobs();
  if (filtered.length === 0) {
    alert("Dışa aktarılacak kayıt bulunmuyor.");
    return;
  }

  const rows = filtered.map(job => ({
    "İş Tanımı": job.title,
    "Kategori": job.category,
    "İş Veren Müdür": job.employer,
    "Spiker / Sunucu": getJobSpikers(job).join(', ') || '-',
    "Kurgu ve Montaj": getJobEditorStaff(job).join(', ') || '-',
    "Haber Birimi / Sosyal Medya": getJobNewsStaff(job).join(', ') || '-',
    "Çekim Ekibi (Çekimi Yapanlar)": (job.shootingCrew || []).join(', '),
    "Reji Kayıt Operatörü": job.rejiStaff || 'Levent AKYAYLA',
    "Görev Yeri": job.location || '-',
    "Tarih": job.date,
    "İşin İstendiği Saat": job.timeRequested || '-',
    "Sahaya Çıkış Saati": job.timeDeparted || '-',
    "Görüntü Teslim Saati": job.timeFootageDelivered || '-',
    "Kurgu Teslim Saati": job.timeEditDelivered || '-',
    "Revize Saati": job.timeRevision || '-',
    "Çıktı / Yayın Saati": job.timeOutput || '-',
    "Aciliyet": job.urgency,
    "Durum": job.status,
    "Notlar": job.notes || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reji ve Çekim Listesi");
  XLSX.writeFile(wb, `Aksaray_Reji_Cekim_Takip_${getTodayString()}.xlsx`);
}

function downloadJsonBackup() {
  const fullData = {
    jobs: appState.jobs,
    staff: appState.staff,
    departments: appState.departments,
    reports: appState.reports,
    exportedAt: new Date().toISOString()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `Aksaray_Basin_Yedek_${getTodayString()}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function restoreJsonBackup() {
  const fileInput = document.getElementById('backupFileInput');
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Lütfen bir .json dosyası seçiniz.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.jobs || !data.staff) throw new Error("Geçersiz yedek.");
      appState.jobs = data.jobs;
      appState.staff = data.staff;
      appState.departments = data.departments || initialData.departments;
      appState.reports = data.reports || {};

      await persistState();

      if (appState.isApiMode) {
        await fetch('/api/backup/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      alert("✅ Yedek geri yüklendi!");
      initDropdowns();
      renderApp();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };
  reader.readAsText(fileInput.files[0]);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateTr(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  } catch (e) {}
  return dateStr;
}

// ----------------------------------------------------
// TELEFONDAN BAĞLAN MODALI
// ----------------------------------------------------
function openPhoneConnectModal() {
  const modal = document.getElementById('phoneConnectModal');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closePhoneConnectModal() {
  const modal = document.getElementById('phoneConnectModal');
  if (modal) modal.classList.add('hidden');
}
