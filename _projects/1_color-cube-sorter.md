---
pager: false
layout: page
title: "Color Cube Sorter"
permalink: /projects/color-cube-sorter/
importance: 1
featured: true
context: "Group project"
summary: "An automatic color-sorting line: a camera identifies cubes on a conveyor, a servo directs them into bins, and a Blynk dashboard tracks the process."
image: /assets/img/projects/color-cube-sorter-demo.gif
tags: [ESP32, XIAO ESP32-S3 Sense, Stepper motor, Blynk]
github: "https://github.com/doriqu/color-cube-sorter"
---
<link rel="stylesheet" href="/assets/css/custom-theme.css"><div class="custom-site"><p class="eyebrow">Project 01 · Group project</p><h1>Color Cube Sorter</h1><p>An automatic color-sorting line: a camera identifies cubes on a conveyor, a servo directs them into bins, and a Blynk dashboard tracks the process.</p><h2>How it works</h2><ol><li>A start laser detects a cube and starts the conveyor.</li><li>An ultrasonic sensor triggers the camera; HSV color identification is sent to the ESP32 master over UART.</li><li>The conveyor carries each cube while its state is tracked.</li><li>An end laser triggers the servo to position the bin.</li><li>A calculated delay lets the cube reach the bin; counters and dashboard data update.</li></ol><p>At the documented defaults (24 rpm, 10 cm roller perimeter, 5 cm sensor-to-bin distance), belt speed is 4 cm/s and drop delay is 1250 ms.</p><p>Hardware: ESP32 master, XIAO ESP32-S3 Sense, ultrasonic sensor, NEMA 17 stepper with TB6600 driver, SG90 servo, two laser/LDR barriers, I2C LCD and status LEDs. Unknown colors and emergency stops stop the belt; software debounce, an inactivity watchdog, persistent counters and non-blocking sorting logic support safe operation. The dashboard shows per-color and total counts, last item, timestamped log and a live chart. The README provides no numeric performance results.</p><h2>My role</h2><p>I lead the club that built this project. [TODO: what I personally designed or built]</p><img src="/assets/img/projects/color-cube-sorter-demo.gif" alt="Color Cube Sorter demonstration"><div class="tag-list"><span class="tag">ESP32</span> <span class="tag">XIAO ESP32-S3 Sense</span> <span class="tag">Stepper motor</span> <span class="tag">Blynk</span></div><a class="button" href="https://github.com/doriqu/color-cube-sorter">GitHub ↗</a></div>
