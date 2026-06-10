/*
  filter.js
  Handles the asset filter dropdown, checkbox state, and card visibility.
*/

window.ADevFilter = {
  init: function () {
    var button = document.querySelector("[data-filter-button]");
    var dropdown = document.querySelector("[data-filter-dropdown]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-asset-card]"));

    if (!button || !dropdown || !cards.length) {
      return;
    }

    buildFilterOptions(dropdown, cards);

    button.addEventListener("click", function () {
      var isOpen = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });

    dropdown.addEventListener("change", function () {
      applyFilters(dropdown, cards);
    });
  }
};

function buildFilterOptions(dropdown, cards) {
  var groups = {
    type: new Set(),
    price: new Set(),
    signup: new Set()
  };

  cards.forEach(function (card) {
    groups.type.add(card.getAttribute("data-type"));
    groups.price.add(card.getAttribute("data-price"));
    groups.signup.add(card.getAttribute("data-signup"));
  });

  dropdown.innerHTML = [
    renderGroup("Type", "type", groups.type),
    renderGroup("Price", "price", groups.price),
    renderGroup("Signup", "signup", groups.signup)
  ].join("");
}

function renderGroup(label, kind, values) {
  var options = Array.from(values).filter(Boolean).sort();

  if (!options.length) {
    options = ["None"];
  }

  return [
    '<fieldset class="filter-group">',
    '<legend>' + escapeHtml(label) + '</legend>',
    options.map(function (value) {
      var displayValue = kind === "signup" ? (value === "true" ? "Signup required" : "No signup") : value;
      return '<label class="filter-option"><input type="checkbox" data-filter-kind="' + kind + '" value="' + escapeAttribute(value) + '" aria-label="Filter by ' + escapeAttribute(displayValue) + '"> ' + escapeHtml(displayValue) + '</label>';
    }).join(""),
    '</fieldset>'
  ].join("");
}

function applyFilters(dropdown, cards) {
  var selected = collectFilters(dropdown);

  cards.forEach(function (card) {
    var matches = matchesFilterGroup(selected.type, [card.getAttribute("data-type")])
      && matchesFilterGroup(selected.price, [card.getAttribute("data-price")])
      && matchesFilterGroup(selected.signup, [card.getAttribute("data-signup")]);

    card.hidden = !matches;
  });
}

function collectFilters(dropdown) {
  var selected = {
    type: [],
    price: [],
    signup: []
  };

  dropdown.querySelectorAll("input:checked").forEach(function (input) {
    selected[input.getAttribute("data-filter-kind")].push(input.value);
  });

  return selected;
}

function matchesFilterGroup(selectedValues, cardValues) {
  if (!selectedValues.length) {
    return true;
  }

  return selectedValues.some(function (value) {
    return cardValues.indexOf(value) !== -1;
  });
}
