/*
  theme.js
  Handles only persistent light/dark theme and font-size controls.
*/

(function applySavedAppearance() {
  var savedTheme = localStorage.getItem("adev_theme");
  var savedThemeWasChosen = localStorage.getItem("adev_theme_chosen") === "true";
  var savedFont = localStorage.getItem("adev_font");
  var theme = savedThemeWasChosen && (savedTheme === "dark" || savedTheme === "light") ? savedTheme : "dark";
  var font = savedFont === "small" || savedFont === "medium" || savedFont === "large" ? savedFont : "medium";

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-font", font);
})();

window.ADevTheme = {
  init: function () {
    var themeToggle = document.querySelector("[data-theme-toggle]");
    var fontButtons = document.querySelectorAll("[data-font-option]");
    var currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    var currentFont = document.documentElement.getAttribute("data-font") || "medium";

    if (themeToggle) {
      themeToggle.checked = currentTheme === "dark";
      themeToggle.addEventListener("change", function () {
        var theme = themeToggle.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("adev_theme", theme);
        localStorage.setItem("adev_theme_chosen", "true");
      });
    }

    if (fontButtons.length) {
      fontButtons.forEach(function (button) {
        var isCurrentFont = button.getAttribute("data-font-option") === currentFont;
        button.classList.toggle("is-active", isCurrentFont);
        button.setAttribute("aria-pressed", isCurrentFont ? "true" : "false");

        button.addEventListener("click", function () {
          var size = button.getAttribute("data-font-option");
          document.documentElement.setAttribute("data-font", size);
          localStorage.setItem("adev_font", size);

          fontButtons.forEach(function (item) {
            var isActive = item === button;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-pressed", isActive ? "true" : "false");
          });
        });
      });
    }
  }
};
