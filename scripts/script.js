// blog/scripts/script.js

document.addEventListener('DOMContentLoaded', () => {
  // --- TEMA CLARO/OSCURO ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  // Cargar preferencia previa del usuario
  if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  // Si el botón de tema existe en el HTML
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function() {
      if (document.body.getAttribute("data-theme") === "dark") {
        document.body.removeAttribute("data-theme"); // Cambiar a tema claro
        localStorage.setItem('theme', 'light');
      } else {
        document.body.setAttribute("data-theme", "dark"); // Cambiar a tema oscuro
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- LÓGICA DEL BLOG SPA ---
  let articles = [];
  let currentArticleIndex = null; // Usamos un nombre más descriptivo para el índice del artículo actual

  /**
   * Renderiza los enlaces de los artículos en la barra lateral.
   * Si el botón de tema no existe en el HTML, lo inyecta dinámicamente.
   */
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    let sidebarContent = '';

    // Si el botón de tema no fue encontrado en el HTML al cargar la página (es decir, no es estático),
    // lo inyectamos aquí para que siempre esté.
    if (!themeToggleBtn && sidebar) {
      sidebarContent += `<button id="theme-toggle" class="sidebar-link">🌙/☀️ Tema</button>`;
    }

    // Añade los enlaces de los artículos
    sidebarContent += articles.map((article, index) =>
      `<button class="sidebar-link${currentArticleIndex === index ? ' active' : ''}" onclick="loadArticle(${index})">${article.title}</button>`
    ).join('');

    if (sidebar) {
      sidebar.innerHTML = sidebarContent;

      // Si el botón de tema fue inyectado dinámicamente, le añadimos el event listener
      if (!themeToggleBtn && sidebar) {
        const dynamicallyAddedBtn = document.getElementById("theme-toggle");
        if (dynamicallyAddedBtn) {
          dynamicallyAddedBtn.addEventListener("click", function() {
            if (document.body.getAttribute("data-theme") === "dark") {
              document.body.removeAttribute("data-theme");
              localStorage.setItem('theme', 'light');
            } else {
              document.body.setAttribute("data-theme", "dark");
              localStorage.setItem('theme', 'dark');
            }
          });
        }
      }
    }
  }

  /**
   * Carga y muestra el contenido de un artículo específico.
   * @param {number} index El índice del artículo a cargar en el array `articles`.
   */
  window.loadArticle = function(index) {
    currentArticleIndex = index;
    renderSidebar(); // Vuelve a renderizar el sidebar para actualizar el estado "activo"

    const articleToLoad = articles[index];
    if (articleToLoad) {
      fetch(`../data/articles/${articleToLoad.file}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(markdownContent => {
          document.getElementById('content').innerHTML = marked.parse(markdownContent);
        })
        .catch(error => {
          console.error('Error al cargar el artículo:', error);
          document.getElementById('content').innerHTML = `<h1>Error al cargar el artículo</h1><p>No se pudo cargar: ${articleToLoad.title}</p>`;
        });
    } else {
      document.getElementById('content').textContent = 'Artículo no encontrado.';
    }
  };

  // --- INICIALIZACIÓN: Carga la lista de artículos y muestra el primero ---
  fetch('articles.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(jsonData => {
      articles = jsonData;
      renderSidebar(); // Renderiza el sidebar inicialmente con la lista de artículos

      // Carga el primer artículo si hay alguno, o muestra un mensaje
      if (articles.length > 0) {
        loadArticle(0);
      } else {
        document.getElementById('content').textContent = 'No hay artículos disponibles para mostrar.';
      }
    })
    .catch(error => {
      console.error('Error al cargar el archivo articles.json:', error);
      document.getElementById('content').innerHTML = '<h1>Error</h1><p>No se pudo cargar la lista de artículos.</p>';
    });
});
