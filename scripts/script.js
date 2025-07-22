/**
 * Simple SPA Router + Tema
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- TEMA CLARO/OSCURO ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function() {
            if (document.body.getAttribute("data-theme") === "light") {
                document.body.removeAttribute("data-theme");
            } else {
                document.body.setAttribute("data-theme", "light");
            }
        });
    }

    // --- SPA ROUTER ---
    const contentContainer = document.getElementById('content');
    const navContainer = document.querySelector('.sidebar nav');

    const updateActiveLink = (path) => {
        if (!navContainer) return;
        const currentActive = navContainer.querySelector('a.active');
        if (currentActive) currentActive.classList.remove('active');
        // Asegurarse de que el path para el enlace activo sea el correcto (ej. /instalacion/fuentes)
        const newActiveLink = navContainer.querySelector(`a[href="${path}"]`);
        if (newActiveLink) newActiveLink.classList.add('active');
    };

    const loadContent = async (path) => {
        if (path === '/' || path === '/index.html' || path === '/blog/index.html') {
            contentContainer.innerHTML = `
                <h1>Bienvenido a la Guía Interactiva</h1>
                <p>Selecciona un tema de la barra lateral para comenzar.</p>
            `;
            updateActiveLink(path);
            return;
        }

        // ¡CORRECCIÓN AQUÍ! Añadir '/src' al inicio de la ruta del archivo
        const filePath = `/src${path}.html`; // Ahora será como /src/instalacion/fuentes.html

        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const html = await response.text();
                contentContainer.innerHTML = html;
            } else if (response.status === 404) {
                contentContainer.innerHTML = '<h1>Error 404: Página no encontrada</h1><p>La ruta solicitada no existe.</p>';
            } else {
                contentContainer.innerHTML = '<h1>Error</h1><p>No se pudo cargar el contenido.</p>';
            }
        } catch (error) {
            console.error('Error al cargar la página:', error);
            contentContainer.innerHTML = '<h1>Error de Conexión</h1><p>Hubo un problema al intentar cargar el contenido.</p>';
        }
        updateActiveLink(path);
    };

    document.body.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;
        if (link.target === '_blank' || link.hasAttribute('download') || !link.href.startsWith(window.location.origin)) {
            return;
        }
        event.preventDefault();
        const path = link.getAttribute('href');
        if (path !== window.location.pathname) {
            window.history.pushState({ path }, '', path);
            loadContent(path);
        }
    });

    window.addEventListener('popstate', event => {
        const path = window.location.pathname;
        loadContent(path);
    });

    // Carga inicial al cargar la página
    let initialPath = window.location.pathname;
    if (initialPath.startsWith('/blog/')) {
        initialPath = initialPath.substring(5);
    } else if (initialPath === '/blog') {
        initialPath = '/';
    }
    loadContent(initialPath);
});
