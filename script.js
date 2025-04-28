document.addEventListener('DOMContentLoaded', function () {
    // --- Variables del Modal de Bienvenida y Video ---ok?
    const welcomeModal = document.getElementById('welcomeModal');
    const playVideoButton = document.getElementById('playVideoButton');
    const closeWelcomeButton = document.getElementById('closeWelcomeButton');
    const videoModal = document.getElementById('videoModal');
    const promoVideo = document.getElementById('promoVideo');
    const closeVideoButton = document.getElementById('closeVideoButton');
    const body = document.body;
    // --- Variables de los elementos con animación (posterior al video) ---
    const viveAventuraSpan = document.getElementById('vive-aventura');
    const enCampingSpan = document.getElementById('en-camping');
    const descubreNaturalezaP = document.getElementById('descubre-naturaleza');
    const imagenGiratoriaElementFinal = document.querySelector('.imagen-final'); // Usamos la clase final
    const hasSeenWelcome = localStorage.getItem("welcomeShown");
    let animationsStarted = false;

    function startHeroAnimations() {
        if (!animationsStarted) {
            if (viveAventuraSpan) viveAventuraSpan.classList.add('animar-izquierda');
            if (enCampingSpan) enCampingSpan.classList.add('animar-derecha');
            if (descubreNaturalezaP) descubreNaturalezaP.classList.add('animar-subir');
            if (imagenGiratoriaElementFinal) {
                imagenGiratoriaElementFinal.style.opacity = '0'; // Aseguramos que esté invisible antes de animar
                imagenGiratoriaElementFinal.style.transform = 'scale(0.8)'; // Aseguramos la escala inicial
                imagenGiratoriaElementFinal.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Añadimos la transición para la animación
                setTimeout(() => {
                    imagenGiratoriaElementFinal.style.opacity = '1'; // Hacemos visible con transición
                    imagenGiratoriaElementFinal.style.transform = 'scale(1)'; // Escalamos con transición
                }, 50); // Un pequeño delay para que la transición se aplique
            }
            animationsStarted = true;
        }
    }

    if (!hasSeenWelcome) {
        welcomeModal.style.display = 'flex';
        body.classList.add('modal-open');
    } else {
        // Si ya vio el modal, inicia las animaciones directamente
        startHeroAnimations();
    }

    if (playVideoButton) {
        playVideoButton.addEventListener('click', () => {
            welcomeModal.style.display = 'none';
            videoModal.style.display = 'flex';
            promoVideo.play();
        });
    }

    if (closeWelcomeButton) {
        closeWelcomeButton.addEventListener('click', () => {
            welcomeModal.style.display = 'none';
            body.classList.remove('modal-open');
            startHeroAnimations(); // Inicia las animaciones al cerrar el modal de bienvenida
        });
    }

    if (closeVideoButton) {
        closeVideoButton.addEventListener('click', () => {
            videoModal.style.display = 'none';
            promoVideo.pause();
            promoVideo.currentTime = 0;
            body.classList.remove('modal-open');
            localStorage.setItem("welcomeShown", "true");
            startHeroAnimations(); // Inicia las animaciones al cerrar el modal del video
        });
    }

    if (promoVideo) {
        promoVideo.addEventListener('ended', () => {
            videoModal.style.display = 'none';
            body.classList.remove('modal-open');
            localStorage.setItem("welcomeShown", "true");
            startHeroAnimations(); // Inicia las animaciones al finalizar el video
        });
    }
    // --- Animación inicial de la Imagen Giratoria --- ok
    const imagenGiratoriaElementInicial = document.querySelector('.imagen-giratoria');
    if (imagenGiratoriaElementInicial) {
        imagenGiratoriaElementInicial.style.opacity = '0';
        imagenGiratoriaElementInicial.style.transform = 'scale(0.8)';
        setTimeout(() => {
            imagenGiratoriaElementInicial.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            imagenGiratoriaElementInicial.style.opacity = '1';
            imagenGiratoriaElementInicial.style.transform = 'scale(1)';
        }, 300); // Ajusta el tiempo si es necesario
    }
    // --- Animación inicial del Logo (si lo tienes) --- ok
    const logoImage = document.querySelector('.logo img');
    if (logoImage) {
        logoImage.style.opacity = '0';
        logoImage.style.transform = 'scale(0.8)';
        setTimeout(() => {
            logoImage.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            logoImage.style.opacity = '1';
            logoImage.style.transform = 'scale(1)';
        }, 500);
    }
    // --- Funcionalidad del título de desplazamiento ---ok
    const scrollingTitleElement = document.getElementById('site-title');
    const originalTitle = scrollingTitleElement ? scrollingTitleElement.textContent : "";
    let scrollPositionTitle = 0;
    const scrollSpeedTitle = 0.05;
    const titleLength = originalTitle.length;
    let frameIdTitle;

    function scrollTitle() {
        scrollPositionTitle += scrollSpeedTitle;
        if (scrollPositionTitle > titleLength + 20) {
            scrollPositionTitle = 0;
        }
        const scrolledTitle = originalTitle.substring(Math.floor(scrollPositionTitle)) + " " + originalTitle.substring(0, Math.floor(scrollPositionTitle));
        document.title = scrolledTitle;
        frameIdTitle = requestAnimationFrame(scrollTitle);
    }

    if (scrollingTitleElement && originalTitle) {
        scrollTitle();
    }

    const logo = document.querySelector('.logo');
    const mainNav = document.querySelector('.main-nav');
    const servicioBotones = document.querySelectorAll('.servicio-boton');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navLinks = document.querySelectorAll('.main-nav ul li a[href^="#"]'); // Modificado para seleccionar solo enlaces internos
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButtonLightbox = document.querySelector('.close-button');
    let scrollPositionLightbox = 0;
    const galleryGrid = document.querySelector('.gallery-grid');
    const header = document.querySelector('header'); // Selecciona tu header (ajusta el selector si es necesario)

    // --- Funcionalidad del menú desplegable ---ok
    function toggleMobileMenu() {
        mainNav.classList.toggle('open');
        hamburgerButton.classList.toggle('open');
    }

    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', toggleMobileMenu);
    }

    if (logo) {
        logo.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const windowWidth = window.innerWidth;
            let offsetTop = targetElement.offsetTop;

            // Ajustar la posición solo en pantallas grandes (ancho mínimo de 769px) y si hay header
            if (header && windowWidth >= 769) {
                offsetTop -= header.offsetHeight;
            }

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            if (windowWidth <= 768 && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburgerButton.classList.remove('open');
            }
        });
    });

    // --- Funcionalidad para los botones de servicio ---ok
    servicioBotones.forEach(boton => {
        boton.addEventListener('click', function () {
            servicioBotones.forEach(otroBoton => {
                if (otroBoton !== this) {
                    otroBoton.classList.remove('active');
                    const descripcionOtro = otroBoton.querySelector('.descripcion-servicio');
                    if (descripcionOtro) {
                        descripcionOtro.style.display = 'none';
                    }
                }
            });
            this.classList.toggle('active');
            const descripcion = this.querySelector('.descripcion-servicio');
            if (descripcion) {
                descripcion.style.display = this.classList.contains('active') ? 'block' : 'none';
            }
        });
    });
    // --- Funcionalidad para la imagen giratoria con animación de entrada y desaparición con scroll ---
    const imagenGiratoria = document.querySelector('.imagen-giratoria');
    const headerScroll = document.querySelector('header');
    let imagenOculta = false;

    if (imagenGiratoria && headerScroll) {
        // Animación inicial con fade + zoom
        imagenGiratoria.style.animation = 'fadeZoomIn 0.6s ease-out';
        imagenGiratoria.style.position = 'absolute';
        imagenGiratoria.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            imagenGiratoria.style.animation = 'none';
            imagenGiratoria.classList.add('imagen-final');
            imagenGiratoria.classList.remove('imagen-giratoria');
            imagenGiratoria.style.top = '120px';
            imagenGiratoria.style.left = '50%';
            imagenGiratoria.style.transform = 'translateX(-50%) scale(1)';
            imagenGiratoria.style.opacity = '1';
            imagenGiratoria.style.position = 'fixed';
            imagenGiratoria.style.width = '150px';
            imagenGiratoria.style.height = 'auto';
        }, 600); // Igual al tiempo de la animación

        function handleScroll() {
            const scrollY = window.scrollY;
            const headerHeight = headerScroll.offsetHeight;
            const triggerPoint = headerHeight * 0.8;

            if (scrollY > triggerPoint && !imagenOculta) {
                imagenGiratoria.style.opacity = '0';
                imagenGiratoria.style.pointerEvents = 'none';
                setTimeout(() => {
                    if (window.scrollY > triggerPoint) {
                        imagenGiratoria.style.display = 'none';
                        imagenOculta = true;
                    }
                }, 500);
            } else if (scrollY <= triggerPoint && imagenOculta) {
                imagenGiratoria.style.display = 'block';
                imagenGiratoria.classList.remove('fade-zoom-in');
                void imagenGiratoria.offsetWidth; // Reinicio de animación
                imagenGiratoria.classList.add('fade-zoom-in');
                setTimeout(() => {
                    imagenGiratoria.style.opacity = '1';
                    imagenGiratoria.style.pointerEvents = 'auto';
                    imagenOculta = false;
                }, 50);
            }
        }

        window.addEventListener('scroll', handleScroll);
    } else {
        console.error('No se encontró la imagen giratoria o el header.');
    }
})