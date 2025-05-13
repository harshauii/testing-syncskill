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
    if (elements.userName) elements.userName.textContent = displayName;
    if (elements.dropdownName) elements.dropdownName.textContent = displayName;
    if (elements.mobileUserName) elements.mobileUserName.textContent = displayName;
    if (elements.dropdownEmail) elements.dropdownEmail.textContent = email;
    if (elements.mobileUserEmail) elements.mobileUserEmail.textContent = email;

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

// Dropdown toggle
window.toggleDropdown = () => {
  const dropdown = document.querySelector('.profile-dropdown');
  if (dropdown) {
    const isVisible = dropdown.style.opacity === '1';
    dropdown.style.opacity = isVisible ? '0' : '1';
    dropdown.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
    dropdown.style.visibility = isVisible ? 'hidden' : 'visible';
  }
};

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const profileMenu = document.querySelector('.profile-menu');
  if (profileMenu && !e.target.closest('.profile-menu')) {
    const dropdown = document.querySelector('.profile-dropdown');
    if (dropdown) {
      dropdown.style.opacity = '0';
      dropdown.style.transform = 'translateY(-10px)';
      dropdown.style.visibility = 'hidden';
    }
  }
});

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
  const loadingOverlay = document.createElement('div');
  loadingOverlay.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;';
  loadingOverlay.innerHTML = '<p>Loading...</p>';
  document.body.appendChild(loadingOverlay);

  onAuthStateChanged(auth, (user) => {
    loadingOverlay.remove();
    handleAuthState(user);
  });
});
