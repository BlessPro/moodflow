// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged
// } from 'firebase/auth';
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   query,
//   where,
//   getDocs,
//   orderBy
// } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "YOUR_FIREBASE_API_KEY",
//   authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
//   projectId: "YOUR_FIREBASE_PROJECT_ID",
//   storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const db = getFirestore(app);
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

import { auth, provider, db } from './firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import './App.css';
import './index.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('');
  const [motivation, setMotivation] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchHistory(currentUser.uid);
      }
    });
  }, []);

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setHistory([]);
  };

  const submitMood = async () => {
    const newMotivation = generateMotivation(mood);
    await addDoc(collection(db, 'moods'), {
      uid: user.uid,
      text: mood,
      motivation: newMotivation,
      timestamp: new Date()
    });
    setMotivation(newMotivation);
    setMood('');
    fetchHistory(user.uid);
  };

  const fetchHistory = async (uid) => {
    const q = query(
      collection(db, 'moods'),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.data());
    setHistory(data);
  };

  const generateMotivation = (text) => {
    const positive = [
      "Keep shining, your happiness is contagious!",
      "Enjoy every moment, you earned it!"
    ];
    const negative = [
      "Every storm passes. You're stronger than you think.",
      "Tough days build tougher people. Keep going."
    ];
    return text.includes('sad') || text.includes('tired')
      ? negative[Math.floor(Math.random() * negative.length)]
      : positive[Math.floor(Math.random() * positive.length)];
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Mood Logger</h1>
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Hello, {user.displayName}</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">My Mood</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Tell me exactly how you feel"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <button
          onClick={submitMood}
          className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
        >
          Submit
        </button>
        {motivation && (
          <div className="mt-4 p-3 bg-yellow-100 rounded">
            <strong>Motivator:</strong> {motivation}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">My History</h2>
        {history.map((entry, i) => (
          <div key={i} className="mt-2 p-2 border rounded">
            <p><strong>Mood:</strong> {entry.text}</p>
            <p><strong>Motivation:</strong> {entry.motivation}</p>
            <p className="text-sm text-gray-500">{new Date(entry.timestamp.seconds * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
