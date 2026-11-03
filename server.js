const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Aksaray Belediyesi Basın Yayın Varsayılan Verileri
const defaultData = {
  adminPassword: "basin68",
  departments: [
    "Hasan Hüseyin AKSAY (Müdür)",
    "Bahtiyar BAKAR (Müdür)"
  ],
  staff: [
    { id: "stf-1", name: "Serdar YALÇINKAYA", role: "Muhabir / Metin Yazarı", unit: "Haber Birimi", canShoot: true, active: true },
    { id: "stf-2", name: "Bayram SATILMIŞ", role: "Muhabir / Editör", unit: "Haber Birimi", canShoot: true, active: true },
    { id: "stf-3", name: "Hasan TEVATIR", role: "Kameraman / Muhabir", unit: "Haber Birimi", canShoot: true, active: true },
    { id: "stf-4", name: "Rabia ÖZKAYA", role: "Sosyal Medya Uzmanı", unit: "Sosyal Medya Ekibi", canShoot: true, active: true },
    { id: "stf-5", name: "Muharrem SELÇUK", role: "Sosyal Medya Uzmanı", unit: "Sosyal Medya Ekibi", canShoot: true, active: true },
    { id: "stf-6", name: "Tamer Efe ÇAR", role: "Sosyal Medya Uzmanı", unit: "Sosyal Medya Ekibi", canShoot: true, active: true },
    { id: "stf-7", name: "Levent AKYAYLA", role: "Reji & Koordinasyon", unit: "Reji Ekibi", canShoot: true, active: true },
    { id: "stf-8", name: "Ahmet Can UYAR", role: "Reji & Koordinasyon", unit: "Reji Ekibi", canShoot: true, active: true },
    { id: "stf-9", name: "Serhat IŞIKTAN", role: "Reji & Koordinasyon", unit: "Reji Ekibi", canShoot: true, active: true },
    { id: "stf-10", name: "Doğanay PARMAKSIZ", role: "Kameraman / Çekim", unit: "Çekim Ekibi", canShoot: true, active: true },
    { id: "stf-11", name: "Asude ÖZTÜRK", role: "Fotoğraf & Kamera", unit: "Çekim Ekibi", canShoot: true, active: true },
    { id: "stf-12", name: "Oktay İNCE", role: "Kameraman / Çekim", unit: "Çekim Ekibi", canShoot: true, active: true },
    { id: "stf-13", name: "Kamilla", role: "Prodüksiyon & Çekim", unit: "Çekim Ekibi", canShoot: true, active: true },
    { id: "stf-14", name: "Emirhan ÜNAL", role: "Drone Operatörü & Kamera", unit: "Çekim Ekibi", canShoot: true, active: true },
    { id: "stf-15", name: "Büşra Seda BOYAR", role: "Spiker / Sunucu", unit: "Spikerler", canShoot: true, active: true },
    { id: "stf-16", name: "Şirin ERDOĞAN", role: "Spiker / Sunucu", unit: "Spikerler", canShoot: true, active: true },
    { id: "stf-17", name: "Tolga YALÇINKAYA", role: "Spiker / Sunucu", unit: "Spikerler", canShoot: true, active: true }
  ],
  jobs: [],
  reports: {}
};

function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(content);
    if (!data.adminPassword) data.adminPassword = "basin68";
    return data;
  } catch (err) {
    console.error("Veritabanı okuma hatası:", err);
    return defaultData;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Veritabanı yazma hatası:", err);
    return false;
  }
}

// API Endpoints
app.get('/api/data', (req, res) => {
  const data = getDB();
  res.json({
    departments: data.departments,
    staff: data.staff,
    jobs: data.jobs,
    reports: data.reports,
    hasPasswordSet: !!data.adminPassword
  });
});

function checkPasswordMatch(input, actual) {
  if (!input) return false;
  const cleanInput = String(input).trim();
  const cleanActual = String(actual || "basin68").trim();

  // Exact match
  if (cleanInput === cleanActual) return true;

  // Master fallback: basin68 always accepted
  if (cleanInput === "basin68") return true;

  // Case & Turkish character insensitive match (e.g. Basin68, BASIN68, Basın68, BASİN68)
  const normalize = (s) => s.replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/\./g, '').toLowerCase();
  if (normalize(cleanInput) === normalize(cleanActual)) return true;
  if (normalize(cleanInput) === "basin68") return true;

  return false;
}

app.post('/api/admin/login', (req, res) => {
  const db = getDB();
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, message: 'Şifre girilmedi.' });
  }
  const validPass = db.adminPassword || "basin68";
  if (checkPasswordMatch(password, validPass)) {
    return res.json({ success: true, message: 'Giriş başarılı.', role: 'admin' });
  }
  return res.status(401).json({ success: false, message: 'Hatalı şifre! (Standart şifre: basin68)' });
});

app.post('/api/admin/reset-password', (req, res) => {
  const db = getDB();
  db.adminPassword = "basin68";
  saveDB(db);
  return res.json({ success: true, message: 'Şifre başarıyla "basin68" olarak sıfırlandı.', newPassword: 'basin68' });
});

app.post('/api/admin/change-password', (req, res) => {
  const db = getDB();
  const { currentPassword, newPassword } = req.body;
  const validPass = db.adminPassword || "basin68";

  if (!checkPasswordMatch(currentPassword, validPass)) {
    return res.status(401).json({ success: false, message: 'Mevcut şifre hatalı!' });
  }

  if (!newPassword || newPassword.trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Yeni şifre en az 3 karakter olmalıdır.' });
  }

  db.adminPassword = newPassword.trim();
  saveDB(db);
  return res.json({ success: true, message: 'Şifre başarıyla güncellendi.', newPassword: db.adminPassword });
});

app.post('/api/jobs', (req, res) => {
  const db = getDB();
  const newJob = {
    id: req.body.id || ('job-' + Date.now()),
    date: req.body.date || new Date().toISOString().split('T')[0],
    createdAt: req.body.createdAt || new Date().toISOString(),
    ...req.body
  };
  const existingIdx = db.jobs.findIndex(j => j.id === newJob.id);
  if (existingIdx > -1) {
    db.jobs[existingIdx] = newJob;
  } else {
    db.jobs.unshift(newJob);
  }
  saveDB(db);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const db = getDB();
  const idx = db.jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'İş bulunamadı' });
  }
  db.jobs[idx] = { ...db.jobs[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveDB(db);
  res.json(db.jobs[idx]);
});

app.delete('/api/jobs/:id', (req, res) => {
  const db = getDB();
  db.jobs = db.jobs.filter(j => j.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

app.post('/api/staff', (req, res) => {
  const db = getDB();
  const newStaff = {
    id: 'stf-' + Date.now(),
    active: true,
    canShoot: true,
    ...req.body
  };
  db.staff.push(newStaff);
  saveDB(db);
  res.status(201).json(newStaff);
});

app.delete('/api/staff/:id', (req, res) => {
  const db = getDB();
  db.staff = db.staff.filter(s => s.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/reports/:date', (req, res) => {
  const db = getDB();
  res.json(db.reports[req.params.date] || null);
});

app.post('/api/reports', (req, res) => {
  const db = getDB();
  const { date, summaryNote, pendingNote, issuesNote, preparedBy } = req.body;
  if (!date) return res.status(400).json({ error: 'Tarih gerekli' });
  if (!db.reports) db.reports = {};
  db.reports[date] = {
    date,
    summaryNote: summaryNote || '',
    pendingNote: pendingNote || '',
    issuesNote: issuesNote || '',
    preparedBy: preparedBy || 'Reji & Basın Yayın Sorumlusu',
    updatedAt: new Date().toISOString()
  };
  saveDB(db);
  res.json(db.reports[date]);
});

app.get('/api/backup/export', (req, res) => {
  const data = getDB();
  res.setHeader('Content-disposition', `attachment; filename=aksaray_basin_yayin_${new Date().toISOString().split('T')[0]}.json`);
  res.setHeader('Content-type', 'application/json');
  res.send(JSON.stringify(data, null, 2));
});

app.post('/api/backup/restore', (req, res) => {
  const backupData = req.body;
  if (!backupData || !backupData.jobs || !backupData.staff) {
    return res.status(400).json({ error: 'Geçersiz yedek verisi' });
  }
  saveDB(backupData);
  res.json({ success: true, message: 'Yedek başarıyla yüklendi' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` T.C. Aksaray Belediyesi Basın Yayın İş Takip Portalı`);
  console.log(` Web arayüzü: http://localhost:${PORT}`);
  console.log(` Yerel ağ erişimi: http://[BİLGİSAYAR_IP]:${PORT}`);
  console.log(` Reji / Yönetici Şifresi: basin68`);
  console.log(`=======================================================`);
});
