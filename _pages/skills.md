---
description: "Embedded systems, robotics and software tools."
layout: page
title: Skills
permalink: /skills/
nav: true
nav_order: 7
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site"><div class="skill-grid">{% for group in site.data.skills %}<article class="surface-card"><h2>{{ group.group }}</h2><div class="tag-list">{% for item in group.items %}<span class="tag">{{ item }}</span>{% endfor %}</div></article>{% endfor %}</div></div>
