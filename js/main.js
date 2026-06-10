/*
  main.js
  Thin initializer that connects content globals to the page and starts each feature script.
*/

document.addEventListener("DOMContentLoaded", function () {
  initPageTransitions();
  populateAboutContent();

  if (window.ADevAssets) {
    window.ADevAssets.render();
  }

  if (window.ADevUpcoming) {
    window.ADevUpcoming.render();
  }

  if (window.ADevTheme) {
    window.ADevTheme.init();
  }

  if (window.ADevFilter) {
    window.ADevFilter.init();
  }

});

window.addEventListener("pageshow", function () {
  document.documentElement.classList.remove("is-page-leaving");
});

function initPageTransitions() {
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (motionQuery.matches) {
    return;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");

    if (!link || !shouldAnimateNavigation(event, link)) {
      return;
    }

    event.preventDefault();
    document.documentElement.classList.add("is-page-leaving");

    window.setTimeout(function () {
      window.location.href = link.href;
    }, 180);
  });
}

function shouldAnimateNavigation(event, link) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  if (link.target || link.hasAttribute("download")) {
    return false;
  }

  var targetUrl = new URL(link.href, window.location.href);
  var currentUrl = new URL(window.location.href);

  if (targetUrl.protocol !== currentUrl.protocol || targetUrl.origin !== currentUrl.origin) {
    return false;
  }

  if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) {
    return false;
  }

  return targetUrl.href !== currentUrl.href;
}

function populateAboutContent() {
  var about = window.ABOUT || {};
  var name = about.name || "ADev";
  var tagline = about.tagline || "A hub of digital products and services created by Armaan Gupta";

  setText("[data-about-name]", name);
  setText("[data-about-tagline]", tagline);
  setText("[data-about-bio]", about.bio || "Add a short bio in content/about.js to introduce your work.");
  setText("[data-footer-year]", new Date().getFullYear());

  var footerName = document.querySelector("[data-footer-name]");
  if (footerName) {
    footerName.textContent = name;
  }

  renderFooterLinks(about);
  renderContactLinks(about);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach(function (element) {
    element.textContent = value;
  });
}

function renderFooterLinks(about) {
  var container = document.querySelector("[data-footer-links]");

  if (!container) {
    return;
  }

  var links = [];

  if (about.github) {
    links.push('<a href="' + escapeAttribute(about.github) + '" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile">GitHub</a>');
  }

  if (about.email) {
    links.push('<a href="mailto:' + escapeAttribute(about.email) + '" aria-label="Email ADev">Email</a>');
  }

  container.innerHTML = links.join("");
}

function renderContactLinks(about) {
  var list = document.querySelector("[data-contact-list]");

  if (!list) {
    return;
  }

  var links = [];

  if (about.github) {
    links.push({ label: "GitHub", url: about.github, icon: "{}" });
  }

  if (about.linkedin) {
    links.push({ label: "LinkedIn", url: about.linkedin, icon: "in" });
  }

  if (about.email) {
    links.push({ label: "Email", url: "mailto:" + about.email, icon: "@" });
  }

  (about.otherLinks || []).forEach(function (link) {
    if (link.label && link.url) {
      links.push({ label: link.label, url: link.url, icon: "+" });
    }
  });

  if (!links.length) {
    list.innerHTML = '<li class="empty-state">Add contact links in content/about.js.</li>';
    return;
  }

  list.innerHTML = links.map(function (link) {
    var target = link.url.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener noreferrer"';
    return '<li><a class="contact-link" href="' + escapeAttribute(link.url) + '"' + target + ' aria-label="Open ' + escapeAttribute(link.label) + '"><span aria-hidden="true">' + escapeHtml(link.icon) + '</span><span>' + escapeHtml(link.label) + '</span></a></li>';
  }).join("");
}
