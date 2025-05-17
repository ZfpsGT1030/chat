// Firebase config (replace with your values)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const messagesEl = document.getElementById('messages');
const form = document.getElementById('form');
const userInput = document.getElementById('user');
const input = document.getElementById('input');

// Listen for real-time updates
db.collection('messages')
  .orderBy('timestamp')
  .onSnapshot(snapshot => {
    messagesEl.innerHTML = '';
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement('div');
      const time = msg.timestamp.toDate().toLocaleTimeString();
      div.textContent = `[${time}] ${msg.user}: ${msg.text}`;
      div.classList.add('message');
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

// Send new message
form.addEventListener('submit', e => {
  e.preventDefault();
  const user = userInput.value.trim();
  const text = input.value.trim();
  if (!user || !text) return;

  db.collection('messages').add({
    user,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = '';
});
