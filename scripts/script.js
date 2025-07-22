
var themeToggleBtn = document.getElementById("theme-toggle");

themeToggleBtn.addEventListener("click", function() {
  if (document.body.getAttribute("data-theme") === "light") {
    document.body.removeAttribute("data-theme"); // Vuelve al modo oscuro por defecto
  } else {
    document.body.setAttribute("data-theme", "light");
  }
}); 