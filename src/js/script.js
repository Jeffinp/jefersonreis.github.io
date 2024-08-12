window.addEventListener('load', () => {
    // Seleciona os elementos da página
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

    // Adiciona evento para alternar o menu
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

    // Smooth scroll
    elements.links.forEach(link => link.addEventListener('click', smoothScroll));

    // Scroll to top button
    window.addEventListener('scroll', debounce(toggleScrollToTopButton, 100));
    if (elements.scrollToTopBtn) {
        elements.scrollToTopBtn.addEventListener("click", () => smoothScrollTo(0, 0));
    }

    // Dark mode toggle
    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Project modal
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

    // Fade-in effect
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

    // Lazy loading images
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

    // Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50, // Reduce the number of particles for better performance on mobile
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1, // Reduce the speed of particles for better performance
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
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 2
                    }
                }
            },
        });
    }

    // Dark mode saved state
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (elements.darkModeToggle) {
            elements.darkModeToggle.classList.add('active');
        }
    }

    // Animation on scroll
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

    // Check if browser is Safari
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.body.classList.add('safari');
    }

    // Language switch
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

// Função para definir o modo escuro
function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '🌙' : '☀️';
    }
    
    localStorage.setItem('darkMode', isDark);
}

// Função para alternar o modo escuro
function toggleDarkMode() {
    const isDarkMode = !document.body.classList.contains('dark-mode');
    setDarkMode(isDarkMode);

    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.classList.add('rotate');
        darkModeToggle.classList.add('no-hover');

        setTimeout(() => {
            darkModeToggle.classList.remove('rotate');
            darkModeToggle.classList.remove('no-hover');
        }, 500);
    }
}

// Inicializa o modo escuro com base na preferência salva ou define como escuro por padrão
window.addEventListener('load', () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    
    // Se não houver preferência salva ou for a primeira visita, define como escuro
    if (savedDarkMode === null) {
        setDarkMode(true);
    } else {
        setDarkMode(savedDarkMode === 'true');
    }

    // Adiciona o evento de clique ao botão de alternância
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
});

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

// script.js

function createRandomShape() {
    const shapesContainer = document.querySelector('.background-shapes');
    const shapeTypes = ['circle', 'triangle', 'hexagon'];
    const shapeCount = 20; 

    for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add('shape', shapeType);
        
        // Define tamanhos e posições aleatórios
        const size = Math.random() * 30 + 20; // Tamanhos menores
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${Math.random() * 100}vh`;
        shape.style.left = `${Math.random() * 100}vw`;
        
        // Define a duração e a direção da animação
        const animationDuration = Math.random() * 120 + 120; // Animação bem lenta
        shape.style.animation = `moveShape ${animationDuration}s infinite linear`;
        
        shapesContainer.appendChild(shape);
    }
}

document.addEventListener('DOMContentLoaded', createRandomShape);
