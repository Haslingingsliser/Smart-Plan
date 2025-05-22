// Ganti ini dengan Channel ID dan API Key ThingSpeak Anda
const CHANNEL_ID = 2970299;
const READ_API_KEY = "L8C7WH7SG2W6BK1K";

const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

function fetchSensorData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const suhu = parseFloat(data.field1).toFixed(1);
      const kelembapanUdara = parseFloat(data.field2).toFixed(1);
      const kelembapanTanah = parseInt(data.field3);

      document.getElementById("temperature").textContent = suhu;
      document.getElementById("humidity").textContent = kelembapanUdara;
      document.getElementById("soil").textContent = kelembapanTanah;

      // Analisis rekomendasi tanaman
      const recommendation = getPlantRecommendation(kelembapanTanah);
      document.getElementById("plant-recommendation").textContent = recommendation;
    })
    .catch(error => {
      console.error("Gagal mengambil data:", error);
    });
}

// Fungsi rekomendasi berdasarkan kelembapan tanah
function getPlantRecommendation(soilMoisture) {
  if (soilMoisture < 1000) {
    return "Tanah sangat basah — cocok untuk padi, kangkung, atau talas.";
  } else if (soilMoisture < 2000) {
    return "Tanah lembab — cocok untuk bayam, selada, atau seledri.";
  } else if (soilMoisture < 3000) {
    return "Tanah agak kering — cocok untuk cabai, tomat, atau terong.";
  } else {
    return "Tanah kering — cocok untuk tanaman kaktus atau lidah buaya.";
  }
}

// Ambil data saat halaman dibuka
fetchSensorData();

// Update data setiap 30 detik
setInterval(fetchSensorData, 30000);
