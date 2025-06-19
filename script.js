import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil data real-time
onValue(ref(db, 'sensor'), (snapshot) => {
  const data = snapshot.val();
  
  // Update UI (sesuai ID yang sudah ada)
  document.getElementById('suhu').textContent = data.suhu.toFixed(1);
  document.getElementById('kelembapan').textContent = data.kelembapan.toFixed(1);
  document.getElementById('tanah').textContent = data.tanah;

  // Update grafik (pastikan Chart.js sudah terload)
  updateChart('suhuChart', data.suhu);
  updateChart('humChart', data.kelembapan);
  updateChart('tanahChart', data.tanah);
});

// Fungsi update grafik
function updateChart(chartId, value) {
  const chart = window.myCharts[chartId];
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(value);
  
  // Batasi data grafik
  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  
  chart.update();
}
