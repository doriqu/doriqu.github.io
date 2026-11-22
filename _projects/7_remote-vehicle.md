---
layout: page
title: "Remote-Controlled Robot Vehicle"
permalink: /projects/remote-vehicle/
importance: 7
featured: false
context: "Personal maker project"
summary: "Wireless remote-controlled mobile robot with a complete hardware architecture and real-time embedded C++ firmware."
image: /assets/img/projects/vehicle.svg
tags: [C++, Arduino, Bluetooth HC-05]
github: ""
demo: /assets/video/vehicle-demo.mp4
preview: /assets/video/vehicle-preview.mp4
order: 7
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 07 · Personal maker project</p><h1>Remote-Controlled Robot Vehicle</h1><p>Wireless remote-controlled mobile robot with a complete hardware architecture and real-time embedded C++ firmware.</p><figure class="project-detail-media" id="demo"><video controls playsinline preload="metadata" poster="{{ '/assets/img/projects/vehicle.svg' | relative_url }}"><source src="{{ '/assets/video/vehicle-demo.mp4' | relative_url }}" type="video/mp4"></video></figure><p>Personal maker project.</p><div class="tag-list"><span class="tag">C++</span> <span class="tag">Arduino</span> <span class="tag">Bluetooth HC-05</span></div><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
