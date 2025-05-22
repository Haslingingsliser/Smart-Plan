const channelID = 2970299;
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

    tampilkanRekomendasi(kelembapanTanah);
  } catch (err) {
    console.error("Gagal mengambil data dari ThingSpeak:", err);
  }
}

function tampilkanRekomendasi(nilaiTanah) {
  let saran = "Tidak tersedia";

  if (nilaiTanah < 300) {
    saran = "🌵 Cocok untuk kaktus atau sukulen (tanah kering)";
  } else if (nilaiTanah >= 300 && nilaiTanah < 600) {
    saran = "🌱 Cocok untuk sayuran daun seperti bayam, selada (tanah sedang)";
  } else {
    saran = "💧 Cocok untuk tanaman air seperti kangkung atau talas (tanah basah)";
  }

  document.getElementById("plant-recommendation").textContent = saran;
}

// Mode gelap/terang
document.getElementById("mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Ambil data setiap 20 detik
fetchData();
setInterval(fetchData, 20000);
