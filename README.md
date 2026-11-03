# T.C. Aksaray Belediyesi - Medya & Prodüksiyon İş Takip ve Gün Raporu Sistemi

**Aksaray Belediyesi Basın Yayın ve Halkla İlişkiler Müdürlüğü** için özel olarak tasarlanmış, saha çekimlerinden kurgu ve sosyal medya yayınlarına kadar tüm prodüksiyon süreçlerini, saatlik aşamalarını, çoklu personel görevlendirmelerini ve **manuel gün sonu faaliyet raporlarını** tek bir ekrandan yönetmeyi sağlayan modern web uygulaması.

---

## 🌟 Öne Çıkan Özellikler ve Kullanıcı Talepleri

### 1. İş Tanımı ve İş Veren Birimler
- **İş Tanımı:** Çekim, haber bülteni, klip, canlı yayın, sosyal medya reels gibi işlerin başlığı ve detaylı konusu.
- **İş Veren Birim:** Aksaray Belediyesi bünyesindeki müdürlükler (Başkanlık Makamı, Özel Kalem, Fen İşleri, Park Bahçeler, Kültür Sosyal vb.) açılır liste veya serbest metin olarak seçilebilir.
- **Mekan / Konum:** Çekimin yapılacağı Aksaray lokasyonu (Örn: Millet Bahçesi, Somuncu Baba Külliyesi, Ihlara Vadisi, Bilim Merkezi vb.).

### 2. Çoklu Personel Seçimi ve Görev Dağılımı (Kimin Ne İş Yaptığı)
- **1'den Fazla Kişi Seçebilme:** Tek bir iş kaydına birden fazla çalışan atanabilir.
- **Kişiye Özel Rol Tanımlama:** Seçilen her personelin o işteki spesifik görevi belirlenebilir (Örn: *Murat Demir - Kameraman*, *Zeynep Kaya - Muhabir*, *Ali Can Çelik - Drone Operatörü*, *Emre Yılmaz - Kurgucu*).
- **Ekip Yönetimi:** Personel listesi modülünden yeni çalışma arkadaşları eklenebilir veya düzenlenebilir.

### 3. Prodüksiyon Süreç ve Saat Takibi (Zaman Çizelgesi)
İş akışının her adımı ayrı saat kutucukları ile kayıt altına alınır:
1. 🕒 **İşin İstendiği Saat** (Talep saati)
2. 🚗 **İş İçin Çıkılan Saat** (Sahaya çıkış saati)
3. 💾 **Görüntü Teslim Saati** (Ham görüntülerin teslimi)
4. 🎬 **Kurgu Teslim Saati** (Montajın tamamlanması)
5. 🔁 **Revize Saati** (Varsa revizyon talebi ve saati)
6. 🚀 **Çıktı Saati** (Nihai render / yayın teslim saati)

### 4. Aciliyet ve Durum Kutucukları
- **Aciliyet Kutucukları:**
  - 🟢 **Normal**
  - 🟡 **Orta**
  - 🟠 **Yüksek**
  - 🔴 **Çok Acil / Flaş Haber** (Animasyonlu ve öncelikli)
- **Durum / Süreç Kademeleri:**
  - 📋 **Planlanıyor**
  - 🎥 **Sahada / Çekimde**
  - 📥 **Görüntü Teslim Edildi**
  - ⚙️ **Kurguda / İşleniyor**
  - 🔄 **Revizede**
  - ✅ **Teslim Edildi / Yayınlandı**
- Tablo görünümünde tek tıkla durum güncelleme (Dropdown) desteği mevcuttur.

### 5. Gün Sonu Raporu (Manuel Giriş & Resmi Çıktı)
Kullanıcının özellikle talep ettiği **Manuel Gün Raporu Modülü**:
- **Otomatik İstatistikler:** O gün yapılan toplam iş sayısı, teslim edilenler, sahada olanlar ve acil işler.
- **Manuel Rapor Giriş Alanları:**
  - Günün Genel Faaliyet Özeti (Serbest metin alanı)
  - Yarınki Planlama & Devam Eden İşler
  - Aksaklıklar / Ekipman Durumu
  - Raporu Düzenleyen / Nöbetçi Yetkili Bilgisi
- **Tek Tıkla WhatsApp Formatında Kopyalama:** WhatsApp medya grubuna yapıştırmaya hazır, şık emojili ve hiyerarşik bülten metni formatında panoya kopyalar.
- **Resmi Antetli A4 PDF / Yazdırma:** T.C. Aksaray Belediyesi antetli, resmi yazışma formatında, amir ve müdürlük imza bloklarına sahip çıktı.

### 6. Görünüm Seçenekleri ve Dışa Aktarma
- **Tablo Görünümü:** Detaylı zaman sütunları ve arama filtreleri.
- **Kanban Pano Görünümü:** İşleri durum sütunları arasında kartlar halinde takip etme.
- **Excel Dışa Aktar (.xlsx):** Tüm kayıtları veya filtrelenmiş listeyi Excel formatında indirme.
- **Veri Yedekleme (JSON):** Sistemi dilediğiniz zaman yedekleme ve geri yükleme imkanı.

---

## 🚀 Nasıl Başlatılır?

Uygulama iki farklı şekilde çalıştırılabilir:

### Seçenek 1: Tek Tıkla Başlatma (Önerilen)
Proje klasöründeki **`baslat.bat`** dosyasına çift tıklayın:
- Bilgisayarınızda Node.js varsa otomatik yerel sunucu başlar ve tarayıcınızda açılır (`http://localhost:3000`).
- Node.js yoksa doğrudan tarayıcınızda `index.html` olarak açılır ve LocalStorage ile kesintisiz çalışır.

### Seçenek 2: Doğrudan Tarayıcıda Açma
Herhangi bir terminal veya sunucu çalıştırmadan doğrudan **`index.html`** dosyasını Google Chrome, Edge veya Firefox ile çift tıklayarak açabilirsiniz. Tüm özellikler ve veriler tarayıcınızın yerel hafızasında (LocalStorage) güvenle saklanır.

### Seçenek 3: Terminal ile Çalıştırma
```bash
cd "C:\Users\ASUS\.gemini\antigravity\scratch\aksaray-belediyesi-is-takip"
npm start
```
Tarayıcınızdan `http://localhost:3000` adresine gidebilirsiniz. Ayrıca aynı ağdaki (belediye yerel ağı / WiFi) diğer ekip arkadaşlarınız da `http://[BILGISAYAR_IP]:3000` adresinden sisteme erişebilir.

---

## 📁 Proje Dosya Yapısı
```
aksaray-belediyesi-is-takip/
├── index.html        # Ana kullanıcı arayüzü, modal pencereleri, Tailwind tasarımı
├── app.js            # Durum yönetimi, çoklu personel, zaman çizelgesi, filtreler, raporlama
├── server.js         # Node.js / Express arka uç sunucusu ve REST API
├── database.json     # Sunucu modu için JSON veritabanı
├── baslat.bat        # Windows için tek tıkla çalıştırma betiği
├── package.json      # Node.js paket bağımlılıkları (express, cors)
└── README.md         # Kullanım ve kurulum rehberi
```

**T.C. Aksaray Belediyesi Basın Yayın ve Halkla İlişkiler Müdürlüğü'ne hayırlı olsun!**
