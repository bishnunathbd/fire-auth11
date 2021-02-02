import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
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
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  // sign out
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        };
        setUser(signedOutUser);
      })
      .catch(err => {
        // an error happened
      })
  }

  const handleInputBlur = (e) => {
    let isFieldValid = true;
    // debugger;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const hasPasswordNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && hasPasswordNumber;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  return (
    <div className="App">
      <h2>React Authentication Using Firebase</h2>
      <br />
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>
          : <button onClick={handleGoogleSignIn}>Google Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} style={{ width: '25%' }} alt="" />
        </div>
      }

      <h2>Our own Authentication</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" onBlur={handleInputBlur} placeholder="Your Name" />
        <br />
        <input type="text" name="email" onBlur={handleInputBlur} placeholder="Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handleInputBlur} id="" placeholder="Your Password" required />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User created successfully.</p>}
    </div>
  );
}

export default App;
