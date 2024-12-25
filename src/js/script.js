/**
 * FUNÇÕES UTILITÁRIAS
 * ====================
 * Funções auxiliares para tarefas comuns.
 */

/**
 * Debounce - Limita a frequência de execução de uma função.
 * @param {function} func - A função a ser executada após o atraso.
 * @param {number} wait - O atraso em milissegundos.
 * @returns {function} - Função debounce.
 */
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

/**
 * Smooth Scroll - Rola suavemente até um elemento alvo.
 * @param {Event} e - O evento de clique.
 */
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const targetPosition = targetElement.offsetTop;
        smoothScrollTo(0, targetPosition);
    }
}

/**
 * Smooth Scroll To - Rola suavemente até uma posição específica.
 * @param {number} endX - Posição horizontal final.
 * @param {number} endY - Posição vertical final.
 * @param {number} [duration=1000] - Duração da animação em milissegundos.
 */
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

/**
 * Toggle Scroll To Top Button - Mostra ou oculta o botão de rolagem para o topo.
 */
function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
}

/**
 * INICIALIZAÇÃO
 * =============
 * Configuração inicial após o DOM ser carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Elementos do DOM
     * -----------------
     * Seletores para os elementos utilizados no script.
     */
    const elements = {
        menuToggle: document.querySelector('.header__menu-toggle'),
        navMenu: document.querySelector('.header__nav'),
        navLinks: document.querySelectorAll('.header__nav-link'),
        links: document.querySelectorAll('a[href^="#"]'),
        scrollToTopBtn: document.getElementById("scrollToTopBtn"),
        darkModeToggle: document.getElementById("darkModeToggle"),
        darkModeIcon: document.getElementById('darkModeIcon'),
        projectItems: document.querySelectorAll('.project-item'),
        modal: document.getElementById('project-modal'),
        closeModal: document.querySelector('.close'),
        form: document.getElementById('contact-form'), // Se necessário, implemente a lógica do formulário
        lazyImages: document.querySelectorAll('img.lazy'), // Se necessário, implemente o lazy loading
        fadeInSections: document.querySelectorAll(".fade-in-section"),
        animateOnScrollElements: document.querySelectorAll('section, .project-item, .skill-item, .timeline-item'),
        languageLinks: document.querySelectorAll('.language-switch a'),
        carouselTrack: document.querySelector('.carousel-track'),
        artCarouselTrack: document.querySelector('.art-carousel__track'),
        skillsContent: document.querySelector('.skills__content'),
        servicesSection: document.querySelector(".services.section"),
        testimonialsTrack: document.querySelector('.testimonials-track'),
    };

    /**
     * Navegação do Menu e Links
     * ---------------------------
     * Gerencia o comportamento do menu e dos links de navegação.
     */

    // Toggle do menu hambúrguer
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', function () {
            elements.navMenu.classList.toggle('open');
            this.classList.toggle('active');
            document.body.style.overflow = elements.navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Fecha o menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!elements.navMenu.contains(e.target) && !elements.menuToggle.contains(e.target)) {
                elements.navMenu.classList.remove('open');
                elements.menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Fecha o menu ao clicar em um link (para mobile)
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('open');
                elements.menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll para links internos
    elements.links.forEach(link => link.addEventListener('click', smoothScroll));

    // Adiciona classe 'selected' ao link da seção visível
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            elements.navLinks.forEach(link => link.classList.remove('selected'));
            this.classList.add('selected');
            smoothScroll.call(this, e);
        });
    });

    // Atualiza link ativo ao rolar
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.header__nav-link[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });

    /**
     * Botão Scroll To Top
     * -------------------
     * Controla a visibilidade e o comportamento do botão de rolagem para o topo.
     */
    if (elements.scrollToTopBtn) {
        window.addEventListener('scroll', debounce(toggleScrollToTopButton, 100));
        elements.scrollToTopBtn.addEventListener("click", () => smoothScrollTo(0, 0));
    }

    /**
     * Modal de Projeto
     * ----------------
     * Gerencia a abertura e o fechamento do modal de detalhes do projeto.
     */
    elements.projectItems.forEach(item => {
        const detailsBtn = item.querySelector('.project-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                const itemId = item.id;
                const projectContent = document.getElementById(`${itemId}-content`).innerHTML;

                elements.modal.querySelector('.project-modal-content').innerHTML = projectContent;
                elements.modal.style.display = "block";
            });
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

    /**
     * Efeito Fade-in
     * --------------
     * Aplica um efeito de fade-in para seções à medida que se tornam visíveis na tela.
     */
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

    /**
     * Modo Escuro/Claro
     * -----------------
     * Alterna entre os modos escuro e claro e armazena a preferência do usuário.
     */

    // Função para alternar entre os modos escuro e claro
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        elements.darkModeToggle.classList.add('rotate');

        // Muda o ícone conforme o modo
        if (document.body.classList.contains('dark-mode')) {
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:weather-night');
            localStorage.setItem('darkMode', 'enabled'); // Armazena como escuro
        } else {
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:white-balance-sunny');
            localStorage.setItem('darkMode', 'disabled'); // Armazena como claro
        }

        // Remove a animação de rotação após 300ms
        setTimeout(() => {
            elements.darkModeToggle.classList.remove('rotate');
        }, 300);
    }

    // Verifica e carrega a preferência armazenada ou ativa o modo escuro por padrão
    function loadUserPreference() {
        const darkMode = localStorage.getItem('darkMode');

        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:weather-night');
        } else if (darkMode === 'disabled') {
            document.body.classList.remove('dark-mode');
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:white-balance-sunny');
        } else {
            // Configura o modo escuro por padrão na primeira visita
            document.body.classList.add('dark-mode');
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:weather-night');
            localStorage.setItem('darkMode', 'enabled'); // Salva a preferência inicial como escuro
        }
    }

    // Adiciona o evento de clique ao botão de alternância
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);

    // Carrega a preferência do usuário ao carregar a página
    loadUserPreference();

    /**
     * Animação ao Rolar
     * -----------------
     * Aplica animações suaves de fade e slide a elementos à medida que eles entram na viewport.
     */
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

    /**
     * Detecção do Navegador Safari
     * ---------------------------
     * Adiciona uma classe específica para o Safari para lidar com possíveis peculiaridades de renderização.
     */
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.body.classList.add('safari');
    }

    /**
     * Troca de Idioma
     * ---------------
     * Gerencia a funcionalidade de troca de idioma, destacando o idioma atual.
     */
    const currentPage = window.location.href;

    // Função para remover a classe 'active' de todos os links
    function removeActiveClass() {
        elements.languageLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Adiciona 'active' ao link correspondente à página atual
    elements.languageLinks.forEach(link => {
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

    /**
     * Inicialização de Componentes
     * ----------------------------
     * Inicializa os carrosséis, gerenciador de skills e modais, se os elementos necessários existirem.
     */

    // Carrossel de Imagens
    if (elements.carouselTrack) {
        new ImageCarousel();
    }

    // Carrossel de Arte Digital
    if (elements.artCarouselTrack) {
        new ArtImageCarousel();
    }

    // Gerenciador de Skills
    if (elements.skillsContent) {
        new SkillsManager();
    }

    // Gerenciador de Modais
    if (elements.servicesSection) {
        new ModalManager();
    }

    // Carrossel de Depoimentos
    if (elements.testimonialsTrack) {
        new TestimonialsCarousel();
    }
});

/**
 * COMPONENTES
 * ===========
 * Classes para gerenciar componentes individuais da página.
 */

/**
 * Image Carousel - Gerencia o carrossel de imagens principal.
 */
class ImageCarousel {
    constructor(options = {}) {
        // Configuration with default values
        this.transitionDuration = options.transitionDuration || 500;
        this.autoAdvanceInterval = options.autoAdvanceInterval || 5000;
        this.touchSensitivity = options.touchSensitivity || 100; // Increased sensitivity

        // State
        this.currentIndex = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragDiff = 0;
        this.autoAdvanceTimer = null;

        // DOM elements
        this.carousel = document.querySelector('.project-container'); // Targeting the correct container
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');

        // If there are no images, stop execution
        if (this.items.length === 0) return;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSlide(this.currentIndex);
        this.startAutoAdvance();
    }

    setupEventListeners() {
        // Click events on buttons
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Drag events (touch and mouse)
        this.track.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.track.addEventListener('touchstart', this.handleDragStart.bind(this));
        this.track.addEventListener('mousemove', this.handleDrag.bind(this));
        this.track.addEventListener('touchmove', this.handleDrag.bind(this));
        this.track.addEventListener('mouseup', this.handleDragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.handleDragEnd.bind(this));
        this.track.addEventListener('touchend', this.handleDragEnd.bind(this));

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    // Show the slide specified by the index
    showSlide(index) {
        if (index < 0 || index >= this.items.length) return;

        this.currentIndex = index;
        const offset = -index * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        this.resetAutoAdvance();
    }

    // Move to the next slide
    nextSlide() {
        const newIndex = (this.currentIndex + 1) % this.items.length;
        this.showSlide(newIndex);
    }

    // Move to the previous slide
    prevSlide() {
        const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showSlide(newIndex);
    }

    // Start dragging
    handleDragStart(e) {
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.dragStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.pauseAutoAdvance();
    }

    // Move the carousel during dragging
    handleDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.dragDiff = x - this.dragStartX;
        const newOffset = -this.currentIndex * 100 + (this.dragDiff / this.carousel.offsetWidth * 100);
        this.track.style.transform = `translateX(${newOffset}%)`;
    }

    // End dragging
    handleDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.style.cursor = 'grab';

        // Determine whether to move to the next or previous slide based on the drag distance
        if (Math.abs(this.dragDiff) > this.touchSensitivity) {
            if (this.dragDiff > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.showSlide(this.currentIndex); // Return to the current slide
        }

        this.dragDiff = 0;
        this.resetAutoAdvance();
    }

    // Start auto-advance
    startAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
        this.autoAdvanceTimer = setInterval(() => this.nextSlide(), this.autoAdvanceInterval);
    }

    // Pause auto-advance
    pauseAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
    }

    // Reset auto-advance
    resetAutoAdvance() {
        this.pauseAutoAdvance();
        this.startAutoAdvance();
    }
}

/**
 * Art Image Carousel - Gerencia o carrossel de arte digital.
 */
class ArtImageCarousel {
    constructor() {
        this.track = document.querySelector('.art-carousel__track');
        this.items = Array.from(this.track.children);
        this.nextButton = document.querySelector('.art-carousel__button--next');
        this.prevButton = document.querySelector('.art-carousel__button--prev');
        this.currentIndex = 0;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;

        this.init();
    }

    init() {
        // Wait for images to load before calculating item width
        Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
            this.itemWidth = this.items[0].offsetWidth;
            this.setupEventListeners();
            this.items[0].classList.add('active');
        });
    }

    setupEventListeners() {
        this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
        this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));

        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        this.track.addEventListener('touchstart', this.dragStart.bind(this));
        this.track.addEventListener('mouseup', this.dragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.dragEnd.bind(this));
        this.track.addEventListener('touchend', this.dragEnd.bind(this));
        this.track.addEventListener('mousemove', this.drag.bind(this));
        this.track.addEventListener('touchmove', this.drag.bind(this));
    }

    moveToSlide(index) {
        if (index < 0) {
            index = this.items.length - 1;
        } else if (index >= this.items.length) {
            index = 0;
        }
        this.track.style.transform = `translateX(-${this.itemWidth * index}px)`;
        this.currentIndex = index;

        this.items.forEach(item => item.classList.remove('active'));
        this.items[this.currentIndex].classList.add('active');
    }

    dragStart(e) {
        this.isDragging = true;
        this.startPos = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.prevTranslate = this.currentTranslate;
        this.track.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        const currentPosition = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    dragEnd() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        const movedBy = this.currentTranslate - this.prevTranslate;
        if (movedBy < -100 && this.currentIndex < this.items.length - 1) {
            this.currentIndex += 1;
        } else if (movedBy > 100 && this.currentIndex > 0) {
            this.currentIndex -= 1;
        }
        this.moveToSlide(this.currentIndex);
    }
}

/**
 * Skills Manager - Gerencia as seções de habilidades, incluindo a animação das barras de progresso.
 */
class SkillsManager {
    constructor() {
        this.skillsContents = document.querySelectorAll('.skills__content');
        this.activeSection = null;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.skillsContents.forEach(content => {
            const header = content.querySelector('.skills__header');
            if (header) {
                header.addEventListener('click', () => this.toggleSection(content));
            }
        });
    }

    toggleSection(section) {
        if (this.isAnimating) return;

        const isOpeningSection = !section.classList.contains('skills__open');

        if (this.activeSection && this.activeSection !== section) {
            this.closeSection(this.activeSection);
        }

        if (isOpeningSection) {
            this.openSection(section);
        } else {
            this.closeSection(section);
        }
    }

    openSection(section) {
        this.isAnimating = true;
        section.classList.add('skills__open');
        this.activeSection = section;

        this.animateProgressBars(section);

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    closeSection(section) {
        this.isAnimating = true;
        section.classList.remove('skills__open');

        const progressBars = section.querySelectorAll('.skill__progress');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });

        if (this.activeSection === section) {
            this.activeSection = null;
        }

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    animateProgressBars(section) {
        const progressBars = section.querySelectorAll('.skill__progress');

        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });

        requestAnimationFrame(() => {
            progressBars.forEach(bar => {
                const percentage = bar.getAttribute('data-percentage');
                bar.style.width = `${percentage}%`;
            });
        });
    }
}

/**
 * Modal Manager - Gerencia a abertura e o fechamento dos modais de serviços.
 */
class ModalManager {
    constructor() {
        this.servicesSection = document.querySelector(".services.section");
        this.modalViews = document.querySelectorAll(".services__modal");
        this.init();
    }

    init() {
        this.servicesSection.addEventListener("click", this.handleModalEvents.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    openModal(index) {
        this.modalViews[index].classList.add("active-modal");
    }

    closeModal() {
        this.modalViews.forEach(modal => modal.classList.remove("active-modal"));
    }

    handleModalEvents(event) {
        const target = event.target;

        if (target.closest('.services__button')) {
            const button = target.closest('.services__button');
            const modalIndex = button.getAttribute('data-modal');
            this.openModal(parseInt(modalIndex));
        }

        if (target.classList.contains("services__modal-close") ||
            target.classList.contains("services__modal")) {
            this.closeModal();
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }
}

/**
 * Testimonials Carousel - Gerencia o carrossel de depoimentos.
 */
class TestimonialsCarousel {
    constructor() {
        this.track = document.querySelector('.testimonials-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = document.querySelector('.next-testimonial');
        this.prevButton = document.querySelector('.prev-testimonial');
        this.dotsContainer = document.querySelector('.testimonial-dots');
        this.activeSlideIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;

        this.init();
    }

    init() {
        this.dotsContainer.innerHTML = '';

        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        this.updateSlideWidth();
        this.startAutoplay();

        this.track.parentElement.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.parentElement.addEventListener('mouseleave', () => this.startAutoplay());
        this.nextButton.addEventListener('click', () => this.moveToNextSlide());
        this.prevButton.addEventListener('click', () => this.moveToPrevSlide());
        window.addEventListener('resize', () => this.updateSlideWidth());

        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    updateSlideWidth() {
        const containerWidth = this.track.parentElement.offsetWidth;
        this.slides.forEach(slide => {
            slide.style.width = `${containerWidth}px`;
        });
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        const slideWidth = this.slides[0].offsetWidth;
        this.track.style.transform = `translateX(${-slideWidth * this.activeSlideIndex}px)`;

        const dots = this.dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.activeSlideIndex);
        });
    }

    goToSlide(index) {
        this.activeSlideIndex = index;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    moveToNextSlide() {
        this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    moveToPrevSlide() {
        this.activeSlideIndex = (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlidePosition();
        this.resetAutoplay();
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => this.moveToNextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    handleSwipe(touchStartX, touchEndX) {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                this.moveToNextSlide();
            } else {
                this.moveToPrevSlide();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const seeMoreButton = document.querySelector('.resume__see-more');
    const resumeContent = document.querySelector('.resume__content');

    seeMoreButton.addEventListener('click', function() {
        if (resumeContent.classList.contains('expanded')) {
            resumeContent.classList.remove('expanded');
            this.innerHTML = 'Ver Mais <i class="uil uil-arrow-down"></i>';
        } else {
            resumeContent.classList.add('expanded');
            this.innerHTML = 'Ver Menos <i class="uil uil-arrow-up"></i>';
        }
    });
});