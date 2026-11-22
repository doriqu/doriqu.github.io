---
layout: page
title: "9-Game ESP32 Console"
permalink: /projects/esp32-console/
importance: 6
featured: false
context: "Team HEPHAESTUS"
summary: "A multi-game console built in 24 hours for Arduino Days 2026, where team HEPHAESTUS won 1st Prize."
image: /assets/img/projects/console.svg
tags: [ESP32, C/C++, Arduino]
github: "https://github.com/Powellfgn17/ArduBoy"
order: 6
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 06 · Team HEPHAESTUS</p><h1>9-Game ESP32 Console</h1><p>A multi-game console built in 24 hours for Arduino Days 2026, where team HEPHAESTUS won 1st Prize.</p><figure class="project-detail-media"><img src="{{ '/assets/img/projects/console.svg' | relative_url }}" alt="6_esp32-console"></figure><p>[TODO: verify technical details against the repository README and confirm my personal contribution.]</p><p><a href="/awards/">Related award: 1st Prize, Arduino Days 2026 →</a></p><div class="tag-list"><span class="tag">ESP32</span> <span class="tag">C/C++</span> <span class="tag">Arduino</span></div><a class="button" href="https://github.com/Powellfgn17/ArduBoy">GitHub ↗</a><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
