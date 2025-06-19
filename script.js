import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2TnzeIu4bYewXBTxcMR41DiTqCja53_Q",
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

onValue(ref(db, 'sensor'), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Ambil data terakhir
  const lastKey = Object.keys(data).pop();
  const lastData = data[lastKey];

  // Update UI TANPA mengubah struktur
  document.getElementById('suhu').textContent = lastData.suhu.toFixed(1);
  document.getElementById('kelembapan').textContent = lastData.kelembapan.toFixed(1);
  document.getElementById('tanah').textContent = lastData.tanah;

  // Rekomendasi tanaman (logika original)
  const tanah = parseInt(lastData.tanah);
  const rekom = document.getElementById('rekomendasi');
  
  if (tanah < 1000) rekom.textContent = "Tanah kering, cocok untuk kaktus";
  else if (tanah < 2500) rekom.textContent = "Tanah lembap, cocok untuk sayuran";
  else rekom.textContent = "Tanah basah, cocok untuk padi";
});
