# Editing the portfolio

| I want to change…                               | Open this file…                                                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Bio, profile photo, phrases, research interests | `_pages/about.md`, `assets/img/donald-oke.jpg`                                                                                   |
| News                                            | Add/edit a file in `_news/` with `title`, `month` (`YYYYMM`), `display_date` (`Mon YYYY`) and optional `link`.                   |
| Project                                         | `_projects/<slug>.md`; put media in `assets/img/projects/`.                                                                      |
| Experience, education, involvement, awards      | `_pages/experience.md`, `_pages/education.md`, `_pages/involvement.md`, `_pages/awards.md`                                       |
| Skills                                          | `_data/skills.yml`                                                                                                               |
| Social links and CV path                        | `_data/socials.yml`                                                                                                              |
| Colors/fonts/spacing                            | The dark and light monochrome palettes are at the top of `assets/css/custom-theme.css`; shared font and spacing tokens follow them. |
| Theme toggle/default                            | Use the sun/moon control in the navbar. First visits default to dark in `_includes/head/custom.liquid`; saved choices use the single `localStorage` key `theme`. |
| Theme color audit                                | Run `node bin/color-audit.js --both-themes --url=http://localhost:8080/` while the local site is available.                     |
| CV PDF                                          | Put the PDF in `assets/pdf/` and update `_pages/cv.md` and `_data/socials.yml`.                                                  |
| Local preview                                   | Run `docker compose up`, open http://localhost:8080, and run `docker compose down` to stop. Restart after `_config.yml` changes. |

## Project front matter template

```yaml
---
layout: page
title: Project title
permalink: /projects/project-slug/
importance: 10
featured: false
context: Personal maker project
summary: Short factual card description.
image: /assets/img/projects/project-image.jpg
tags: [Python, Robotics]
github: ""
demo: ""
status: ""
---
```

Use `featured: true` for one of the first three cards. Leave `github` and `demo` empty when no link exists. Mark unknown facts `[TODO: ...]` and list them in `TODO.md`.
