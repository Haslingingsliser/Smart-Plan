const channelID = 2970299;
const apiKey = 'L8C7WH7SG2W6BK1K'; // Read API Key jika dibutuhkan
const url = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json`;

async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const suhu = parseFloat(data.field1);
    const kelembapanUdara = parseFloat(data.field2);
    const kelembapanTanah = parseInt(data.field3);

    document.getElementById("temperature").textContent = suhu.toFixed(1);
    document.getElementById("humidity").textContent = kelembapanUdara.toFixed(1);
    document.getElementById("soil").textContent = kelembapanTanah;

    updateRecommendation(kelembapanTanah);
  } catch (error) {
    console.error("Gagal mengambil data dari ThingSpeak:", error);
  }
}

function updateRecommendation(soilMoisture) {
  let rekomendasi = "Tanaman tidak diketahui";

  if (soilMoisture < 300) {
    rekomendasi = "🌵 Cocok untuk tanaman kaktus atau lidah buaya (tanah kering)";
  } else if (soilMoisture >= 300 && soilMoisture < 600) {
    rekomendasi = "🌱 Cocok untuk sayuran daun seperti bayam atau selada (tanah lembap sedang)";
  } else if (soilMoisture >= 600) {
    rekomendasi = "💧 Cocok untuk tanaman air seperti kangkung atau genjer (tanah sangat basah)";
  }

  document.getElementById("plant-recommendation").textContent = rekomendasi;
}

// Dark/Light mode toggle
document.getElementById("mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Auto update tiap 20 detik
fetchData();
setInterval(fetchData, 20000);
