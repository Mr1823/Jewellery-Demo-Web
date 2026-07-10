// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

const isConfigured = 
  import.meta.env.VITE_APIKEY && 
  import.meta.env.VITE_APIKEY !== "your_firebase_api_key" && 
  import.meta.env.VITE_APIKEY.trim() !== "";

let app = null;
let analytics = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    // Only initialize analytics in browser environments where it's supported
    if (typeof window !== "undefined") {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn("Analytics not available:", analyticsError.message);
      }
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase credentials are not configured or are using placeholders. Authentication will run in Demo Mode.");
}

export { analytics };
export default app;

