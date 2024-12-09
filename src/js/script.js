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

// ARTISTA DIGITAL
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.main-image');
    if (images.length === 0) return; // Sai se a seção não existir

    const prevButton = document.querySelector('.nav.prev');
    const nextButton = document.querySelector('.nav.next');
    let currentIndex = 0;

    function showImage(index) {
        images[currentIndex].classList.remove('active');
        images[index].classList.add('active');
        currentIndex = index;
    }

    prevButton?.addEventListener('click', () => {
        const newIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        showImage(newIndex);
    });

    nextButton?.addEventListener('click', () => {
        const newIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        showImage(newIndex);
    });

    // Mostra a primeira imagem ao carregar a página
    showImage(0);
});

// Carousel functionality
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentIndex = 0;
let startX;
let isDragging = false;

function updateCarousel(smooth = true) {
    const offset = -currentIndex * 100;
    track.style.transition = smooth ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Touch and mouse events for dragging
track.addEventListener('mousedown', dragStart);
track.addEventListener('touchstart', dragStart);

track.addEventListener('mousemove', drag);
track.addEventListener('touchmove', drag);

track.addEventListener('mouseup', dragEnd);
track.addEventListener('mouseleave', dragEnd);
track.addEventListener('touchend', dragEnd);

function dragStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    track.style.cursor = 'grabbing';
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;
    const sensitivity = 100; // Adjust this value to change drag sensitivity

    if (Math.abs(diff) > sensitivity) {
        if (diff > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
        isDragging = false;
    }
}

function dragEnd() {
    isDragging = false;
    track.style.cursor = 'grab';
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Initial setup
updateCarousel(false);

// SKILLS ANIMATION
document.addEventListener('DOMContentLoaded', () => {
    const skillsContent = document.getElementsByClassName('skills__content');
    const skillsHeader = document.querySelectorAll('.skills__header');

    function toggleSkills() {
        let itemClass = this.parentNode.className;

        for (let i = 0; i < skillsContent.length; i++) {
            skillsContent[i].className = 'skills__content skills__close';
        }

        if (itemClass === 'skills__content skills__close') {
            this.parentNode.className = 'skills__content skills__open';
            resetAndAnimateSkills(this.parentNode);
        }
    }

    function resetAndAnimateSkills(skillsSection) {
        const progressBars = skillsSection.querySelectorAll('.skills__progress');
        const numbers = skillsSection.querySelectorAll('.skills__number');

        progressBars.forEach((bar) => {
            const percentage = bar.dataset.percentage;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = percentage;
            }, 10);
        });

        numbers.forEach((number) => {
            const targetValue = parseInt(number.dataset.value);
            number.textContent = '0%';
            setTimeout(() => {
                animateNumber(number, targetValue);
            }, 10);
        });
    }

    function animateNumber(element, target) {
        let current = 0;
        const duration = 1000; // Animation duration in milliseconds
        const start = performance.now();

        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.round(progress * target);
            element.textContent = current + '%';

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    skillsHeader.forEach((el) => {
        el.addEventListener('click', toggleSkills);
    });
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