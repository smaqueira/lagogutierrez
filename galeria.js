document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const imagenPrincipalGaleria = document.getElementById('imagen-principal-galeria');
    const verTodasFotosBtn = document.getElementById('ver-todas-fotos');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButton = document.querySelector('.lightbox .close-button');
    const anteriorFotoBtn = document.getElementById('anterior-foto');
    const siguienteFotoBtn = document.getElementById('siguiente-foto');
    const enlacesGaleria = galleryGrid ? galleryGrid.querySelectorAll('.gallery-grid a') : [];
    const fullscreenButton = document.getElementById('fullscreen-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const cerrarGaleriaBtn = document.getElementById('cerrar-galeria');
    const fullscreenArrowLeft = document.querySelector('.fullscreen-arrow-left');
    const fullscreenArrowRight = document.querySelector('.fullscreen-arrow-right');
    const body = document.body;
    let indiceActual = 0;
    let imagenes = [];
    let isFullscreen = false;
    let slideshowInterval;
    let isPlaying = false;
    let miniaturasVisibles = false;

    if (enlacesGaleria.length > 0) {
        enlacesGaleria.forEach((enlace, index) => {
            imagenes.push(enlace.href);
            enlace.dataset.index = index;
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                indiceActual = parseInt(enlace.dataset.index);
                mostrarImagen(indiceActual);
                lightbox.classList.add('active');
                exitFullscreenMode();
                stopSlideshow();
            });
        });

        function mostrarImagen(indice) {
            if (indice >= 0 && indice < imagenes.length) {
                lightboxImage.src = imagenes[indice];
            }
            actualizarNavegacion();
        }

        function siguienteImagen() {
            indiceActual++;
            if (indiceActual >= imagenes.length) {
                indiceActual = 0;
            }
            mostrarImagen(indiceActual);
        }

        function anteriorImagen() {
            indiceActual--;
            if (indiceActual < 0) {
                indiceActual = imagenes.length - 1;
            }
            mostrarImagen(indiceActual);
        }

        function actualizarNavegacion() {
            if (imagenes.length <= 1) {
                if (anteriorFotoBtn) anteriorFotoBtn.style.display = 'none';
                if (siguienteFotoBtn) siguienteFotoBtn.style.display = 'none';
                if (fullscreenButton) fullscreenButton.style.display = 'none';
                if (playPauseButton) playPauseButton.style.display = 'none';
            } else {
                if (anteriorFotoBtn) anteriorFotoBtn.style.display = 'block';
                if (siguienteFotoBtn) siguienteFotoBtn.style.display = 'block';
                if (fullscreenButton) fullscreenButton.style.display = 'block';
                if (playPauseButton) playPauseButton.style.display = 'block';
                if (anteriorFotoBtn) anteriorFotoBtn.disabled = indiceActual === 0;
                if (siguienteFotoBtn) siguienteFotoBtn.disabled = indiceActual === imagenes.length - 1;
            }
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                lightbox.classList.remove('active');
                exitFullscreenMode();
                stopSlideshow();
            });
        }

        if (siguienteFotoBtn) {
            siguienteFotoBtn.addEventListener('click', siguienteImagen);
        }

        if (anteriorFotoBtn) {
            anteriorFotoBtn.addEventListener('click', anteriorImagen);
        }

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                    exitFullscreenMode();
                    stopSlideshow();
                } else if (e.key === 'ArrowRight') {
                    siguienteImagen();
                } else if (e.key === 'ArrowLeft') {
                    anteriorImagen();
                }
            } else if (isFullscreen && e.key === 'Escape') {
                exitFullscreenMode();
                mostrarImagen(indiceActual);
                lightbox.classList.add('active');
                stopSlideshow();
            }
        });

        function enterFullscreenMode() {
            isFullscreen = true;
            body.classList.add('fullscreen-active');
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            //if (closeButton) closeButton.style.display = 'none';
            if (anteriorFotoBtn) anteriorFotoBtn.style.display = 'none';
            if (siguienteFotoBtn) siguienteFotoBtn.style.display = 'none';
            fullscreenButton.style.display = 'none';
            playPauseButton.style.display = 'block';
            lightbox.style.backgroundColor = 'black';
            lightboxImage.style.maxWidth = '100%';
            lightboxImage.style.maxHeight = '100%';
            lightboxImage.style.objectFit = 'contain';
        }

        function exitFullscreenMode() {
            isFullscreen = false;
            body.classList.remove('fullscreen-active');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            if (closeButton) closeButton.style.display = 'block';
            if (anteriorFotoBtn) anteriorFotoBtn.style.display = 'block';
            if (siguienteFotoBtn) siguienteFotoBtn.style.display = 'block';
            fullscreenButton.style.display = 'block';
            playPauseButton.style.display = 'none';
            lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            lightboxImage.style.maxWidth = '90%';
            lightboxImage.style.maxHeight = '90%';
            lightboxImage.style.objectFit = 'contain';
            stopSlideshow();
            playPauseButton.textContent = 'Iniciar Presentación';
            isPlaying = false;
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        function handleFullscreenChange() {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                exitFullscreenMode();
                // Añadir el desplazamiento aquí
                const galeriaMenu = document.getElementById('menu-galeria');
                if (galeriaMenu) {
                    galeriaMenu.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn('No se encontró el elemento con el ID "menu-galeria" para el desplazamiento.');
                }
            } else {
                enterFullscreenMode();
            }
        }

        fullscreenButton.addEventListener('click', enterFullscreenMode);

        function startSlideshow() {
            isPlaying = true;
            playPauseButton.textContent = 'Detener Presentación';
            fullscreenButton.classList.add('slideshow-active');
            slideshowInterval = setInterval(siguienteImagen, 3000);
        }

        function stopSlideshow() {
            isPlaying = false;
            playPauseButton.textContent = 'Iniciar Presentación';
            fullscreenButton.classList.remove('slideshow-active');
            clearInterval(slideshowInterval);
        }

        playPauseButton.addEventListener('click', toggleSlideshow);

        function toggleSlideshow() {
            if (isPlaying) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        }

        if (cerrarGaleriaBtn) {
            cerrarGaleriaBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        if (fullscreenArrowLeft) {
            fullscreenArrowLeft.addEventListener('click', anteriorImagen);
        }

        if (fullscreenArrowRight) {
            fullscreenArrowRight.addEventListener('click', siguienteImagen);
        }

        function iniciarPresentacionDirecta() {
            console.log('Función iniciarPresentacionDirecta llamada'); // Para debugging
            if (enlacesGaleria.length > 0) {
                // Simula el clic en la primera miniatura
                enlacesGaleria[0].click();
                // Inicia la pantalla completa después de un breve tiempo para asegurar que el lightbox esté activo
                setTimeout(() => {
                    enterFullscreenMode();
                    startSlideshow();
                }, 100); // Ajusta el tiempo si es necesario
            }
        }

        if (verTodasFotosBtn) {
            verTodasFotosBtn.addEventListener('click', iniciarPresentacionDirecta);
        }

        if (imagenPrincipalGaleria) {
            imagenPrincipalGaleria.style.cursor = 'pointer'; // Indica que es clickable
            imagenPrincipalGaleria.addEventListener('click', iniciarPresentacionDirecta);
        }

        actualizarNavegacion();
    }

    // Funcionalidad del menú hamburguesa (copiado de index.html)
    const hamburgerButton = document.querySelector('.hamburger-button');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    hamburgerButton.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        hamburgerButton.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                hamburgerButton.classList.remove('open');
            }
        });
    });
});