// ------------------------------
// INICIALIZAÇÃO
// ------------------------------

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
        animateOnScrollElements: document.querySelectorAll('section, .project-item, .skill-item, .timeline-item'),
    };


    // ------------------------------
    // SMOOTH SCROLL
    // ------------------------------
    elements.links.forEach(link => link.addEventListener('click', smoothScroll));

    // ------------------------------
    // SCROLL TO TOP BUTTON
    // ------------------------------
    window.addEventListener('scroll', debounce(toggleScrollToTopButton, 100));
    if (elements.scrollToTopBtn) {
        elements.scrollToTopBtn.addEventListener("click", () => smoothScrollTo(0, 0));
    }

    // ------------------------------
    // PROJECT MODAL
    // ------------------------------
    elements.projectItems.forEach(item => {
        const detailsBtn = item.querySelector('.project-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => openModal(item));
        }
    });

    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', () => {
            elements.modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === elements.modal) {
            elements.modal.style.display = "none";
        }
    });

    // ------------------------------
    // FADE-IN EFFECT
    // ------------------------------
    if (elements.fadeInSections.length) {
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.fadeInSections.forEach(section => fadeInObserver.observe(section));
    }

    // Função para alternar entre os modos escuro e claro
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        document.getElementById('darkModeToggle').classList.add('rotate');

        // Muda o ícone conforme o modo
        const iconElement = document.getElementById('darkModeIcon');
        if (document.body. classList.contains('dark-mode')) {
            iconElement.setAttribute('data-icon', 'mdi:weather-night');
            localStorage.setItem('darkMode', 'enabled'); // Armazena como escuro
        } else {
            iconElement.setAttribute('data-icon', 'mdi:white-balance-sunny');
            localStorage.setItem('darkMode', 'disabled'); // Armazena como claro
        }

        // Remove a animação de rotação após 300ms
        setTimeout(() => {
            document.getElementById('darkModeToggle').classList.remove('rotate');
        }, 300);
    }

    // Verifica e carrega a preferência armazenada ou ativa o modo escuro por padrão
    function loadUserPreference() {
        const darkMode = localStorage.getItem('darkMode');
        const iconElement = document.getElementById('darkModeIcon');

        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            iconElement.setAttribute('data-icon', 'mdi:weather-night');
        } else if (darkMode === 'disabled') {
            document.body.classList.remove('dark-mode');
            iconElement.setAttribute('data-icon', 'mdi:white-balance-sunny');
        } else {
            // Configura o modo escuro por padrão na primeira visita
            document.body.classList.add('dark-mode');
            iconElement.setAttribute('data-icon', 'mdi:weather-night');
            localStorage.setItem('darkMode', 'enabled'); // Salva a preferência inicial como escuro
        }
    }

    // Adiciona o evento de clique ao botão de alternância
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Carrega a preferência do usuário ao carregar a página
    loadUserPreference();

    // ------------------------------
    // ANIMATION ON SCROLL (Smooth Fade and Slide)
    // ------------------------------

    const animationOptions = {
        threshold: 0.15,
        rootMargin: '0px',
        once: false // Permite que a animação ocorra várias vezes
    };

    const animateElement = (element, direction) => {
        const animationClass = direction === 'down' ? 'animate-in' : 'animate-out';
        element.classList.add(animationClass);
        if (direction === 'down') {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-10px)';
        }

        element.addEventListener('transitionend', () => {
            if (direction === 'up') {
                element.classList.remove('animate-in', 'animate-out');
            }
        }, { once: true });
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target, 'down');
            } else {
                const boundingRect = entry.target.getBoundingClientRect();
                if (boundingRect.top > 0) {
                    animateElement(entry.target, 'up');
                }
            }
        });
    };

    if (elements.animateOnScrollElements.length) {
        const animateOnScrollObserver = new IntersectionObserver(handleIntersection, animationOptions);

        elements.animateOnScrollElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '0';
            element.style.transform = 'translateX(-10px)';
            animateOnScrollObserver.observe(element);
        });
    }

    // ------------------------------
    // CHECK IF BROWSER IS SAFARI
    // ------------------------------
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.body.classList.add('safari');
    }

    // ------------------------------
    // LANGUAGE SWITCH
    // ------------------------------
    const currentPage = window.location.href;
    const languageLinks = document.querySelectorAll('.language-switch a');

    // Função para remover a classe 'active' de todos os links
    function removeActiveClass() {
        languageLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Adiciona 'active' ao link correspondente à página atual
    languageLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Verifica se a URL atual corresponde exatamente ao href do link
        if (currentPage.endsWith(linkHref)) {
            link.classList.add('active');
        }

        // Adiciona o evento de clique a cada link
        link.addEventListener('click', () => {
            removeActiveClass();  // Remove a classe 'active' de todos os links
            link.classList.add('active');  // Adiciona 'active' ao link clicado
        });
    });

});

// Seleciona todos os links de navegação
const navLinks = document.querySelectorAll('nav ul li a');

// Adiciona um ouvinte de evento de clique a cada link
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        // Remove a classe 'selected' de todos os links
        navLinks.forEach(link => link.classList.remove('selected'));

        // Adiciona a classe 'selected' ao link clicado
        this.classList.add('selected');

        // Chama a função de rolagem suave
        smoothScroll.call(this, e);
    });
});

// Função para rolar suavemente até um elemento
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const targetPosition = targetElement.offsetTop;
        smoothScrollTo(0, targetPosition);
    }
}

// Função para rolar suavemente até uma posição
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
            window.scrollTo(endX, endY); // Garante que a rolagem chegue ao final
        } else {
            window.scrollTo(newX, newY);
        }
    }, 1000 / 60);
}

// Função para alternar o botão de rolar para o topo
function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
}

// Função debounce para limitar a frequência de execução
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

// ARTISTA DIGITAL RODAGEM
document.addEventListener('DOMContentLoaded', function() {
    const carousel = {
        currentIndex: 0,
        images: document.querySelectorAll('.main-image'),
        prevButton: document.querySelector('.nav.prev'),
        nextButton: document.querySelector('.nav.next'),
        isDragging: false,
        startX: 0,
        sensitivity: 100,

        init() {
            // Set up initial state
            this.showImage(this.currentIndex);
            
            // Add event listeners
            this.prevButton.addEventListener('click', () => this.prevSlide());
            this.nextButton.addEventListener('click', () => this.nextSlide());
            
            // Touch and drag events
            const container = document.querySelector('.main-image-container');
            
            container.addEventListener('mousedown', (e) => this.handleDragStart(e));
            container.addEventListener('touchstart', (e) => this.handleDragStart(e));
            
            container.addEventListener('mousemove', (e) => this.handleDrag(e));
            container.addEventListener('touchmove', (e) => this.handleDrag(e));
            
            container.addEventListener('mouseup', () => this.handleDragEnd());
            container.addEventListener('touchend', () => this.handleDragEnd());
            container.addEventListener('mouseleave', () => this.handleDragEnd());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });

            // Auto-advance timer
            this.startAutoAdvance();
        },

        showImage(index) {
            this.images.forEach(img => img.classList.remove('active'));
            this.images[index].classList.add('active');
        },

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage(this.currentIndex);
            this.resetAutoAdvance();
        },

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.showImage(this.currentIndex);
            this.resetAutoAdvance();
        },

        handleDragStart(e) {
            this.isDragging = true;
            this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        },

        handleDrag(e) {
            if (!this.isDragging) return;
            e.preventDefault();
            
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = currentX - this.startX;

            if (Math.abs(diff) > this.sensitivity) {
                if (diff > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
                this.isDragging = false;
            }
        },

        handleDragEnd() {
            this.isDragging = false;
        },

        // Auto-advance functionality
        startAutoAdvance() {
            this.autoAdvanceTimer = setInterval(() => this.nextSlide(), 5000); // Change slide every 5 seconds
        },

        resetAutoAdvance() {
            clearInterval(this.autoAdvanceTimer);
            this.startAutoAdvance();
        }
    };

    // Initialize the carousel
    carousel.init();
});

// Keyboard NAB
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Initial setup
updateCarousel(false);

//ANIMAÇÕES DO "HABILIDADES"
class SkillsManager {
    /**
     * @constructor
     */
    constructor() {
        // Elementos DOM
        this.skillsContents = document.querySelectorAll('.skills__content');
        this.activeSection = null;
        this.isAnimating = false;

        this.init();
    }

    /**
     * Inicializa o gerenciador de habilidades
     * @private
     */
    init() {
        // Adiciona listeners para cada seção
        this.skillsContents.forEach(content => {
            const header = content.querySelector('.skills__header');
            if (header) {
                header.addEventListener('click', () => this.toggleSection(content));
            }
        });
    }

    /**
     * Alterna a seção de habilidades
     * @param {HTMLElement} section - A seção a ser alternada
     * @private
     */
    toggleSection(section) {
        // Previne múltiplos cliques durante a animação
        if (this.isAnimating) return;

        const isOpeningSection = !section.classList.contains('skills__open');
        
        // Fecha a seção ativa atual (se houver)
        if (this.activeSection && this.activeSection !== section) {
            this.closeSection(this.activeSection);
        }

        // Alterna a seção clicada
        if (isOpeningSection) {
            this.openSection(section);
        } else {
            this.closeSection(section);
        }
    }

    /**
     * Abre uma seção de habilidades
     * @param {HTMLElement} section - A seção a ser aberta
     * @private
     */
    openSection(section) {
        this.isAnimating = true;
        section.classList.add('skills__open');
        this.activeSection = section;
        
        // Anima as barras de progresso
        this.animateProgressBars(section);

        // Reseta o flag de animação após a transição
        setTimeout(() => {
            this.isAnimating = false;
        }, 500); // Tempo alinhado com a transição CSS
    }

    /**
     * Fecha uma seção de habilidades
     * @param {HTMLElement} section - A seção a ser fechada
     * @private
     */
    closeSection(section) {
        this.isAnimating = true;
        section.classList.remove('skills__open');
        
        // Reseta as barras de progresso
        const progressBars = section.querySelectorAll('.skill__progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });

        if (this.activeSection === section) {
            this.activeSection = null;
        }

        // Reseta o flag de animação após a transição
        setTimeout(() => {
            this.isAnimating = false;
        }, 500); // Tempo alinhado com a transição CSS
    }

    /**
     * Anima as barras de progresso de uma seção
     * @param {HTMLElement} section - A seção contendo as barras de progresso
     * @private
     */
    animateProgressBars(section) {
        const progressBars = section.querySelectorAll('.skill__progress');
        
        // Reseta primeiro
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });

        // Inicia a animação após um pequeno delay
        requestAnimationFrame(() => {
            progressBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percentage');
                bar.style.width = `${percentage}%`;
            });
        });
    }
}

// Inicializa o gerenciador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new SkillsManager();
});

// Seleciona o contêiner de serviços e modais
const servicesSection = document.querySelector(".services.section");
const modalViews = document.querySelectorAll(".services__modal");

// Função para abrir o modal
function openModal(index) {
    modalViews[index].classList.add("active-modal");
}

// Função para fechar todos os modais
function closeModal() {
    modalViews.forEach(modal => modal.classList.remove("active-modal"));
}

// Manipulador de eventos para abrir e fechar modais
servicesSection.addEventListener("click", (event) => {
    const target = event.target;

    // Verifica se o botão de abrir modal foi clicado
    if (target.closest('.services__button')) {
        const button = target.closest('.services__button');
        const modalIndex = button.getAttribute('data-modal');
        openModal(parseInt(modalIndex));
    }

    // Verifica se o botão de fechar modal foi clicado ou se clicou fora do modal
    if (target.classList.contains("services__modal-close") ||
        target.classList.contains("services__modal")) {
        closeModal();
    }
});

// Adiciona listener para fechar modal com a tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});