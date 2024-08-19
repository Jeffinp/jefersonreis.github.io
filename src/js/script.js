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
// Função para definir o modo escuro
function setDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);

    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '🌙' : '☀️';
        darkModeToggle.classList.toggle('active', isDark);
    }

    localStorage.setItem('darkMode', isDark);
    console.log("Modo escuro ativado:", isDark);  // Log para verificar o estado
}

// Função para alternar o modo escuro
function toggleDarkMode() {
    const isDarkMode = !document.body.classList.contains('dark-mode');
    setDarkMode(isDarkMode);

    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.classList.add('rotate');

        setTimeout(() => {
            darkModeToggle.classList.remove('rotate');
        }, 500);
    }
}

// Função para inicializar o modo escuro
function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === null) {
        // Verifica a preferência do sistema
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDarkMode);
    } else {
        setDarkMode(savedDarkMode === 'true');
    }
}

// Inicialize o modo escuro imediatamente ao carregar a página
initializeDarkMode();

// Adiciona evento de clique ao botão quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        console.log("Botão de alternância de tema registrado.");  // Log para verificar se o botão foi registrado
    } else {
        console.error("Botão de alternância de tema não encontrado!");  // Log de erro se o botão não for encontrado
    }
});

// Adicionar listener para mudanças na preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === null) {
        setDarkMode(e.matches);
    }
});


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

    languageLinks.forEach(link => {
        if (currentPage.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
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

// Função para o easter egg de clique
document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0;
    const triggerElement = document.getElementById('profilePic');
    const easterEgg = document.getElementById('easter-egg');
    const fireworksContainer = document.getElementById('fireworks-container');
    const fireworkSound = document.getElementById('firework-sound');

    if (!easterEgg) {
        console.error('Elemento com ID "easter-egg" não encontrado.');
        return;
    }

    if (triggerElement) {
        triggerElement.addEventListener('click', function() {
            clickCount++;

            // Exibir o easter egg após 5 cliques
            if (clickCount === 5) {
                easterEgg.style.display = 'block';
                triggerFireworks();
                clickCount = 0; // Resetar contador
            }
        });
    } else {
        console.error('Elemento com ID "profilePic" não encontrado.');
    }

    function triggerFireworks() {
        if (fireworksContainer && fireworkSound) {
            fireworksContainer.style.display = 'block';
            fireworkSound.currentTime = 0; // Reinicia o som
            fireworkSound.play();

            const fireworks = fireworksContainer.querySelectorAll('.firework');

            fireworks.forEach(firework => {
                // Posicionamento aleatório
                firework.style.top = `${Math.random() * 60 + 20}%`;
                firework.style.left = `${Math.random() * 80 + 10}%`;
                
                // Cor aleatória do arco-íris
                const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
                const randomColors = [getRandomColor(colors), getRandomColor(colors), getRandomColor(colors)];
                firework.style.background = `radial-gradient(circle, ${randomColors[0]} var(--particleSize), transparent 50%),
                                            radial-gradient(circle, ${randomColors[1]} var(--particleSize), transparent 50%),
                                            radial-gradient(circle, ${randomColors[2]} var(--particleSize), transparent 50%)`;
                
                // Reiniciar a animação
                firework.style.animation = 'none';
                firework.offsetHeight; // Força o reflow
                firework.style.animation = 'firework 2s infinite';
            });

            setTimeout(() => {
                fireworksContainer.style.display = 'none';
            }, 2000); // Duração dos fogos de artifício
        } else {
            console.error('Elemento com ID "fireworks-container" não encontrado.');
        }
    }

    function getRandomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)];
    }
});

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

//SHAPE
const shapeContainer = document.getElementById('shape-container');
const shapes = ['circle', 'square', 'triangle'];
const colors = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
const maxShapes = 10; // Reduzido o número máximo de formas

function createShape() {
    if (shapeContainer.children.length >= maxShapes) return;

    const shape = document.createElement('div');
    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 20 + 10; // 10px to 30px (reduzido o tamanho)

    shape.classList.add('shape', shapeType);
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    
    if (shapeType === 'triangle') {
        shape.style.borderBottomColor = color;
    } else {
        shape.style.backgroundColor = color;
    }

    shape.style.left = `${Math.random() * 100}vw`;
    shape.style.top = `${Math.random() * 100}vh`;

    shapeContainer.appendChild(shape);

    moveShape(shape);
}

function moveShape(shape) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 1 + 0.5; // 0.5 to 1.5 pixels per frame (reduzido a velocidade)

    function animate() {
        const rect = shape.getBoundingClientRect();
        let x = rect.left + Math.cos(angle) * speed;
        let y = rect.top + Math.sin(angle) * speed;

        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;

        if (x < -rect.width || x > window.innerWidth ||
            y < -rect.height || y > window.innerHeight) {
            shapeContainer.removeChild(shape);
            createShape(); // Cria uma nova forma quando uma é removida
        } else {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function initShapes() {
    for (let i = 0; i < maxShapes; i++) {
        createShape();
    }
}

initShapes();

// Adiciona novas formas periodicamente
setInterval(createShape, 2000);

    // ARISTA DIGITAL
    const images = document.querySelectorAll('.main-image');
    const prevButton = document.querySelector('.nav.prev');
    const nextButton = document.querySelector('.nav.next');

    let currentIndex = 0;

    function showImage(index) {
        images[currentIndex].classList.remove('active');
        images[index].classList.add('active');
        currentIndex = index;
    }

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        showImage(newIndex);
    });

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        showImage(newIndex);
    });