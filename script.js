const channelID = "2970299";

function getPlantRecommendation(temp, humidity, soil) {
  if (temp >= 26 && temp <= 32 && humidity >= 60 && soil < 1000) {
    return {
      name: "Padi 🌾",
      planting: "Tanam di sawah basah, semai dulu selama 21 hari sebelum pindah tanam.",
      care: "Pastikan air menggenang, beri pupuk urea, dan semprot pestisida bila perlu."
    };
  } else if (temp >= 24 && temp <= 30 && humidity >= 50 && soil >= 1000 && soil <= 2500) {
    return {
      name: "Cabai 🌶️",
      planting: "Semai benih di tray, lalu tanam di tanah gembur dengan sinar cukup.",
      care: "Siram pagi/sore, beri pupuk organik, dan lindungi dari hama."
    };
  } else if (temp >= 20 && temp <= 35 && humidity <= 50 && soil > 2500) {
    return {
      name: "Kaktus 🌵",
      planting: "Tanam di pot berpasir, jangan terlalu dalam.",
      care: "Taruh di tempat terang, siram 1–2 minggu sekali saja."
    };
  } else {
    return {
      name: "Tidak cocok ❌",
      planting: "Lingkungan saat ini tidak cocok untuk tanaman yang umum.",
      care: "-"
    };
  }
}

function fetchLatestData() {
  fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`)
    .then(res => res.json())
    .then(data => {
      const latest = data.feeds[0];
      const suhu = parseFloat(latest.field1);
      const kelembapan = parseFloat(latest.field2);
      const tanah = parseInt(latest.field3);

      document.getElementById("temp").textContent = isNaN(suhu) ? "--" : suhu.toFixed(1);
      document.getElementById("hum").textContent = isNaN(kelembapan) ? "--" : kelembapan.toFixed(1);
      document.getElementById("soil").textContent = isNaN(tanah) ? "--" : tanah;

      if (!isNaN(suhu) && !isNaN(kelembapan) && !isNaN(tanah)) {
        const rec = getPlantRecommendation(suhu, kelembapan, tanah);
        document.getElementById("plantName").textContent = rec.name;
        document.getElementById("plantingGuide").textContent = rec.planting;
        document.getElementById("careGuide").textContent = rec.care;
      } else {
        document.getElementById("plantName").textContent = "Data belum tersedia";
        document.getElementById("plantingGuide").textContent = "-";
        document.getElementById("careGuide").textContent = "-";
      }

      console.log("📡 Update:", suhu, kelembapan, tanah);
    })
    .catch(err => {
      console.error("⚠️ Gagal ambil data dari ThingSpeak:", err);
    });
}

fetchLatestData();
setInterval(fetchLatestData, 5000);
