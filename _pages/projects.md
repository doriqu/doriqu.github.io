---
layout: page
title: Projects
permalink: /projects/
nav: true
nav_order: 3
description: Selected engineering and robotics projects.
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site"><div class="project-grid">{% assign list = site.projects | sort: "importance" %}{% for project in list %}<article class="surface-card project-card" {% unless project.featured %}data-project-extra hidden{% endunless %}><a href="{{ project.url | relative_url }}"><img src="{{ project.image | relative_url }}" alt="{{ project.title }}" loading="lazy"></a><p class="eyebrow">{{ project.context }}</p><h2><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h2><p class="project-summary">{{ project.summary }}</p><div class="tag-list">{% for tag in project.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</div><div class="social-row"><a class="button" href="{{ project.url | relative_url }}">Details ↗</a>{% if project.github and project.github != "" %}<a class="button" href="{{ project.github }}" target="_blank" rel="noopener">GitHub ↗</a>{% endif %}</div></article>{% endfor %}</div><div style="text-align:center;margin-top:32px"><button class="button" type="button" data-project-toggle aria-expanded="false">Show more projects ↓</button></div></div>
