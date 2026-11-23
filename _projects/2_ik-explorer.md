---
layout: page
title: "IK Explorer"
permalink: /projects/ik-explorer/
importance: 2
featured: true
context: "Solo · self-study"
summary: "A from-scratch kinematics study for the 5-DOF X-Arm, comparing analytical and Damped Least Squares solvers."
image: /assets/img/projects/ik-explorer.png
tags: [Python, NumPy, Matplotlib, DH parameters, Al-Kashi, DLS/Jacobian]
github: "https://github.com/doriqu/xarm-ik-explorer"
demo: "/assets/video/Screencast from 2026-11-22 15-18-19.webm"
preview: /assets/video/ik-explorer-preview.mp4
order: 2
---

<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 02 · Solo · self-study</p><h1>IK Explorer</h1><p>A from-scratch kinematics study for the 5-DOF X-Arm, comparing analytical and Damped Least Squares solvers.</p><figure class="project-detail-media" id="demo"><video controls playsinline preload="metadata"><source src="{{ '/assets/video/Screencast from 2026-11-22 15-18-19.webm' | relative_url }}" type="video/webm"></video></figure><p>Solo project to learn kinematics deeply. From the X-Arm URDF, I extracted link lengths, built the DH table and derived forward and inverse kinematics without the manufacturer's IK library.</p><p>The analytical solver uses geometry and Al-Kashi's law of cosines. The numerical solver uses Damped Least Squares with the Jacobian and multi-restart. An interactive 3D Matplotlib visualizer compares FK sliders, IK target input, animated motion, error, computation time, manipulability and debug log. A mirror method handles targets behind the robot (Y &lt; 0).</p><ul><li>Analytical: average error &lt; 0.05 mm, &lt; 1 ms, deterministic.</li><li>Numerical: tolerance &lt; 10 mm, 1–100 ms, non-deterministic due to random restarts.</li></ul><p>[TODO: add the technical report PDF link.]</p><div class="tag-list"><span class="tag">Python</span> <span class="tag">NumPy</span> <span class="tag">Matplotlib</span> <span class="tag">DH parameters</span> <span class="tag">Al-Kashi</span> <span class="tag">DLS/Jacobian</span></div><a class="button" href="https://github.com/doriqu/xarm-ik-explorer">GitHub ↗</a><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
