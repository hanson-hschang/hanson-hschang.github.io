+++
title = "How regularization affects the critical points in linear neural networks"
date = 2018-11-08
updated = 2019-02-20
in_search_index = true
draft = false
tag = ["Neural Networks", "Optimality"]
category = ["blogs", "science"]
[extra]
excerpt = "The existence and optimality properties of the critical points of the linear neural networks with mean-squared loss function in the face of regularization."
+++

$\newcommand{\transpose}{\intercal}$
$\newcommand{\Real}[1]{\mathbb{R}^{#1}}$
$\newcommand{\expectation}[1]{\mathsf{E}\left[#1\right]}$
$\newcommand{\dif}{\mathrm{d}}$

Given an input initial random vector $X_0\in\Real{n}$ with $p_X$ distribution and covariance matrix $\Sigma_{X_0}=\expectation{X_0{X_0}^\transpose}$. Assume the input-output model is in the following linear form: $$Z=RX_0+\xi$$ where $\xi\in\Real{n}$ is the noise and $Z\in\Real{n}$ is the output. In addition, the noise $\xi$ is assumed to have $p_\xi$ distribution and be independent to the input $X_0$, i.e. $\expectation{\xi{X_0}^\transpose}=0$. The problem is using i.i.d. input-output samples $\{({X_0}^{(k)},Z^{(k)})\}_{k=1}^K$ to learn the weights of a linear feed-forward neural network $$\dfrac{\dif X_t}{\dif t}=A_tX_t$$ in order to match the input-output relation $R$. Note that $A_t$ are the network weights, $t$ denotes the input layer with at most depth $T$, and $K$ is the total number of training samples.

Consider the following regularized form of the optimization problem: 
$$
\begin{align*}
\underset{A_t}{\textsf{minimize}}\quad&\text{J}[A_t]=\expectation{\lambda\int_0^T\dfrac{1}{2}\text{tr}({A_t}^\transpose A_t)\ \dif t+\dfrac{1}{2}(X_T-Z)^2}\\
\textsf{subject to}\quad&\dfrac{\dif X_t}{\dif t}=A_tX_t,\ X_0\textsf{ given}
\end{align*}
$$
where $(\cdot)^2$ denotes the dot product of itself, and $\lambda\geq0$ is a regularization parameter.

To minimize $A_t$, we consider the Lagrange multiplier $Y_t$, a random process $[0,T]\rightarrow\Real{n}$, s.t. 
$$
\mathcal{L}(X_t,A_t,Y_t)=\text{J}[A_t]+\expectation{\int_0^T{Y_t}^\transpose\left(\dfrac{\dif X_t}{\dif t}-A_tX_t\right)\ \dif t}
$$
then we have the necessary conditions: $\dfrac{\partial\mathcal{L}}{\partial Y_t}=0$ that is
$$
\begin{align}
\expectation{\int_0^T{\delta Y_t}^\transpose\left(\dfrac{\dif X_t}{\dif t}-A_tX_t\right)\ \dif t}=0,\quad\forall\ \delta Y_t
\end{align}
$$
$\dfrac{\partial\mathcal{L}}{\partial X_t}=0$ that is $\expectation{X_T-Z+Y_T}=0$ for $t=T$ and for $t\neq T$
$$
\begin{align}
\expectation{-\displaystyle\int_0^T\left(\dfrac{\dif Y_t}{\dif t}+{A_t}^\transpose Y_t\right)^\transpose \delta X_t\ \dif t},\quad \forall\ \delta X_t
\end{align}
$$
and $\dfrac{\partial\mathcal{L}}{\partial A_t}=0$ that is
$$
\begin{align}
\expectation{\int_0^T(\lambda A_t-Y_t{X_t}^\transpose)\ \dif t}=0
\end{align}
$$
Note that 
$$
\int_0^T{Y_t}^\transpose\dfrac{\dif X_t}{\dif t}\ \dif t={Y_T}^\transpose X_T-{Y_0}^\transpose X_0-\int_0^T{\dfrac{\dif Y_t}{\dif t}}^\transpose X_t\ \dif t.
$$
Therefore, from (1), (2) and (3), we have 
$$
\begin{align}
\dfrac{\dif X_t}{\dif t}&=\ \ \ A_tX_t,\quad\textsf{with }X_0\textsf{ given}\\
\dfrac{\dif Y_t}{\dif t}&=-{A_t}^\transpose Y_t,\quad\textsf{with }Y_T=Z-X_T\\
A_t&=\dfrac{1}{\lambda}\expectation{Y_t{X_t}^\transpose}\\
\end{align}
$$

Next, we would like to solve the 3 differential equation. We start with assuming the solution of equations (4) and (5) in the form of 
$$
\begin{align}
X_t&=\phi_{t;0}X_0\\
Y_t&={\phi_{T;t}}^\transpose Y_T={\phi_{T;t}}^\transpose(Z-X_T)={\phi_{T;t}}^\transpose(RX_0+\xi-\phi_{T;0}X_0)
\end{align}
$$
and also first, take the derivative of both sides of (6) with respect to $t$ and next, substitute the differentiate terms with equations (4) and (5), one obtain 
$$
\begin{align}
\dfrac{\dif A_t}{\dif t}=-{A_t}^\transpose A_t+A_t{A_t}^\transpose
\end{align}
$$

Since the differentiation of $A_t$ is a symmetric matrix, we decomposing $A_t$ into the combination of symmetric matrix $S_t$ and skew-symmetric matrix $\bar S_t$: 
$$
A_t=\dfrac{A_t+{A_t}^\transpose}{2}+\dfrac{A_t-{A_t}^\transpose}{2}=S_t+\bar S_t
$$
and guess that the differentiation result of the skew-symmetric matrix $\bar S_t$ should be 0. The derivatives of $S_t$ and $\bar S_t$ are 
$$
\dfrac{\dif S_t}{\dif t}=\dfrac{\dif}{\dif t}\dfrac{A_t+{A_t}^\transpose}{2}=-{A_t}^\transpose A_t+A_t{A_t}^\transpose
$$
$$
\dfrac{\dif \bar S_t}{\dif t}=\dfrac{\dif}{\dif t}\dfrac{A_t-{A_t}^\transpose}{2}=0\qquad\qquad\qquad\quad
$$
which matches our assumption. We can further rewrite $\dfrac{\dif S_t}{\dif t}$ in terms of $S_t$ and $\bar S_t$: 
$$
\dfrac{\dif S_t}{\dif t}=2(\bar S_tS_t-S_t\bar S_t)=MS_t-S_tM
$$
where $M=2\bar S_t=2\bar S_0$ is a constant matrix (i.e. not a matrix function of time $t$). From here, we can have the general solution of $S_t$ as 
$$
S_t=e^{tM}S_0e^{-tM}
$$
and therefore, 
$$
\begin{align}
A_t=e^{t(A_0-{A_0}^\transpose)}A_0e^{-t(A_0-{A_0}^\transpose)}
\end{align}
A_t
$$
with the derivation as follows
$$
\begin{align*}
A_t&=S_t+\bar S_t\\
&=e^{2t\bar S_0}S_0e^{-2t\bar S_0}+\bar S_0\\
&=e^{2t\bar S_0}(S_0+\bar S_0)e^{-2t\bar S_0}\\
&=e^{t(A_0-{A_0}^\transpose)}A_0e^{-t(A_0-{A_0}^\transpose)}
\end{align*}
$$
Note that the third equality holds since any two functions of the same matrix are commutable. In addition, if we substitute (6) with (7) and (8), and set $t=0$, we will have a constrain on $A_0$: 
$$
\begin{align}
\lambda A_0={\phi_{T;0}}^\transpose(R-\phi_{T;0})\Sigma_{X_0}
\end{align}
$$

Finally, to solve $\phi_{t;0}$, first let $\bar X_t=e^{-t(A_0-{A_0}^\transpose)}X_t$, and substitute (4) with $\bar X_t$, $\bar X_0$ and (10), we have 
$$
\dfrac{d\bar X_t}{dt}={A_0}^\transpose \bar X_t
$$
which can be easily solved. Thus, the solution to (4) is 
$$
\begin{align}
X_t=e^{t(A_0-{A_0}^\transpose)}\bar X_t=e^{t(A_0-{A_0}^\transpose)}e^{t{A_0}^\transpose}X_0
\end{align}
$$
Similarly, the solution to (5) is 
$$
\begin{align*}
Y_t&=e^{t(A_0-{A_0}^\transpose)}e^{-tA_0}Y_0\\
&=e^{t(A_0-{A_0}^\transpose)}e^{(T-t)A_0}e^{-T(A_0-{A_0}^\transpose)}Y_T\\
&=e^{t(A_0-{A_0}^\transpose)}e^{(T-t)A_0}e^{-T(A_0-{A_0}^\transpose)}(Z-X_T)
\end{align*}
$$
Note that $\phi_{t;0}$ is also solved by comparing (7) and (12) 
$$
\phi_{t;0}=e^{t(A_0-{A_0}^\transpose)}e^{t{A_0}^\transpose}
$$
Furthermore, the constrain on $A_0$ can be rewritten as 
$$
\begin{align*}
\lambda A_0&=\left(e^{TA_0}e^{-T(A_0-{A_0}^\transpose)}\right)\left(R-e^{T(A_0-{A_0}^\transpose)}e^{T{A_0}^\transpose}\right)\Sigma_{X_0}\\
&=\left(e^{TA_0}e^{-T(A_0-{A_0}^\transpose)}R-e^{TA_0}e^{T{A_0}^\transpose}\right)\Sigma_{X_0}
\end{align*}
$$

Reference: [How regularization affects the critical points in linear networks](https://papers.nips.cc/paper/6844-how-regularization-affects-the-critical-points-in-linear-networks)



