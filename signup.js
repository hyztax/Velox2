// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBXb9OhOEOo4gXNIv2WcCNmXfnm1x7R2EM",
  authDomain: "velox-c39ad.firebaseapp.com",
  projectId: "velox-c39ad",
  storageBucket: "velox-c39ad.appspot.com",
  messagingSenderId: "404832661601",
  appId: "1:404832661601:web:9ad221c8bfb459410bba20",
  measurementId: "G-X8W755KRF6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const usernameInput = signupForm.querySelector('input[name="username"]');
  const emailInput = signupForm.querySelector('input[name="email"]');
  const passwordInput = signupForm.querySelector('input[name="password"]');

  // Username validation
  usernameInput.addEventListener('input', () => {
    const value = usernameInput.value.trim();
    const valid = /^[a-zA-Z]{3,10}$/.test(value);

    if (!valid) {
      usernameInput.setCustomValidity("You need 3–10 letters (A–Z only)");
      usernameInput.reportValidity();
      usernameInput.style.borderColor = 'red';
    } else {
      usernameInput.setCustomValidity('');
      usernameInput.style.borderColor = '';
    }
  });

  // Form submission
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);

      // Set display name
      await userCredential.user.updateProfile({
        displayName: username
      });

      // Create Firestore document
      await db.collection('users').doc(userCredential.user.uid).set({
        displayName: username,
        bio: "",
        avatarUrl: null,
        email: email
      });

      // Redirect to sign-in
      window.location.href = 'signin.html';
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});
