// // src/firebase.ts

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // ** ADD THESE TWO IMPORTS **
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyA038MsSOtYNjTaZ2uwIrzJAzvT9eE45EQ",
//   authDomain: "flatmate-vibe.firebaseapp.com",
//   projectId: "flatmate-vibe",
//   storageBucket: "flatmate-vibe.firebasestorage.app",
//   messagingSenderId: "448729787054",
//   appId: "1:448729787054:web:f79ef3f204455e06425b3f",
//   measurementId: "G-LRSZWXLFC9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// // ** ADD THESE TWO LINES TO EXPORT THE SERVICES **
// export const auth = getAuth(app);
// export const db = getFirestore(app);