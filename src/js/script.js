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
        // Configurações padrão com fallback para valores definidos no construtor
        this.transitionDuration = options.transitionDuration || 200; // Duração da transição em ms
        this.autoAdvanceInterval = options.autoAdvanceInterval || 4000; // Intervalo de avanço automático em ms
        this.touchSensitivity = options.touchSensitivity || 100; // Sensibilidade ao toque em px

        // Estado inicial do carrossel
        this.currentIndex = 0; // Índice do slide atual
        this.isDragging = false; // Indica se o usuário está arrastando o carrossel
        this.startPos = 0; // Posição inicial do mouse/toque
        this.currentTranslate = 0; // Translado atual do carrossel
        this.prevTranslate = 0; // Translado anterior do carrossel
        this.animationId = null; // ID da animação atual para controle de requestAnimationFrame
        this.autoAdvanceTimer = null; // Timer para avanço automático
        this.isHovering = false; // Indica se o mouse está sobre o carrossel
        this.isTransitioning = false; // Indica se uma transição está em andamento

        // Seletores para os elementos do carrossel no DOM
        this.carousel = document.querySelector('.carousel');
        this.track = document.querySelector('.carousel-track');
        this.items = Array.from(document.querySelectorAll('.carousel-item'));
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');
        this.filterButtons = document.querySelectorAll('.filter-button');

        // Verifica se os elementos essenciais do carrossel foram encontrados
        if (!this.validateElements()) return;

        // Largura inicial do item é calculada após a validação dos elementos
        this.itemWidth = this.items[0].offsetWidth;
        this.init();
    }

    // Valida a presença dos elementos essenciais do carrossel no DOM
    validateElements() {
        if (!this.carousel || !this.track || this.items.length === 0) {
            console.error('Elementos essenciais do carrossel não encontrados');
            return false;
        }
        return true;
    }

    // Inicializa o carrossel
    init() {
        // Configura o estado inicial dos itens do carrossel
        this.items.forEach(item => {
            item.style.display = 'flex'; // Define a exibição como flex
            item.classList.add('active'); // Adiciona a classe 'active' a todos os itens inicialmente
        });

        // Configura os event listeners
        this.setupEventListeners();
        // Atualiza a lista de itens visíveis
        this.updateVisibleItems();
        // Mostra o primeiro slide
        this.showSlide(0);
        // Inicia o avanço automático dos slides
        this.startAutoAdvance();

        // Cria um observer para observar mudanças no tamanho do contêiner do carrossel
        this.resizeObserver = new ResizeObserver(entries => {
            this.handleResize(entries);
        });
        // Começa a observar o contêiner do carrossel
        this.resizeObserver.observe(this.track);
    }

    // Atualiza a lista de itens visíveis com base no display atual
    updateVisibleItems() {
        this.visibleItems = this.items.filter(item =>
            item.style.display !== 'none' &&
            window.getComputedStyle(item).display !== 'none'
        );

        // Atualiza a exibição dos botões de navegação
        if (this.prevButton && this.nextButton) {
            const shouldShowButtons = this.visibleItems.length > 1;
            this.prevButton.style.display = shouldShowButtons ? '' : 'none';
            this.nextButton.style.display = shouldShowButtons ? '' : 'none';
        }
    }

    // Lida com o redimensionamento do contêiner do carrossel
    handleResize(entries) {
        if (this.isTransitioning) return;

        this.updateVisibleItems();

        if (this.visibleItems.length > 0) {
            this.itemWidth = this.visibleItems[0].offsetWidth;

            this.currentIndex = Math.min(this.currentIndex, this.visibleItems.length - 1);

            const offset = -this.currentIndex * this.itemWidth;
            this.track.style.transition = 'none';
            this.track.style.transform = `translateX(${offset}px)`;
            this.track.offsetHeight; // Força reflow
            this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
        }
    }

    // Configura os event listeners para interação do usuário
    setupEventListeners() {
        // Adiciona listeners para os botões de navegação com debounce
        if (this.prevButton) {
            this.prevButton.addEventListener('click', this.debounce(() => this.prevSlide(), 250));
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', this.debounce(() => this.nextSlide(), 250));
        }

        // Configura eventos de arrastar para mouse e toque
        const dragEvents = {
            mouse: { start: 'mousedown', move: 'mousemove', end: 'mouseup', leave: 'mouseleave' },
            touch: { start: 'touchstart', move: 'touchmove', end: 'touchend' }
        };

        Object.values(dragEvents).forEach(eventSet => {
            this.track.addEventListener(eventSet.start, e => !this.isTransitioning && this.handleDragStart(e));
            this.track.addEventListener(eventSet.move, e => this.handleDrag(e));
            this.track.addEventListener(eventSet.end, () => this.handleDragEnd());
            if (eventSet.leave) {
                this.track.addEventListener(eventSet.leave, () => this.handleDragEnd());
            }
        });

        // Adiciona navegação por teclado com debounce
        document.addEventListener('keydown', this.debounce(e => {
            if (!this.isTransitioning) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        }, 250));

        // Configura os listeners para os botões de filtro
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.filter;
                this.filterProjects(category);

                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Pausa o avanço automático quando o mouse está sobre o carrossel
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.pauseAutoAdvance();
            });

            this.carousel.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.resetAutoAdvance();
            });
        }

        // Adiciona listeners para eventos de transição
        this.track.addEventListener('transitionstart', () => {
            this.isTransitioning = true;
        });

        this.track.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });
    }

    // Exibe o slide especificado pelo índice
    showSlide(index) {
        this.updateVisibleItems();

        if (this.visibleItems.length === 0 || this.isTransitioning) return;

        index = ((index % this.visibleItems.length) + this.visibleItems.length) % this.visibleItems.length;
        this.currentIndex = index;

        this.visibleItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        const offset = -this.currentIndex * this.itemWidth;
        this.currentTranslate = offset;
        this.track.style.transform = `translateX(${offset}px)`;
    }

    // Move para o próximo slide
    nextSlide() {
        if (this.isTransitioning) return;
        this.showSlide(this.currentIndex + 1);
    }

    // Move para o slide anterior
    prevSlide() {
        if (this.isTransitioning) return;
        this.showSlide(this.currentIndex - 1);
    }

    // Função de debounce para limitar a frequência de eventos
    debounce(func, wait) {
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

    // Inicia o arrastar
    handleDragStart(e) {
        if (this.isTransitioning) return;

        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.prevTranslate = this.currentTranslate;

        cancelAnimationFrame(this.animationId);
        this.pauseAutoAdvance();
    }

    // Move o carrossel durante o arrastar
    handleDrag(e) {
        if (!this.isDragging || this.isTransitioning) return;
        e.preventDefault();

        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - this.startPos;
        this.currentTranslate = this.prevTranslate + diff;

        this.animationId = requestAnimationFrame(() => {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        });
    }

    // Finaliza o arrastar
    handleDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.track.style.cursor = '';

        const movedBy = this.currentTranslate - this.prevTranslate;

        if (Math.abs(movedBy) > this.touchSensitivity) {
            if (movedBy > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.showSlide(this.currentIndex);
        }

        if (!this.isHovering) {
            this.resetAutoAdvance();
        }
    }

    // Filtra os projetos com base na categoria
    filterProjects(category) {
        this.items.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            item.style.display = shouldShow ? 'flex' : 'none';
        });

        this.updateVisibleItems();
        this.currentIndex = 0;
        this.showSlide(0);
    }

    // Inicia o avanço automático
    startAutoAdvance() {
        this.autoAdvanceTimer = setInterval(() => {
            if (!this.isHovering && !this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoAdvanceInterval);
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

// Inicializa o carrossel quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ImageCarousel();
});

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