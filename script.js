// Ganti config ini dengan milikmu dari Firebase Project Settings
const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://iottugas-1678e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Data untuk grafik
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
      x: { title: { display: true, text: 'Waktu' } },
      y: { beginAtZero: true, title: { display: true, text: 'Nilai ADC' } }
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

// Ambil data real-time dari Firebase
db.ref("/sensor/soil_moisture").on("value", snapshot => {
  const value = snapshot.val();
  const now = new Date();
  const timeLabel = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

  labels.push(timeLabel);
  dataPoints.push(value);
  if (labels.length > 10) {
    labels.shift();
    dataPoints.shift();
  }

  soilChart.update();
  updateRecommendation(value);
});
