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

<p>Transformer-based language models have fundamentally reshaped natural language processing. These models achieve remarkable performance across a wide range of language tasks, and a key reason for this success is the <em>self-attention mechanism</em>, which allows models to capture long-range dependencies without relying on recurrence or convolution. However, this architecture introduces a subtle but critical challenge:</p>
<blockquote>
<p>Self-attention is inherently permutation invariant: it treats the input as a set of tokens rather than an ordered sequence.</p>
</blockquote>
<p>Without additional structure, the model cannot distinguish between sentences that contain the same tokens but in different orders. For example: <span class="math display">\[
\textit{the dog chased the cat} \quad \text{vs.} \quad \textit{the cat chased the dog}
\]</span> Although both sentences contain identical words, their meanings differ dramatically because of word order. A pure attention mechanism, by itself, has no way to recognize this difference.</p>
<p>To address this issue, Transformer models incorporate <strong>positional encoding</strong>—additional vectors that encode the position of each token in the sequence. These encodings provide the model with information about token order, allowing attention mechanisms to reason about sequence structure.</p>
<p>Over time, positional encoding methods have evolved alongside the rapid growth of language models and their need to process longer contexts. In this post, we examine three broad categories of positional encoding approaches that have shaped modern language models. We also briefly discuss techniques for extending context length beyond the limits seen during training, before concluding with some final thoughts on the importance and performance of positional encoding in transformer architectures.</p>
<h2 id="variants-of-positional-encoding">Variants of Positional Encoding</h2>
<p>Since the introduction of the original Transformer, several positional encoding strategies have been proposed to improve model expressiveness, generalization, and scalability.</p>
<ol type="1">
<li><strong>Absolute Positional Embeddings</strong> – the original approach where each token position receives a dedicated positional vector.</li>
<li><strong>Attention with Relative Positional Representations</strong> – a method that models relative distances between tokens directly within the attention mechanism.</li>
<li><strong>Rotary Positional Transformations</strong> – a geometric approach that encodes positions through rotations applied to query and key vectors.</li>
</ol>
<p>While these methods differ in their implementation, they all share the same fundamental goal: to provide the model with information about token order so that it can capture the sequential structure of language.</p>
<h3 id="absolute-positional-embeddings">1. Absolute Positional Embeddings</h3>
<p>The original Transformer architecture introduces positional information by <strong>adding a position-dependent vector</strong> to each token embedding in <span class="math inline">\(\Real{\stateDim}\)</span>, where <span class="math inline">\(\stateDim\)</span> is the model embedding dimension. Formally,</p>
<p><span class="math display">\[
\state_t = \embedding(:, \observation_t) + \position_t
\]</span></p>
<p>where <span class="math inline">\(\embedding\in\Real{\stateDim\times \observationDim}\)</span> is the token embedding matrix, <span class="math inline">\(\observation_t\in\\{1,2,\ldots,\observationDim\\}\)</span> denotes the token index at position <span class="math inline">\(t\)</span> with <span class="math inline">\(\observationDim\)</span> denoting the total number of tokens in the tokenizer, <span class="math inline">\(\embedding(:,\observation_t)\in\Real{\stateDim}\)</span> is the corresponding token embedding, and <span class="math inline">\(\position_t\in\Real{\stateDim}\)</span> is the positional embedding for position <span class="math inline">\(t\)</span>. The resulting representation <span class="math inline">\(\state_t\in\Real{\stateDim}\)</span> is then passed to the attention mechanism for the key, query, and value computations.</p>
<p>The positional vectors <span class="math inline">\(\position_t\)</span> may either be <strong>learned parameters</strong> or defined using <strong>fixed sinusoidal functions</strong>. In either case, the positional encoding is added directly to the token representation before attention is applied.</p>
<p>While this method is simple and effective, it has an important limitation. Because the model learns positional vectors only for positions observed during training, it may struggle to generalize to longer sequences than those seen in the training data. This limitation motivated the development of more flexible approaches.</p>
<h3 id="attention-with-relative-positional-representations">2. Attention with Relative Positional Representations</h3>
<p>Relative positional encoding addresses the limitations of absolute embeddings by focusing on <strong>relative distances between tokens</strong>, rather than their absolute positions in the sequence. Instead of modifying the input embeddings, this approach incorporates positional information directly into the attention computation. The attention score <span class="math inline">\(\score_{t,\tau}\in\Real{}\)</span> between positions <span class="math inline">\(t\)</span> and <span class="math inline">\(\tau\)</span> (with <span class="math inline">\(\tau\leq t\)</span>) is defined as</p>
<p><span class="math display">\[
\score_{t,\tau} =
\query_t\cdot(\key_\tau+\relativeWeight_{t-\tau})
+
\relativeBias_{t-\tau}
\]</span></p>
<p>where <span class="math inline">\(\cdot\)</span> denotes the dot product, <span class="math inline">\(\query_t,\key_\tau\in\Real{\stateDim}\)</span> are the query and key vectors, <span class="math inline">\(\relativeWeight_{\smalldeltat}\in\Real{\stateDim}\)</span> is a relative positional weight vector, and <span class="math inline">\(\relativeBias_{\smalldeltat}\in\Real{}\)</span> is a scalar bias that also depends on the relative distance <span class="math inline">\(\deltat\)</span>. Both positional terms depend only on the distance <span class="math inline">\(\deltat = t-\tau\)</span>, rather than the individual positions <span class="math inline">\(t\)</span> and <span class="math inline">\(\tau\)</span>.</p>
<p>This formulation allows the model to learn how interactions between tokens vary with their relative separation. Because relative distances remain meaningful even for longer sequences, this method tends to generalize better to varying input lengths.</p>
<!-- Relative positional encodings are widely used in transformer variants such as **Transformer-XL, T5, and DeBERTa**. -->
<h3 id="rotary-positional-transformations">3. Rotary Positional Transformations</h3>
<p>Rotary Positional Transformations introduce a different perspective: rather than adding positional information to embeddings or attention scores, they encode position through <strong>geometric transformations applied to query and key vectors</strong>. Specifically, the query and key vectors are rotated according to their positions:</p>
<p><span class="math display">\[
\query_t&#39; = \exp{\maptoliealgebra{\rotatedAngle_t}}\query_t,
\quad
\key_\tau&#39; = \exp{\maptoliealgebra{\rotatedAngle_\tau}}\key_\tau
\]</span></p>
<p>where <span class="math inline">\(\rotatedAngle_t\in\angleSpace=[-\pi,\pi)^{\stateDim/2}\)</span> is a position-dependent vector of rotation angles, and <span class="math inline">\(\exp{\maptoliealgebra{\cdot}}:\angleSpace\to(\SO{2})^{\stateDim/2}\subset\Real{\stateDim\times\stateDim}\)</span> converts these angles into a block-diagonal rotation matrix.</p>
<p>The attention score is then computed using the rotated vectors:</p>
<p><span class="math display">\[
\score_{t,\tau} = \query_t&#39; \cdot \key_\tau&#39; = \query_t \cdot \exp{\maptoliealgebra{\rotatedAngle_t-\rotatedAngle_\tau}} \key_\tau
\]</span></p>
<p>Through these rotations, positional information is encoded in the relative phase differences <span class="math inline">\(\rotatedAngle_t-\rotatedAngle_\tau\)</span> between token representations. The rotation angles are typically determined by a fixed frequency schedule, allowing the encoding to extend naturally to arbitrary sequence lengths.</p>
<!-- This property makes RoPE particularly attractive for large language models, and it is used in architectures such as **LLaMA, Mistral, and Qwen**. -->
<h2 id="extending-context-length">Extending Context Length</h2>
<p>As language models scale, the ability to handle longer contexts becomes increasingly important. Training directly on extremely long sequences, however, is computationally costly. To address this challenge, researchers have developed techniques that extend a model’s effective context length beyond the range seen during training. These approaches are especially compatible with relative positional encoding methods, which represent positional information through relative distances between tokens rather than absolute positions.</p>
<p>One practical technique is <strong>position extrapolation via interpolation</strong>. Suppose a model is trained with context length <span class="math inline">\(T\)</span> but needs to process sequences of length <span class="math inline">\(T&#39; &gt; T\)</span>. For relative positional representations, we can simply interpolate the positional vectors to fit the new context length. <span class="math display">\[
\relativeWeight_{t-\tau}&#39; =
\relativeWeight_{(t-\tau)\frac{T}{T&#39;}},
\quad
\relativeBias_{t-\tau}&#39; =
\relativeBias_{(t-\tau)\frac{T}{T&#39;}}
\]</span> and the attention score becomes <span class="math display">\[
\score_{t,\tau} =
\query_t\cdot(\key_\tau+\relativeWeight_{t-\tau}&#39;)
+
\relativeBias_{t-\tau}&#39;
\]</span> The rotation angles in rotary positional transformations can be similarly interpolated to extend the effective context length without retraining the model: <span class="math display">\[
\score_{t,\tau} = \query_t \cdot \exp{\maptoliealgebra{\rotatedAngle_t&#39;-\rotatedAngle_\tau&#39;}} \key_\tau
\]</span> where <span class="math inline">\(\rotatedAngle_{t}&#39;= \rotatedAngle_{t\frac{T}{T&#39;}}\)</span> for any position <span class="math inline">\(t\)</span> in the extended context. This compresses positions into the range observed during training while preserving the learned positional structure, enabling models to operate effectively on longer sequences.</p>
<p>However, interpolation-based extrapolation introduces an important trade-off. By compressing positions into the range observed during training, the method effectively <strong>reduces the resolution of positional information</strong>. Tokens that are far apart in a long sequence may appear artificially closer after interpolation, which can blur the positional distinctions that the model learned during training. As a result, while interpolation often works well for moderate extensions of the context window, model performance may gradually degrade as the context length grows much larger than the training limit. In practice, these techniques typically remain effective within a limited multiple of the original training context, after which long-range reasoning and attention patterns may become less reliable.</p>
<h2 id="final-thoughts">Final Thoughts</h2>
<p>Positional encoding is a fundamental component of transformer-based language models. Without it, the self-attention mechanism cannot capture the sequential structure of language.</p>
<p>Over time, positional encoding techniques have evolved from simple additive embeddings to more sophisticated methods that modify the attention mechanism itself. Absolute embeddings provided the initial solution, relative representations improved generalization across sequence lengths, and rotary embeddings introduced a geometric formulation that is particularly effective for large language models.</p>
<p>As models increasingly need to process longer documents and conversations, techniques for extending context length have become an important complement to positional encoding design. Methods such as interpolation allow models to operate beyond their original training context, although they introduce trade-offs in positional resolution that may affect performance at very long ranges.</p>
<p>As language models continue to scale and are expected to reason over increasingly long documents, innovations in positional encoding and context extension techniques will remain central to enabling models to understand and generate coherent text over extended contexts.</p>
<hr />
<p>This post is mainly based on an ICLR blog post in 2025: <a href="https://iclr-blogposts.github.io/2025/blog/positional-embedding/">Positional Embeddings in Transformer Models: Evolution from Text to Vision Domains</a> and a survey paper from Computational Linguistics in 2022: <a href="https://direct.mit.edu/coli/article/48/3/733/111478/Position-Information-in-Transformers-An-Overview">Position information in transformers: An overview</a>.</p>
