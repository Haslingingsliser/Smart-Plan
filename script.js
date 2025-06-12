async function fetchAndDisplay() {
  const res = await fetch('data.json');
  const data = await res.json();

  const suhuData = data.map(d => parseFloat(d.suhu) || null);
  const humData = data.map(d => parseFloat(d.kelembapan) || null);
  const tanahData = data.map(d => parseFloat(d.tanah) || null);
  const labels = data.map(d => d.timestamp.split(" ")[1]); // ambil jam

  // Tampilkan data terakhir
  const latest = data[data.length - 1] || {};
  document.getElementById('suhu').textContent = latest.suhu || '--';
  document.getElementById('kelembapan').textContent = latest.kelembapan || '--';
  document.getElementById('tanah').textContent = latest.tanah || '--';

  // Rekomendasi
  const kelembapanTanah = parseInt(latest.tanah);
  const rekom = document.getElementById('rekomendasi');
  if (kelembapanTanah < 1000) {
    rekom.textContent = "Tanah sangat kering, cocok untuk kaktus atau sukulen.";
  } else if (kelembapanTanah < 2500) {
    rekom.textContent = "Tanah cukup lembap, cocok untuk tanaman sayur.";
  } else {
    rekom.textContent = "Tanah sangat lembap, cocok untuk tanaman air atau padi.";
  }

  // Gambar grafik
  createChart('suhuChart', labels, suhuData, 'Suhu (°C)', 'rgba(255, 99, 132, 0.6)');
  createChart('humChart', labels, humData, 'Kelembapan Udara (%)', 'rgba(54, 162, 235, 0.6)');
  createChart('tanahChart', labels, tanahData, 'Kelembapan Tanah', 'rgba(255, 206, 86, 0.6)');
}

function createChart(canvasId, labels, data, label, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
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
