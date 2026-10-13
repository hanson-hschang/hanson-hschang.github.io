+++
template = "post.html"
title = "Learning to Forage: Hierarchical Control of a CyberOctopus"
description = "How reinforcement learning, fast energy shaping, and local contact reflexes work together to coordinate a simulated octopus searching for food."
date = 2023-06-22
in_search_index = true
draft = false

[taxonomies]
tags = ["Soft Robotics", "Hierarchical Control", "Reinforcement Learning", "Energy Shaping"]
categories = ["Research", "Paper"]

[extra]

[extra.post]
subtitle = "Sharing the work between a central policy, arm controllers, and a compliant body"
thumbnail = "img/control-hierarchy.png"
thumbnail_alt = "An octopus-inspired control hierarchy connects central decisions, arm muscle control, and local interactions with obstacles."
links = [
  { name = "Read the paper", url = "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/aisy.202300088", icon_class = "bi bi-file-earmark-text" },
  { name = "Foraging code", url = "https://github.com/chshih2/Multi-arm-coordination-for-foraging", icon_class = "bi bi-github" },
  { name = "Arm control code", url = "https://github.com/chshih2/Real-time-control-of-an-octopus-arm-NNES", icon_class = "bi bi-code-slash" },
  { name = "Watch video", url = "#foraging-in-action", icon_class = "bi bi-play-circle" },
]
bibtex = '''
@article{shih2023hierarchical,
  title = {Hierarchical Control and Learning of a Foraging {CyberOctopus}},
  author = {Shih, Chia-Hsien and Naughton, Noel and Halder, Udit and Chang, Heng-Sheng and Kim, Seung Hyun and Gillette, Rhanor and Mehta, Prashant G. and Gazzola, Mattia},
  journal = {Advanced Intelligent Systems},
  volume = {5},
  number = {9},
  pages = {2300088},
  year = {2023},
  doi = {10.1002/aisy.202300088},
  url = {https://doi.org/10.1002/aisy.202300088}
}
'''

[extra.post.teaser]
src = "img/control-hierarchy.png"
alt = "The central level selects behaviors, the arm level supplies muscle activations, and local compliance helps a simulated CyberOctopus reach food around obstacles."
size = [1616, 452]
caption = "**Three levels of coordination.** Decisions about what to do are translated into muscle commands, then adjusted through local interaction with the environment. Figure 1 from [Shih et al. (2023)](https://doi.org/10.1002/aisy.202300088). Octopus photograph: Anneli Salo, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). [Open full-size figure](img/control-hierarchy.png)."

[extra.tex]
+++

An octopus searching for food faces several problems at once. It must decide where to go, coordinate arms that can bend almost anywhere along their length, and keep moving when an arm encounters an obstacle. Trying to solve every muscle command and every foraging decision together creates an enormous control problem.

The octopus's distributed nervous system suggests a useful way to divide that work. Central decisions can select a behavior, arm-level programs can organize the muscles, and local feedback can respond to contact.

In our paper, [*Hierarchical Control and Learning of a Foraging CyberOctopus*](https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/aisy.202300088), Chia-Hsien Shih, Noel Naughton, Udit Halder, Seung Hyun Kim, Rhanor Gillette, Prashant G. Mehta, Mattia Gazzola, and I turn this idea into a computational framework. We combine **reinforcement learning for decisions, energy shaping for arm control, and a local reflex for obstacle contact**. A simulated CyberOctopus then learns to collect food using progressively more active arms.

## Foraging in action

<figure class="post__figure">
{{ <post.embed src="https://www.youtube-nocookie.com/embed/XrcgQFTuSks" title="Hierarchical control and learning of a foraging CyberOctopus" /> }}
<figcaption><strong>CyberOctopus in motion.</strong> Watch the foraging and obstacle-interaction simulations, or <a href="https://www.youtube.com/watch?v=XrcgQFTuSks">open the video on YouTube</a>.</figcaption>
</figure>

## Give each level a manageable job

The hierarchy assigns different kinds of decisions to different controllers:

| Level | Main question | Method |
| :--- | :--- | :--- |
| Central | Should each active arm collect food or help move the body? | A policy learned with proximal policy optimization (PPO) |
| Arm | Which muscle activations will bring the tip to a target? | Neural network energy shaping (NN-ES) |
| Local | How should the arm respond when it touches an obstacle? | A contact-triggered muscle reflex acting through the compliant body |

This structure lets the central policy reason in terms of useful actions while an arm controller handles the many muscle activations needed to carry them out. Each level has access to a different part of the problem.

Our simulated body has eight arms, with one, two, and finally four actively controlled in the experiments. Each arm is a tapered **Cosserat rod**, a continuum model that tracks deformation along a slender body. Here, we restrict each arm's motion to a plane and include two longitudinal muscle groups and one transverse group. Longitudinal activation can shorten or bend the arm; transverse contraction extends it through the model's volume-conservation assumption.

Several arm planes, combined with crawling across a horizontal substrate, allow food collection in a three-dimensional scene. Individual arms still have planar dynamics; twisting and fully three-dimensional arm motions are outside this study.

## Make reaching fast enough to reuse

In [*Shaping Energy to Control a Muscular Octopus Arm*](@/blogs/science/energy-shaping-octopus-arm/index.md), I described how muscle activation changes an arm's equilibrium. Energy shaping uses that connection to find activations that bring the arm toward a useful configuration.

The difficulty for foraging is computational cost. The controller must repeatedly evaluate possible targets and issue new reaching commands. Solving a fresh iterative optimization problem for every candidate would make the hierarchy expensive to run.

We therefore train a neural network to map the **current muscle activation and target position** to a new activation profile. Let $\alpha_0(s)$ denote the current activation, $\alpha(s)$ the proposed activation, and $q$ the target. The arm-level objective is

<div>
$$
J(\alpha;\alpha_0,q)
=\int_0^{L_0}\|\alpha(s)-\alpha_0(s)\|^2\,ds
+\mu_{\mathrm{tip}}\|q-x_\alpha(L_0)\|.
$$
</div>

Here, $L_0$ is the arm's resting length and $x_\alpha(L_0)$ is the tip position at the equilibrium induced by $\alpha$. The first term penalizes changes in muscle activation; the second penalizes missing the target. Muscle activations remain between zero and one. The activation term is a model of control effort, not a direct measurement of biological energy consumption.

To represent continuous activation profiles with a finite network output, we expand them in a set of spatial basis functions. The network predicts the coefficients. Equilibrium mechanics and rod kinematics then determine the resulting tip position and loss.

Training uses this mechanical objective directly: it does not require a collection of optimal activation labels produced by the older solver. Once trained, the network supplies the activations in a forward pass, and the simulated arm's dynamics carry out the movement.

{{ <media.image page={page} path="img/neural-network-energy-shaping.png" width={1816} alt="NN-ES learns muscle activations from target position and current activation. Workspace maps show configuration-dependent costs, and comparisons with iterative energy shaping show similar reaching accuracy with shorter computation times." caption="**A fast arm controller.** The learned map is trained through the mechanical objective. The lower panels compare arm shapes, computation times, reaching errors, and activation costs with iterative energy shaping. Figure 3 from the paper. [Open full-size figure](img/neural-network-energy-shaping.png)." full_size={true} /> }}

Across 100 random reaching cases, NN-ES and iterative energy shaping both achieve **median tip errors below 1% of resting arm length**. NN-ES computes solutions about **200 times faster**, with slightly higher muscle activation costs. This speedup concerns the computation of arm controls; it is not a claim that the entire foraging simulation or learning process runs 200 times faster.

## Build foraging from two behaviors

The central policy chooses between two behavioral primitives for each active arm:

- **Reach all:** attempt to collect every food target within the arm's workspace. The arm controller estimates the activation change needed for each target, selects the least costly, and repeats from the resulting configuration.
- **Crawl:** execute a predefined extension-and-contraction sequence. The arm extends, anchors its tip, and pulls the body forward by a fixed step before releasing the anchor.

Reaching uses repeated NN-ES evaluations, while crawling uses a prescribed activation pattern. The sucker effect is represented through boundary conditions rather than an explicit model of individual suckers. Food is counted as collected when the arm reaches its location.

An immediate food target is not always the best reason to stop. Crawling a little farther can bring several targets into an easier part of the workspace, allowing the arm to collect them with less effort. Learning when to make that tradeoff is the central policy's job.

{{ <media.image page={page} path="img/foraging-controller.png" width={1508} alt="Food targets lie on a grid around the CyberOctopus inside a bounded attention region. Diagrams compare a central-policy and NN-ES hierarchy with a single end-to-end network." caption="**Choose a behavior, then execute it.** A limited attention region keeps the planning input manageable. The hierarchical and end-to-end formulations receive the same overall information, but organize the computation differently. Figure 4 from the paper. [Open full-size figure](img/foraging-controller.png)." full_size={true} /> }}

The policy observes a fixed maximum number of nearby, uncollected targets within an attention region. This is a spatial selection rule that limits the input size. Target coordinates are supplied by the simulation; the study does not solve visual detection.

PPO trains the policy to balance food rewards against muscle activation costs and a penalty when all active arms choose to reach despite no food being available. The resulting behavior can delay reaching until several targets are conveniently placed, then gather them together.

## What does the hierarchy change?

The single-active-arm experiment compares the learned policy, a simplified analytical Q-policy, and greedy and random high-level policies, all backed by the arm controller. An additional end-to-end PPO network learns muscle commands directly from food locations and current activation.

All four hierarchical policies outperform the tested end-to-end controller on the reported metrics. Even randomly choosing between useful behaviors benefits from having a capable arm controller underneath. The learned high-level policy performs best overall, using its choices to improve both the modeled energy return and the number of decision steps needed per food item.

This comparison supports the chosen decomposition for this task and training setup. The paper does not establish that every hierarchical method outperforms every end-to-end method, and it does not report further end-to-end benchmarks for the multiarm cases.

With two active arms, the policy can coordinate movement along two orthogonal directions. Four active arms add forward, backward, left, and right movement, making it possible to revisit missed food. In the four-arm experiment without obstacles, the learned policy collects **88% of available food on average**, compared with **38% for the greedy policy**.

## Let contact trigger a local response

An arm reaching toward food can become stuck against an obstacle even when the target is geometrically reachable. We address this with a local reflex inspired by waves of muscle activation observed in octopus arms.

At contact, the part of the arm beyond the contact point relaxes. Toward the base, longitudinal muscles on the contacting side increase activation while the other muscles relax. This reshapes the compliant arm so that it can slide past the obstacle. When contact ends, the original muscle command resumes. The model treats the activation signals as propagating instantaneously.

{{ <media.image page={page} path="img/obstacle-reflex.png" width={1620} alt="Without local feedback an arm gets stuck at a spherical obstacle; with feedback it slides past. Food-collection results and a four-arm foraging sequence show the benefit of the contact reflex." caption="**Local feedback restores access to food.** The central policy was trained without obstacles. Enabling the contact reflex improves food collection when obstacles are introduced. Panel b summarizes 100 evaluation episodes; panel c illustrates one foraging sequence. Figure 7 from the paper. [Open full-size figure](img/obstacle-reflex.png)." full_size={true} /> }}

The four-arm results show both the benefit and its limits:

| Evaluation condition | Mean fraction of food collected |
| :--- | ---: |
| No obstacles | 88% |
| Obstacles, without local reflex | 21% |
| Obstacles, with local reflex | 67% |

The high-level policy is **trained without obstacles**. Adding the reflex at deployment recovers much of the lost performance without retraining that policy, although collection remains below the unobstructed result. The response handles contact locally, allowing the existing foraging decisions to remain useful.

## What this teaches us about soft control

The contribution is a way to combine methods with different strengths. Reinforcement learning handles sequences of discrete decisions. A mechanics-based neural controller provides fast reaching commands. Local feedback and physical compliance respond to disturbances where they occur.

These results come from a computational model, with food's horizontal coordinates on a grid compatible with the crawl step, simplified anchoring and collection, and frictionless obstacle contact. They establish a working control strategy in that setting, while hardware performance and more general arm dynamics remain open questions.

For soft robotics, the useful design principle is to make each layer solve a problem it can handle well. A central policy can coordinate a deformable body more effectively when reliable arm behaviors and local responses are already available.

## Paper and attribution

This post is based on **Hierarchical Control and Learning of a Foraging CyberOctopus**, by Chia-Hsien Shih, Noel Naughton, Udit Halder, Heng-Sheng Chang, Seung Hyun Kim, Rhanor Gillette, Prashant G. Mehta, and Mattia Gazzola. The paper appeared in [*Advanced Intelligent Systems*, 5(9), 2300088 (2023)](https://doi.org/10.1002/aisy.202300088), and was first published online on June 22, 2023.

Figures 1, 3, 4, and 7 are reproduced from the published paper, with surrounding page text and original captions removed and explanatory captions supplied here. The article is © 2023 The Authors, published by Wiley-VCH GmbH under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The octopus photograph within Figure 1 is separately credited to Anneli Salo under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

The paper provides code for [multiarm foraging](https://github.com/chshih2/Multi-arm-coordination-for-foraging) and [neural network energy shaping](https://github.com/chshih2/Real-time-control-of-an-octopus-arm-NNES). The BibTeX below cites the published article.
