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

// Helper to render a single message
function renderMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  const time = msg.timestamp
    ? msg.timestamp.toDate().toLocaleTimeString()
    : '...';
  div.textContent = `[${time}] ${msg.user}: ${msg.text}`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Listen for real-time updates (initial load + new)
db.collection('messages')
  .orderBy('timestamp', 'asc')
  .onSnapshot(snapshot => {
    // On first load, clear container
    if (snapshot.docChanges().length === snapshot.size) {
      messagesEl.innerHTML = '';
    }
    // Render only added messages
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        renderMessage(change.doc.data());
      }
    });
  });

// Send new message
form.addEventListener('submit', e => {
  e.preventDefault();
  const user = userInput.value.trim();
  const text = input.value.trim();
  if (!user || !text) return;

  // Add to Firestore (serverTimestamp ensures ordering)
  db.collection('messages').add({
    user,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(console.error);

  input.value = '';
});
