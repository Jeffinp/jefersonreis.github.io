// Configuração aprimorada para particles.js
const particlesConfig = {
    particles: {
        number: {
            value: 60, // Número de partículas
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#2EB67D", "#ECB22E", "#E01E5B", "#36C5F0"] // Cores vibrantes
        },
        shape: {
            type: ["circle", "triangle", "polygon", "star"], // Formatos suportados
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5 // Configuração para polígonos (5 lados por padrão)
            },
            star: {
                nb_points: 5 // Configuração para estrelas (5 pontas por padrão)
            }
        },
        opacity: {
            value: 0.7,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 4, // Tamanho inicial
            random: true,
            anim: {
                enable: true,
                speed: 2, // Velocidade de animação do tamanho
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff", // Cor das linhas de conexão
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2, // Velocidade de movimento
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce", // Comportamento ao atingir bordas
            bounce: true,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse" // Efeito de afastamento no hover
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
            repulse: {
                distance: 200, // Aumenta a distância do efeito "repulse"
                duration: 0.6
            },
            push: {
                particles_nb: 4 // Adiciona partículas no clique
            }
        }
    },
    retina_detect: true
};

// Função para inicializar particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    }
}

// Inicializa o Particles.js quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initParticles);
