// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a dynamic table of contents
    createTableOfContents();

    // Add a scroll-to-top button
    addScrollToTopButton();

    // Add a dark mode toggle
    addDarkModeToggle();

    // Add a word counter
    addWordCounter();

    // Add a reading time estimator
    addReadingTimeEstimator();

    // Add hover effects to paragraphs
    addParagraphHoverEffects();

    // Add a floating action button for sharing
    addShareButton();

    // Add text highlight effect
    addTextHighlightEffect();

    // Add smooth scrolling for anchor links
    addSmoothScrolling();
});

function createTableOfContents() {
    const toc = document.createElement('nav');
    toc.id = 'table-of-contents';
    toc.innerHTML = '<h3>Índice</h3><ul></ul>';

    const headings = document.querySelectorAll('h2');
    const tocList = toc.querySelector('ul');

    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = heading.textContent;
        a.href = `#heading-${index}`;
        li.appendChild(a);
        tocList.appendChild(li);

        heading.id = `heading-${index}`;
    });

    document.querySelector('main').insertBefore(toc, document.querySelector('article'));
}


function addScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scroll-to-top';
    button.textContent = '↑';
    button.style.display = 'none';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            button.style.display = 'block';
            button.classList.add('fade-in');
        } else {
            button.classList.remove('fade-in');
            button.classList.add('fade-out');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 300);
    });
}

function addDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.textContent = '🌙';
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        toggle.classList.add('spin');
        setTimeout(() => {
            toggle.classList.remove('spin');
        }, 300);
    });
}

function addShareButton() {
    const shareButton = document.createElement('button');
    shareButton.id = 'share-button';
    shareButton.textContent = 'Share';
    shareButton.style.position = 'fixed';
    shareButton.style.bottom = '20px';
    shareButton.style.right = '20px';
    document.body.appendChild(shareButton);

    shareButton.addEventListener('click', () => {
        shareButton.classList.add('pulse');
        setTimeout(() => {
            shareButton.classList.remove('pulse');
        }, 300);

        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            alert('Web Share API not supported in your browser');
        }
    });
}

function addTextHighlightEffect() {
    const article = document.querySelector('article');
    article.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.className = 'highlight';
            range.surroundContents(span);
            
            setTimeout(() => {
                span.classList.add('fade-highlight');
            }, 100);

            setTimeout(() => {
                const parent = span.parentNode;
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize();
            }, 2000);
        }
    });
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Add necessary styles for new elements and animations
const style = document.createElement('style');
style.textContent = `
    body {
        transition: background-color 0.5s ease, color 0.5s ease;
        overflow-x: hidden; /* Previne rolagem horizontal */
    }
    .container {
        width: 210mm;
        background-color: var(--paper-color);
        box-shadow: 0 5px 15px var(--shadow-color);
        padding: 25mm;
        background-image: repeating-linear-gradient(
            to bottom,
            var(--line-color),
            var(--line-color) 1px,
            var(--paper-color) 1px,
            var(--paper-color) 8mm
        );
        background-attachment: local; /* Importante para o efeito de movimento */
        position: relative;
        overflow-y: auto;
        max-height: none; /* Remove a limitação de altura */
    }
    #table-of-contents {
        background-color: #f9f9f9;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 5px;
        transition: background-color 0.5s ease;
    }
    #table-of-contents ul {
        list-style-type: none;
        padding-left: 0;
    }
    #table-of-contents li {
        margin-bottom: 5px;
    }
    #scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
    }
    #scroll-to-top.fade-in {
        opacity: 1;
    }
    #scroll-to-top.fade-out {
        opacity: 0;
    }
    #scroll-to-top.clicked {
        transform: scale(0.9);
    }
    #dark-mode-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    #dark-mode-toggle.spin {
        transform: rotate(360deg);
    }
    .dark-mode {
        --bg-color: #333;
        --paper-color: #222;
        --text-color: #f0f0f0;
        --line-color: #444;
        --hole-color: #555;
    }
    .dark-mode #table-of-contents {
        background-color: #2a2a2a;
    }
    #word-counter, #reading-time {
        font-size: 0.8em;
        color: #777;
        margin-top: 10px;
        transition: color 0.5s ease;
    }
    #share-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 5px;
        transition: transform 0.3s ease;
    }
    #share-button.pulse {
        animation: pulse 0.3s ease-in-out;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    .highlight {
        background-color: yellow;
        transition: background-color 0.5s ease;
    }
    .fade-highlight {
        background-color: transparent;
    }
    p {
        transition: background-color 0.3s ease;
    }
`;
document.head.appendChild(style);

// Adicione esta nova função para controlar o movimento do fundo
function addMovingBackground() {
    const container = document.querySelector('.container');
    let lastScrollPosition = window.pageYOffset;

    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        const scrollDifference = currentScrollPosition - lastScrollPosition;
        
        // Ajusta a posição do fundo baseado na rolagem
        const currentBackgroundPosition = parseInt(getComputedStyle(container).backgroundPositionY);
        container.style.backgroundPositionY = `${currentBackgroundPosition + scrollDifference * 0.5}px`;
        
        lastScrollPosition = currentScrollPosition;
    });
}

