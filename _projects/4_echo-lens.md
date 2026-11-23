---
layout: page
title: "Echo Lens"
permalink: /projects/echo-lens/
importance: 4
featured: false
context: "Team project"
summary: "NASA Space Apps Challenge 2025 team project: supervised classification of Kepler catalog candidates and a web interface for exoplanet detection."
image: /assets/img/projects/echo.svg
tags: [Python, scikit-learn, Pandas, Kepler catalog]
github: "https://github.com/sun-kpokpo/exoplanet_hunt"
order: 4
---

<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 04 · Team project</p><h1>Echo Lens</h1><p>NASA Space Apps Challenge 2025 team project: supervised classification of Kepler catalog candidates and a web interface for exoplanet detection.</p><figure class="project-detail-media"><img src="{{ '/assets/img/projects/echo.svg' | relative_url }}" alt="4_echo-lens"></figure><p>[TODO: confirm my contribution]</p><p>Participation only; no prize is claimed. The NASA Space Apps participation certificate is listed under Certifications.</p><p>[TODO: verify technical details against the repository README.]</p><div class="tag-list"><span class="tag">Python</span> <span class="tag">scikit-learn</span> <span class="tag">Pandas</span> <span class="tag">Kepler catalog</span></div><a class="button" href="https://github.com/sun-kpokpo/exoplanet_hunt">GitHub ↗</a><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
