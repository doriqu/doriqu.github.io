---
pager: false
layout: page
title: "IK Explorer"
permalink: /projects/ik-explorer/
importance: 2
featured: true
context: "Solo project"
summary: "A from-scratch kinematics study for the 5-DOF X-Arm, comparing analytical and Damped Least Squares solvers."
image: /assets/img/projects/ik-explorer.png
tags: [Python, NumPy, Matplotlib, DH parameters, Al-Kashi, DLS/Jacobian]
github: "https://github.com/doriqu/xarm-ik-explorer"
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site"><p class="eyebrow">Project 02 · Solo project</p><h1>IK Explorer</h1><p>A from-scratch kinematics study for the 5-DOF X-Arm, comparing analytical and Damped Least Squares solvers.</p><p>Solo project to learn kinematics deeply. From the X-Arm URDF, I extracted link lengths, built the DH table and derived forward and inverse kinematics without the manufacturer's IK library.</p><p>The analytical solver uses geometry and Al-Kashi's law of cosines. The numerical solver uses Damped Least Squares with the Jacobian and multi-restart. An interactive 3D Matplotlib visualizer compares FK sliders, IK target input, animated motion, error, computation time, manipulability and debug log. A mirror method handles targets behind the robot (Y &lt; 0).</p><ul><li>Analytical: average error &lt; 0.05 mm, &lt; 1 ms, deterministic.</li><li>Numerical: tolerance &lt; 10 mm, 1–100 ms, non-deterministic due to random restarts.</li></ul><img src="/assets/img/projects/ik-explorer.png" alt="IK Explorer visualizer screenshot"><p>[TODO: add the technical report PDF link.]</p><div class="tag-list"><span class="tag">Python</span> <span class="tag">NumPy</span> <span class="tag">Matplotlib</span> <span class="tag">DH parameters</span> <span class="tag">Al-Kashi</span> <span class="tag">DLS/Jacobian</span></div><a class="button" href="https://github.com/doriqu/xarm-ik-explorer">GitHub ↗</a></div>
