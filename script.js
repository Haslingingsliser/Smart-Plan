import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2TnzeIu4bYewXBTxcMR41DiTqCja53_Q",
  authDomain: "iot-haidar.firebaseapp.com",
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-haidar",
  storageBucket: "iot-haidar.firebasestorage.app",
  messagingSenderId: "863414396307",
  appId: "1:863414396307:web:18900ca6dfb76903343466",
  measurementId: "G-CC1L1H1Y0L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Chart.js objek
let charts = {};

function drawChart(id, labels, data, label, color) {
  if (charts[id]) charts[id].destroy();

  const ctx = document.getElementById(id).getContext("2d");
  charts[id] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

const suhuArr = [];
const kelembapanArr = [];
const tanahArr = [];
const waktuArr = [];

function updateDataRealtime() {
  const sensorRef = ref(db, "sensor");

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const suhu = parseFloat(data.suhu);
    const kelembapan = parseFloat(data.kelembapan_udara);
    const tanah = parseInt(data.kelembapan_tanah);
    const waktu = new Date().toLocaleTimeString();

    // Update tampilan
    document.getElementById("suhu").textContent = suhu;
    document.getElementById("kelembapan").textContent = kelembapan;
    document.getElementById("tanah").textContent = tanah;

    // Update rekomendasi
    const rekom = document.getElementById("rekomendasi");
    if (!tanah) {
      rekom.textContent = "⚠️ Data tidak terbaca. Periksa koneksi sensor.";
    } else if (tanah < 1000) {
      rekom.textContent = "Tanah sangat kering, cocok untuk kaktus atau sukulen.";
    } else if (tanah < 2500) {
      rekom.textContent = "Tanah cukup lembap, cocok untuk tanaman sayur.";
    } else {
      rekom.textContent = "Tanah sangat lembap, cocok untuk tanaman air atau padi.";
    }

    // Simpan data ke array
    suhuArr.push(suhu);
    kelembapanArr.push(kelembapan);
    tanahArr.push(tanah);
    waktuArr.push(waktu);

    // Maksimal 10 data terakhir
    if (suhuArr.length > 10) {
      suhuArr.shift();
      kelembapanArr.shift();
      tanahArr.shift();
      waktuArr.shift();
    }

    // Update grafik
    drawChart("suhuChart", waktuArr, suhuArr, "Suhu (°C)", "rgba(255, 99, 132, 0.6)");
    drawChart("humChart", waktuArr, kelembapanArr, "Kelembapan Udara (%)", "rgba(54, 162, 235, 0.6)");
    drawChart("tanahChart", waktuArr, tanahArr, "Kelembapan Tanah", "rgba(255, 206, 86, 0.6)");
  });
}

updateDataRealtime();
