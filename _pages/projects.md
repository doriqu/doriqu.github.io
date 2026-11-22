---
swarm: formation
layout: page
title: Projects
permalink: /projects/
nav: true
nav_order: 3
description: Selected engineering and robotics projects.
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site"><canvas class="site-swarm" data-swarm="formation" aria-hidden="true"></canvas><div class="project-grid">{% assign list = site.projects | sort: "importance" %}{% for project in list %}<article class="surface-card project-card" {% unless project.featured %}data-project-extra hidden{% endunless %}><a class="project-media" href="{{ project.url | relative_url }}"><img class="project-poster" src="{{ project.image | relative_url }}" alt="{{ project.title }}" loading="lazy">{% if project.preview %}<video class="project-preview" muted loop playsinline preload="none" data-src="{{ project.preview | relative_url }}" aria-hidden="true"></video><span class="preview-badge">▶ PREVIEW</span>{% endif %}</a><p class="eyebrow">{{ project.context }}</p><h2><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h2><p class="project-summary">{{ project.summary }}</p><div class="tag-list">{% for tag in project.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</div><div class="project-actions"><a class="button" href="{{ project.url | relative_url }}">Details →</a>{% if project.github and project.github != "" %}<a class="button" href="{{ project.github }}" target="_blank" rel="noopener">GitHub ↗</a>{% endif %}</div></article>{% endfor %}</div><div class="project-toggle-row"><button class="button" type="button" data-project-toggle aria-expanded="false">Show more projects ↓</button></div></div>
