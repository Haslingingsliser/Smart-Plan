import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2TnzeIu4bYewXBTxcMR41DiTqCja53_Q",
  authDomain: "iot-haidar.firebaseapp.com",
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-haidar",
  storageBucket: "iot-haidar.appspot.com",
  messagingSenderId: "863414396307",
  appId: "1:863414396307:web:18900ca6dfb76903343466",
  measurementId: "G-CC1L1H1Y0L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.realtimeDB = db;
window.ref = ref;
window.onValue = onValue;
