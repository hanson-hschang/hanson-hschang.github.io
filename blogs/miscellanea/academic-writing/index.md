---
title: 'Academic Writing'
date: 2019-02-17
# modified: 2019-02-20
permalink: academic_writing
toc: false
excerpt: "Concepts and key points in writing academic papers"
header: 
  teaser: ""
tags:
  - Academic
  - Writing
mathjax: true
# author_profile: false
# sidebar:
#   title: "ML Glossary"
#   nav: sidebar-glossary
---

{% include base_path %}

The goal of mathematical optimization (also called mathematical programming), is to find a minima or maxima of an objective function $f(x)$.
The "best" optimization algorithm, is very problem specific and depends on the objective function to minimize and the type of constraints the solution has to satisfy. In mathematics and machine learning, optimization problems are usually stated in terms of minimization, which is why I will focus on minimization. Importantly, if you want to maximize $f(x)$ you can equivalently minimize $f'(x)=-f(x)$.

The optimization problems are often separated into a large number of overlapping sets of problems. In this blog I will focus on a few key distinctions between sets of problems: 

* **Convex Optimization** vs **Non-Convex Optimization**: The former consists of the sets of problems that deal with a convex objective function and set of constraints. The latter is a lot harder and contains all other problems. Current non-convex algorithms usually don't have nice convergence guarantees.
* **Discrete Optimization** vs **Continuous Optimization**: as suggested by the name, some of the variables in discrete optimization are restricted to be discrete. Discrete optimization is often separated into *combinatorial optimization* (*e.g.* on graph structures) and *integer programming* (linear programming with integer variables). Discrete optimization tend to be harder than continuous optimization, which contain only continuous variables.
* **Finite terminating algorithms** vs **Iterative methods** vs **Heuristic-based models**: the first type of algorithms terminate after a finite number of steps. Iterative methods converge to a solution. Heuristic based methods is any algorithm that is not guaranteed to converge mathematically, but is still very useful in practice.
* **Unconstrained Optimization** vs **Constrained Optimization**: whether or not there are constraints on the variables of the objective function. The constraints might be *hard* (required to be satisfied) or *soft*, in which case the objective function is penalized by the extent that the constraints are not satisfied.
* **Deterministic Optimization** vs **Stochastic Optimization**: whether the data is assumed to be noisy or not. The latter is extremely useful in practice as most data is noisy.
* **Linear Programming** vs **Non-Linear Programming**: The former consists of the sets of problems that have a linear objective functions and only linear constraints. Non-linear programming consists of all other problems, and can be convex or not.
* $n^{th}$ **Order Algorithms**: Which distinguishes which order derivative the algorithm is using. In optimization the most common are:
    - *Zero-order optimization algorithm* (=derivative free): use only the function values. This has to be used if the explicit function form is not given (*i.e.* black-box optimization).
    - *First-order optimization algorithm*: these algorithms optimize the objective function by taking advantage of the derivatives, which says how a function is increasing or decreasing in every direction. This class of algorithm is the most used in machine learning problems.
    - *Second-order optimization algorithm*: these algorithms use the Hessian to know about the curvature of the function.


:mag: <span class='note'>Side Notes</span>: As optimization is crucial for many different fields, the vocabulary and conventions are not really standardize. For example $f(x)$, is often called the objective function, the loss function, or the cost function when it is minimized. And is called the utility or fitness function when it has to be maximized. In physics and computer vision, it is often called the energy function.
