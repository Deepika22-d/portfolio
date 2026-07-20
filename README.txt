Deepika Sekar — Portfolio (Multi-File Project)
================================================

HOW TO USE
----------
1. Keep the folder structure exactly as-is and open "index.html" in any browser.
2. To deploy (Netlify, Vercel, GitHub Pages, etc.), upload this entire folder
   as-is. "index.html" is the entry point.

FOLDER STRUCTURE
-----------------
index.html                  Main page
css/style.css                All styling
js/script.js                 All interactivity (project cards, modals, video player, nav, etc.)
assets/images/                Profile photo + project images
assets/images/projects/       All 7 project card images + video poster frames
assets/videos/                 Online Quiz System & Online Survey System demo videos
assets/documents/              Both resumes (Software & Hardware), ServiceNow CSA/CAD
                                certificates, CSA/CAD score cards, internship certificate
assets/fonts/                  Self-hosted Space Grotesk, Inter, and JetBrains Mono (woff2)
                                — no external font CDN calls, fully offline-capable

WHAT WAS VERIFIED
------------------
- All 7 project cards render with correct images, GitHub links, and (where
  applicable) Live Website / View Demo buttons
- Both certificate cards render with correct images and working View Score
  Card buttons
- Demo videos play directly from local files (no embedding, no data URIs)
- Resume View/Download buttons point to the real PDF files
- Zero embedded/base64 assets anywhere — every image, video, and document is
  a real file referenced by a relative path
- Tested end-to-end with an automated headless-browser run: 0 JavaScript
  errors, all elements present

NOTE ON ACHIEVEMENTS SECTION
------------------------------
The Achievements section currently still uses icon-based placeholder cards.
The task to replace it with your uploaded achievement images and remove the
duplicate CSA/CAD entries was paused per your instruction and has not been
applied yet — let me know when you'd like it completed.
