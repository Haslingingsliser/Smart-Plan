const apiKey = 'L8C7WH7SG2W6BK1K';
const channelId = '2970299';

async function fetchData() {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${channelId}/feeds.json?results=1&api_key=${apiKey}`
    );
    const data = await response.json();
    const feed = data.feeds[0];

    const temperature = parseFloat(feed.field1);
    const humidity = parseFloat(feed.field2);
    const soilMoisture = parseFloat(feed.field3);

    document.getElementById('temperature').textContent = isNaN(temperature) ? '--' : temperature.toFixed(1);
    document.getElementById('humidity').textContent = isNaN(humidity) ? '--' : humidity.toFixed(1);
    document.getElementById('soil').textContent = isNaN(soilMoisture) ? '--' : soilMoisture.toFixed(1);

    tampilkanRekomendasi(soilMoisture);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

function tampilkanRekomendasi(soil) {
  const rekomendasiEl = document.getElementById('plant-recommendation');
  if (isNaN(soil)) {
    rekomendasiEl.textContent = 'Data belum tersedia.';
    return;
  }

  if (soil < 30) {
    rekomendasiEl.textContent = '🌵 Cocok untuk tanaman kering seperti lidah buaya atau kaktus.';
  } else if (soil < 70) {
    rekomendasiEl.textContent = '🌱 Cocok untuk tanaman umum seperti bayam, cabai, atau tomat.';
  } else {
    rekomendasiEl.textContent = '💧 Cocok untuk tanaman air seperti kangkung atau talas (tanah basah).';
  }
}

document.getElementById('mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

fetchData();
setInterval(fetchData, 15000); // refresh data setiap 15 detik
