import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://iot-haidar-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Debug 1: Cek inisialisasi Firebase
try {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  console.log("Firebase initialized successfully");
  
  // Debug 2: Cek koneksi ke path 'sensor'
  onValue(ref(db, 'sensor'), (snapshot) => {
    const data = snapshot.val();
    console.log("Data received:", data); // Harus muncul di browser console
    
    if (!data) {
      console.error("Data is empty");
      return;
    }

    // Debug 3: Cek update DOM
    document.getElementById('tanah').textContent = data.tanah || "N/A";
    console.log("DOM updated");
    
  }, { onlyOnce: false });

} catch (error) {
  console.error("Firebase error:", error);
}
