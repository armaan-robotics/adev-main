/*
  ideas.js
  Handles the idea submission form and renders the public ideas list.
  Sends ideas to the local Express server (server.js) which saves them to ideas.json.
  Fetches all ideas from the server to display publicly on the page.
*/

window.ADevIdeas = {

  // ─── INITIALIZE ────────────────────────────────────────────────────────────
  init: function () {
    var form        = document.querySelector("[data-idea-form]");
    var textarea    = document.querySelector("[data-idea-text]");
    var counter     = document.querySelector("[data-idea-counter]");
    var message     = document.querySelector("[data-idea-message]");
    var submitButton = form ? form.querySelector("button[type='submit']") : null;
    var ideasList   = document.querySelector("[data-ideas-list]");

    if (!form || !textarea || !counter || !message || !submitButton) {
      return;
    }

    // Load and display existing ideas on page load
    window.ADevIdeas.loadIdeas(ideasList);

    // ─── CHARACTER COUNTER ──────────────────────────────────────────────────
    function updateCounter() {
      counter.textContent = textarea.value.length + "/300";
    }

    textarea.addEventListener("input", updateCounter);
    updateCounter();

    // ─── FORM SUBMIT ────────────────────────────────────────────────────────
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var text = textarea.value.trim();

      if (!text) {
        return;
      }

      submitButton.disabled = true;
      message.textContent = "Submitting...";

      // Send idea to local Express server
      fetch("/submit-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
      })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.success) {
          textarea.value = "";
          updateCounter();
          message.textContent = "Thanks! Your idea was noted.";

          // Reload the ideas list to show the new idea immediately
          window.ADevIdeas.loadIdeas(ideasList);

          window.setTimeout(function () {
            message.textContent = "";
          }, 2400);
        } else {
          message.textContent = data.error || "Something went wrong.";
        }
      })
      .catch(function () {
        message.textContent = "Could not reach the server. Is it running?";
      })
      .finally(function () {
        submitButton.disabled = false;
      });
    });
  },

  // ─── LOAD IDEAS FROM SERVER ─────────────────────────────────────────────
  // Fetches all ideas from /get-ideas and renders them into [data-ideas-list]
  loadIdeas: function (container) {
    if (!container) {
      return;
    }

    fetch("/get-ideas")
      .then(function (res) {
        return res.json();
      })
      .then(function (ideas) {
        if (!ideas || ideas.length === 0) {
          container.innerHTML = "<p class='ideas-empty'>No ideas submitted yet. Be the first!</p>";
          return;
        }

        // Render each idea as a card
        container.innerHTML = ideas.map(function (idea) {
          var date = new Date(idea.timestamp);

          // Format: "6 Jun 2026, 10:32 AM"
          var formatted = date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            "<div class='idea-card'>" +
              "<p class='idea-text'>" + window.ADevIdeas.escapeHTML(idea.text) + "</p>" +
              "<span class='idea-timestamp'>" + formatted + "</span>" +
            "</div>"
          );
        }).join("");
      })
      .catch(function () {
        container.innerHTML = "<p class='ideas-empty'>Could not load ideas. Is the server running?</p>";
      });
  },

  // ─── ESCAPE HTML ────────────────────────────────────────────────────────
  // Prevents XSS — sanitizes user submitted text before inserting into DOM
  escapeHTML: function (str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

};
