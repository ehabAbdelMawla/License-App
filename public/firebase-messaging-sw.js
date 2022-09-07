console.log(" Service Worker Loaded");
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyB8WHzjOV_kLr48Z0M0Ol4SVh9M5uLyE-4",
    authDomain: "sunglassesvalidation.firebaseapp.com",
    databaseURL: "https://sunglassesvalidation.firebaseio.com",
    projectId: "sunglassesvalidation",
    storageBucket: "sunglassesvalidation.appspot.com",
    messagingSenderId: "177597671284",
    appId: "1:177597671284:web:b5fcf22688dde2f0c1ee21",
    measurementId: "G-502Q9JPPX1"
});
const messaging = firebase.messaging();
self.__WB_MANIFEST = {}
self.addEventListener("push", e => {
    const payload = e.data.json();
    const { notification, data } = payload
    self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: "./logo.png",
    });
});