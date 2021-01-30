import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <div className="App">
      <h2>React Authentication Using Firebase</h2>
    </div>
  );
}

export default App;
