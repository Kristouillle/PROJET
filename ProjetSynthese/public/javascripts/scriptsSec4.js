// Obtenir la modale
var modal = document.getElementById("myModal");

// Obtenir l'image et l'élément modal
var img = document.querySelector("#sec4 img");
var modalImg = document.getElementById("img01");

// Obtenir l'élément <span> qui ferme la modale
var span = document.getElementsByClassName("close")[0];

// Quand l'utilisateur clique sur l'image, ouvrir la modale
img.onclick = function () {
  modal.style.display = "block";
  modalImg.src = this.src;
};

// Quand l'utilisateur clique sur <span> (x), fermer la modale
span.onclick = function () {
  modal.style.display = "none";
};

// Fermer la modale quand l'utilisateur clique en dehors de l'image
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
