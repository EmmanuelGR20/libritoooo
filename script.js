let currentPage = 1;
const totalPages = 25;
let musicPlaying = false;

// Variables para notificación
let notificationTimer = null;
let modalOpen = false;
let notificationShown = false; // Flag para evitar múltiples notificaciones

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    showPage(1);
    createParticles();
    updateNavigation();
    
    // Iniciar timer para notificación sorpresa GLOBALMENTE
    // Este timer funcionará en cualquier página
    startGlobalNotificationTimer();
    
    // Intentar reproducir música automáticamente
    setTimeout(() => {
        const audio = document.getElementById('background-music');
        audio.play().then(() => {
            musicPlaying = true;
            updateMusicButton();
        }).catch(() => {
            // Auto-play no permitido, mantener botón para que usuario pueda activar
            musicPlaying = false;
            updateMusicButton();
        });
    }, 1000);
});

// Mostrar página específica
function showPage(pageNumber) {
    // Ocultar todas las páginas y resetear estilos de razones
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
        
        // Resetear razones de todas las páginas
        const razones = page.querySelectorAll('.razon');
        razones.forEach(razon => {
            razon.style.transition = 'none';
            razon.style.opacity = '1';
            razon.style.transform = 'translateX(0)';
        });
    });
    
    // Mostrar página actual con animación
    const currentPageElement = document.querySelector(`[data-page="${pageNumber}"]`);
    if (currentPageElement) {
        currentPageElement.style.display = 'block';
        setTimeout(() => {
            currentPageElement.classList.add('active');
        }, 50);
    }
    
    currentPage = pageNumber;
    updateNavigation();
    updatePageIndicator();
    
    // Manejar efectos especiales según la página
    if (pageNumber === 1) {
        createSparkles();
    } else if (pageNumber === 25) {
        // Efecto especial para la página final
        setTimeout(() => {
            createFinalConfetti();
        }, 1000);
    }

    // Animar las razones si estamos en una página de razones
    if (pageNumber >= 8 && pageNumber <= 17) {
        setTimeout(() => {
            animateRazones();
        }, 100);
    }
}

// Función de timer global para notificación
// Esta función inicia el timer UNA SOLA VEZ cuando la página carga
// y la notificación aparecerá después de 1 minuto sin importar en qué página esté el usuario
function startGlobalNotificationTimer() {
    // Solo iniciar si no se ha mostrado la notificación antes
    if (!notificationShown && !notificationTimer) {
        notificationTimer = setTimeout(() => {
            showNotification();
            notificationShown = true; // Marcar que ya se mostró
        }, 60000); // 1 minuto = 60000 ms
    }
}

// Animar razones
function animateRazones() {
    const razones = document.querySelectorAll('.page.active .razon');
    razones.forEach((razon, index) => {
        // Resetear primero cualquier animación previa
        razon.style.transition = 'none';
        razon.style.opacity = '0';
        razon.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            razon.style.transition = 'all 0.6s ease';
            razon.style.opacity = '1';
            razon.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Navegación
function nextPage() {
    if (currentPage < totalPages) {
        addPageTurnEffect();
        setTimeout(() => {
            showPage(currentPage + 1);
        }, 400);
    }
}

function previousPage() {
    if (currentPage > 1) {
        addPageTurnEffect();
        setTimeout(() => {
            showPage(currentPage - 1);
        }, 400);
    }
}

// Efecto de voltear página
function addPageTurnEffect() {
    const currentPageElement = document.querySelector(`[data-page="${currentPage}"]`);
    if (currentPageElement) {
        currentPageElement.classList.add('turning');
        setTimeout(() => {
            currentPageElement.classList.remove('turning');
        }, 800);
    }
}

// Actualizar navegación
function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Cambiar estilo visual
    if (currentPage === 1) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    if (currentPage === totalPages) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Actualizar indicador de página
function updatePageIndicator() {
    const indicator = document.getElementById('page-indicator');
    indicator.textContent = `${currentPage} / ${totalPages}`;
}

// Control de música
function toggleMusic() {
    const audio = document.getElementById('background-music');
    
    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
    } else {
        audio.play().then(() => {
            musicPlaying = true;
        }).catch(console.error);
    }
    
    updateMusicButton();
}

function updateMusicButton() {
    const button = document.getElementById('music-toggle');
    const icon = button.querySelector('i');
    
    if (musicPlaying) {
        icon.className = 'fas fa-music';
        button.style.animation = 'pulse 2s infinite';
        button.style.opacity = '1';
    } else {
        icon.className = 'fas fa-music';
        button.style.animation = 'none';
        button.style.opacity = '0.7';
    }
}

// Crear partículas de corazones
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    setInterval(() => {
        if (Math.random() < 0.3) {
            createHeartParticle(particlesContainer);
        }
    }, 2000);
}

function createHeartParticle(container) {
    const hearts = ['💖', '💕', '💝', '💗', '💞', '💓', '🌸', '🌺'];
    const heart = document.createElement('div');
    heart.className = 'particle';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Posición aleatoria
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.opacity = Math.random() * 0.6 + 0.4;
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
    
    container.appendChild(heart);
    
    // Remover después de la animación
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 8000);
}

// Crear destellos para la portada
function createSparkles() {
    const book = document.querySelector('.book');
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 80 + 10 + '%';
            sparkle.style.top = Math.random() * 80 + 10 + '%';
            sparkle.style.fontSize = '24px';
            sparkle.style.animation = 'sparkle 2s ease-out forwards';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10';
            
            book.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }, i * 300);
    }
}

// Navegación con teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousPage();
    }
});

// Navegación táctil para móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe izquierda - página siguiente
            nextPage();
        } else {
            // Swipe derecha - página anterior
            previousPage();
        }
    }
}

// Funciones para notificación sorpresa
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');

    // Agregar efecto de vibración suave
    setTimeout(() => {
        notification.style.animation += ', notificationShake 0.5s ease-in-out 3';
    }, 2000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
    // No limpiar el timer aquí, ya que queremos que funcione globalmente
}

function openSurpriseModal() {
    const modal = document.getElementById('surprise-modal');
    modal.classList.add('show');
    modalOpen = true;
    hideNotification();
    
    // Crear efectos especiales al abrir
    createModalSparkles();
    
    // Agregar clase al body para prevenir scroll
    document.body.style.overflow = 'hidden';
}

function closeSurpriseModal() {
    const modal = document.getElementById('surprise-modal');
    modal.classList.remove('show');
    modalOpen = false;
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
    
    // Crear efecto de confeti al cerrar
    createConfetti();
}

function createModalSparkles() {
    const modal = document.querySelector('.modal-content');
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 90 + 5 + '%';
            sparkle.style.top = Math.random() * 90 + 5 + '%';
            sparkle.style.fontSize = '20px';
            sparkle.style.animation = 'sparkleModal 2s ease-out forwards';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '10';
            
            modal.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }, i * 200);
    }
}

function createConfetti() {
    const confettiContainer = document.body;
    const colors = ['💖', '💕', '💝', '💗', '💞', '🌸', '🌺', '✨'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.innerHTML = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.fontSize = Math.random() * 15 + 20 + 'px';
            confetti.style.animation = 'confettiFall ' + (Math.random() * 2 + 3) + 's linear forwards';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '3000';
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

function createFinalConfetti() {
    const confettiContainer = document.body;
    const confettiItems = ['💖', '💕', '💝', '💗', '💞', '🌸', '🌺', '✨', '🎊', '🎉', '⭐', '🌟', '💫', '🦋', '🌈'];
    
    // Crear más confeti para el efecto final
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.innerHTML = confettiItems[Math.floor(Math.random() * confettiItems.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.fontSize = Math.random() * 20 + 25 + 'px';
            confetti.style.animation = 'confettiFall ' + (Math.random() * 3 + 4) + 's linear forwards';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '3000';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 7000);
        }, i * 80);
    }
    
    // Agregar efecto de explosión de corazones
    setTimeout(() => {
        createHeartExplosion();
    }, 1000);
}

function createHeartExplosion() {
    const heartContainer = document.body;
    const hearts = ['💖', '💕', '💝', '💗', '💞', '💓'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = '30px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '3000';
            
            // Animación de explosión radial
            const angle = (i / 15) * 2 * Math.PI;
            const distance = 200 + Math.random() * 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            heart.style.animation = `heartExplosion 2s ease-out forwards`;
            heart.style.setProperty('--endX', endX + 'px');
            heart.style.setProperty('--endY', endY + 'px');
            
            heartContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }, i * 50);
    }
}
