---
layout: page
title: "Surveillance Radar"
permalink: /projects/surveillance-radar/
importance: 9
featured: false
context: "Personal maker project"
summary: "Perimeter surveillance radar using an ultrasonic sensor and real-time visualization."
image: /assets/img/projects/radar.svg
tags: [Arduino, Ultrasonic sensor, Processing]
github: ""
order: 9
---

<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 09 · Personal maker project</p><h1>Surveillance Radar</h1><p>Perimeter surveillance radar using an ultrasonic sensor and real-time visualization.</p><figure class="project-detail-media"><img src="{{ '/assets/img/projects/radar.svg' | relative_url }}" alt="9_surveillance-radar"></figure><p>Personal maker project.</p><div class="tag-list"><span class="tag">Arduino</span> <span class="tag">Ultrasonic sensor</span> <span class="tag">Processing</span></div><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
