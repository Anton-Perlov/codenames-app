
import * as firebase from "firebase/app"
require('firebase/database')

const firebaseConfig = {
    apiKey: "AIzaSyC45XgJXxNHEJPzFQb6KISJ86oCtCtIQoA",
    authDomain: "codenames-app.firebaseapp.com",
    databaseURL: "https://codenames-app.firebaseio.com",
    projectId: "codenames-app",
    storageBucket: "codenames-app.appspot.com",
    messagingSenderId: "774207860665",
    appId: "1:774207860665:web:ef532560504c591162d068"
}

firebase.initializeApp(firebaseConfig)

export function getDatabase(){
    return firebase.database()
}
