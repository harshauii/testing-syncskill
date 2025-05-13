import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBvqzYTaepJn-WvWMPSZJe26Ydkw-7MXLE",
  authDomain: "syncskilll.firebaseapp.com",
  projectId: "syncskilll",
  storageBucket: "syncskilll.firebasestorage.app",
  messagingSenderId: "203322315096",
  appId: "1:203322315096:web:958fc7d94806ef9a98552d",
  measurementId: "G-JWWWM2ZQSK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const elements = {
  mobileMenu: document.getElementById('mobileMenu'),
  mobileMenuButton: document.getElementById('mobileMenuButton'),
  mobileMenuClose: document.getElementById('mobileMenuClose'),
  userAvatar: document.getElementById('userAvatar'),
  mobileUserAvatar: document.getElementById('mobileUserAvatar'),
  userName: document.getElementById('userName'),
  dropdownAvatar: document.getElementById('dropdownAvatar'),
  dropdownName: document.getElementById('dropdownName'),
  dropdownEmail: document.getElementById('dropdownEmail'),
  mobileUserName: document.getElementById('mobileUserName'),
  mobileUserEmail: document.getElementById('mobileUserEmail')
};

// Update user profile
const updateUserProfile = (user) => {
  if (!user) return;
  
  const fallbackAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const email = user.email || 'No email provided';
  const photoURL = user.photoURL || fallbackAvatar;

  try {
    elements.userName.textContent = displayName;
    elements.dropdownName.textContent = displayName;
    elements.mobileUserName.textContent = displayName;
    elements.dropdownEmail.textContent = email;
    elements.mobileUserEmail.textContent = email;

    [elements.userAvatar, elements.dropdownAvatar, elements.mobileUserAvatar].forEach(img => {
      if (img) {
        img.src = photoURL;
        img.onerror = () => img.src = fallbackAvatar;
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
  }
};

// Handle auth state
const handleAuthState = (user) => {
  if (!user || localStorage.getItem('isLoggedIn') !== 'true') {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login.html';
    return;
  }
  updateUserProfile(user);
};

// Initialize auth listener
onAuthStateChanged(auth, handleAuthState);

// Mobile menu toggle
const toggleMobileMenu = () => {
  if (elements.mobileMenu) {
    const isOpen = elements.mobileMenu.style.transform === 'translateX(0px)';
    elements.mobileMenu.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0)';
  }
};

// Event listeners
if (elements.mobileMenuButton) elements.mobileMenuButton.addEventListener('click', toggleMobileMenu);
if (elements.mobileMenuClose) elements.mobileMenuClose.addEventListener('click', toggleMobileMenu);

// Close mobile menu on outside click or ESC
document.addEventListener('click', (e) => {
  if (elements.mobileMenu && elements.mobileMenuButton && 
      !elements.mobileMenu.contains(e.target) && 
      !elements.mobileMenuButton.contains(e.target) && 
      window.innerWidth <= 768) {
    elements.mobileMenu.style.transform = 'translateX(100%)';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.innerWidth <= 768 && elements.mobileMenu) {
    elements.mobileMenu.style.transform = 'translateX(100%)';
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && elements.mobileMenu) {
    elements.mobileMenu.style.transform = 'translateX(100%)';
  }
});

// Logout function
window.logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error during logout. Please try again.');
  }
};

// Session timeout
let inactivityTimer;
const resetSessionTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => window.logout(), 3600000); // 1 hour
};

['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  window.addEventListener(event, resetSessionTimer);
});

resetSessionTimer();

// Initial auth check
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = '/login.html';
  }
});
