import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  });

  // Google sign in 
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
      })
      .then(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  return (
    <div className="App">
      <h2>React Authentication Using Firebase</h2>
      <br />
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} style={{ width: '25%' }} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
