const channelID = 2970299;
const apiKey = 'L8C7WH7SG2W6BK1K';
const url = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${apiKey}`;

function fetchData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById('suhu').textContent = data.field1 || '--';
      document.getElementById('kelembapan').textContent = data.field2 || '--';
      document.getElementById('tanah').textContent = data.field3 || '--';

      // Rekomendasi berdasarkan nilai kelembapan tanah (contoh sederhana)
      const kelembapanTanah = parseInt(data.field3);
      const rekom = document.getElementById('rekomendasi');
      if (kelembapanTanah < 1000) {
        rekom.textContent = "Tanah sangat kering, cocok untuk kaktus atau sukulen.";
      } else if (kelembapanTanah < 2500) {
        rekom.textContent = "Tanah cukup lembap, cocok untuk tanaman sayur.";
      } else {
        rekom.textContent = "Tanah sangat lembap, cocok untuk tanaman air atau padi.";
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data dari ThingSpeak:", error);
    });
}

// Ambil data setiap 15 detik
fetchData();
setInterval(fetchData, 15000);
