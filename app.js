// 1) Reemplaza estos valores con la configuración de tu proyecto Firebase.
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const loginView = document.querySelector("#login-view");
const legalView = document.querySelector("#legal-view");
const loginButton = document.querySelector("#google-login");
const loginMessage = document.querySelector("#login-message");
const userArea = document.querySelector("#user-area");
const userName = document.querySelector("#user-name");
const userPhoto = document.querySelector("#user-photo");
const logoutButton = document.querySelector("#logout-btn");

const configured = Object.values(firebaseConfig).every(
  value => value && !value.startsWith("TU_")
);

if (!configured) {
  loginButton.disabled = true;
  loginButton.style.opacity = ".55";
  loginMessage.textContent = "Falta configurar Firebase. Consulta el archivo README.";
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  loginButton.addEventListener("click", async () => {
    loginMessage.textContent = "";
    loginButton.disabled = true;
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      loginMessage.textContent = error.code === "auth/popup-closed-by-user"
        ? "Se cerró la ventana de Google. Inténtalo nuevamente."
        : "No se pudo iniciar sesión. Revisa la configuración de Firebase e inténtalo otra vez.";
    } finally {
      loginButton.disabled = false;
    }
  });

  onAuthStateChanged(auth, user => {
    if (user) {
      loginView.classList.add("hidden");
      legalView.classList.remove("hidden");
      userArea.classList.remove("hidden");
      userName.textContent = user.displayName || "Usuario";
      userPhoto.src = user.photoURL || "";
      userPhoto.style.visibility = user.photoURL ? "visible" : "hidden";
    } else {
      legalView.classList.add("hidden");
      userArea.classList.add("hidden");
      loginView.classList.remove("hidden");
    }
  });

  logoutButton.addEventListener("click", () => signOut(auth));
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".document").forEach(doc => doc.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.doc).classList.add("active");
  });
});
