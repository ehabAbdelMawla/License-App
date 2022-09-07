import Firebase from 'firebase'
var firebaseConfig = {
    apiKey: "ENTER_YOUR_VALUE",
    authDomain: "ENTER_YOUR_VALUE",
    databaseURL: "ENTER_YOUR_VALUE",
    projectId: "ENTER_YOUR_VALUE",
    storageBucket: "ENTER_YOUR_VALUE",
    messagingSenderId: "ENTER_YOUR_VALUE",
    appId: "ENTER_YOUR_VALUE",
    measurementId: "ENTER_YOUR_VALUE"
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig);
// Firebase.analytics();


export default Firebase;