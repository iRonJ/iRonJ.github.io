---
layout: post
title:  "The Restructuring of Work"
author: ron
categories: [ AI, profession ]
image: assets/images/IMG_0450.png
description: "Takeaways from the frontlines of enterprise AI — what stood out after a week with 4,000 people on the front lines of enterprise automation."
featured: true
hidden: false
tags: []
---

*Takeaways from the frontlines of enterprise AI*

At an AI conference this week with around 4,000 people, mostly from enterprise and industry roles, I came away with a few big takeaways as someone who's been following deep learning for more than 10 years.

The first was that non-technical people are really trusting AI output now, especially when it's backed by RAG, documents, context, internal company data, or some kind of workflow wrapper that makes it feel grounded. If the answer sounds confident and looks like it came from the right sources, that's enough for a lot of people to move forward.

<div class="callout-box">
  <p class="callout-text" style="text-align:center; color:#00ab6b; font-size:1.4rem;">That's a big shift.</p>
</div>

I've been following this space for a long time and I still don't trust model output without scrutinizing it. And you can see the same instinct from the people actually building models and agent systems. Science and math tasks still need verification harnesses. Strong coding workflows still rely on rules, tests, review, and guardrails. <span class="callout-highlight">The people closest to the failure modes are usually the least likely to blindly trust the model.</span>

But outside that bubble, people are already using it differently.

One surprising thing from the conference was how many professionals across industries were building automations with tools like n8n, Manus, and similar systems, and finding the models good enough to just trust for a large swath of tasks. They're using prompting and constraints, sure, but they're still relying heavily on the models to just work. And apparently, in a lot of cases, they do.

It feels like we crossed a threshold in the last few months. Not that the models are fully reliable. Not that hallucinations are gone. But they've gotten good enough on many business tasks that trusting them is becoming normal behavior. And as they get more consistent and predictable, I think we may soon hit a point where for some classes of work they're more trustworthy than the average human doing the same task.

<div class="callout-box">
  <p class="callout-text">One thing is pretty clear though: if you're not figuring out how to automate parts of your job, you're working harder than you need to, or you're getting outpaced by people who are learning the new skill. And the skill is honestly not that hard to learn.</p>
</div>

The second big takeaway was that developer teams should absolutely have an AI agent somewhere in their workflow now. And medium or larger teams should be heavily customizing that team coding agent, if not rolling their own entirely.

<div class="callout-box">
  <p class="callout-text" style="font-style:italic; color:#445566;">I think that configuration layer is going to become real secret sauce. The model matters, but the bigger advantage is in the scaffolding around it: the prompts, repo awareness, tools, rules, test harnesses, coding standards, review logic, context shaping, and what kinds of actions the system is allowed to take. That whole setup becomes intellectual property.</p>
</div>

At the conference, a lot of larger companies already had engineering teams integrating AI coders deeply into their process. Each one was doing it differently, but the common thread was extensive verification of outputs, plus human review for higher-stakes changes. At the same time, many were already at the point where lower-stakes tasks could be fully automated.

That's important because once a team has built the infrastructure to safely include AI in the loop, they can keep expanding the scope as the models improve. **They don't have to start over every time the base models get better. They just move the autonomy line.**

Another thing that stood out was how many people were talking about whole segments of products being automated. Customer support, outreach, marketing, internal services, operational workflows. A lot of this is still early, but it's clearly where things are heading.

I was at this same conference last year and the difference compared to this year was kind of wild. Last year, a lot of the conversation was still people barely understanding what an LLM could actually do. This year, there were entire companies talking about being run mostly by AI. Not in some sci-fi sense. In the practical sense that huge parts of their workflow were already being handled by models, agents, and automation systems.

## So what happens next year?

I'd expect another jump of roughly the same scale. Probably a huge wave of world models, multimodal systems, edge AI, and humanoid robotics that can interact more naturally with the physical world. The pace of change right now is pretty hard to overstate.

<div class="callout-box callout-conclusion">
  <p class="callout-text" style="margin-bottom:0.85rem;">The big picture to me is that this is no longer about whether AI can answer questions or generate text. It's about restructuring work.</p>
  <p class="callout-body">The people who seem to understand that are already moving. They're not waiting for perfect models. They're taking the systems that exist right now, wrapping them in tools, context, and verification, and using them to move faster.</p>
</div>

*And more and more, that seems to be enough.*
