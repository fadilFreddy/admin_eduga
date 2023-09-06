    // Ta configuration Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyC4eGM4rcFNZsgO_6VnQr_Z8hbpfynQV3U",
      authDomain: "top-science-8fd65.firebaseapp.com",
      projectId: "top-science-8fd65",
      storageBucket: "top-science-8fd65.appspot.com",
      messagingSenderId: "325746831998",
      appId: "1:325746831998:web:8d5fd48cab9eddc382de2f",
      measurementId: "G-V2THNBH4YS"
    };
     // Fonction qui affiche la liste des classes dans la sidebar
function getData() {
  // Sélection de l'élément de liste des cours
  let cours = document.querySelector('#cours');

  // Initialisation de Firebase avec la configuration
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Récupération des données de la collection "classes"
  db.collection("classes").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var classe = doc.data();
      var idDoc = doc.id;
      let li = document.createElement('li');
      li.classList.add("nav-item");
      // Création d'un élément de liste avec le nom de la classe et un événement de clic pour afficher les matières
      li.innerHTML = `<a onclick='affiche("${idDoc}")' class="dropdown-item" data-intitule="${classe.intitule}" data-idDoc="${idDoc}" href="#">${classe.intitule}</a>`;
      cours.appendChild(li);
    });
  });
}

// Appel de la fonction pour afficher les données dans la sidebar
getData();

// Fonction qui affiche les matières et les cours d'une classe sélectionnée
function affiche(idDoc) {
  const db = firebase.firestore();
  const content = document.getElementById('content');

  // Suppression du contenu précédent dans la div "content"
  while (content.firstChild) {
    content.firstChild.remove();
  }

  // Récupération des données de la classe sélectionnée
  db.collection("classes").doc(idDoc).get()
    .then((doc) => {
      const classe = doc.data();

      // Création d'un élément de titre pour afficher le nom de la classe
      const classeSelectionneeElement = document.createElement('h2');
      classeSelectionneeElement.textContent = classe.intitule;
      content.appendChild(classeSelectionneeElement);

      // Création d'un tableau pour afficher les matières
      const table = document.createElement('table');
      table.classList.add('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const trHead = document.createElement('tr');
      trHead.innerHTML = `<th>Titre</th><th>Nombre de cours</th>`;
      thead.appendChild(trHead);

      // Récupération des matières et de leur nombre de cours
      db.collection("classes").doc(idDoc).collection("Matieres").get()
        .then((querySnapshot) => {
          const promises = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${data.intitule}</td><td>Loading...</td>`;
            tr.classList.add('table-row');
            tbody.appendChild(tr);

            // Récupération du nombre de cours pour chaque matière
            const promise = db.collection("classes").doc(idDoc).collection("Matieres").doc(doc.id).collection("Cours").get()
              .then((snapshot) => {
                tr.children[1].textContent = snapshot.size.toString();
              })
              .catch((error) => {
                console.error("Erreur lors de la récupération des cours :", error);
              });

            promises.push(promise);
          });

          // Attente de l'exécution de toutes les promesses pour mettre à jour le tableau
          Promise.all(promises)
            .then(() => {
              table.appendChild(thead);
              table.appendChild(tbody);
              content.appendChild(table);

              // Ajout d'un gestionnaire d'événement pour chaque ligne du tableau (chaque matière)
              const tableRows = document.getElementsByClassName('table-row');
              for (let i = 0; i < tableRows.length; i++) {
                tableRows[i].addEventListener('click', () => {
                  const matiereId = querySnapshot.docs[i].id;
                  afficheContenuCours(idDoc, matiereId); // Fonction pour afficher les détails des cours
                });
              }
            });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des matières :", error);
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération du document :", error);
    });
}

// Fonction pour afficher le contenu détaillé des cours d'une matière
function afficheContenuCours(idDoc, matiereId) {
  const db = firebase.firestore();
  const content = document.getElementById('content');
  while (content.firstChild) {
    content.firstChild.remove();
  }

  // Bouton de retour vers la liste des matières
  const backButton = document.createElement('button');
  backButton.classList.add('btn', 'btn-primary', 'mb-3');
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour';
  backButton.addEventListener('click', () => {
    affiche(idDoc); // Retour à la liste des matières
  });
  content.appendChild(backButton)
  
    // Création d'un bouton pour ajouter un nouveau cours (affiche un modal)
const addButton = document.createElement('button');
addButton.classList.add('btn', 'btn-success', 'mb-3', 'ms-2');
addButton.setAttribute('data-bs-toggle', 'modal');
addButton.setAttribute('data-bs-target', '#addCourseModal');
addButton.innerHTML = '<i class="fas fa-plus"></i> Ajouter un cours';
content.appendChild(addButton); // Ajout du bouton à la div "content"

// Création d'un tableau pour afficher les détails des cours
const table = document.createElement('table');
table.classList.add('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
const trHead = document.createElement('tr');
trHead.innerHTML = `<th>Titre</th><th>Document</th><th>Vidéo</th>`;
thead.appendChild(trHead);
table.appendChild(thead);
table.appendChild(tbody);
content.appendChild(table);

// Récupération des cours de la matière sélectionnée depuis la base de données
db.collection("classes").doc(idDoc).collection("Matieres").doc(matiereId).collection("Cours").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const cours = doc.data();
      const tr = document.createElement('tr');
      const documentName = cours.document ? cours.document.name : 'N/A';
      const videoName = cours.video ? cours.video.name : 'N/A';
      tr.innerHTML = `<td>${cours.titre}</td>
      <td>${cours.document}</td>
      <td>${cours.video}</td>
<td>
          <button class="btn btn-primary btn-sm edit-course" data-course-id="${doc.id}">
            <i class="fas fa-edit"></i> 
          </button>
          <button class="btn btn-danger btn-sm delete-course" data-course-id="${doc.id}">
            <i class="fas fa-trash"></i> 
          </button>
        </td>`;
              tbody.appendChild(tr); // Ajout de la ligne au tableau

    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération du contenu des cours :", error);
  });

// Enregistrement du formulaire modal pour ajouter un nouveau cours
document.getElementById('addCourseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const courseTitle = document.getElementById('courseTitle').value;
  const coursePdf = document.getElementById('coursePdf').files[0];
  const courseVideo = document.getElementById('courseVideo').files[0];

  // Enregistrement du fichier PDF dans Firebase Storage
  const storageRef = firebase.storage().ref();
  const pdfRef = storageRef.child(`cours/${coursePdf.name}`);
  pdfRef.put(coursePdf)
    .then((pdfSnapshot) => {
      console.log("Fichier PDF enregistré avec succès.");

      // Récupération de l'URL de téléchargement du fichier PDF
      return pdfSnapshot.ref.getDownloadURL()
        .then((pdfUrl) => {
          // Enregistrement du fichier vidéo dans Firebase Storage
          const videoRef = storageRef.child(`cours/${courseVideo.name}`);
          return videoRef.put(courseVideo)
            .then((videoSnapshot) => {
              console.log("Fichier vidéo enregistré avec succès.");

              // Récupération de l'URL de téléchargement du fichier vidéo
              return videoSnapshot.ref.getDownloadURL()
                .then((videoUrl) => {
                  // Enregistrement des données dans la base de données Firestore
                  return db.collection("classes").doc(idDoc).collection("Matieres").doc(matiereId).collection("Cours").add({
                    titre: courseTitle,
                    document: { name: coursePdf.name, url: pdfUrl },
                    video: { name: courseVideo.name, url: videoUrl }
                  });
                });
            });
        });
    })
    .then((docRef) => {
      console.log("Enregistrement réussi :", docRef.id);

      // Réinitialisation du formulaire
      document.getElementById('addCourseForm').reset();

      // Fermeture de la fenêtre modale d'ajout de cours
      const addCourseModal = bootstrap.Modal.getInstance(document.getElementById('addCourseModal'));
      addCourseModal.hide();
    })
    .catch((error) => {
      console.error("Erreur lors de l'enregistrement :", error);
    });
});
  
}