/* Fonction pour basculer la visibilité du mot de passe */
function togglePasswordVisibility(fieldId) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text";
  } else {
    field.type = "password";
  }
}

/* Gestionnaire d'événements pour la soumission du formulaire */
document
  .getElementById("passwordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // Récupère les valeurs des champs de mot de passe
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let newPasswordError = document.getElementById("newPasswordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");

    // Réinitialise les messages d'erreur
    newPasswordError.textContent = "";
    confirmPasswordError.textContent = "";

    // Vérification du mot de passe
    if (newPassword.length < 8) {
      newPasswordError.textContent =
        "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    }
    if (
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[!@#\$&*]/.test(newPassword)
    ) {
      newPasswordError.textContent =
        "Le mot de passe doit contenir des minuscules, des majuscules, des chiffres, et des caractères spéciaux (!@#$&*).";
      return;
    }
    if (/[%-]/.test(newPassword) || /[\u0300-\u036f]/.test(newPassword)) {
      newPasswordError.textContent =
        "Les caractères %, -, et signes diacritiques sont interdits.";
      return;
    }
    if (newPassword !== confirmPassword) {
      confirmPasswordError.textContent =
        "Les mots de passe ne correspondent pas.";
      return;
    }

    // Message de succès si toutes les vérifications sont validées
    alert("Mot de passe validé et soumis avec succès !");
  });
