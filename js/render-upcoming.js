/*
  render-upcoming.js
  Reads window.UPCOMING, generates muted upcoming cards, and injects them into the page.
*/

window.ADevUpcoming = {
  getUpcoming: function () {
    return (window.UPCOMING || []).filter(function (item) {
      return !item.isTemplate && item.name;
    });
  },

  render: function () {
    var grid = document.querySelector("[data-upcoming-grid]");

    if (!grid) {
      return;
    }

    var upcoming = window.ADevUpcoming.getUpcoming();

    if (!upcoming.length) {
      grid.innerHTML = '<p class="empty-state">No upcoming projects have been added yet.</p>';
      return;
    }

    grid.innerHTML = upcoming.map(function (item) {
      return [
        '<article class="upcoming-card">',
        '<div class="card-body">',
        '<div class="badge-row">',
        '<span class="badge badge-development">In Development</span>',
        '<span class="badge badge-type">' + escapeHtml(item.type || "Project") + '</span>',
        '</div>',
        '<h3 class="card-title">' + escapeHtml(item.name) + '</h3>',
        '<p>' + escapeHtml(item.teaserDescription || "") + '</p>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");
  }
};
