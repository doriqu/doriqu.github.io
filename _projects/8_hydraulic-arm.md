---
layout: page
title: "Cardboard Hydraulic Arm"
permalink: /projects/hydraulic-arm/
importance: 8
featured: false
context: "Personal maker project"
summary: "A cardboard mechanical arm operated hydraulically, with two tools: a gripper and a go-between; physical assembly completed."
image: /assets/img/projects/hydraulic.svg
tags: [Mechanical design, Hydraulics, Prototype]
github: ""
demo: /assets/video/hydraulic-demo.mp4
preview: /assets/video/hydraulic-preview.mp4
order: 8
---

<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 08 · Personal maker project</p><h1>Cardboard Hydraulic Arm</h1><p>A cardboard mechanical arm operated hydraulically, with two tools: a gripper and a go-between; physical assembly completed.</p><figure class="project-detail-media" id="demo"><video controls playsinline preload="metadata" poster="{{ '/assets/img/projects/hydraulic.svg' | relative_url }}"><source src="{{ '/assets/video/hydraulic-demo.mp4' | relative_url }}" type="video/mp4"></video></figure><p>Personal maker project.</p><div class="tag-list"><span class="tag">Mechanical design</span> <span class="tag">Hydraulics</span> <span class="tag">Prototype</span></div><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
