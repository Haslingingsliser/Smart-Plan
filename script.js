import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2TnzeIu4bYewXBTxcMR41DiTqCja53_Q",
  authDomain: "iot-haidar.firebaseapp.com",
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-haidar",
  storageBucket: "iot-haidar.appspot.com",
  messagingSenderId: "863414396307",
  appId: "1:863414396307:web:18900ca6dfb76903343466"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Tetap menggunakan UI yang sudah ada
onValue(ref(db, 'sensor'), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  // Ambil data terakhir
  const lastKey = Object.keys(data).pop();
  const lastData = data[lastKey];

  // Update UI yang sudah ada tanpa perubahan
  document.getElementById('tanah').textContent = lastData.tanah;
  
  // Untuk rekomendasi tanaman (sesuai logika Anda sebelumnya)
  const kelembapanTanah = parseInt(lastData.tanah);
  const rekom = document.getElementById('rekomendasi');
  
  if (!kelembapanTanah) {
    rekom.textContent = "⚠️ Data tidak terbaca. Periksa koneksi sensor.";
  } else if (kelembapanTanah < 1000) {
    rekom.textContent = "Tanah sangat kering, cocok untuk kaktus atau sukulen.";
  } else if (kelembapanTanah < 2500) {
    rekom.textContent = "Tanah cukup lembap, cocok untuk tanaman sayur.";
  } else {
    rekom.textContent = "Tanah sangat lembap, cocok untuk tanaman air atau padi.";
  }
});
