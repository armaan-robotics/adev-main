# ADev

A pure HTML, CSS, and JavaScript personal landing page. It has no frameworks, no build tools, and no dependencies.

## Folder Structure

- `index.html` - Home page with hero, projects, upcoming work, idea form, and footer.
- `settings.html` - Appearance settings for theme and font size.
- `pages/about.html` - Standalone about and contact page.
- `css/reset.css` - Basic box sizing, margin, and padding reset.
- `css/variables.css` - All colors, spacing, sizing, transitions, and theme variables.
- `css/layout.css` - Main page layout, top bar, sections, and footer.
- `css/components.css` - Buttons, badges, forms, contact links, and idea cards.
- `css/sidebar.css` - Right sidebar, backdrop, and navigation styles.
- `css/cards.css` - Project and upcoming card styles.
- `css/filter.css` - Filter dropdown, checkbox groups, and active filter chips.
- `css/settings.css` - Settings page controls and toggle switch.
- `css/animations.css` - Keyframes and reduced-motion handling.
- `css/responsive.css` - Tablet and mobile media queries.
- `js/main.js` - Thin initializer that starts all page features.
- `js/sidebar.js` - Opens and closes the sidebar.
- `js/theme.js` - Handles persistent light/dark mode and font-size switching.
- `js/filter.js` - Builds filters, applies checkbox state, and renders active chips.
- `js/ideas.js` - Submits ideas to the configured private spreadsheet endpoint.
- `js/render-assets.js` - Renders project cards from `content/assets.js`.
- `js/render-upcoming.js` - Renders upcoming cards from `content/upcoming.js`.
- `content/assets.js` - Editable project list.
- `content/upcoming.js` - Editable upcoming project list.
- `content/about.js` - Editable personal/about details.
- `assets/thumbnails/` - Place project thumbnail images here.
- `assets/icons/` - Place future icon files here.

## Run Locally

Open `index.html` directly in your browser. No server is required.

## Add a New Asset

Open `content/assets.js`. Copy the blank template object, paste it above the template, remove the `isTemplate: true` line, and fill in every field.

Use a real image path like `assets/thumbnails/my-project.png` for `thumbnail`, or use a fallback hex color like `#A8D8C8`. Save the file and refresh `index.html`.

## Add an Upcoming Product

Open `content/upcoming.js`. Copy the blank template object, paste it above the template, remove the `isTemplate: true` line, and fill in the name, type, and teaser description.

Save the file and refresh `index.html`.

## Update About Details

Open `content/about.js`. Fill in the name, tagline, bio, email, GitHub URL, LinkedIn URL, and any extra links in `otherLinks`.

These values update the hero, about page, contact links, and footer.

## Send Ideas to a Private Spreadsheet

The idea form posts to a Google Apps Script web app, which writes submissions into a Google Sheet that only you need access to.

1. Create a private Google Sheet.
2. Copy the spreadsheet ID from the sheet URL.
3. Create a Google Apps Script project and paste in `google-apps-script/ideas-to-sheets.gs`.
4. Replace `PASTE_YOUR_SPREADSHEET_ID_HERE` with your spreadsheet ID.
5. Deploy the script as a Web App with "Execute as: Me" and "Who has access: Anyone".
6. Copy the Web App URL.
7. Paste that URL into `ARMAANDEV_IDEA_ENDPOINT` in `js/ideas.js`.

The endpoint can receive submissions from visitors, but the spreadsheet itself remains private to your Google account.

## Add a New Settings Option Later

Add the new control markup inside the `Display` section in `settings.html`, where the comment says `// Add future display settings here`.

Then add page-specific styling in `css/settings.css` and behavior in a focused JavaScript file. Save persistent settings to localStorage with a clear `adev_` key.
"# adev-main" 
