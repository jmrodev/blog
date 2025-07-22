
document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content-area');
  const pageOrder = [
    'src/instalacion/preparacion.html',
    'src/instalacion/fuentes.html',
    'src/instalacion/neovim_nvchad.html',
    'src/configuracion/estructura.html',
    'src/configuracion/plugins.html',
    'src/configuracion/lsp.html',
    'src/configuracion/mappings.html',
    'src/configuracion/temas.html',
    'src/configuracion/snippets.html',
    'src/productividad/atajos.html',
    'src/productividad/debug.html',
    'src/productividad/tips.html',
    'src/comunidad/recursos.html'
  ];

  // Función para cargar contenido
  async function loadContent(url, pushState = true) {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const h1Content = doc.querySelector('h1');
      const sectionContent = doc.querySelector('section');

      if (h1Content && sectionContent) {
        contentArea.innerHTML = '';
        contentArea.appendChild(h1Content);
        contentArea.appendChild(sectionContent);
      } else {
        contentArea.innerHTML = '<p>Contenido no encontrado o formato inesperado.</p>';
        console.warn('Expected h1 and section not found in:', url);
      }

      if (pushState) {
        history.pushState({ path: url }, '', url);
      }

      window.scrollTo(0, 0);
      updateNavigationButtons(); // Actualizar botones de navegación

    } catch (error) {
      console.error('Error al cargar la página:', error);
      contentArea.innerHTML = '<p>Error al cargar el contenido.</p>';
    }
  }

  // Manejar todos los clics en los enlaces a través de delegación de eventos en el body
  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (link) {
      const href = link.getAttribute('href');

      if (href && !href.startsWith('http') && !href.endsWith('README.md') && !href.startsWith('#')) {
        event.preventDefault();
        loadContent(href);
      }
    }
  });

  // Manejar navegación con botones de adelante/atrás del navegador
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.path) {
      loadContent(event.state.path, false);
    } else {
      // Fallback para la página inicial o si no hay estado
      loadContent('src/instalacion/preparacion.html', false);
    }
  });

  // Función para determinar la página siguiente/anterior y actualizar botones
  function updateNavigationButtons() {
    const currentPath = window.location.pathname;
    let baseCurrentPath = currentPath.split('/blog/')[1] || '';

    // Ajustar la ruta si no tiene 'src/' al inicio o es index.html
    if (baseCurrentPath === 'index.html' || baseCurrentPath === '') {
      baseCurrentPath = 'src/instalacion/preparacion.html';
    } else if (!baseCurrentPath.startsWith('src/') && pageOrder.includes('src/' + baseCurrentPath)) {
      // Si la URL es e.g. /blog/instalacion/preparacion.html (sin src en la URL pero en pageOrder si)
      baseCurrentPath = 'src/' + baseCurrentPath;
    }

    const currentIndex = pageOrder.indexOf(baseCurrentPath);

    const navButtons = [
      { prev: document.getElementById('nav-prev-top'), home: document.getElementById('nav-home-top'), next: document.getElementById('nav-next-top') },
      { prev: document.getElementById('nav-prev-bottom'), home: document.getElementById('nav-home-bottom'), next: document.getElementById('nav-next-bottom') }
    ];

    navButtons.forEach(buttons => {
      if (buttons.home) {
        buttons.home.href = 'index.html';
      }

      if (buttons.prev) {
        if (currentIndex > 0) {
          buttons.prev.classList.remove('disabled');
          buttons.prev.removeAttribute('disabled');
          buttons.prev.href = pageOrder[currentIndex - 1];
        } else {
          buttons.prev.classList.add('disabled');
          buttons.prev.setAttribute('disabled', 'true');
          buttons.prev.removeAttribute('href');
        }
      }

      if (buttons.next) {
        if (currentIndex < pageOrder.length - 1) {
          buttons.next.classList.remove('disabled');
          buttons.next.removeAttribute('disabled');
          buttons.next.href = pageOrder[currentIndex + 1];
        } else {
          buttons.next.classList.add('disabled');
          buttons.next.setAttribute('disabled', 'true');
          buttons.next.removeAttribute('href');
        }
      }
    });
  }

  // Cargar la página inicial al cargar el router.js
  let initialPath = window.location.pathname.split('/blog/')[1] || 'index.html';
  if (initialPath === 'index.html' || initialPath === '') {
    initialPath = 'src/instalacion/preparacion.html';
    history.replaceState({ path: initialPath }, '', initialPath);
  } else {
    history.replaceState({ path: initialPath }, '', initialPath); // Ensure initial URL is part of history state
  }
  loadContent(initialPath, false); // Cargar contenido inicial, no añadir al historial de nuevo

}); 