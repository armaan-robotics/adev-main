/*
  sidebar.js
  Handles only the right-side sidebar open, close, backdrop, and Escape-key behavior.
*/

window.ADevSidebar = {
  init: function () {
    var body = document.body;
    var openButton = document.querySelector("[data-sidebar-open]");
    var closeButton = document.querySelector("[data-sidebar-close]");
    var backdrop = document.querySelector("[data-sidebar-backdrop]");

    if (!openButton || !closeButton || !backdrop) {
      return;
    }

    function openSidebar() {
      body.classList.add("sidebar-open");
      openButton.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
      body.classList.remove("sidebar-open");
      openButton.setAttribute("aria-expanded", "false");
    }

    openButton.addEventListener("click", openSidebar);
    closeButton.addEventListener("click", closeSidebar);
    backdrop.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSidebar();
      }
    });
  }
};
