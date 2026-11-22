---
layout: page
title: "Autonomous Robotic Arm (HiWonder xArm)"
permalink: /projects/xarm-pick-and-place/
importance: 3
featured: true
context: "Group project · In progress (2025-2026)"
summary: "AI Club project for real-time object detection and autonomous pick-and-place with a HiWonder xArm."
image: /assets/img/projects/xarm.svg
tags: [Python, YOLO, OpenCV, Kinematics, Trajectory planning]
github: "https://github.com/sun-kpokpo/X-Arm"
order: 3
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site project-detail"><p class="eyebrow">Project 03 · Group project · In progress (2025-2026)</p><h1>Autonomous Robotic Arm (HiWonder xArm)</h1><p>AI Club project for real-time object detection and autonomous pick-and-place with a HiWonder xArm.</p><figure class="project-detail-media"><img src="{{ '/assets/img/projects/xarm-pick-and-place.svg' | relative_url }}" alt="3_xarm-pick-and-place"></figure><p>AI Club project of the BENIN Excellence-Fondation Vallet AI Lab. The repository goals include real-time object detection, 3D positions relative to the robot base, collision-free trajectory planning, reliable grasp-and-place, and visualization of camera feed and robot state. Modules cover computer vision and control (kinematics, trajectory planning and motor control).</p><p>README vision method: YOLO + OpenCV.</p><p>[TODO: confirm the vision method and what my part was]</p><div class="tag-list"><span class="tag">Python</span> <span class="tag">YOLO</span> <span class="tag">OpenCV</span> <span class="tag">Kinematics</span> <span class="tag">Trajectory planning</span></div><a class="button" href="https://github.com/sun-kpokpo/X-Arm">GitHub ↗</a><nav class="project-detail-pager"><a class="button" href="/projects/">Back to projects</a>{% assign ordered_projects = site.projects | sort: "order" %}{% assign current_index = nil %}{% for candidate in ordered_projects %}{% if candidate.url == page.url %}{% assign current_index = forloop.index0 %}{% endif %}{% endfor %}{% if current_index != nil %}{% assign prev_index = current_index | minus: 1 %}{% assign next_index = current_index | plus: 1 %}{% if prev_index >= 0 %}{% assign prev_project = ordered_projects[prev_index] %}<a class="button" rel="prev" href="{{ prev_project.url | relative_url }}">← {{ prev_project.title }}</a>{% endif %}{% if next_index < ordered_projects.size %}{% assign next_project = ordered_projects[next_index] %}<a class="button" rel="next" href="{{ next_project.url | relative_url }}">{{ next_project.title }} →</a>{% endif %}{% endif %}</nav></div>
