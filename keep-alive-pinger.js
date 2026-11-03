const https = require('https');

const RENDER_URL = 'https://aksaray-belediyesi-is-takip.onrender.com/api/data';

function ping() {
  https.get(RENDER_URL, (res) => {
    console.log(`[${new Date().toLocaleTimeString()}] Render Ping: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleTimeString()}] Render Ping Hatası:`, err.message);
  });
}

// Render'ı her 8 dakikada bir uyanık tut
setInterval(ping, 8 * 60 * 1000);
ping();
