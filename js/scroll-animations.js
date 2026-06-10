/*
  scroll-animations.js
  Reveals major page sections and cards every time they enter the viewport.
*/

window.ADevScrollAnimations = {
  init: function () {
    var elements = Array.prototype.slice.call(document.querySelectorAll(
      ".hero, .section, .section-block, .asset-card, .upcoming-card, .contact-link, .settings-panel"
    ));

    if (!elements.length) {
      return;
    }

    elements.forEach(function (element) {
      element.classList.add("scroll-reveal");
      updateVisibility(element);
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach(revealElement);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealElement(entry.target);
        } else {
          hideElement(entry.target);
        }
      });
    }, {
      rootMargin: "-8% 0px -8% 0px",
      threshold: 0.12
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }
};

function revealElement(element) {
  element.classList.add("is-visible");
}

function hideElement(element) {
  element.classList.remove("is-visible");
}

function updateVisibility(element) {
  var rect = element.getBoundingClientRect();
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  var entersViewport = rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;

  if (entersViewport) {
    revealElement(element);
  }
}
