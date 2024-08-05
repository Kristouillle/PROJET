//  LOGIQUE POUR PEUPLER LE SPINNER DES SERVICES
document.addEventListener('DOMContentLoaded', function() {
    const services = ['Service 1', 'Service 2', 'Service 3']; // Exemple de liste de services disponibles

    const selectedServiceButton = document.getElementById('selectedServiceButton');
    const serviceDropdown = document.getElementById('serviceDropdown');
    const serviceList = document.getElementById('serviceList');

    function updateAvailableServices() {
        serviceList.innerHTML = ''; // Clear existing services
        services.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            li.addEventListener('click', function() {
                selectedServiceButton.textContent = service;
                serviceDropdown.classList.remove('open'); // Ferme le menu déroulant après la sélection
            });
            serviceList.appendChild(li);
        });
    }

    selectedServiceButton.addEventListener('click', function() {
        serviceDropdown.classList.toggle('open'); // Affiche ou masque le menu déroulant
    });

    // Gestion de la fermeture du menu déroulant lorsque l'utilisateur clique en dehors de celui-ci
    document.addEventListener('click', function(e) {
        if (!serviceDropdown.contains(e.target) && e.target !== selectedServiceButton) {
            serviceDropdown.classList.remove('open');
        }
    });

    updateAvailableServices(); // Appel initial pour afficher les services disponibles
});




// LOGIQUE POUR LE DATE PICKER ET LE MENU D'HEURES
document.addEventListener('DOMContentLoaded', function() {
    const bookedAppointments = {
        '2024-07-08': ['08:00', '09:00', '10:00'], // Exemples de timeslot réservées
        '2024-07-09': ['11:00', '13:00']           // Exemples de timeslot réservées
    };

    const times = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00'
    ];

    const selectedTimeButton = document.getElementById('selectedTimeButton');
    const timeDropdown = document.getElementById('timeDropdown');
    const timeList = document.getElementById('timeList');

    function updateAvailableTimes(selectedDate) {
        timeList.innerHTML = ''; // Clear existing times
        times.forEach(time => {
            const li = document.createElement('li');
            li.textContent = time;
            if (bookedAppointments[selectedDate] && bookedAppointments[selectedDate].includes(time)) {
                li.classList.add('disabled');
                li.addEventListener('click', function(event) {
                    event.stopPropagation();
                });
            } else {
                li.addEventListener('click', function() {
                    selectedTimeButton.textContent = time;
                    timeDropdown.classList.remove('open');
                });
            }
            timeList.appendChild(li);
        });
    }

    selectedTimeButton.addEventListener('click', function() {
        timeDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
        if (!timeDropdown.contains(e.target) && e.target !== selectedTimeButton) {
            timeDropdown.classList.remove('open');
        }
    });

    flatpickr("#datePicker", {
        dateFormat: "Y-m-d",
        minDate: "today",
        defaultDate: "today",
        locale: "fr",
        onChange: function(selectedDates, dateStr, instance) {
            updateAvailableTimes(dateStr);
        }
    });

    updateAvailableTimes(flatpickr.formatDate(new Date(), "Y-m-d"));
});


// LOGIQUE POUR LE CHANGEMENT DE TABS
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.tab-link');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            changeSection(targetId);
        });
    });
});

function changeSection(targetId) {
    const currentSection = document.querySelector('.section:not(.hidden)');
    const nextSection = document.getElementById(targetId);

    if (currentSection !== nextSection) {
        // Ajouter la classe fade-out à la section actuelle
        currentSection.classList.add('fade-out');
        currentSection.classList.remove('fade-in');

        // Attendre la fin de l'animation avant de cacher l'élément
        currentSection.addEventListener('animationend', function onFadeOut() {
            currentSection.classList.add('hidden');
            currentSection.classList.remove('fade-out');
            currentSection.removeEventListener('animationend', onFadeOut);

            // Afficher la nouvelle section
            nextSection.classList.remove('hidden');
            nextSection.classList.add('fade-in');
        });
    }
}


selectedTimeButton.addEventListener('click', function() {
    console.log('Selected Time button clicked');
    timeDropdown.classList.toggle('open');
});

selectedServiceButton.addEventListener('click', function() {
    console.log('Selected Service button clicked');
    serviceDropdown.classList.toggle('open');
});





// LOGIQUE POUR LE CURSOR TRAIL EFFECT

var maxDots = 50;
var interval = 100;
var time = 0;
var dots = document.getElementsByClassName('dot');
var dot = dots[0];
var dotSize = dot.offsetWidth;

document.addEventListener('mousemove', function(event) {
    // dot.style.left = event.clientX + 'px';
    // dot.style.top = event.clientY + 'px';

    if(event.timeStamp > time + interval && dots.length <= maxDots) {
        time = event.timeStamp;
        addDot();
    }
});

function addDot() {
    var dotClone = dot.cloneNode();

    dotClone.style.backgroundColor = randomColor();
    dotClone.style.width = dotClone.style.height = randomSize();
    dotClone.style.left = event.clientX + 'px';
    dotClone.style.top = event.clientY + 'px';
    dotClone.style.transform = "translate("+randomLocation()+", "+randomLocation()+")";
    document.body.appendChild(dotClone);

    if(dots.length === maxDots) {
        removeDot();
    }
}

function removeDot() {
    document.body.removeChild(dots[1]);
}

function randomLocation() {
    return Math.floor(Math.random() * (dotSize * 2)) - (dotSize) + 'px';
}

function randomSize() {
    var max = dotSize * 0.8;
    var min = dotSize * 0.2;
    return Math.floor(Math.random() * max + min) + 'px';
}

function randomColor() {
    var dotColorR = Math.floor(Math.random() * 3) + 1;  // Retourne les entiers 1, 2 ou 3
    var dotColorReturned;

    if (dotColorR === 3) {
        dotColorReturned = "10, 108, 164";
    } else if (dotColorR === 2) {
        dotColorReturned = "85, 184, 230";
    } else {
        dotColorReturned = "50, 139, 193";
    }

    return 'rgb(' + dotColorReturned + ')';
}