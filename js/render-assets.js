/*
  render-assets.js
  Reads window.ASSETS, generates project cards, and injects them into the asset grid.
*/

window.ADevAssets = {
  getAssets: function () {
    return (window.ASSETS || []).filter(function (asset) {
      return !asset.isTemplate && asset.name;
    });
  },

  render: function () {
    var grid = document.querySelector("[data-assets-grid]");

    if (!grid) {
      return;
    }

    var assets = window.ADevAssets.getAssets();

    if (!assets.length) {
      grid.innerHTML = '<p class="empty-state">No projects have been added yet.</p>';
      return;
    }

    grid.innerHTML = assets.map(function (asset, index) {
      var isHexThumbnail = /^#([0-9A-F]{3}){1,2}$/i.test(asset.thumbnail || "");
      var thumbnailMarkup = isHexThumbnail
        ? '<div class="thumbnail thumbnail-fallback" style="background-color: ' + escapeAttribute(asset.thumbnail) + ';">' + escapeHtml(asset.name.charAt(0)) + '</div>'
        : '<img class="thumbnail" src="' + escapeAttribute(asset.thumbnail || "") + '" alt="' + escapeAttribute(asset.name) + ' thumbnail">';
      var priceClass = asset.price === "Paid" ? "badge-paid" : "badge-free";
      var signupBadge = asset.signupRequired
        ? '<span class="badge badge-neutral">Signup Required</span>'
        : '<span class="badge badge-neutral">No Signup Required</span>';

      return [
        '<article class="asset-card" data-asset-card data-type="' + escapeAttribute(asset.type || "") + '" data-price="' + escapeAttribute(asset.price || "") + '" data-signup="' + String(Boolean(asset.signupRequired)) + '">',
        thumbnailMarkup,
        '<div class="card-body">',
        '<h3 class="card-title">' + escapeHtml(asset.name) + '</h3>',
        '<div class="badge-row">',
        '<span class="badge badge-type">' + escapeHtml(asset.type || "Project") + '</span>',
        '<span class="badge ' + priceClass + '">' + escapeHtml(asset.price || "Free") + '</span>',
        signupBadge,
        '</div>',
        '<p class="card-description" title="' + escapeAttribute(asset.description || "") + '">' + escapeHtml(asset.description || "") + '</p>',
        '<div class="card-actions"><a class="button" href="' + escapeAttribute(asset.link || "#") + '" target="_blank" rel="noopener noreferrer" aria-label="Visit ' + escapeAttribute(asset.name) + '">Visit</a></div>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character];
  });
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
