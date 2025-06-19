let charts = {};
let maxDataPoints = 15; // Batasi jumlah data yang ditampilkan

function drawChart(id, labels, data, label, color, unit = '') {
  if (charts[id]) charts[id].destroy();

  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${label} (${unit})`,
        data,
        borderColor: color,
        backgroundColor: color + '20', // Tambahkan opacity
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { 
          beginAtZero: false,
          title: { display: true, text: unit }
        },
        x: { title: { display: true, text: 'Waktu' } }
      }
    }
  });
}

function processData(rawData) {
  if (!rawData) return null;

  const entries = Object.entries(rawData)
    .map(([timestamp, data]) => ({
      timestamp: new Date(timestamp),
      suhu: parseFloat(data.suhu),
      kelembapan: parseFloat(data.kelembapan),
      tanah: parseFloat(data.tanah)
    }))
    .filter(entry => !isNaN(entry.suhu) && !isNaN(entry.kelembapan) && !isNaN(entry.tanah))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Ambil hanya data terakhir (maxDataPoints) untuk grafik
  const slicedEntries = entries.slice(-maxDataPoints);
  
  return {
    entries: slicedEntries,
    latest: entries[entries.length - 1] || null
  };
}

function updateUI(data) {
  if (!data.latest) {
    document.getElementById('suhu').textContent = '--';
    document.getElementById('kelembapan').textContent = '--';
    document.getElementById('tanah').textContent = '--';
    document.getElementById('rekomendasi').textContent = 
      "⚠️ Data tidak tersedia. Periksa koneksi sensor.";
    return;
  }

  const { suhu, kelembapan, tanah } = data.latest;
  
  // Update nilai sensor
  document.getElementById('suhu').textContent = suhu.toFixed(1);
  document.getElementById('kelembapan').textContent = kelembapan.toFixed(1);
  document.getElementById('tanah').textContent = tanah.toFixed(0);

  // Update rekomendasi tanaman
  const rekomText = getPlantRecommendation(suhu, kelembapan, tanah);
  document.getElementById('rekomendasi').textContent = rekomText;

  // Format waktu untuk grafik
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const labels = data.entries.map(entry => 
    timeFormatter.format(entry.timestamp)
  );

  // Update grafik
  drawChart('suhuChart', labels, 
    data.entries.map(d => d.suhu), 'Suhu', '#ff6384', '°C');
  drawChart('humChart', labels, 
    data.entries.map(d => d.kelembapan), 'Kelembapan Udara', '#36a2eb', '%');
  drawChart('tanahChart', labels, 
    data.entries.map(d => d.tanah), 'Kelembapan Tanah', '#ffce56', '');
}

function getPlantRecommendation(suhu, kelembapanUdara, kelembapanTanah) {
  // Logika rekomendasi yang lebih kompleks
  if (kelembapanTanah < 1000) {
    return "Tanah sangat kering. Cocok untuk: Kaktus, Sukulen, atau Lidah Mertua.";
  } else if (kelembapanTanah < 2500) {
    if (suhu > 30) {
      return "Tanah cukup lembap dan suhu tinggi. Cocok untuk: Cabai, Tomat, atau Terong.";
    } else {
      return "Tanah cukup lembap. Cocok untuk: Selada, Bayam, atau Kangkung.";
    }
  } else {
    return "Tanah sangat lembap. Cocok untuk: Padi, Kangkung Air, atau Selada Air.";
  }
}

function initFirebase() {
  const db = window.realtimeDB;
  const dataRef = window.ref(db, 'sensor');

  window.onValue(dataRef, (snapshot) => {
    try {
      const processedData = processData(snapshot.val());
      updateUI(processedData);
    } catch (error) {
      console.error("Error processing data:", error);
      document.getElementById('rekomendasi').textContent = 
        "⚠️ Terjadi kesalahan saat memproses data sensor.";
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFirebase);
