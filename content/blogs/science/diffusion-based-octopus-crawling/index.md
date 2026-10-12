+++
template = "post.html"
title = "Learning Many Ways to Crawl: Diffusion Models for an Adaptable CyberOctopus"
description = "How diffusion-based optimization discovers diverse octopus-arm coordination patterns and edits them to recover crawling performance under new actuation constraints."
date = 2026-10-02
in_search_index = true
draft = false

[taxonomies]
tags = ["Soft Robotics", "Diffusion Models", "Optimization", "Adaptive Control"]
categories = ["Research", "Paper"]

[extra]

[extra.post]
subtitle = "Turning redundant arms into options for adaptation"
thumbnail = "img/cyberoctopus-overview.png"
thumbnail_alt = "A simulated eight-arm octopus follows waypoints and adapts its crawling controls."
links = [
  { name = "Read the paper", url = "https://arxiv.org/abs/2609.21138v1", icon_class = "bi bi-file-earmark-text" },
  { name = "Paper PDF", url = "https://arxiv.org/pdf/2609.21138v1", icon_class = "bi bi-file-earmark-pdf" },
  { name = "Project page", url = "https://skim0119.github.io/adaptive-crawling/", icon_class = "bi bi-globe" },
  { name = "Watch video", url = "#crawling-in-action", icon_class = "bi bi-play-circle" },
]
bibtex = '''
@misc{kim2026diverse,
  title = {Diverse and Adaptable Arm Coordination for Octopus-Crawling via Diffusion-Based Uncertainty-Aware Optimization},
  author = {Kim, Seung Hyun and Chang, Heng-Sheng and Kazemi, Kimia and Mehta, Prashant G. and Gazzola, Mattia},
  year = {2026},
  eprint = {2609.21138},
  archivePrefix = {arXiv},
  primaryClass = {cs.RO},
  url = {https://arxiv.org/abs/2609.21138v1}
}
'''

[extra.post.teaser]
src = "img/cyberoctopus-overview.png"
alt = "CyberOctopus crawls along waypoint directions on a frictional plane; an inactive arm illustrates the motivation for adapting its controls."
width = 1338
height = 552
caption = "**CyberOctopus.** The study uses an eight-arm soft-body simulation to learn crawling coordination and investigate adaptation. Figure 1 from [Kim et al. (2026)](https://arxiv.org/abs/2609.21138v1)."


[extra.tex.macros]
+++

An octopus has many ways to move in the same direction. Different arms can push, pull, bend, and anchor against the ground, giving the animal a large set of possible coordination patterns. For a soft robot, this **motor abundance** creates a difficult search problem, but it also offers options when a familiar movement stops working.

In our [recent preprint](https://arxiv.org/abs/2609.21138v1), Seung Hyun Kim, Kimia Kazemi, Prashant G. Mehta, Mattia Gazzola, and I investigate how to learn and reuse those options. We introduce **Diffusion-based Uncertainty-aware Optimization (DUO)**, which discovers crawling controls for a simulated, muscle-actuated CyberOctopus without prior demonstrations.

The central idea is to learn a **distribution of useful controls**. When actuation constraints change, we can edit a control using that learned distribution while keeping the model fixed. In the tested scenarios, this recovers roughly half or more of the crawling performance lost to the constraint.

## Crawling in action

<figure class="post__figure">
{{ <video.player src="https://d1hwl9j5fn5ugq.cloudfront.net/ICRA2027Octopus/vid01.mp4" title="CyberOctopus adaptive crawling demonstration" start_time={3} /> }}
<figcaption><strong>CyberOctopus in motion.</strong> Visit the <a href="https://skim0119.github.io/adaptive-crawling/">project page</a> for more about the work, or <a href="https://d1hwl9j5fn5ugq.cloudfront.net/ICRA2027Octopus/vid01.mp4">open the video directly</a>.</figcaption>
</figure>

## Why learn a family of controls?

Imagine learning one highly effective crawling motion that depends heavily on suction. If suction becomes weaker, that motion may perform poorly. A controller family containing other patterns of arm recruitment gives adaptation more possibilities to work with.

Capturing this variety is difficult because the robot's body is highly deformable. Our CyberOctopus has eight soft arms, each modeled as a **Cosserat rod**: a continuum description that accounts for bending, twisting, stretching, and shearing. Muscle forces interact with gravity, ground friction, contact between arms, and sucker adhesion.

Each arm has nine actuation channels: four longitudinal muscles for directional bending, one transverse muscle for elongation, two oblique muscles for twisting, and two sucker groups for anchoring. Every channel follows a Gaussian activation pulse with three parameters: amplitude, width, and peak phase. A crawling control therefore contains

<div>
$$
d = 8 \times 9 \times 3 = 216
$$
</div>

parameters. Testing one setting requires a dynamic simulation. Searching this space for many useful settings makes the evaluation budget a central concern.

## Use symmetry, then check the gaps

The robot's eight equally spaced arms provide a useful shortcut. Cyclically shifting the assignment of controls among arms gives symmetry-related directions separated by $45^\circ$. We can concentrate the directional search on a canonical sector from $-22.5^\circ$ to $22.5^\circ$, then reuse the result around the body.

This reduces the directional search while leaving the 216 actuation parameters to optimize. For directions between discrete symmetry rotations, we interpolate adjacent arm assignments. The interpolated control stays within the allowed parameter bounds, but its physical performance still needs to be checked.

For a commanded direction $\phi$, the starting objective is

<div>
$$
\begin{aligned}
q(u;\phi) = {} & \cos\phi\,\Delta x(u) + \sin\phi\,\Delta y(u) \\
& - \frac{\lambda}{2}\bigl[J_{\mathrm{ang}}(u;\phi)+J_{\mathrm{rot}}(u)\bigr].
\end{aligned}
$$
</div>

Here, $u$ is the control, $(\Delta x,\Delta y)$ is the resulting displacement, $J_{\mathrm{ang}}$ measures directional error, and $J_{\mathrm{rot}}$ measures net body rotation. The weight $\lambda$ balances progress against those penalties.

The objective used for learning, $f(u)$, combines evaluations at the **sector center and boundary**, with equal weights and angular penalties at both. This encourages a control to work between the symmetry directions as well as at the center.

{{ <media.image page={page} path="img/directional-crawling.png" width={1518} alt="Boundary-aware training produces more consistent directional crawling and closer waypoint tracking; 128 generated controls complete the illustrated curved path." caption="**Crawling between symmetry directions.** Blue curves include the boundary objective; orange curves omit it. The right panel shows the illustrated curved-path test. Figure 4(a-d) from the paper. [Open full-size figure](img/directional-crawling.png)." full_size={true} /> }}

The experiments show the tradeoff: adding the boundary evaluation gives up some center-direction performance while improving directional consistency and waypoint tracking. In the illustrated curved-path experiment, all 128 generated controls reach the end. That result describes this particular test, rather than a guarantee for arbitrary paths.

## DUO: generate broadly, simulate selectively

A conditional diffusion model learns to generate controls for a requested objective value:

<div>
$$
u \sim p_\theta(\cdot\mid y).
$$
</div>

During training, the model learns to remove noise from evaluated controls. During generation, it starts with noise and progressively denoises it into a candidate control. Different noise samples can produce different coordination patterns for the same requested score. The requested score guides generation; simulation determines what the candidate actually achieves.

The training data grows through an online optimization loop:

1. Train the diffusion generators and objective predictors on the controls evaluated so far.
2. Generate a larger pool of candidate controls, conditioning on a range of target scores.
3. Rank candidates using predicted performance and uncertainty.
4. Simulate the selected batch, add the measured outcomes to the dataset, and repeat.

In the reported setup, each iteration proposes 5,400 controls and selects 1,800 for objective evaluation. Training runs for 100 iterations. Each objective evaluation includes the center and boundary simulations. **Demonstration-free learning still requires substantial simulation data.**

{{ <media.image page={page} path="img/duo-method.png" width={1518} alt="DUO generates controls by denoising, ranks candidates before center and boundary simulations, and later edits controls under actuation constraints." caption="**Discover, evaluate, and edit.** The training loop builds its own control dataset through simulation. After training, constrained editing reuses the learned denoiser. Figure 3 from the paper. [Open full-size figure](img/duo-method.png)." full_size={true} /> }}

### Two roles for uncertainty

DUO combines two scores when deciding which controls deserve simulation.

The first uses an ensemble of forward predictors to estimate a candidate's objective. Its upper-confidence-bound score is

<div>
$$
\alpha_{\mathrm{control}}(u)=\mu(u)+\kappa\sigma(u),
$$
</div>

where $\mu$ is the ensemble's mean prediction and $\sigma$ measures disagreement. This rewards promising predictions and gives an exploration bonus to uncertain candidates.

The second score, $\alpha_{\mathrm{target}}(y)$, uses disagreement among diffusion generators to assess the reliability of the requested target value. It favors high targets with lower generator disagreement. The paper estimates that disagreement through the generators' expected normalized control norms.

These terms combine as

<div>
$$
\alpha(u,y)=\alpha_{\mathrm{control}}(u)
+\eta\,\alpha_{\mathrm{target}}(y).
$$
</div>

The distinction matters: uncertainty about an individual control can motivate exploration, while disagreement about a target can discourage an unreliable query. Sampling a range of target scores also helps the search retain alternatives as performance improves.

## What does the learned diversity look like?

The generated controls use different patterns of muscle and suction recruitment. The differences are especially visible in transverse-muscle activation and suction, while longitudinal- and oblique-muscle activation levels are comparatively similar across the control family.

{{ <media.image page={page} path="img/control-diversity.png" width={1518} alt="Actuation profiles show different muscle and suction recruitment patterns. DUO and DiBO achieve similar high objective values, while DUO evaluates a broader range of controls." caption="**Performance and variety.** Actuation profiles, optimization curves, and principal-component projections provide complementary views of the learned controls. Figure 4(e-g) from the paper. [Open full-size figure](img/control-diversity.png)." full_size={true} /> }}

The comparison with other optimization methods is informative. Under the matched simulator-evaluation budget, **DUO and DiBO reach similarly high objective values**, with DiBO converging slightly earlier. DUO continues evaluating controls over a wider objective range. The actuation profiles and projections of the control distribution provide additional evidence of retained variety; a wide score range alone would not establish distinct behaviors.

These results support diverse coordination patterns within the crawling task. As the paper notes, they do not establish mechanically distinct gaits.

The ablation study also helps explain the method's design. Across five independent runs, the mean final best objective falls from 0.384 to 0.256 when generation conditions only on the highest observed score. Removing control-level acquisition gives 0.243; removing target-level acquisition gives 0.328. In this experiment, both selective evaluation and broader target sampling contribute to the result.

## Adaptation by editing a control

Once the diffusion model has learned useful coordination patterns, we can use it to modify a control under new limits. The procedure resembles image inpainting: some coordinates are constrained, and the model helps adjust the remaining coordinates into a compatible whole.

For CyberOctopus, the constraints act on muscle or suction amplitudes. Repeated denoising, constraint enforcement, and noising alter the control while the **trained denoiser remains frozen**. There is no model retraining during this editing stage.

{{ <media.image page={page} path="img/control-adaptation.png" width={1518} alt="Control editing recovers a mean 46.8 percent of lost objective with weaker muscles, 54.0 percent with weaker suction, and 60.7 percent with actuation disabled on four alternating arms." caption="**Recovery with a frozen denoiser.** Each panel follows performance from the original control through the imposed constraint and subsequent editing. Violin plots summarize 64 generated controls. Figure 5 from the paper. [Open full-size figure](img/control-adaptation.png)." full_size={true} /> }}

The paper tests three constraints that were absent during training:

| Imposed constraint | Mean recovery of lost objective |
| :--- | ---: |
| Muscle amplitudes reduced by 25% across all arms | 46.8% |
| Suction amplitudes reduced by 75% across all arms | 54.0% |
| Muscle and suction actuation disabled on arms 1, 3, 5, and 7 | 60.7% |

In the third case, the four inactive arms remain physically present. Their actuation is suppressed.

To interpret the percentages, let $y_{\mathrm{initial}}$ be the original objective, $y_{\mathrm{constrained}}$ the objective after imposing the constraint, and $y_{\mathrm{adapted}}$ the result after editing. Recovery for an individual control is

<div>
$$
\mathrm{recovery}
=\frac{y_{\mathrm{adapted}}-y_{\mathrm{constrained}}}
{y_{\mathrm{initial}}-y_{\mathrm{constrained}}}\times100\%.
$$
</div>

The table reports the mean of this quantity across 64 generated controls. Thus, 60.7% means recovering that fraction of the **lost composite crawling score**. It is not a speed increase or a claim that the robot operates at 60.7% of its original performance.

## What this opens up

The study demonstrates a useful connection between controller discovery and reuse: a distribution learned for ordinary crawling can support partial recovery under new actuation constraints. Preserving alternative coordination patterns gives the editing procedure room to reorganize how the arms work together.

The evidence is currently limited to **planar crawling in simulation**. Reduced suction provides a test of weakened grip; it does not establish adaptation to arbitrary terrain. The experiments also do not establish automatic failure detection or real-time recovery. Hardware validation, richer sensory feedback, and three-dimensional locomotion remain future directions.

For soft robotics, this suggests a productive design goal: learn useful alternatives alongside high performance, then develop ways to reshape those alternatives when the body or its available actuation changes.

## Paper and attribution

This post is based on **Diverse and Adaptable Arm Coordination for Octopus-Crawling via Diffusion-Based Uncertainty-Aware Optimization**, by Seung Hyun Kim, Heng-Sheng Chang, Kimia Kazemi, Prashant G. Mehta, and Mattia Gazzola, University of Illinois Urbana-Champaign. The source reviewed here is [arXiv:2609.21138v1](https://arxiv.org/abs/2609.21138v1), dated September 17, 2026.

The figures are reproduced as crops from that version. Directional control and diversity results appear in Figure 4, adaptation results in Figure 5, and the ablations in Table I. The BibTeX citation below refers to the source paper.
