/*
  filter.js
  Handles the asset filter dropdown, checkbox state, and card visibility.
*/

window.ADevFilter = {
  init: function () {
    var button = document.querySelector("[data-filter-button]");
    var dropdown = document.querySelector("[data-filter-dropdown]");
    var grid = document.querySelector("[data-assets-grid]");
    var cards = getAssetCards();

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

    dropdown.addEventListener("click", function (event) {
      if (event.target.matches("input[type='checkbox']")) {
        applyFilters(dropdown, grid);
      }
    });

    dropdown.addEventListener("change", function () {
      applyFilters(dropdown, grid);
    });
  }
};

function getAssetCards() {
  return Array.prototype.slice.call(document.querySelectorAll("[data-asset-card]"));
}

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
    options.map(function (value, index) {
      var displayValue = kind === "signup" ? (value === "true" ? "Signup Required" : "No Signup Required") : value;
      var inputId = "filter-" + kind + "-" + index;
      return '<label class="filter-option" for="' + escapeAttribute(inputId) + '"><input id="' + escapeAttribute(inputId) + '" type="checkbox" data-filter-kind="' + kind + '" value="' + escapeAttribute(value) + '" aria-label="Filter by ' + escapeAttribute(displayValue) + '"> <span>' + escapeHtml(displayValue) + '</span></label>';
    }).join(""),
    '</fieldset>'
  ].join("");
}

function applyFilters(dropdown, grid) {
  var selected = collectFilters(dropdown);
  var cards = getAssetCards();
  var visibleCount = 0;

  cards.forEach(function (card) {
    var matches = matchesFilterGroup(selected.type, [card.getAttribute("data-type")])
      && matchesFilterGroup(selected.price, [card.getAttribute("data-price")])
      && matchesFilterGroup(selected.signup, [card.getAttribute("data-signup")]);

    card.hidden = !matches;

    if (matches) {
      visibleCount += 1;
    }
  });

  renderFilterEmptyState(grid, visibleCount);
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

function renderFilterEmptyState(grid, visibleCount) {
  if (!grid) {
    return;
  }

  var emptyState = grid.querySelector("[data-filter-empty]");

  if (visibleCount > 0) {
    if (emptyState) {
      emptyState.remove();
    }

    return;
  }

  if (!emptyState) {
    emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.setAttribute("data-filter-empty", "");
    emptyState.textContent = "No projects match these filters.";
    grid.appendChild(emptyState);
  }
}
