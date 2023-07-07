
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC4eGM4rcFNZsgO_6VnQr_Z8hbpfynQV3U",
    authDomain: "top-science-8fd65.firebaseapp.com",
    projectId: "top-science-8fd65",
    storageBucket: "top-science-8fd65.appspot.com",
    messagingSenderId: "325746831998",
    appId: "1:325746831998:web:8d5fd48cab9eddc382de2f",
    measurementId: "G-V2THNBH4YS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Récupérer une référence à votre collection Firebase
const collectionRef = firebase.firestore().collection("classes");

// Récupérer le dropdown et la liste des options
const dropdown = document.getElementById("dropdownOptions");

// Récupérer les données de la collection
collectionRef.get().then((querySnapshot) => {
  // Pour chaque document dans la collection
  querySnapshot.forEach((doc) => {
    // Créer un élément de liste pour chaque option
    const option = document.createElement("li");
    option.innerHTML = `<a class="dropdown-item" href="#">${doc.data().intitule}</a>`;
    
    // Ajouter l'option à la liste du dropdown
    dropdown.appendChild(option);
  });
});
