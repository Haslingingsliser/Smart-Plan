const channelID = "2515806"; // Ganti jika channel ID berubah

const tempLabels = [], humLabels = [], soilLabels = [];
const tempData = [], humData = [], soilData = [];

const tempChart = new Chart(document.getElementById('tempChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: tempLabels,
    datasets: [{
      label: 'Suhu (°C)',
      data: tempData,
      borderColor: '#FF5722',
      backgroundColor: 'rgba(255, 87, 34, 0.2)',
      fill: true,
      tension: 0.3
    }]
  }
});

const humChart = new Chart(document.getElementById('humChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: humLabels,
    datasets: [{
      label: 'Kelembapan Udara (%)',
      data: humData,
      borderColor: '#03A9F4',
      backgroundColor: 'rgba(3, 169, 244, 0.2)',
      fill: true,
      tension: 0.3
    }]
  }
});

const soilChart = new Chart(document.getElementById('soilChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: soilLabels,
    datasets: [{
      label: 'Kelembapan Tanah (ADC)',
      data: soilData,
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.3
    }]
  }
});

function updateRecommendation(value) {
  let rec = "-";
  if (value < 1000) rec = "Tanaman air (padi, kangkung)";
  else if (value < 2500) rec = "Sayuran (cabai, tomat)";
  else rec = "Tanaman kering (kaktus, lidah buaya)";
  document.getElementById("recommendation").textContent = rec;
}

function fetchFieldData(field, labels, dataArr, chart) {
  fetch(`https://api.thingspeak.com/channels/${channelID}/fields/${field}.json?results=10`)
    .then(res => res.json())
    .then(data => {
      const feeds = data.feeds;
      labels.length = 0;
      dataArr.length = 0;
      feeds.forEach(feed => {
        labels.push(new Date(feed.created_at).toLocaleTimeString());
        dataArr.push(Number(feed[`field${field}`]));
      });
      chart.update();
      if (field === 3) updateRecommendation(dataArr[dataArr.length - 1]);
    })
    .catch(err => {
      console.error(`Gagal mengambil data Field ${field}:`, err);
    });
}

function fetchAllData() {
  fetchFieldData(1, tempLabels, tempData, tempChart);
  fetchFieldData(2, humLabels, humData, humChart);
  fetchFieldData(3, soilLabels, soilData, soilChart);
}

fetchAllData();
setInterval(fetchAllData, 5000);
