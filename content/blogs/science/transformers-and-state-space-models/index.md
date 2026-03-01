+++
title = 'Transformers and State Space Models: A Connection in Sequential Data Modeling'
date = 2026-02-28
in_search_index = true
draft = false
[taxonomies]
tags = ['Transformer', 'State Space Models', 'Sequential Data']
categories = ['blogs', 'science']
[extra]
excerpt = """
A dual perspective on how decoder-only Transformers and State Space Models can be viewed as two sides of the same coin in modeling sequential data, with implications for attention mechanisms and efficient algorithms.
"""
[extra.tex.macros]
'\defined' = '\coloneqq'
'\transpose' = '\intercal'
'\elementwiseMultiply' = '\circ'
'\state' = 'h'
'\output' = 'y'
'\input' = 'v'
'\Key' = 'K'
'\Query' = 'Q'
'\Input' = 'V'
'\Output' = 'Y'
'\StructuredMatrix' = 'M'
'\Mask' = 'L'
'\Order' = '\mathsf{O}'
+++

Over the past few years, [decoder-only Transformers](https://arxiv.org/pdf/2005.14165) have dominated sequence modeling, especially in language modeling. 
At the same time, state space models, including architectures like [Mamba](https://arxiv.org/abs/2312.00752), have emerged as compelling alternatives with linear-time scaling and strong long-range modeling capabilities.
This [research](https://arxiv.org/pdf/2405.21060) claims a surprising and elegant connection between these two paradigms, showing that they can be viewed as two sides of the same coin on sequential data modeling.

## The Key Insight: Structured State Space Duality

This dual perspective connects three components:

1. **State space models** (defined via recurrences)
2. **Attention mechanisms** (defined via pairwise interactions)
3. **Structured matrices** (algebraic objects with fast multiplication)

> Together, these reveal that State Space Models (linear recurrent form) and Attention Mechanisms (quadratic parallel form) are connected through multiplication of Structured Matrices.

The authors show that the forward pass of a state space model can be expressed as a multiplication of a structured matrix with the input sequence, which shares the same form as the attention mechanism with a causal mask. 

{{ image(path="img/structured-state-space-duality.jpg", width=500, alt="Structured State Space Duality") }}

## Two Views of the Structured Matrices

The paper reveals that both state space models and attention mechanisms can be viewed as multiplications with structured matrices.

### View 1: State Space Models as Structured Matrices

A structured SSM is typically defined via a recurrence of state evolution and output generation:
$$
\begin{align*}
  \state_{t+1} &= A_t \state_t + B_t \input_t\\\\
  \output_t &= C_t \state_t
\end{align*}
$$
where $\state_t$, $\input_t$, and $\output_t$ are the hidden state, input value, and output observation at time $t$, respectively.
This looks purely recurrent and sequential.
However, the authors show that the entire sequence of outputs can be expressed as a single multiplication of a structured matrix $\StructuredMatrix$ (constructed from $A_t$, $B_t$, and $C_t$) with the input sequence $\Input\defined\input_{1:T}$ and output sequence $\Output\defined\output_{1:T}$:
$$
\Output = \StructuredMatrix \Input
$$
where $T$ is the sequence length.
This means that the state space model can be viewed as a single matrix multiplication, where the structured (lower triangular) matrix encodes the dynamics of the system.

{{ image(path="img/state-space-model.png", width=1000, alt="Structured State Space Duality") }}

### View 2: Attention Mechanisms as Structured Matrices

A standard masked attention is typically written:
$$
\Output = ((\Query\Key^\transpose)\elementwiseMultiply\Mask)\Input = \StructuredMatrix\Input
$$
where $\elementwiseMultiply$ is an elementwise multiplication operator, $\Query$, $\Key$, $\Input$, and $\Output$ are the query, key, value, and output sequences, $\Mask$ is a structured mask, and $\StructuredMatrix$ is the resulting structured matrix after elementwise masking.
This is a purely parallel and non-recurrent formulation.
However, the authors show that this can also be viewed as a multiplication with a structured matrix $\StructuredMatrix$ that encodes the attention weights and the causal mask, making a connection to the recurrence structure from the state space models (view 1).

{{ image(path="img/masked-attention.png", width=1000, alt="Masked Attention") }}

## An Efficient Algorithm for Structured Matrix Multiplication

The authors leverage the structure matrix to derive an efficient algorithm through a low-rank decomposition of the structured matrix $\StructuredMatrix$ into low-rank block matrices.

{{ image(path="img/efficient-algorithm.jpg", width=1000, alt="Masked Attention") }}

The resulting algorithm is more efficient than naive attention on both training and inference, with the following complexity:

| | $\quad$ Attention $\quad$ | $\quad$ State Space Models $\quad$ | $\quad$ Structured Matrices $\quad$ |
|:--|:-:|:-:|:-:|
| Training FLOPS | $\Order(T^2N)$ | $\Order(TN^2)$ | $\Order(TN^2)$ |
| Inference FLOPS | $\Order(TN)$ | $\Order(N^2)$ | $\Order(N^2)$ |
| (Naive) memory | $\Order(T^2)$ | $\Order(TN^2)$ | $\Order(TN)$ |
| Matrix Multiplication | $\checkmark$ |  | $\checkmark$ |

## Final Thoughts

This work reframes the landscape of sequence modeling.
Instead of asking: "Should we use attention or recurrence?", we can now ask: "Which structured matrix representation best fits our constraints?"
The SSD framework provides the language and tools to explore that space rigorously.
As sequence lengths continue to grow and hardware constraints dominate training costs, this unification could shape the next generation of foundation models.

---

This post is based on [Transformers are SSMs: Generalized Models and Efficient Algorithms through Structured State Space Duality](https://arxiv.org/pdf/2405.21060) by Prof. Tri Dao and Prof. Albert Gu, and is slightly adapted for a general audience.