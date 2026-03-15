+++
title = 'Positional Encoding in Transformer Language Models'
date = 2026-02-13
in_search_index = true
draft = false
[taxonomies]
tags = ['Positional Encoding', 'Transformer', 'Language Models']
categories = ['blogs', 'science']
[extra]
excerpt = """
An exploration of the role of positional encodings in transformer language models, including their construction and impact on model performance.
"""
[extra.tex.macros]
'\transpose' = '\intercal'
'\Real' = '\mathbb{R}^{#1}'
'\stateDim' = '\mathsf{d}'
'\observationDim' = '\mathsf{m}'
'\state' = 'x'
'\embedding' = 'C'
'\observation' = 'Z'
'\position' = 'p'
'\score' = 's'
'\query' = 'q'
'\key' = 'k'
'\deltat' = '{\vartriangle\hspace{-3pt}t}'
'\smalldeltat' = '{\vartriangle t}'
'\relativeWeight' = 'w'
'\relativeBias' = 'b'
'\SO' = '\textnormal{SO}({#1})'
'\maptoliealgebra' = '{\left(#1\right)_{\wedge}}'
'\rotatedAngle' = '\theta'
'\angleSpace' = '\mathcal{\Theta}'
'\exp' = '\textnormal{ exp}\left(#1\right)'
+++

Transformer-based language models have fundamentally reshaped natural language processing. 
These models achieve remarkable performance across a wide range of language tasks, and a key reason for this success is the *self-attention mechanism*, which allows models to capture long-range dependencies without relying on recurrence or convolution.
However, this architecture introduces a subtle but critical challenge:

> Self-attention is inherently permutation invariant: it treats the input as a set of tokens rather than an ordered sequence.

Without additional structure, the model cannot distinguish between sentences that contain the same tokens but in different orders. 
For example:
$$
\textit{the dog chased the cat} \quad \text{vs.} \quad \textit{the cat chased the dog}
$$
Although both sentences contain identical words, their meanings differ dramatically because of word order. 
A pure attention mechanism, by itself, has no way to recognize this difference.

To address this issue, Transformer models incorporate **positional encoding**—additional vectors that encode the position of each token in the sequence. 
These encodings provide the model with information about token order, allowing attention mechanisms to reason about sequence structure.

Over time, positional encoding methods have evolved alongside the rapid growth of language models and their need to process longer contexts.
In this post, we examine three broad categories of positional encoding approaches that have shaped modern language models. 
We also briefly discuss techniques for extending context length beyond the limits seen during training, before concluding with some final thoughts on the importance and performance of positional encoding in transformer architectures.


## Variants of Positional Encoding

Since the introduction of the original Transformer, several positional encoding strategies have been proposed to improve model expressiveness, generalization, and scalability.

1. **Absolute Positional Embeddings** – the original approach where each token position receives a dedicated positional vector.
2. **Attention with Relative Positional Representations** – a method that models relative distances between tokens directly within the attention mechanism.
3. **Rotary Positional Transformations** – a geometric approach that encodes positions through rotations applied to query and key vectors.

While these methods differ in their implementation, they all share the same fundamental goal: to provide the model with information about token order so that it can capture the sequential structure of language.

### 1. Absolute Positional Embeddings

The original Transformer architecture introduces positional information by **adding a position-dependent vector** to each token embedding in $\Real{\stateDim}$, where $\stateDim$ is the model embedding dimension.
Formally,

$$
\state_t = \embedding(:, \observation_t) + \position_t
$$

where $\embedding\in\Real{\stateDim\times \observationDim}$ is the token embedding matrix, $\observation_t\in\\{1,2,\ldots,\observationDim\\}$ denotes the token index at position $t$ with $\observationDim$ denoting the total number of tokens in the tokenizer, $\embedding(:,\observation_t)\in\Real{\stateDim}$ is the corresponding token embedding, and $\position_t\in\Real{\stateDim}$ is the positional embedding for position $t$.
The resulting representation $\state_t\in\Real{\stateDim}$ is then passed to the attention mechanism for the key, query, and value computations.

The positional vectors $\position_t$ may either be **learned parameters** or defined using **fixed sinusoidal functions**. In either case, the positional encoding is added directly to the token representation before attention is applied.

While this method is simple and effective, it has an important limitation. Because the model learns positional vectors only for positions observed during training, it may struggle to generalize to longer sequences than those seen in the training data.
This limitation motivated the development of more flexible approaches.

### 2. Attention with Relative Positional Representations

Relative positional encoding addresses the limitations of absolute embeddings by focusing on **relative distances between tokens**, rather than their absolute positions in the sequence.
Instead of modifying the input embeddings, this approach incorporates positional information directly into the attention computation. 
The attention score $\score_{t,\tau}\in\Real{}$ between positions $t$ and $\tau$ (with $\tau\leq t$) is defined as

$$
\score_{t,\tau} =
\query_t\cdot(\key_\tau+\relativeWeight_{t-\tau})
+
\relativeBias_{t-\tau}
$$

where $\cdot$ denotes the dot product, $\query_t,\key_\tau\in\Real{\stateDim}$ are the query and key vectors, $\relativeWeight_{\smalldeltat}\in\Real{\stateDim}$ is a relative positional weight vector, and $\relativeBias_{\smalldeltat}\in\Real{}$ is a scalar bias that also depends on the relative distance $\deltat$.
Both positional terms depend only on the distance $\deltat = t-\tau$, rather than the individual positions $t$ and $\tau$.

This formulation allows the model to learn how interactions between tokens vary with their relative separation. Because relative distances remain meaningful even for longer sequences, this method tends to generalize better to varying input lengths.

<!-- Relative positional encodings are widely used in transformer variants such as **Transformer-XL, T5, and DeBERTa**. -->

### 3. Rotary Positional Transformations

Rotary Positional Transformations introduce a different perspective: rather than adding positional information to embeddings or attention scores, they encode position through **geometric transformations applied to query and key vectors**.
Specifically, the query and key vectors are rotated according to their positions:

$$
\query_t' = \exp{\maptoliealgebra{\rotatedAngle_t}}\query_t,
\quad
\key_\tau' = \exp{\maptoliealgebra{\rotatedAngle_\tau}}\key_\tau
$$

where $\rotatedAngle_t\in\angleSpace=[-\pi,\pi)^{\stateDim/2}$ is a position-dependent vector of rotation angles, and $\exp{\maptoliealgebra{\cdot}}:\angleSpace\to(\SO{2})^{\stateDim/2}\subset\Real{\stateDim\times\stateDim}$ converts these angles into a block-diagonal rotation matrix.

The attention score is then computed using the rotated vectors:

$$
\score_{t,\tau} = \query_t' \cdot \key_\tau' = \query_t \cdot \exp{\maptoliealgebra{\rotatedAngle_t-\rotatedAngle_\tau}} \key_\tau
$$

Through these rotations, positional information is encoded in the relative phase differences $\rotatedAngle_t-\rotatedAngle_\tau$ between token representations. 
The rotation angles are typically determined by a fixed frequency schedule, allowing the encoding to extend naturally to arbitrary sequence lengths.

<!-- This property makes RoPE particularly attractive for large language models, and it is used in architectures such as **LLaMA, Mistral, and Qwen**. -->


## Extending Context Length

As language models scale, the ability to handle longer contexts becomes increasingly important. 
Training directly on extremely long sequences, however, is computationally costly. 
To address this challenge, researchers have developed techniques that extend a model’s effective context length beyond the range seen during training. 
These approaches are especially compatible with relative positional encoding methods, which represent positional information through relative distances between tokens rather than absolute positions.

One practical technique is **position extrapolation via interpolation**. 
Suppose a model is trained with context length $T$ but needs to process sequences of length $T' > T$. 
For relative positional representations, we can simply interpolate the positional vectors to fit the new context length.
$$
\relativeWeight_{t-\tau}' =
\relativeWeight_{(t-\tau)\frac{T}{T'}},
\quad
\relativeBias_{t-\tau}' =
\relativeBias_{(t-\tau)\frac{T}{T'}}
$$
and the attention score becomes
$$
\score_{t,\tau} =
\query_t\cdot(\key_\tau+\relativeWeight_{t-\tau}')
+
\relativeBias_{t-\tau}'
$$
The rotation angles in rotary positional transformations can be similarly interpolated to extend the effective context length without retraining the model:
$$
\score_{t,\tau} = \query_t \cdot \exp{\maptoliealgebra{\rotatedAngle_t'-\rotatedAngle_\tau'}} \key_\tau
$$
where $\rotatedAngle_{t}'= \rotatedAngle_{t\frac{T}{T'}}$ for any position $t$ in the extended context.
This compresses positions into the range observed during training while preserving the learned positional structure, enabling models to operate effectively on longer sequences.

However, interpolation-based extrapolation introduces an important trade-off. 
By compressing positions into the range observed during training, the method effectively **reduces the resolution of positional information**. 
Tokens that are far apart in a long sequence may appear artificially closer after interpolation, which can blur the positional distinctions that the model learned during training. 
As a result, while interpolation often works well for moderate extensions of the context window, model performance may gradually degrade as the context length grows much larger than the training limit. 
In practice, these techniques typically remain effective within a limited multiple of the original training context, after which long-range reasoning and attention patterns may become less reliable.


## Final Thoughts

Positional encoding is a fundamental component of transformer-based language models. 
Without it, the self-attention mechanism cannot capture the sequential structure of language.

Over time, positional encoding techniques have evolved from simple additive embeddings to more sophisticated methods that modify the attention mechanism itself. 
Absolute embeddings provided the initial solution, relative representations improved generalization across sequence lengths, and rotary embeddings introduced a geometric formulation that is particularly effective for large language models.

As models increasingly need to process longer documents and conversations, techniques for extending context length have become an important complement to positional encoding design. 
Methods such as interpolation allow models to operate beyond their original training context, although they introduce trade-offs in positional resolution that may affect performance at very long ranges.

As language models continue to scale and are expected to reason over increasingly long documents, innovations in positional encoding and context extension techniques will remain central to enabling models to understand and generate coherent text over extended contexts.

---

This post is mainly based on an ICLR blog post in 2025: [Positional Embeddings in Transformer Models: Evolution from Text to Vision Domains](https://iclr-blogposts.github.io/2025/blog/positional-embedding/) and a survey paper from Computational Linguistics in 2022: [Position information in transformers: An overview](https://direct.mit.edu/coli/article/48/3/733/111478/Position-Information-in-Transformers-An-Overview).



