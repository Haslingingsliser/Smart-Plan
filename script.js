const apiKey = "L8C7WH7SG2W6BK1K";
const channelId = "2970299";

async function fetchData() {
  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`;
    const response = await fetch(url);
    const data = await response.json();
    const latest = data.feeds[0];

    const suhu = parseFloat(latest.field1);
    const kelembapan = parseFloat(latest.field2);
    const kelembapanTanah = parseFloat(latest.field3);

    document.getElementById("temperature").textContent = suhu.toFixed(1);
    document.getElementById("humidity").textContent = kelembapan.toFixed(1);
    document.getElementById("soil").textContent = kelembapanTanah.toFixed(0);

    // Ganti warna berdasarkan kelembapan tanah
    const soilSpan = document.getElementById("soil");
    if (kelembapanTanah < 1000) {
      soilSpan.style.color = "blue";
    } else if (kelembapanTanah < 2000) {
      soilSpan.style.color = "green";
    } else {
      soilSpan.style.color = "orange";
    }

    tampilkanRekomendasi(kelembapanTanah);

  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}

function tampilkanRekomendasi(soilMoisture) {
  const rekomendasiBox = document.getElementById("recommendation");

  if (soilMoisture < 1000) {
    rekomendasiBox.textContent = "Tanah sangat basah. Cocok untuk padi atau tanaman air.";
  } else if (soilMoisture < 2000) {
    rekomendasiBox.textContent = "Tanah lembap. Cocok untuk bayam, kangkung, dan tomat.";
  } else {
    rekomendasiBox.textContent = "Tanah kering. Cocok untuk kaktus, singkong, atau tanaman tahan panas.";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

fetchData();
setInterval(fetchData, 30000); // Update setiap 30 detik
