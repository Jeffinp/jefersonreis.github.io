/**
 * Funções Utilitárias
 * ====================
 * Funções auxiliares para tarefas comuns.
 */

/**
 * Debounce - Limita a taxa de execução de uma função.
 * @param {function} func - A função a ser executada após o atraso.
 * @param {number} wait - O atraso em milissegundos.
 * @returns {function} - Função com debounce.
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
 * Rola suavemente até um elemento.
 * @param {HTMLElement} element - O elemento alvo para o qual rolar.
 */
function smoothScrollToElement(element) {
    if (element) {
        const offsetTop = element.offsetTop;
        smoothScroll(offsetTop);
    }
}

/**
 * Rola suavemente até uma posição específica na página.
 * @param {number} to - A posição alvo para rolar (em pixels).
 * @param {number} duration - A duração da animação de rolagem (em milissegundos).
 */
function smoothScroll(to, duration = 600) {
    const start = window.pageYOffset;
    const change = to - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const newPosition = easeInOutQuad(elapsedTime, start, change, duration);
        window.scrollTo(0, newPosition);
        if (elapsedTime < duration) {
            requestAnimationFrame(animateScroll);
        }
    }

    // Função de easing para uma animação suave
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animateScroll);
}

/**
 * Alterna a visibilidade do botão "Voltar ao Topo" com base na posição de rolagem.
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
 * Componentes
 * ===========
 * Classes para gerenciar componentes individuais da página.
 */

/**
 * Image Carousel - Gerencia o carrossel de imagens principal.
 */
class ImageCarousel {
    constructor(options = {}) {
        // Configuração com valores padrão
        this.transitionDuration = options.transitionDuration || 500;
        this.autoAdvanceInterval = options.autoAdvanceInterval || 5000;
        this.touchSensitivity = options.touchSensitivity || 100; // Aumentei a sensibilidade

        // Estado
        this.currentIndex = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragDiff = 0;
        this.autoAdvanceTimer = null;

        // Elementos do DOM
        this.carousel = document.querySelector('.project-container'); // Selecionando o container correto
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');

        // Se não houver imagens, interrompe a execução
        if (this.items.length === 0) return;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSlide(this.currentIndex);
        this.startAutoAdvance();
    }

    setupEventListeners() {
        // Eventos de clique nos botões
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Eventos de arrastar (toque e mouse)
        this.track.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.track.addEventListener('mousemove', this.handleDrag.bind(this));
        this.track.addEventListener('mouseup', this.handleDragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.handleDragEnd.bind(this));

        // Adicionando passive: true para os eventos de toque
        this.track.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: true });
        this.track.addEventListener('touchmove', this.handleDrag.bind(this), { passive: false });
        this.track.addEventListener('touchend', this.handleDragEnd.bind(this), { passive: true });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    // Mostra o slide especificado pelo índice
    showSlide(index) {
        if (index < 0 || index >= this.items.length) return;

        this.currentIndex = index;
        const offset = -index * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        this.resetAutoAdvance();
    }

    // Move para o próximo slide
    nextSlide() {
        const newIndex = (this.currentIndex + 1) % this.items.length;
        this.showSlide(newIndex);
    }

    // Move para o slide anterior
    prevSlide() {
        const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showSlide(newIndex);
    }

    // Inicia o arrastar
    handleDragStart(e) {
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.dragStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.pauseAutoAdvance();
    }

    // Move o carrossel durante o arrastar
    handleDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.dragDiff = x - this.dragStartX;
        const newOffset = -this.currentIndex * 100 + (this.dragDiff / this.carousel.offsetWidth * 100);
        this.track.style.transform = `translateX(${newOffset}%)`;
    }

    // Finaliza o arrastar
    handleDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.track.style.cursor = 'grab';

        // Determina se deve mover para o próximo ou anterior com base na distância do arrasto
        if (Math.abs(this.dragDiff) > this.touchSensitivity) {
            if (this.dragDiff > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.showSlide(this.currentIndex); // Retorna ao slide atual
        }

        this.dragDiff = 0;
        this.resetAutoAdvance();
    }

    // Inicia o avanço automático
    startAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
        this.autoAdvanceTimer = setInterval(() => this.nextSlide(), this.autoAdvanceInterval);
    }

    // Pausa o avanço automático
    pauseAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
    }

    // Reinicia o avanço automático
    resetAutoAdvance() {
        this.pauseAutoAdvance();
        this.startAutoAdvance();
    }
}

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

        window.addEventListener('DOMContentLoaded', () => {
            window.addEventListener('load', () => {
                this.init();
            });
        });
    }

    init() {
        this.itemWidth = this.items[0].offsetWidth;
        this.setupEventListeners();
        this.items[0].classList.add('active');
    }

    setupEventListeners() {
        this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
        this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));

        this.track.addEventListener('mousedown', this.dragStart.bind(this));
        this.track.addEventListener('mouseup', this.dragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.dragEnd.bind(this));
        this.track.addEventListener('mousemove', this.drag.bind(this));

        this.track.addEventListener('touchstart', this.dragStart.bind(this), { passive: true });
        this.track.addEventListener('touchmove', this.drag.bind(this), { passive: false });
        this.track.addEventListener('touchend', this.dragEnd.bind(this), { passive: true });
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
        const threshold = this.itemWidth * 0.25;

        if (movedBy < -threshold && this.currentIndex < this.items.length - 1) {
            this.currentIndex += 1;
        } else if (movedBy > threshold && this.currentIndex > 0) {
            this.currentIndex -= 1;
        }
        this.moveToSlide(this.currentIndex);
    }
}

// Instanciar a classe após a definição
new ArtImageCarousel();

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
        scrollToTopBtn: document.getElementById("scrollToTopBtn"),
        darkModeToggle: document.getElementById("darkModeToggle"),
        darkModeIcon: document.getElementById('darkModeIcon'),
        languageLinks: document.querySelectorAll('.language-switch a'),
        resumeContent: document.querySelector('.resume__content'),
        seeMoreButton: document.querySelector('.resume__see-more'),
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
            // Trava o scroll quando o menu estiver aberto
            document.body.style.overflow = elements.navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Fecha o menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!elements.navMenu.contains(e.target) && !elements.menuToggle.contains(e.target)) {
                elements.navMenu.classList.remove('open');
                elements.menuToggle.classList.remove('active');
                document.body.style.overflow = ''; // Libera o scroll
            }
        });

        // Fecha o menu ao clicar em um link (para mobile)
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('open');
                elements.menuToggle.classList.remove('active');
                document.body.style.overflow = ''; // Libera o scroll
            });
        });
    }

    // Smooth scroll para links internos
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Previne o comportamento padrão do link
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            smoothScrollToElement(targetElement); // Chama a função de rolagem suave
        });
    });

    // Adiciona classe 'selected' ao link da seção visível (Não está sendo usado no momento, mas é útil)
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            elements.navLinks.forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Atualiza link ativo ao rolar
    const sections = document.querySelectorAll('section[id]'); // Todas as seções com ID
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // 100 é um offset para começar a transição mais cedo
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.header__nav-link[href="#${sectionId}"]`);

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
        elements.scrollToTopBtn.addEventListener("click", () => smoothScroll(0)); // Rola para o topo da página
    }

    /**
     * Botão "Ver Mais" do Currículo
     * ------------------------------
     * Controla a expansão e retração do conteúdo do currículo.
     */
    if (elements.seeMoreButton) {
        elements.seeMoreButton.addEventListener("click", () => {
            elements.resumeContent.classList.toggle("expanded");

            // Atualiza o texto e o ícone do botão
            if (elements.resumeContent.classList.contains("expanded")) {
                elements.seeMoreButton.innerHTML = 'Ver Menos <span class="iconify" data-icon="uil:arrow-up"></span>';
            } else {
                elements.seeMoreButton.innerHTML = 'Ver Mais <span class="iconify" data-icon="uil:arrow-down"></span>';
            }
        });
    }


    /**
     * Modo Escuro/Claro
     * -----------------
     * Alterna entre os modos escuro e claro e armazena a preferência do usuário.
     */
    const toggleDarkMode = () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        elements.darkModeToggle.classList.add('rotate');

        // Atualiza o ícone com base no modo atual
        elements.darkModeIcon.setAttribute('data-icon', isDarkMode ? 'mdi:weather-night' : 'mdi:white-balance-sunny');

        // Salva a preferência do usuário no localStorage
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

        // Remove a classe 'rotate' após a animação
        setTimeout(() => elements.darkModeToggle.classList.remove('rotate'), 300);
    };

    const loadUserPreference = () => {
        const darkModeSetting = localStorage.getItem('darkMode');

        // Aplica o modo escuro se a configuração for 'enabled' ou se for a primeira visita
        if (darkModeSetting === 'enabled' || darkModeSetting === null) {
            document.body.classList.add('dark-mode');
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:weather-night');
        } else {
            document.body.classList.remove('dark-mode');
            elements.darkModeIcon.setAttribute('data-icon', 'mdi:white-balance-sunny');
        }
    };

    // Adiciona o listener de eventos ao botão de alternância do modo escuro
    elements.darkModeToggle.addEventListener('click', toggleDarkMode);

    // Carrega a preferência do usuário ao iniciar
    loadUserPreference();

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
            removeActiveClass(); // Remove a classe 'active' de todos os links
            link.classList.add('active'); // Adiciona 'active' ao link clicado
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