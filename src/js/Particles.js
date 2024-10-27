// Encapsula o código em uma IIFE (Immediately Invoked Function Expression)
(() => {
    // Define os elementos do DOM
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

    // Configuração para particles.js
    const particlesConfig = {
    particles: {
        number: { value: 40, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
        },
        modes: {
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 2 }
        }
    },
    retina_detect: true
    };

    // Função para inicializar particles.js
    function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
    }

    // Função para limitar a taxa de execução de uma função
    function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
        } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
            if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
            }
        }, limit - (Date.now() - lastRan));
        }
    };
    }

    // Função para carregar imagens lazy
    function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
        });
    }, { rootMargin: "50px" });

    elements.lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Função para animar elementos ao rolar
    function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        } else {
            entry.target.classList.remove('animate');
        }
        });
    }, { threshold: 0.1 });

    elements.animateOnScrollElements.forEach(el => observer.observe(el));
    }

    // Função para rolar até o topo
    function handleScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    }

    // Função para alternar botão de rolar até o topo
    function toggleScrollToTopButton() {
    elements.scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    }

    // Função para inicializar
    function init() {
    initParticles();
    lazyLoadImages();
    animateOnScroll();

    elements.scrollToTopBtn.style.display = 'none';
    elements.scrollToTopBtn.addEventListener('click', handleScrollToTop);

    window.addEventListener('scroll', throttle(toggleScrollToTopButton, 200));
    }

    // Função para reinicializar
    function reinitialize() {
        elements.animateOnScrollElements.forEach(el => el.classList.remove('animate'));
        init();
    }

    // Verifica se o documento está carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Adiciona evento para reinicializar quando a página for atualizada ou mudada
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            reinitialize();
        }
    });
})();