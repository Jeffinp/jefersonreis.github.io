document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        menuToggle: document.querySelector('.menu-toggle'),
        navMenu: document.querySelector('nav ul'),
        links: document.querySelectorAll('a[href^="#"]'),
        scrollToTopBtn: document.getElementById("scrollToTopBtn"),
        darkModeToggle: document.getElementById("darkModeToggle"),
        projectItems: document.querySelectorAll('.project-item'),
        modal: document.getElementById('project-modal'),
        closeModal: document.querySelector('.close'),
        form: document.getElementById('contact-form'),
        lazyImages: document.querySelectorAll('img.lazy'),
        fadeInSections: document.querySelectorAll(".fade-in-section"),
        animateOnScrollElements: document.querySelectorAll('section, .project-item, .skill-item, .timeline-item')
    };

    // Menu toggle
    elements.menuToggle.addEventListener('click', () => {
        elements.menuToggle.classList.toggle('active');
        elements.navMenu.classList.toggle('show');
    });

    // Smooth scroll
    elements.links.forEach(link => link.addEventListener('click', smoothScroll));

    // Scroll to top button
    window.addEventListener('scroll', debounce(toggleScrollToTopButton, 100));
    elements.scrollToTopBtn.addEventListener("click", () => smoothScrollTo(0, 0));

    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);

    // Project modal
    elements.projectItems.forEach(item => {
        const detailsBtn = item.querySelector('.project-details-btn');
        detailsBtn.addEventListener('click', () => openModal(item));
    });

    elements.closeModal.addEventListener('click', () => {
        elements.modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target == elements.modal) {
            elements.modal.style.display = "none";
        }
    });

    // Fade-in effect
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.fadeInSections.forEach(section => fadeInObserver.observe(section));

    // Lazy loading images
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target;
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy');
                lazyImage.classList.add('loaded');
                observer.unobserve(lazyImage);
            }
        });
    });

    elements.lazyImages.forEach(image => lazyImageObserver.observe(image));

    // Form validation
    elements.form.addEventListener('submit', validateForm);

    // Particles.js (if you're using it)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5, // Reduzido de 0.5 para 0.3
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3, // Reduzido de 3 para 2
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2, // Reduzido de 0.4 para 0.2
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2, // Reduzido de 6 para 2
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 2 // Reduzido de 4 para 2
                    }
                }
            },
            retina_detect: false // Desativado para melhorar o desempenho
        });
    }

    

    // Dark mode saved state
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Animation on scroll
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animateOnScrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.animateOnScrollElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        animateOnScrollObserver.observe(element);
    });

    // Check if browser is Safari
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.body.classList.add('safari');
    }
});

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetPosition = document.querySelector(targetId).offsetTop;
    smoothScrollTo(0, targetPosition);
}

function smoothScrollTo(endX, endY, duration = 1000) {
    const startX = window.pageXOffset || window.scrollX || document.documentElement.scrollLeft;
    const startY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();

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

    isValid = validateField(nameInput, 'Nome é obrigatório') && isValid;
    isValid = validateField(emailInput, 'Email é obrigatório', isValidEmail) && isValid;
    isValid = validateField(messageInput, 'Mensagem é obrigatória') && isValid;

    if (isValid) {
        console.log('Form is valid. Sending data...');
        e.target.reset();
    }
}

function validateField(input, errorMessage, validationFunction = null) {
    const value = input.value.trim();
    if (value === '' || (validationFunction && !validationFunction(value))) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}