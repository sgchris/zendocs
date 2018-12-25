// Initialize Firebase
firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
});

var FIREBASE_DB = firebase.database();
var POSTS = FIREBASE_DB.ref().child('posts');