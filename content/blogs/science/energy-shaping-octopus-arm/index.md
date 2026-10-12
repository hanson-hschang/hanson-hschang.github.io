+++
template = "post.html"
title = "Shaping Energy to Control a Muscular Octopus Arm"
description = "How muscle geometry and energy shaping turn reaching and grasping in three dimensions into a search for a useful equilibrium."
date = 2023-02-01
in_search_index = true
draft = false

[taxonomies]
tags = ["Soft Robotics", "Energy Shaping", "Optimal Control", "Biomechanics"]
categories = ["Research", "Paper"]

[extra]

[extra.post]
subtitle = "Letting the arm's mechanics carry it toward a useful shape"
thumbnail = "img/grasping.png"
thumbnail_alt = "A simulated muscular octopus arm twists and wraps around cylinders of different sizes and orientations."
social_image = "img/energy-landscape.png"
links = [
  { name = "Read the paper", url = "https://royalsocietypublishing.org/rspa/article/479/2270/20220593/56735/Energy-shaping-control-of-a-muscular-octopus-arm", icon_class = "bi bi-file-earmark-text" },
  { name = "arXiv preprint", url = "https://arxiv.org/abs/2209.04089", icon_class = "bi bi-file-earmark-pdf" },
  { name = "Research page", url = "https://mehta.mechse.illinois.edu/research/soft-robotics/energy-shaping-control", icon_class = "bi bi-globe" },
  { name = "Watch video", url = "#reaching-and-grasping-in-motion", icon_class = "bi bi-play-circle" },
]
bibtex = '''
@article{chang2023energy,
  title = {Energy-shaping control of a muscular octopus arm moving in three dimensions},
  author = {Chang, Heng-Sheng and Halder, Udit and Shih, Chia-Hsien and Naughton, Noel and Gazzola, Mattia and Mehta, Prashant G.},
  journal = {Proceedings of the Royal Society A: Mathematical, Physical and Engineering Sciences},
  volume = {479},
  number = {2270},
  pages = {20220593},
  year = {2023},
  doi = {10.1098/rspa.2022.0593},
  url = {https://doi.org/10.1098/rspa.2022.0593}
}
'''

[extra.post.teaser]
src = "img/energy-landscape.png"
alt = "Muscle activation changes the potential energy landscape, shifting the arm's equilibrium from a straight configuration to a curved one."
width = 1600
height = 641
caption = "**Control through an energy landscape.** Activating the muscles changes which arm shape is an equilibrium. Figure 3 from [Chang et al., arXiv:2209.04089v1](https://arxiv.org/abs/2209.04089v1)."

[extra.tex]
+++

An octopus arm has no rigid skeleton and no small set of joints to command. It can bend along its length, extend toward an object, and twist to bring its suckers into contact. That flexibility makes the arm a compelling model for soft robots, but it also raises a difficult control question: **how should its muscles work together to produce a useful shape?**

In our paper, [*Energy-shaping control of a muscular octopus arm moving in three dimensions*](https://doi.org/10.1098/rspa.2022.0593), Udit Halder, Chia-Hsien Shih, Noel Naughton, Mattia Gazzola, Prashant G. Mehta, and I approach this problem through energy. We model the arm and its muscles together, then choose muscle activations that make a task-specific shape an equilibrium of the combined system.

The resulting motion comes from the arm's mechanics. Once the activation pattern is applied, elastic forces, muscle forces, inertia, and damping determine how the arm moves toward its new resting configuration. We demonstrate this approach in simulations of reaching and grasping in three dimensions.

## Reaching and grasping in motion

<figure class="post__figure">
{{ <post.embed src="https://www.youtube-nocookie.com/embed/SQ_KViaDov0" title="Muscular octopus arm reaching and grasping in three dimensions" /> }}
<figcaption><strong>The muscular arm in motion.</strong> Watch the reaching and grasping simulations, or <a href="https://www.youtube.com/watch?v=SQ_KViaDov0">open the video on YouTube</a>.</figcaption>
</figure>

## Three muscle groups, many possible motions

The geometry of a muscle matters as much as its ability to contract. In an octopus arm, three major muscle groups turn local contraction into different kinds of deformation:

| Muscle group | Arrangement | Main mechanical role |
| :--- | :--- | :--- |
| Transverse | Across the arm, surrounding the central nerve cord | Narrows the cross-section and extends the arm through approximate volume conservation |
| Longitudinal | Along the arm, away from its center line | Shortens the arm and produces bending when activation is uneven across its sides |
| Oblique | Helically around the arm, with opposite handedness | Produces twisting together with other coupled deformations |

{{ <media.image page={page} path="img/musculature.png" width={1600} alt="Transverse muscles form green rings, longitudinal muscles run lengthwise in purple, and orange oblique muscles wind around the arm in opposite directions; insets show anatomical cross-sections." caption="**Geometry turns contraction into motion.** The virtual muscles follow the arrangement of the arm's major muscle groups. Anatomical cross-sections appear in the insets. Figure 2 from the preprint. [Open full-size figure](img/musculature.png)." full_size={true} /> }}

We describe the arm as a **Cosserat rod**. At each location along its center line, the model tracks both a position and the orientation of a small material frame. This lets it describe stretching, shearing, bending, and twisting in one continuum model.

Keeping track of orientation is essential. Two configurations can have similar center lines while presenting different sides of the arm to an object. To model a grasp with the suckers facing inward, we need to control that orientation as well as position.

The implementation uses one transverse activation field, four longitudinal fields, and two oblique fields, one for each handedness. Each field can vary along the arm. The oblique fibers of the same handedness share an activation, giving seven distributed controls overall.

## Muscles become part of the energy model

An elastic rod stores energy when it deforms. Its internal forces and bending or twisting moments can be obtained by differentiating that energy with respect to strain. Our key modeling step is to give the muscles a compatible description.

For muscle $m$, the paper constructs a scalar function $W^m$ whose strain derivatives generate its active force and moment. The construction incorporates the muscle's geometry and a force-length relation fitted to experimental data. Multiplying by its activation $u^m$ scales its contribution:

<div>
$$
\mathbf n^m=u^m\frac{\partial W^m}{\partial\boldsymbol\nu},
\qquad
\mathbf m^m=u^m\frac{\partial W^m}{\partial\boldsymbol\kappa}.
$$
</div>

Here, $\boldsymbol\nu$ describes shear and stretch, while $\boldsymbol\kappa$ describes bending and twist. The vectors $\mathbf n^m$ and $\mathbf m^m$ are the muscle's internal force and moment in the arm's local frame.

For a fixed spatial activation profile $\alpha^m(s)$, the combined potential energy becomes

<div>
$$
V(q;\alpha)=\int_0^L\left[
W^e(\varepsilon(s))+
\sum_m\alpha^m(s)W^m(s,\varepsilon(s))
\right]\,ds.
$$
</div>

The notation $q$ represents the arm's position and orientation along its length, $\varepsilon=(\boldsymbol\nu,\boldsymbol\kappa)$ collects its strains, and $W^e$ is the passive elastic energy density. The muscle term is written here with its dependence on muscle strain absorbed into $\varepsilon$.

This gives us a family of energy landscapes indexed by muscle activation. It is a mechanical representation of the actuator forces; it does not measure the biological energy consumed by muscle metabolism.

## Choose the equilibrium, then let the arm move

The picture at the top of this post captures the control idea. Before activation, a straight arm is at rest in its passive energy landscape. Activating the muscles reshapes that landscape, allowing a bent or twisted configuration to become a new equilibrium.

There is an important constraint: the available muscles determine which landscapes can be produced. A transverse muscle cannot apply an arbitrary sideways force, for example. In conventional energy-shaping design, reconciling a desired energy with these actuator restrictions leads to difficult equations called **matching conditions**.

Our muscle-energy formulation builds those restrictions into the family $V(q;\alpha)$. We search over physically available activations, with $0\leq\alpha^m(s)\leq1$, to find an equilibrium suited to the task. For the unloaded arm with a fixed base and free tip, the equilibrium condition balances active muscle loads against passive elastic loads.

The search minimizes a combination of activation effort and task error:

<div>
$$
J(\alpha,q)=
\frac12\sum_m\int_0^L[\alpha^m(s)]^2\,ds
+J_{\mathrm{task}}(q).
$$
</div>

For reaching, the task cost penalizes tip-position and tip-orientation errors. For grasping, it encourages the arm to approach the object and face its suckers toward it, while a penalty discourages penetration. The squared-activation term regularizes muscle effort; minimizing it is not a claim of optimal metabolic efficiency.

The algorithm alternates between three steps:

1. For the current activations, solve for equilibrium strains and reconstruct the arm from base to tip.
2. Propagate a costate from tip to base to determine how the task objective responds to changes along the arm.
3. Update the activations using that information, respecting their bounds, and repeat.

This is an optimal control calculation along the **spatial coordinate of the arm**. The pose evolves in $SE(3)$, the space of three-dimensional positions and rotations. A useful reduction expresses the costate through two three-component vectors with the interpretation of internal forces and moments.

After optimization, the activation profile is held constant in time. Muscle forces still change as the arm deforms because they depend on its current geometry and muscle lengths. With damping, the model's total mechanical energy is non-increasing along the motion. The paper uses this to argue local asymptotic stability under technical assumptions; a full functional-analytic proof for the infinite-dimensional system is left for future work.

## Reaching means getting the orientation right, too

The simulated arm is 20 cm long and tapers from a base radius of 1.2 cm to a tip radius of 0.12 cm. We discretize it into 100 rod elements in Elastica.

In a representative reaching movement, transverse activation extends the distal arm, longitudinal activation near the base bends it toward the target, and oblique activation twists it to orient the suckers. The three muscle groups cooperate to meet a position-and-orientation objective.

{{ <media.image page={page} path="img/reaching.png" width={1600} alt="A simulated arm reaches toward an orange target using transverse, longitudinal, and oblique activations. A 125-target workspace study shows position and orientation errors, including difficult distant and near-base targets." caption="**Reach, bend, and turn the sucker side toward the target.** The upper panels show the task and a representative movement; the lower panels characterize errors across 125 target positions. Figure 5 from the preprint. [Open full-size figure](img/reaching.png)." full_size={true} /> }}

We test 125 targets distributed within a cube of side length 20 cm. The largest position errors occur at distant corners outside the arm's reachable workspace. Targets close to the base also challenge the arm's ability to bend and twist at the same time.

The normalized orientation error stays below 0.1 in all tested cases. This is a specific matrix-based measure, $\|Q^*-Q(L)\|_F^2/8$, rather than an angular error in degrees or a percentage of successful reaches. The experiment shows how the controller performs across a workspace that includes physically difficult and unreachable targets.

## Wrapping around an object

Grasping asks more of the arm than bringing its tip to a point. A substantial length of the arm must approach the object, curve around it, and turn its sucker-facing side inward.

We express these requirements through an objective acting on the distal 70% of the arm, together with a non-penetration penalty. Longitudinal and oblique activation then produce a spiral-like configuration around a cylindrical target.

{{ <media.image page={page} path="img/grasping.png" width={1600} alt="An octopus-arm simulation wraps around a cylinder while turning the sucker-facing side inward. Additional tests vary cylinder radius from one to four centimeters and tilt cylinders in two directions." caption="**A grasp depends on shape and orientation.** The simulated arm wraps around cylinders with different radii and tilts. The lower plots compare position and director errors relative to the indicated reference cases. Figure 6 from the preprint. [Open full-size figure](img/grasping.png)." full_size={true} /> }}

The tests vary cylinder radius from 1 to 4 cm. Thinner cylinders are harder to wrap around: their surfaces require tighter bending, which competes with the activation-effort penalty. Separate tests keep the radius at 2 cm and vary the cylinder's tilt from $-60^\circ$ to $60^\circ$ about each of two axes.

Across those tilt tests, the position-error measure varies less than the orientation-error measure. The chosen objective places greater weight on proximity, so keeping the arm close to the cylinder can take priority over perfectly orienting the suckers.

Here, grasping means achieving the wrapping configuration in simulation. Sucker adhesion and sensing are outside this model, and the experiments do not test holding or lifting a load.

## What energy shaping gives us

The contribution is a connection between **anatomy, mechanics, and control design**. Muscle geometry determines forces and moments; a common energy description combines them with elasticity; optimization selects activations for a useful equilibrium. The arm's dynamics then produce the transition toward that configuration.

This provides a way to coordinate a highly deformable body without prescribing the full motion of every point along it. It also keeps the actuator constraints visible throughout the design.

The demonstrated tasks involve static targets and a simulated arm. Extending the approach to moving targets, sensory feedback, and neural control requires additional work. Still, the study gives a concrete starting point for soft robotic manipulation: design how the body wants to settle, and use its mechanics to help it get there.

## Paper and attribution

This post is based on **Energy-shaping control of a muscular octopus arm moving in three dimensions**, by Heng-Sheng Chang, Udit Halder, Chia-Hsien Shih, Noel Naughton, Mattia Gazzola, and Prashant G. Mehta. The paper appeared in [*Proceedings of the Royal Society A*, 479(2270), 20220593 (2023)](https://doi.org/10.1098/rspa.2022.0593).

The technical discussion and Figures 2, 3, 5, and 6 follow the [arXiv:2209.04089v1 preprint](https://arxiv.org/abs/2209.04089v1), submitted September 9, 2022. The figures are reproduced in full from that version, with surrounding page text removed. The arXiv version is distributed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/). The [research group page](https://mehta.mechse.illinois.edu/research/soft-robotics/energy-shaping-control) includes a video of three-dimensional reaching and grasping. The BibTeX below cites the published paper.
