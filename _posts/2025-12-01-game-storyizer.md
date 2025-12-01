---
layout: post
title:  "Game Storyizer"
author: ron
categories: [ gamedev, writing, tool ]
image: assets/images/game-storyizer.png
featured: false
toc: false
---

I've built a new tool called **Game Storyizer**. It's a node-based narrative builder designed to help game developers and writers create complex, branching storylines.

The tool features a visual graph editor where you can create nodes representing story events and connect them to define the flow. It supports logic gates (AND/OR) for prerequisites, making it easy to design puzzles or multi-path narratives. 

I wanted to try to see how good Gemini Canvas Mode was at building games, but i also needed a way to present the game story to the AI. Just writing it out in plain text wasn't good enough because stories have branches, and if you need to change or modify things, that gets complicated.

The idea of using a directed graph story editor isn't new, but i couldn't find any free easy to use tools, that most importantly, just outputted the story in a format good for AI. This tool is the beginnings of that. I already have some plans to make this better. I belief one-shot creation of a game from story to 3D world is entirely possible!

Check it out below!

<div style="margin-bottom: 10px; text-align: right;">
<a href="/assets/apps/game-storyizer/dist/index.html" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 12px;">OPEN IN NEW WINDOW</a>
</div>

<iframe src="/assets/apps/game-storyizer/dist/index.html" style="width:100%; height:800px; border:none; background: #020617;"></iframe>
