import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://support.google.com/firebase/answer/7015592#zippy=%2Cin-this-article
// Scroll to bottom and click web option
const firebaseConfig = {
    apiKey: "AIzaSyAznlapA6L9HPksTDgOYeKbvfAVq9D76v4",
    authDomain: "word-game-79f6d.firebaseapp.com",
    projectId: "word-game-79f6d",
    storageBucket: "word-game-79f6d.appspot.com",
    messagingSenderId: "829512418189",
    appId: "1:829512418189:web:21f63e801e7894f689b3c4",
    measurementId: "G-GV105KKWX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const Pages = {
    name: 0,
    room_creation: 1,
    room_waiting: 2,
    game: 3,
}