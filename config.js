import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC9VDBx2KGRutjkKcJl7pEJxDt-pDwbqHc",
    authDomain: "biblioteca-3.firebaseapp.com",
    projectId: "biblioteca-3",
    storageBucket: "biblioteca-3.appspot.com",
    messagingSenderId: "457836720350",
    appId: "1:457836720350:web:99fe27750b08c2b2d0924f"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };