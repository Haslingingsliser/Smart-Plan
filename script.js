import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2TnzeIu4bYewXBTxcMR41DiTqCja53_Q",
  authDomain: "iot-haidar.firebaseapp.com",
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-haidar",
  storageBucket: "iot-haidar.appspot.com",
  messagingSenderId: "863414396307",
  appId: "1:863414396307:web:18900ca6dfb76903343466"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const sensorRef = ref(db, 'sensor_data');

onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    document.getElementById('tanah').textContent = "No data";
    return;
  }

  // Get most recent entry
  const entries = Object.values(data);
  const latest = entries[entries.length - 1];
  
  // Update UI
  document.getElementById('tanah').textContent = latest.soil_moisture + '%';
  document.getElementById('tanah-raw').textContent = latest.soil_raw;
  document.getElementById('timestamp').textContent = latest.timestamp;
});
