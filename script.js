// Konfigurasi Firebase kamu (gunakan yang sudah kamu punya)
const firebaseConfig = {
  apiKey: "AIzaSyCBQHsrCvAi_UT6bcq0JZFL8gluS0Z8-Dg",
  authDomain: "iottugas-1678e.firebaseapp.com",
  databaseURL: "https://iottugas-1678e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iottugas-1678e",
  storageBucket: "iottugas-1678e.firebasestorage.app",
  messagingSenderId: "868045535714",
  appId: "1:868045535714:web:7cf4606d5eda5c8f5a61bb",
  measurementId: "G-P9FGG0Q107"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Persiapan chart
let labels = [];
let dataPoints = [];

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

// Fungsi update rekomendasi
function updateRecommendation(value) {
  let recommendation = "-";
  if (value < 1000) {
    recommendation = "Tanaman air (padi, kangkung)";
  } else if (value < 2500) {
    recommendation = "Sayuran (cabai, tomat)";
  } else {
    recommendation = "Tanaman kering (kaktus, lidah buaya)";
  }
  document.getElementById("recommendation").textContent = recommendation;
}

// Ambil data dari Firebase secara real-time
db.ref("/sensor/soil_moisture").on("value", (snapshot) => {
  const value = snapshot.val();
  const now = new Date();
  const timeLabel = now.toLocaleTimeString();

  // Update data dan label
  labels.push(timeLabel);
  dataPoints.push(value);

  // Maksimal 10 data di chart
  if (labels.length > 10) {
    labels.shift();
    dataPoints.shift();
  }

  // Update chart dan rekomendasi
  soilChart.update();
  updateRecommendation(value);
});
