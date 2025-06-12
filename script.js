async function fetchAndDisplay() {
  const res = await fetch('data.json');
  const data = await res.json();

  const suhuData = data.map(d => parseFloat(d.suhu) || null);
  const humData = data.map(d => parseFloat(d.kelembapan) || null);
  const tanahData = data.map(d => parseFloat(d.tanah) || null);
  const labels = data.map(d => d.timestamp.split(" ")[1]);

  const latest = data[data.length - 1] || {};
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
}

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

fetchAndDisplay();
setInterval(fetchAndDisplay, 15000);
