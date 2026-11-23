# Local rebuild notes

- Rebuilt the portfolio content and monochrome presentation in site pages and assets.
- The personal site uses local header and footer includes, permitted by the master guide for this site.
- The project cards are driven by the Jekyll project collection; local CSS and vanilla JavaScript provide responsive layout, reveal motion, swarm canvas and expandable cards.
- Used the local Color Cube Sorter demo GIF and IK visualizer screenshot. Other missing project images use neutral SVG placeholders.
- No push or deployment was performed.

## Fix round 2 · Batch 1

- Added a consistent custom header and static footer, with one About link, one reading-progress element, an icon-only search control, and a footer-aware scroll-to-top button.
- Disabled the theme footer, progress bar, dark-mode switch, and built-in back-to-top control; set the shared content width to 1100 px.
- Applied neutral UI colors, disabled ligatures, and aligned inner page title and content widths.
- Corrected front matter on the Education, Experience, Projects, Involvement, Skills, and Awards pages so Jekyll generates and includes them in navigation.
- Restarted the local Jekyll container. Generated HTML confirms one About link and one shared header/progress/footer on each inner page.
- Screenshot verification at 1366×768 and 380 px was unavailable: Firefox failed to initialize a profile, and no other browser automation is installed in this environment.
