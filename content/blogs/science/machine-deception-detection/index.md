+++
template = "post.html"
title = "A Polygraph for Language Models"
description = """
Can a language model's internal activity reveal deception? 
A look at early experiments and a proposal for making detector alarms more reliable.
"""
date = 2026-10-11
in_search_index = true
draft = false

[taxonomies]
tags = ["Large Language Models", "AI Safety", "Deception Detection", "Uncertainty Quantification"]
categories = ["Research", "White Paper"]

[extra]
breadcrumb_title = "Machine Deception Detection"

[extra.post]
subtitle = "Accuracy and uncertainty in machine deception detection"
thumbnail = "img/polygraph-examination.png"
thumbnail_alt = "A polygraph analogy connects training on known answers, calibration on honest answers, and detection on unknown answers."
links = [
  { name = "White paper", url = "machine-deception-detection-white-paper.pdf", icon_class = "bi bi-file-earmark-pdf" },
  { name = "Cite", action = "copy-bibtex", icon_class = "bi bi-quote" },
]
bibtex = '''
@techreport{chang2026accuracy,
  title = {Accuracy and Uncertainty in Machine Deception Detection},
  author = {Chang, Heng-Sheng},
  institution = {Coordinated Science Laboratory, University of Illinois Urbana-Champaign},
  type = {Research white paper},
  year = {2026},
  month = oct,
}
'''

[extra.post.teaser]
src = "img/polygraph-examination.png"
alt = "Three stages compare a human polygraph with a machine detector: learn from labeled honest and deceptive answers, set a threshold using honest answers, and score an unknown answer."
width = 1800
height = 446
full_size = true
caption = """
**Learn, calibrate, detect.** 
Learn from known examples, calibrate on honest examples, then examine new answers. 
The machine detector reads internal embeddings from a language model, while the polygraph reads physiological signals from a human. 
Both aim to catch deception while keeping false alarms rare.
"""
+++

Imagine a language model acting as a trading assistant. It uses confidential information to make a trade, then tells its manager that the decision came from ordinary market analysis. The report sounds plausible. Its wording alone may give little reason to suspect that something was concealed.

> Could the model's internal activity provide another clue? And if a detector raises an alarm, how much should we trust that detector's decision? 

In this white paper, I propose a **Machine Deception Detector** that tackles both questions. 
The goal is to catch deceptive responses while keeping false alarms rare, and to reveal when the detector's own judgment is unstable.

This is work in progress. 
The early experiments show why these questions matter; the full detector and its broader evaluation are still ahead.

## Looking beyond the words

As a language model processes text, it passes information through many layers. 
The numerical patterns inside those layers offer another source of evidence alongside the words in the answer. 
A small detector (compared to the size of the language model) can learn to read those patterns while the language model itself stays unchanged.

The polygraph analogy gives us a useful workflow. 
First, learn from examples labeled honest or deceptive. 
Next, use a separate set of honest answers to decide how strong a signal should be before it triggers an alarm. 
Finally, examine new answers.

The analogy has limits. 
An internal signal is a clue to investigate, not proof of a lie. 
Here, deception means concealing information or misreporting what a model is taken to know. 
An ordinary factual mistake does not, by itself, establish deception.

## Finding the useful features

A detector has to decide where to look. 
Should it read one layer or several? 
Should it consider the whole answer equally, look for a pattern that persists across the answer, or focus on the most suspicious passage?

The proposal combines information across layers and lets the detector learn from labels attached to whole responses. 
That matters because an otherwise ordinary answer might contain just one misleading claim.

The first experiments also suggest that a detector can rely on a smaller set of signals. 
The figure below compares two ways of training it: **ridge regression**, which tends to spread weight across many signals, and **lasso regression**, which encourages a more selective readout.

{{ <media.image page={page} path="img/probe-weights.png" width={512} alt="Figure 2a, titled Trained Detectors' Weights. Two heatmaps compare detectors that spread weight across many internal signals with detectors that focus on fewer signals. The more selective version has a much sparser pattern." caption="**Concentrated Deception Embedding Feature.** On Qwen3-8B, the lasso detectors concentrate their weights much more than the ridge detectors. Darker marks indicate stronger weights; the middle plot compares their concentration. This supports exploring selective readouts, but does not identify a unique deception circuit." full_size={true} /> }}

## Better scores need steadier judgments

The early tests involve two situations: 
**Insider Trading**, where a model conceals its use of an insider tip, and **Convincing Game**, where it claims a trait it lacks. 
These experiments read one layer at a time and report the best-performing layer for each setup. 
They provide a starting point for the proposed detector that combines layers.

The two panels below tell a connected story.
 **How we build a detector affects its performance, and training it again can change the result.**

{{ <media.image page={page} path="img/detector-performance.png" width={512} alt="Two related performance plots. The left compares ways to combine information and train a detector. The right shows that repeating training can produce widely different scores, including a Qwen3-4B run near chance." caption="**Design choices and repeatability belong together.** Left: different regularization and averaging choices change performance on Qwen3-8B. Right: six independent training runs per model size reveal how much results vary. Both panels use AUROC, a measure of how well the detector separates honest and deceptive examples: 0.5 is chance and 1 is perfect separation." full_size={true} /> }}

On the left, most choices work well on Convincing Game, but Insider Trading is harder. 
Focusing on fewer signals helps with some ways of combining evidence and hurts with another. 
A good detector needs these choices to work together.

On the right, the same training recipe is repeated with different random starting points. 
For the smallest model shown, one Insider Trading run scores **0.59**, while another reaches about **0.93**. 
One promising run can therefore give an incomplete picture of how reliable the method is.

These scores measure how well the detector ranks examples. A score of 0.93 does not mean it catches 93% of lies. 
To know how it would behave in use, we also need to decide when to sound the alarm.

## An alarm should earn trust

If a detector flags too many honest answers, reviewers will soon be overwhelmed. 
The proposal aims for roughly **one false alarm per 1,000 honest answers** on traffic like the examples used to set its threshold. 
This is a target for the next experiments, rather than a result established by the pilot plots.

That qualification matters. 
A detector calibrated on everyday questions may react differently to an honest discussion of misconduct. 
Testing it on new situations is essential.

There is a second check: train several detectors independently and compare their judgments. 
This group is called an **ensemble**. 
When its members give a response consistently high scores, the alarm is more stable. 
When they disagree, the system treats that disagreement as a reason for caution.

Agreement still does not establish truth. 
Several detectors can learn the same shortcut and make the same mistake. 
The research question is whether their disagreement helps identify unreliable alarms on unfamiliar tasks.

## What comes next?

The planned study will test six Qwen3 model sizes across five kinds of deception. 
It will measure both the deceptive responses caught and the honest responses mistakenly flagged.

A central challenge is moving beyond examples that explicitly tell a model to deceive. 
A detector might learn to recognize that instruction instead of deception more generally. 
It needs to work when a model has a reason to hide information without being directly told to lie.

Another challenge comes from using stored responses written by other models. 
The Qwen3 model reading a response may not know what its original author knew. 
Generating new examples with each model would help make that comparison clearer.

The next step is to establish whether these detectors produce useful, repeatable alarms across those different situations. 
That would give us a stronger basis for deciding when an apparently convincing answer deserves a closer look.
