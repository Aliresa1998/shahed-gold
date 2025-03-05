importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyB677KeMnW4rgwqmkTCJdYZJyx0mDERj88",
    authDomain: "shahedgold-2b375.firebaseapp.com",
    projectId: "shahedgold-2b375",
    storageBucket: "shahedgold-2b375.appspot.com",
    messagingSenderId: "1002464102383",
    appId: "1:1002464102383:web:84681d2d082474cfe7d81a",
    measurementId: "G-FEZE1KE1X8"
});

// Initialize Firebase messaging
const messaging = firebase.messaging();