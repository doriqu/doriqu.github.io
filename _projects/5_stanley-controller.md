---
layout: page
title: "Path Tracking: Stanley Controller (ma64)"
permalink: /projects/stanley-controller/
importance: 5
featured: false
context: "Community contribution · In progress"
summary: "Contribution to the ma64 community project; my part was testing the Stanley path-tracking algorithm."
image: /assets/img/projects/stanley.svg
tags: [ROS 2, Python]
github: ""
order: 5
---

<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 05 · Community contribution · In progress</p><h1>Path Tracking: Stanley Controller (ma64)</h1><p>Contribution to the ma64 community project; my part was testing the Stanley path-tracking algorithm.</p><figure class="project-detail-media"><img src="{{ '/assets/img/projects/stanley.svg' | relative_url }}" alt="5_stanley-controller"></figure><p>My part was testing the Stanley path-tracking algorithm.</p><p>[TODO: confirm what the testing covered and the current status]</p><div class="tag-list"><span class="tag">ROS 2</span> <span class="tag">Python</span></div><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
