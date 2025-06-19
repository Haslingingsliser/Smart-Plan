const channelID = "2515806";

function getPlantRecommendation(temp, humidity, soil) {
  if (temp >= 26 && temp <= 32 && humidity >= 60 && soil < 1000) {
    return {
      name: "Padi",
      planting: "Padi ditanam di lahan basah yang tergenang air. Tabur benih di lahan semai, lalu pindahkan ke sawah setelah 21 hari.",
      care: "Jaga irigasi agar tanah tetap tergenang, berikan pupuk urea dan pestisida sesuai tahap pertumbuhan."
    };
  } else if (temp >= 24 && temp <= 30 && humidity >= 50 && soil >= 1000 && soil <= 2500) {
    return {
      name: "Cabai",
      planting: "Semai benih cabai di tray selama 10–14 hari, lalu pindahkan ke tanah gembur berdrainase baik.",
      care: "Sirami rutin pagi/sore, beri pupuk kandang dan pestisida organik untuk hama daun."
    };
  } else if (temp >= 20 && temp <= 35 && humidity <= 50 && soil > 2500) {
    return {
      name: "Kaktus",
      planting: "Tanam di media berpasir, berdrainase tinggi. Jangan terlalu dalam.",
      care: "Letakkan di area terang, siram 1–2 minggu sekali. Hindari tanah lembab."
    };
  } else {
    return {
      name: "Tidak ada yang cocok",
      planting: "Kondisi lingkungan tidak cocok untuk tanaman standar.",
      care: "-"
    };
  }
}

function fetchLatestData() {
  document.getElementById("temp").textContent = "--";
  document.getElementById("hum").textContent = "--";
  document.getElementById("soil").textContent = "--";

  Promise.all([
    fetch(`https://api.thingspeak.com/channels/${channelID}/fields/1.json?results=1`).then(r => r.json()),
    fetch(`https://api.thingspeak.com/channels/${channelID}/fields/2.json?results=1`).then(r => r.json()),
    fetch(`https://api.thingspeak.com/channels/${channelID}/fields/3.json?results=1`).then(r => r.json())
  ])
  .then(([tempRes, humRes, soilRes]) => {
    const suhu = Number(tempRes.feeds[0].field1);
    const kelembapan = Number(humRes.feeds[0].field2);
    const tanah = Number(soilRes.feeds[0].field3);

    document.getElementById("temp").textContent = suhu.toFixed(1);
    document.getElementById("hum").textContent = kelembapan.toFixed(1);
    document.getElementById("soil").textContent = tanah;

    const rec = getPlantRecommendation(suhu, kelembapan, tanah);
    document.getElementById("plantName").textContent = rec.name;
    document.getElementById("plantingGuide").textContent = rec.planting;
    document.getElementById("careGuide").textContent = rec.care;

    console.log("Data terbaru → Suhu:", suhu, "°C | Kelembapan:", kelembapan, "% | Tanah:", tanah);
  })
  .catch(err => {
    console.error("Gagal mengambil data dari ThingSpeak:", err);
  });
}

fetchLatestData();
setInterval(fetchLatestData, 5000);
