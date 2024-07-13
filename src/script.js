document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const links = document.querySelectorAll('a[href^="#"]');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const projectItems = document.querySelectorAll('.project-item');
    const modal = document.getElementById('project-modal');
    const closeModal = document.getElementsByClassName('close')[0];

    // Menu botão
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // Smooth scroll
    links.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // subir página butão
    window.addEventListener('scroll', toggleScrollToTopButton);
    scrollToTopBtn.addEventListener("click", () => smoothScrollTo(0, 0));

    // Dark mode troca
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Project modal
    projectItems.forEach(item => {
        const detailsBtn = item.querySelector('.project-details-btn');
        detailsBtn.addEventListener('click', () => openModal(item));
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    });

    document.querySelectorAll(".fade-in-section").forEach(section => {
        observer.observe(section);
    });

    // carregamento lerdo das imagens
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
                lazyImage.classList.add('loaded');
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });

    lazyImages.forEach(image => {
        lazyImageObserver.observe(image);
    });

    // validação de form
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', validateForm);

    // Particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
        },
        retina_detect: true
    });
});

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetPosition = document.querySelector(targetId).offsetTop;
    smoothScrollTo(0, targetPosition);
}

function smoothScrollTo(endX, endY) {
    const startX = window.pageXOffset || window.scrollX || document.documentElement.scrollLeft;
    const startY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();

    duration = 1000;

    const easeInOutQuart = (time, from, distance, duration) => {
        if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
        return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
    };

    const timer = setInterval(() => {
        const time = new Date().getTime() - startTime;
        const newX = easeInOutQuart(time, startX, distanceX, duration);
        const newY = easeInOutQuart(time, startY, distanceY, duration);
        if (time >= duration) {
            clearInterval(timer);
        }
        window.scroll(newX, newY);
    }, 1000 / 60);
}

function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function openModal(projectItem) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');

    modalTitle.textContent = projectItem.querySelector('h3').textContent;
    modalImage.src = projectItem.querySelector('img').src;
    modalDescription.textContent = projectItem.querySelector('p').textContent;


    const technologies = projectItem.dataset.technologies.split(',');
    modalTechnologies.innerHTML = technologies.map(tech => `<li>${tech.trim()}</li>`).join('');

    modal.style.display = "block";
}

function validateForm(e) {
    e.preventDefault();
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    let isValid = true;

    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Nome é obrigatório');
        isValid = false;
    } else {
        clearError(nameInput);
    }

    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email é obrigatório');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Email inválido');
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Mensagem é obrigatória');
        isValid = false;
    } else {
        clearError(messageInput);
    }

    if (isValid) {
        // Here you would typically send the form data to a server
        console.log('Form is valid. Sending data...');
        // Reset form after successful submission
        e.target.reset();
    }
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = message;
    formGroup.classList.add('error');
}

function clearError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = '';
    formGroup.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Dark mode salvo
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Animação de entrada
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}


function addAnimationClass() {
    const sectionsToAnimate = document.querySelectorAll('section, .project-item, .skill-item, .timeline-item');
    sectionsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    addAnimationClass();
    animateOnScroll();
});

//verificar se o navegadoar é safari
(function() {
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        document.body.classList.add('safari');
    }
})();