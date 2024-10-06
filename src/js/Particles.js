(function () {
    // Armazena os elementos do DOM em cache para melhor performance
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

    // Inicializa o Particles.js se estiver disponível
    function initParticles() {
        // Verifica se a biblioteca Particles.js está carregada
        if (typeof particlesJS === 'undefined') return;

        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: false } // Desativa animações de opacidade para melhor performance
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: false } // Desativa animações de tamanho para melhor performance
                },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
                move: {
                    enable: true,
                    speed: 2,
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
        });
    }

    // Função throttle para limitar a taxa de execução de uma função
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Carregamento lazy de imagens para otimizar o carregamento da página
    function lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img); // Para de observar a imagem após o carregamento
                }
            });
        });

        elements.lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Anima elementos quando eles entram na viewport
    function animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target); // Para de observar o elemento após a animação
                }
            });
        }, { threshold: 0.1 });

        elements.animateOnScrollElements.forEach(el => observer.observe(el));
    }

    // Inicializa as funções
    function init() {
        initParticles();
        lazyLoadImages();
        animateOnScroll();

        // Oculta o botão "scroll to top" inicialmente
        elements.scrollToTopBtn.style.display = 'none';

        // Mostra/oculta o botão "scroll to top" com base na posição de rolagem
        window.addEventListener('scroll', throttle(() => {
            elements.scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        }, 200));

        // Outros listeners de eventos podem ser adicionados aqui
    }

    // Executa a inicialização quando o DOM estiver totalmente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();