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
        if (document.body.classList.contains('dark-mode')) {
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

document.addEventListener('DOMContentLoaded', () => {
    // Inicia o carrossel
    const carousel = new ImageCarousel({
        sensitivity: 100,
        autoAdvanceInterval: 5000,
        transitionDuration: 500
    });

    // Inicia o gerenciamento das habilidades
    const skillsManager = new SkillsManager();
});

// Classe para gerenciar o carrossel de imagens
class ImageCarousel {
    constructor(options = {}) {
        // Configuração com valores padrão
        this.transitionDuration = options.transitionDuration || 500; // Duração da transição em ms
        this.autoAdvanceInterval = options.autoAdvanceInterval || 5000; // Intervalo de avanço automático em ms
        this.touchSensitivity = options.touchSensitivity || 50; // Sensibilidade ao toque (pixels)

        // Estado
        this.currentIndex = 0; // Índice da imagem atual
        this.isDragging = false; // Flag para verificar se está arrastando
        this.dragStartX = 0; // Posição X inicial do arrasto
        this.dragDiff = 0; // Diferença entre a posição inicial e a atual do arrasto
        this.autoAdvanceTimer = null; // Timer para avanço automático

        // Elementos do DOM
        this.carousel = document.querySelector('.gallery__carousel');
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item');
        this.images = document.querySelectorAll('.carousel-item img');
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

        // Eventos de arrastar (touch e mouse)
        this.track.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.track.addEventListener('touchstart', this.handleDragStart.bind(this));
        this.track.addEventListener('mousemove', this.handleDrag.bind(this));
        this.track.addEventListener('touchmove', this.handleDrag.bind(this));
        this.track.addEventListener('mouseup', this.handleDragEnd.bind(this));
        this.track.addEventListener('mouseleave', this.handleDragEnd.bind(this));
        this.track.addEventListener('touchend', this.handleDragEnd.bind(this));

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Eventos de carregamento de imagem (para transição suave)
        this.images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.transition = `opacity ${this.transitionDuration}ms ease-in-out, transform ${this.transitionDuration}ms ease-in-out`;
                if (img.parentElement.classList.contains('active')) {
                    img.style.opacity = '1';
                }
            });
        });
    }

    // Mostra o slide especificado pelo índice
    showSlide(index) {
        // Certifique-se de que o índice esteja dentro dos limites
        if (index < 0 || index >= this.items.length) return;

        // Remove a classe 'active' de todos os itens
        this.items.forEach(item => item.classList.remove('active'));

        // Adiciona a classe 'active' ao item atual
        this.items[index].classList.add('active');

        // Define a transformação do track para mover o carrossel
        const offset = -index * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        this.currentIndex = index;
        this.resetAutoAdvance();
    }

    // Avança para o próximo slide
    nextSlide() {
        const newIndex = (this.currentIndex + 1) % this.items.length;
        this.showSlide(newIndex);
    }

    // Volta para o slide anterior
    prevSlide() {
        const newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showSlide(newIndex);
    }

    // Inicia o arrasto
    handleDragStart(e) {
        this.isDragging = true;
        this.track.style.cursor = 'grabbing';
        this.dragStartX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        // Pausa o avanço automático ao iniciar o arrasto
        clearInterval(this.autoAdvanceTimer);
    }

    // Move o carrossel durante o arrasto
    handleDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        this.dragDiff = (this.dragStartX - x);
        const newOffset = -this.currentIndex * 100 - (this.dragDiff / this.carousel.offsetWidth * 100);
        this.track.style.transform = `translateX(${newOffset}%)`;

        // Ajustar o índice atual com base no arrasto
        if (Math.abs(this.dragDiff) > this.touchSensitivity) {
            if (this.dragDiff > 0) {
                // Arrastou para a esquerda
                this.currentIndex = (this.currentIndex + 1) % this.items.length;
            } else {
                // Arrastou para a direita
                this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
            }

            // Atualizar a posição inicial do arrasto para a próxima ação
            this.dragStartX = x;

            // Mover o carrossel para o novo índice
            this.showSlide(this.currentIndex);
        }
    }

    // Finaliza o arrasto
    handleDragEnd() {
        this.isDragging = false;
        this.track.style.cursor = 'grab';
        this.resetAutoAdvance();
    }

    // Inicia o avanço automático
    startAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
        this.autoAdvanceTimer = setInterval(() => this.nextSlide(), this.autoAdvanceInterval);
    }

    // Reinicia o avanço automático
    resetAutoAdvance() {
        clearInterval(this.autoAdvanceTimer);
        this.startAutoAdvance();
    }
}

// Inicializa o carrossel
document.addEventListener('DOMContentLoaded', () => {
    new ImageCarousel();
});

//CARROUSEL ARTISTA DIGITAL
document.addEventListener('DOMContentLoaded', () => {
/**
 * Seleciona os elementos do carrossel.
 */
const track = document.querySelector('.art-carousel__track'); // Faixa do carrossel
const items = Array.from(track.children); // Itens do carrossel (imagens)
const nextButton = document.querySelector('.art-carousel__button--next'); // Botão "próximo"
const prevButton = document.querySelector('.art-carousel__button--prev'); // Botão "anterior"

/**
 * Variáveis de controle do carrossel.
 */
let currentIndex = 0; // Índice do slide atual
const itemWidth = items[0].offsetWidth; // Largura de um item (assume que todos têm a mesma largura)

/**
 * Move o carrossel para um slide específico.
 * @param {number} index - O índice do slide para o qual mover.
 */
function moveToSlide(index) {
    track.style.transform = `translateX(-${itemWidth * index}px)`; // Move a faixa
    currentIndex = index; // Atualiza o índice atual

    // Atualiza a classe 'active' para o item atual
    items.forEach(item => item.classList.remove('active'));
    items[currentIndex].classList.add('active');
}

/**
 * Evento de clique no botão "próximo".
 */
nextButton.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
        moveToSlide(currentIndex + 1); // Move para o próximo slide
    } else {
        moveToSlide(0); // Volta para o primeiro slide se estiver no último
    }
});

/**
 * Evento de clique no botão "anterior".
 */
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        moveToSlide(currentIndex - 1); // Move para o slide anterior
    } else {
        moveToSlide(items.length - 1); // Vai para o último slide se estiver no primeiro
    }
});

/**
 * Define o primeiro item como ativo inicialmente.
 */
items[0].classList.add('active');

/**
 * Variáveis para a funcionalidade de arrastar.
 */
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

/**
 * Evento de 'mousedown' (clique e segurar) na faixa do carrossel.
 */
track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startPos = e.clientX; // Posição X inicial do mouse
    prevTranslate = currentTranslate; // Armazena a translação atual
    track.style.cursor = 'grabbing'; // Muda o cursor para 'grabbing'
});

/**
 * Evento de 'mousemove' (mover o mouse) na faixa do carrossel.
 */
track.addEventListener('mousemove', (e) => {
    if (!isDragging) return; // Se não estiver arrastando, não faz nada
    const currentPosition = e.clientX; // Posição X atual do mouse
    currentTranslate = prevTranslate + currentPosition - startPos; // Calcula a nova translação
    track.style.transform = `translateX(${currentTranslate}px)`; // Move a faixa
});

/**
 * Evento de 'mouseup' (soltar o clique) na faixa do carrossel.
 */
track.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.cursor = 'grab'; // Muda o cursor para 'grab'
    const movedBy = currentTranslate - prevTranslate; // Calcula o deslocamento

    // Se moveu mais que 100px ou menos que -100px, muda de slide
    if (movedBy < -100 && currentIndex < items.length - 1) {
        currentIndex += 1;
    } else if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    moveToSlide(currentIndex); // Move para o slide correto
});

/**
 * Evento de 'mouseleave' (mouse sair da faixa) na faixa do carrossel.
 */
track.addEventListener('mouseleave', () => {
    isDragging = false;
    track.style.cursor = 'grab';
    moveToSlide(currentIndex); // Retorna para o slide atual
});

/**
 * Eventos de toque para dispositivos móveis.
 */
track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startPos = e.touches[0].clientX; // Posição X inicial do toque
    prevTranslate = currentTranslate;
    track.style.cursor = 'grabbing';
});

track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX; // Posição X atual do toque
    currentTranslate = prevTranslate + currentPosition - startPos;
    track.style.transform = `translateX(${currentTranslate}px)`;
});

track.addEventListener('touchend', () => {
    isDragging = false;
    track.style.cursor = 'grab';
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < items.length - 1) {
        currentIndex += 1;
    } else if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    moveToSlide(currentIndex);
});

});

// Classe para gerenciar as seções de habilidades
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

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa o carrossel se houver elementos necessários
    if (document.querySelector('.main-image-container')) {
        new ImageCarousel();
    }

    // Inicializa o gerenciador de habilidades se houver elementos necessários
    if (document.querySelector('.skills__content')) {
        new SkillsManager();
    }
});

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

// Carrossel de Depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonials-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-testimonial');
    const prevButton = document.querySelector('.prev-testimonial');
    // Procura o container de dots existente em vez de criar um novo
    const dotsContainer = document.querySelector('.testimonial-dots');
    let activeSlideIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 segundos entre cada slide

    // Configuração inicial
    function initialize() {
        // Limpa os dots existentes (se houver)
        dotsContainer.innerHTML = '';
        
        // Adiciona os indicadores de slide (dots)
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Configura a largura inicial dos slides
        updateSlideWidth();
        
        // Inicia o autoplay
        startAutoplay();

        // Pausa o autoplay quando o mouse está sobre o carrossel
        track.parentElement.addEventListener('mouseenter', stopAutoplay);
        track.parentElement.addEventListener('mouseleave', startAutoplay);
    }

    // Atualiza a largura dos slides baseado no container
    function updateSlideWidth() {
        const containerWidth = track.parentElement.offsetWidth;
        slides.forEach(slide => {
            slide.style.width = `${containerWidth}px`;
        });
        updateSlidePosition();
    }

    // Atualiza a posição dos slides
    function updateSlidePosition() {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(${-slideWidth * activeSlideIndex}px)`;
        
        // Atualiza os dots
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === activeSlideIndex);
        });
    }

    // Vai para um slide específico
    function goToSlide(index) {
        activeSlideIndex = index;
        updateSlidePosition();
        resetAutoplay();
    }

    // Move para o próximo slide
    function moveToNextSlide() {
        activeSlideIndex = (activeSlideIndex + 1) % slides.length;
        updateSlidePosition();
        resetAutoplay();
    }

    // Move para o slide anterior
    function moveToPrevSlide() {
        activeSlideIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
        updateSlidePosition();
        resetAutoplay();
    }

    // Inicia o autoplay
    function startAutoplay() {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(moveToNextSlide, autoplayDelay);
    }

    // Para o autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Reseta o autoplay
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event Listeners
    nextButton.addEventListener('click', moveToNextSlide);
    prevButton.addEventListener('click', moveToPrevSlide);
    window.addEventListener('resize', updateSlideWidth);

    // Suporte a gestos touch para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Mínima distância para considerar como swipe
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                moveToNextSlide();
            } else {
                moveToPrevSlide();
            }
        }
    }

    // Inicializa o carrossel
    initialize();
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navMenu = document.querySelector('.header__nav');
    const menuIcon = document.querySelector('.header__menu-icon');
    const navLinks = document.querySelectorAll('.header__nav-link');

    // Toggle menu
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('open');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Atualizar link ativo ao rolar
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.header__nav-link[href*=${sectionId}]`).classList.add('active');
            } else {
                document.querySelector(`.header__nav-link[href*=${sectionId}]`).classList.remove('active');
            }
        });
    });
});