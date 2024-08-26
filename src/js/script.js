// ------------------------------
// INICIALIZAÇÃO
// ------------------------------
window.addEventListener('load', () => {
    // Seleção dos elementos da página
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

    // ------------------------------
    // MENU TOGGLE
    // ------------------------------
    if (elements.menuToggle && elements.navMenu) {
        elements.menuToggle.addEventListener('click', () => {
            elements.menuToggle.classList.toggle('active');
            elements.navMenu.classList.toggle('show');

            const menuItems = elements.navMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                if (elements.navMenu.classList.contains('show')) {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100 * index);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                }
            });
        });
    }

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

    // ------------------------------
    // LAZY LOADING IMAGES
    // ------------------------------
    if (elements.lazyImages.length) {
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
    }


        // Função para alternar entre os modos escuro e claro
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        document.getElementById('darkModeToggle').classList.add('rotate');

        // Muda o ícone conforme o modo
        const iconElement = document.getElementById('darkModeIcon');
        if (document.body.classList.contains('dark-mode')) {
            iconElement.setAttribute('data-icon', 'mdi:weather-night');
        } else {
            iconElement.setAttribute('data-icon', 'mdi:white-balance-sunny');
        }

        // Armazena a preferência do usuário no localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }

        setTimeout(() => {
            document.getElementById('darkModeToggle').classList.remove('rotate');
        }, 300);
    }

    // Verifica a preferência armazenada do usuário
    function loadUserPreference() {
        const darkMode = localStorage.getItem('darkMode');
        const iconElement = document.getElementById('darkModeIcon');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            iconElement.setAttribute('data-icon', 'mdi:weather-night');
        } else {
            document.body.classList.remove('dark-mode');
            iconElement.setAttribute('data-icon', 'mdi:white-balance-sunny');
        }
    }

    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Carrega a preferência do usuário ao carregar a página
    loadUserPreference();


    // ------------------------------
    // ANIMATION ON SCROLL
    // ------------------------------
    if (elements.animateOnScrollElements.length) {
        const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.animateOnScrollElements.forEach(element => {
            element.classList.add('animate-on-scroll');
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
    if (currentPage.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }

    // Adiciona o evento de clique a cada link
    link.addEventListener('click', () => {
        removeActiveClass(); 
        link.classList.add('active'); 
    });
});

});

// ------------------------------
// FUNÇÕES AUXILIARES
// ------------------------------

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
        }
        window.scroll(newX, newY);
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

// Verifica se tem 4 linhas ou mais, se sim, o botão de ler mais aparece
document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project-info');

    projects.forEach(project => {
        const paragraph = project.querySelector('p');

        // Verifica se o parágrafo tem mais de 4 linhas
        const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
        const lines = paragraph.scrollHeight / lineHeight;

        if (lines > 4) {
            const readMoreButton = document.createElement('span');
            readMoreButton.classList.add('read-more');
            
            // Define o texto do botão baseado no idioma da página
            const lang = document.documentElement.lang || 'pt';
            readMoreButton.textContent = lang === 'en' ? 'read more' : 'ler mais';

            readMoreButton.addEventListener('click', function() {
                if (paragraph.classList.contains('expanded')) {
                    paragraph.classList.remove('expanded');
                    paragraph.classList.add('collapsed');
                    readMoreButton.textContent = lang === 'en' ? 'read more' : 'ler mais';
                } else {
                    paragraph.classList.remove('collapsed');
                    paragraph.classList.add('expanded');
                    readMoreButton.textContent = lang === 'en' ? 'show less' : 'mostrar menos';
                }
            });

            // Inicialmente define o parágrafo como colapsado
            paragraph.classList.add('collapsed');

            project.appendChild(readMoreButton);
        }
    });
});


    // ARISTA DIGITAL
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
    
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const newIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
                showImage(newIndex);
            });
        }
    
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const newIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
                showImage(newIndex);
            });
        }
    });
    