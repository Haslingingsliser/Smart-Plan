function drawChart(id, labels, data, label, color) {
  if (window.charts?.[id]) window.charts[id].destroy();

  const ctx = document.getElementById(id).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  if (!window.charts) window.charts = {};
  window.charts[id] = chart;
}

function updateDisplay(dataArr) {
  if (!dataArr.length) return;

  const suhu = [], hum = [], tanah = [], labels = [];

  dataArr.forEach(entry => {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    labels.push(time);
    suhu.push(parseFloat(entry.suhu));
    hum.push(parseFloat(entry.kelembapan));
    tanah.push(parseFloat(entry.tanah));
  });

  const latest = dataArr[dataArr.length - 1];

  document.getElementById('suhu').textContent = latest.suhu;
  document.getElementById('kelembapan').textContent = latest.kelembapan;
  document.getElementById('tanah').textContent = latest.tanah;

  const kelembapanTanah = parseInt(latest.tanah);
  const rekom = document.getElementById('rekomendasi');
  if (kelembapanTanah < 1000) {
    rekom.textContent = "Tanah sangat kering, cocok untuk kaktus atau sukulen.";
  } else if (kelembapanTanah < 2500) {
    rekom.textContent = "Tanah cukup lembap, cocok untuk tanaman sayur.";
  } else {
    rekom.textContent = "Tanah sangat lembap, cocok untuk tanaman air atau padi.";
  }

  drawChart('suhuChart', labels, suhu, 'Suhu (°C)', 'rgba(255, 99, 132, 0.6)');
  drawChart('humChart', labels, hum, 'Kelembapan Udara (%)', 'rgba(54, 162, 235, 0.6)');
  drawChart('tanahChart', labels, tanah, 'Kelembapan Tanah', 'rgba(255, 206, 86, 0.6)');
}

// Load data dari Firebase Realtime Database
import { ref, onValue } from "./firebase.js";

const dbRef = ref(window.realtimeDB, "data");

onValue(dbRef, (snapshot) => {
  const rawData = snapshot.val();
  const dataArr = rawData ? Object.values(rawData) : [];
  updateDisplay(dataArr);
});
