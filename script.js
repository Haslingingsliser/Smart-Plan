function fetchData() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById('suhu').textContent = data.suhu || '--';
      document.getElementById('kelembapan').textContent = data.kelembapan || '--';
      document.getElementById('tanah').textContent = data.tanah || '--';

      const kelembapanTanah = parseInt(data.tanah);
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
      console.error("Gagal mengambil data:", error);
    });
}

fetchData();
setInterval(fetchData, 15000); // refresh tiap 15 detik
