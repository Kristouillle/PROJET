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


// CODE POUR LE CURSOR TRAIL EFFECT

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

function addDot() {
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