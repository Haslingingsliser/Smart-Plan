const labels = [];
const dataPoints = [];

const ctx = document.getElementById('soilChart').getContext('2d');
const soilChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Kelembapan Tanah (ADC)',
      data: dataPoints,
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Waktu'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nilai ADC'
        }
      }
    }
  }
});

function updateRecommendation(value) {
  let rec = "-";
  if (value < 1000) rec = "Tanaman air (padi, kangkung)";
  else if (value < 2500) rec = "Sayuran (cabai, tomat)";
  else rec = "Tanaman kering (kaktus, lidah buaya)";
  document.getElementById("recommendation").textContent = rec;
}

// Ganti dengan CHANNEL ID kamu dari ThingSpeak
const channelID = "2515806"; // Ubah jika berbeda
const fieldNumber = 1;

function fetchData() {
  fetch(`https://api.thingspeak.com/channels/${channelID}/fields/${fieldNumber}.json?results=10`)
    .then(res => res.json())
    .then(data => {
      const feeds = data.feeds;
      labels.length = 0;
      dataPoints.length = 0;

      feeds.forEach(feed => {
        labels.push(new Date(feed.created_at).toLocaleTimeString());
        dataPoints.push(Number(feed[`field${fieldNumber}`]));
      });

      soilChart.update();

      const latest = dataPoints[dataPoints.length - 1];
      updateRecommendation(latest);
    })
    .catch(err => {
      console.error("Gagal mengambil data dari ThingSpeak:", err);
    });
}

// Ambil data setiap 5 detik
fetchData();
setInterval(fetchData, 5000);
