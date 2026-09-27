+++
title = "Resume"
page_template = "resume.html"

[extra]
type = "resume"
icon_class = "bi bi-person-vcard"
subtitle = "Researcher, Engineer & Instructor in Intelligent Robotics"
order = 15

skills = [
  { category = "Programming Language", icon_class = "bi bi-code-slash", items = ["Python", "C/C++", "Java", "Fortran", "JavaScript", "PHP", "MATLAB"] },
  { category = "Machine Learning Package", icon_class = "bi bi-cpu", items = ["PyTorch", "JAX", "TensorFlow", "Hugging Face", "TensorBoard", "MLflow", "Wandb", "Scikit-learn"] },
  { category = "Software Development Tool", icon_class = "bi bi-tools", items = ["Git", "Docker", "CI/CD tools", "Copilot Agent", "Gemini CLI", "Codex", "Claude Code"] },
  { category = "Microprocessor & Controller", icon_class = "bi bi-motherboard", items = ["Raspberry Pi", "Arduino", "National Instruments myRIO", "Pixhawk", "NVIDIA Jetson TX2"] },
]

[extra.summary]
title = "Professional Summary"
button_text = "View full resume"
description = """
Postdoctoral Researcher at Coordinated Science Laboratory (CSL) specializing in applying system and signal analysis to advance the interpretability and efficiency of artificial intelligence (AI) including large language models (LLMs) and robotics (Embodied AI).
Experience in developing novel algorithms that bridge optimal control, probability theory, and machine learning.
Establish a strong track record of translating theoretical insights into patented technologies and open-source tools, including contributions to the PyTorch and ROS2 ecosystems.
Eager to apply deep mathematical rigor and fast-paced research adaptability to the development of reliable and steerable AI systems.
"""

[extra.summary.badges]
title = "Awards and Honors"
items = [
  { label = "Dr. Sandra J. Finley Scholar", icon_class = "bi bi-award", link = "https://citl.illinois.edu/professional-advancement-teaching-certificates" },
  { label = "Robert E. Miller Award", icon_class = "bi bi-award", link = "https://mechse.illinois.edu/news/54194" },
  { label = "Government Fellowship", icon_class = "bi bi-award", link = "https://mechse.illinois.edu/news/40181" },
  { label = "Gauthier Fellowship Award", icon_class = "bi bi-award" },
]
+++

# Hanson - Dr. Heng-Sheng Chang

## Education

### Ph.D. in Mechanical Science & Engineering

> Period: 2018-08 / 2025-05
> Organization: University of Illinois Urbana-Champaign (UofI)
> Location: Illinois, USA

- 2023 Robert E. Miller Excellence in Teaching Award, Department of Mechanical Science & Engineering, UofI. *(1 recipient per year)*
- 2022 Outstanding Teaching Assistant, Center for Innovation in Teaching & Learning, UofI. *(top-rated 20% of teaching assistants)*
- 2021 Government Fellowship Award, Ministry of Education, Taiwan *(25.8% acceptance rate)*.
- 2018 Gauthier Fellowship Award, Department of Mechanical Science & Engineering, UofI *(1 recipient out of 53 Ph.D. admissions)*.

### B.S. in Mechanical Engineering

> Period: 2013-09 / 2017-06  
> Organization: National Taiwan University (NTU)  
> Location: Taipei, Taiwan

- 2017 Chain-Tsuan Liu Scholarship Award, Department of Mechanical Engineering, NTU *(1 recipient out of nearly 700 undergraduates)*.
- 2017 Presidential Award, NTU *(recipients rank in the top 5% of their class)*.
- 2016 Distinguished Oral Paper Award, ISME International Conference.
- 2016 National Research Funding, Ministry of Science and Technology, Taiwan.

## Research Highlights

### Machine Learning for Robotics and AI

> Period: 2024-05 / Present

- Bridge transformer attention mechanisms with estimation problem via optimal control theory to derive **interpretable architectures** from first principles, providing a mathematical framework for enhancing transparency.
  - ["bi bi-file-earmark-text"] [Journal of Machine Learning Research (accepted)](https://arxiv.org/abs/2505.00818)
- Establish a **duality theory** for non-Markovian linear Gaussian models by reformulating the estimation problem as a dual optimal control problem, effectively reducing computational complexity from cubic to quadratic. 
  - ["bi bi-file-earmark-text"] [IEEE Conference on Decision and Control (2026)](https://arxiv.org/abs/2604.03909)
- Formulate a differentiable filtering-based parameter identification approach for **sequence modeling** that converges 3x faster than the classic Baum-Welch algorithm, recovering parameters in overcomplete regimes where spectral methods fail.
  - ["bi bi-file-earmark-text"] [Proceedings of Machine Learning Research (2026)](https://proceedings.mlr.press/v331/chen26c.html)
- Co-develop a novel **reinforcement learning** algorithm for continuous state systems utilizing the duality of optimal control and Ensemble Kalman filtering to achieve a 100x speedup compared to state-of-the-art policy gradient methods.
  - ["bi bi-file-earmark-text"] [Proceedings of Machine Learning Research (2025)](https://proceedings.mlr.press/v283/joshi25a.html)

### Robotic Modeling, Control & Estimation

> Period: 2019-09 / Present

- Develop a **Diffusion-based Uncertainty-aware Optimization** algorithm to learn control policies online for a multi-arm soft robot, enabling full-direction crawling locomotion and **zero-shot adaptation** to actuator constraints without retraining.
  - ["bi bi-file-earmark-text"] [IEEE International Conference on Robotics & Automation (submitted)](https://arxiv.org/abs/2609.21138)
- Build an open-source, ROS2 and Vicon-based tracking framework utilizing spatiotemporal pose markers to estimate continuous deformations, enabling the first real-time **posture reconstruction** for infinite-dimensional systems.
  - ["bi bi-file-earmark-text"] [IEEE International Conference on Robotics & Automation (2025)](https://ieeexplore.ieee.org/abstract/document/11128142/)
  - ["bi bi-file-earmark-text"] [IEEE International Conference on Robotics & Automation (2022)](https://ieeexplore.ieee.org/abstract/document/9811909/)
- Create the first energy-based dynamic model of an octopus muscular hydrostat arm, providing a **continuum Hamiltonian control system** that enables precise manipulation (reaching, grasping, and locomotion) of complex soft bodies.
  - ["bi bi-file-earmark-text"] [Proceedings of the Royal Society A (2023) --- Issue Cover](https://royalsocietypublishing.org/rspa/article-abstract/479/2270/20220593/56735)
  - ["bi bi-file-earmark-text"] [Advanced Intelligent Systems (2023) --- Editors' Choice](https://advanced.onlinelibrary.wiley.com/doi/abs/10.1002/aisy.202300088)

  

### Online Sound Wave Learning and Detection

> Period: 2023-08 / 2024-05

- Implement an online frequency transform algorithm by integrating a Kalman-based filter. This real-time algorithm enabled continuous monitoring of sound waves, dynamically adapting to changing frequencies and providing efficient online analysis.
- Design an ensemble feedback particle filters to improve the identification of optimal control parameters, which enables online learning, detection, and recognition of intricate frequency patterns associated with musical notes, improving accuracy and adaptability in online sound wave analysis.


<!-- ### Prosthetic Robot Arm Development

> Period: 2015-09 / 2017-07

- Undertook an independent project focused on the classification of surface electromyography (sEMG) signals, achieving 95% accuracy in distinguishing five hand gestures by using Independent Component Analysis (ICA) to process multi-channel sEMG signals.
- Collaborated with fellow students and graduate researchers on the development, manufacturing, and control of a prosthetic robot arm featuring pneumatic artificial muscles. Contributed to control and estimation, including the implementation of PID control and the Extended Kalman filter algorithm. -->

---

## Professional Experience

### Postdoctoral Research Associate

> Period: 2025-07 / Present
> Organization: Mechanical Science & Engineering and CSL, UofI
> Location: Illinois, USA

- Direct interdisciplinary cohorts of 10+ graduate and undergraduate researchers to investigate the foundational principles of sequence modeling, driving theoretical and algorithmic advancements in large language models.
- Partner with cross-functional experts across neuroscience, computer science, and control theory to translate complex theoretical insights into scalable algorithms for natural language processing and advanced robotics.
- Cultivate a high-performance research environment by mentoring students through complex problem-solving, successfully guiding alumni into top-tier graduate programs and the creation of venture-backed tech startups.
- Propel foundational research and early-stage venture growth by pursuing \$500K+ in competitive federal and public grants (SBIR, NSF, AFOSR, Beckman) to transition theoretical first-principles AI models into enterprise software applications.
- Prototype a full-stack, voice-enabled Learning Management System interface that transcribes spoken queries, maps them to executable SQL commands over relational databases, and returns contextual natural language responses.


### Instructor / Dr. Sandra J. Finley Scholar

> Period: 2023-01 / 2026-05  
> Organization: Mechanical Science & Engineering, UofI  
> Location: Illinois, USA

- Architect theory-to-code curricula for **Robotic Software Engineering** and **Signal Processing** for over 60 students, achieving a Top 1% Instructor ranking and an 84% success rate in guiding students to deploy complex algorithmic solutions.
- Embed DevOps methodologies (Git, CI, TDD, and SDLC) into the curriculum to guide students in building full-stack simulations that span digital twins, sensor fusion, feedback control, and path planning with obstacle avoidance.


### Robotics Engineer Intern

> Period: 2023-05 / 2023-08  
> Organization: MVP Robotics  
> Location: Vermont, USA

- Drive the commercialization of a tracking and trajectory reconstruction system by aligning hardware, software, and product teams to execute technology integration and deployment strategies, contributing to over $1M in new revenue.
- Develop an audio-based machine learning classification model utilizing microphone signals to achieve 98% accuracy in complex acoustic environments by leveraging robust feature extraction through audio--visual sequence modeling. 

### Teaching Assistant

> Period: 2017-08 / 2018-07  
> Organization: Mechanical Engineering, NTU 
> Location: Taipei, Taiwan

- Demonstrated the critical role of kinematics, dynamics, and systems in the design and optimization of machinery across fields such as robotics, manufacturing, and automotive engineering.
- Provided students with hands-on guidance and essential resources to complete projects, helping them apply theoretical knowledge, enhance their engineering skills, and understand the practical relevance of these concepts in real-world engineering applications.

### Robotic Engineer Intern

> Period: 2016-09 / 2017-06  
> Organization: Laboratory Medicine, NTU Hospital  
> Location: Taipei, Taiwan

- Built an advanced alarm system within the medical laboratory, incorporating collection tube traffic sensors. The system featured a radar distance sensor designed to verify completion of the collection tube testing process, with alarm notifications providing visual and audio feedback to technicians upon completion of testing.
- Improved the efficiency of the blood sample inspection process by 15% through collaboration with clinical specialists. This approach streamlined the inspection process while ensuring accuracy and precision, contributing to the laboratory's operational effectiveness.

### Research & Development Intern

> Period: 2016-07 / 2016-08  
> Organization: Syntec Technology  
> Location: Hsinchu, Taiwan

- Applied notch filters on a digital signal processor to mitigate resonance issues on loaded machine tools, improving electric motor performance by enabling operation at higher command frequencies without compromising precision.
- Investigated the stepping-motor out-of-step phenomenon through analysis of experiments and simulation results, contributing to the advancement of motor control strategies.


