let charts = {};

function drawChart(id, labels, data, label, color) {
  if (charts[id]) charts[id].destroy();

  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, {
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
}

async function fetchAndDisplay() {
  const db = window.realtimeDB;
  const dataRef = window.ref(db, 'sensor');

  window.onValue(dataRef, (snapshot) => {
    const rawData = snapshot.val();
    if (!rawData) return;

    const entries = Object.entries(rawData).map(([key, val]) => ({
      ...val,
      timestamp: key
    }));

    entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const suhuData = entries.map(d => parseFloat(d.suhu) || null);
    const humData = entries.map(d => parseFloat(d.kelembapan) || null);
    const tanahData = entries.map(d => parseFloat(d.tanah) || null);
    const labels = entries.map(d => d.timestamp.split("T")[1]?.slice(0, 5) || d.timestamp);

    const latest = entries[entries.length - 1] || {};
    document.getElementById('suhu').textContent = latest.suhu || '--';
    document.getElementById('kelembapan').textContent = latest.kelembapan || '--';
    document.getElementById('tanah').textContent = latest.tanah || '--';

    const kelembapanTanah = parseInt(latest.tanah);
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

    drawChart('suhuChart', labels, suhuData, 'Suhu (°C)', 'rgba(255, 99, 132, 0.6)');
    drawChart('humChart', labels, humData, 'Kelembapan Udara (%)', 'rgba(54, 162, 235, 0.6)');
    drawChart('tanahChart', labels, tanahData, 'Kelembapan Tanah', 'rgba(255, 206, 86, 0.6)');
  });
}

fetchAndDisplay();
