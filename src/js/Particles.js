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

    // Inicializa Particles.js se disponível
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 50,
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
                    speed: 1,
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
            }
        });
    }
});



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
