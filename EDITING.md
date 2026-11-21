# Editing the portfolio

| I want to change… | Open this file… |
| --- | --- |
| Bio, profile photo, phrases, research interests | `_pages/about.md`, `assets/img/donald-oke.jpg` |
| News | Add/edit a file in `_news/` with `title`, `month` (`YYYYMM`), `display_date` (`Mon YYYY`) and optional `link`. |
| Project | `_projects/<slug>.md`; put media in `assets/img/projects/`. |
| Experience, education, involvement, awards | `_pages/experience.md`, `_pages/education.md`, `_pages/involvement.md`, `_pages/awards.md` |
| Skills | `_data/skills.yml` |
| Social links and CV path | `_data/socials.yml` |
| Colors/fonts/spacing | Variables at the top of `assets/css/custom-theme.css`; set `--motion: 0` to stop animation. |
| Restore light mode | Change `--theme-mode` and remove the toggle hiding rule in `assets/css/custom-theme.css`, then define and check a light palette. |
| CV PDF | Put the PDF in `assets/pdf/` and update `_pages/cv.md` and `_data/socials.yml`. |
| Local preview | Run `docker compose up`, open http://localhost:8080, and run `docker compose down` to stop. Restart after `_config.yml` changes. |

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
