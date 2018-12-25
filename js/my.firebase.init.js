// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyB07EkhVfJ6vkPCjg-8sTqsSFrcCxRFjq4",
    authDomain: "zendocs-43700.firebaseapp.com",
    databaseURL: "https://zendocs-43700.firebaseio.com",
    projectId: "zendocs-43700",
    storageBucket: "",
    messagingSenderId: "570118287413"
});

var FIREBASE_DB = firebase.database();
var POSTS = FIREBASE_DB.ref().child('posts');