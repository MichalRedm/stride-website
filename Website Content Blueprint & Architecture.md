# **STRIDE Website Content Blueprint & Architecture**

## **0\. Technical & Visual Architecture**

*This section defines the foundational technologies, repository structure, design system, and animation guidelines for the website.*  
**Tech Stack:**

* **Structure:** HTML5 (Vanilla)  
* **Styling:** Tailwind CSS (Utility-first framework). *Recommendation: Use the Tailwind CLI build process rather than the CDN for production to ensure PurgeCSS removes unused styles, keeping the final file size minimal.*  
* **Interactivity & Animations:** Vanilla JavaScript (minimal, specifically leveraging the Intersection Observer API for scroll animations).

**Repository Structure (Best Practice for Vanilla HTML/CSS):**  
To ensure the repository remains clean and maintainable without a frontend framework, the files should be logically separated by type:  
STRIDE-Website/  
├── index.html              \# The single-page application/landing page  
├── tailwind.config.js      \# Custom theme colors and fonts configuration  
├── package.json            \# For managing Tailwind CLI dependencies  
├── README.md               \# Repository documentation  
├── .gitignore              \# Ignored files (node\_modules, etc.)  
├── src/                    \# Source files for build processes  
│   └── input.css           \# Tailwind base directives (@tailwind base; etc.)  
└── assets/                 \# Compiled assets and static media  
    ├── css/  
    │   └── output.css      \# The compiled, minified Tailwind stylesheet  
    ├── js/  
    │   └── main.js         \# Vanilla JavaScript logic (Intersection Observer)  
    ├── img/                \# Images (logos, diagrams, screenshots)  
    │   ├── stride\_logo.jpg  
    │   └── pipeline.png  
    └── docs/               \# Downloadable files (e.g., ECML paper PDF)

**Design System & Brand Guidelines:**  
Extracted directly from stride\_logo.jpg and pipeline.png to ensure visual cohesion.

* **Typography:** A clean, bold, geometric sans-serif font to match the "STRIDE" text in the logo.  
  * *Primary Font Recommendations:* Montserrat, Poppins, or Inter (available via Google Fonts).  
* **Color Palette:**  
  * **Primary Dark (Text, Headers, Footer):** Dark Slate / Navy Blue. Matches the logo text and magnifying glass handle. (Tailwind equivalent: slate-800 / \#1e293b or custom \#34495e).  
  * **Secondary Accent (Icons, Layer Titles):** Deep Teal / Cyan. Matches the magnifying glass rim and the "Data/Model/Explanation layer" text in the pipeline image. (Tailwind equivalent: teal-600 / \#0d9488 or custom \#45b39d).  
  * **Highlight/Action (Buttons, Warnings):** Vibrant Orange / Amber. Matches the drifting data points inside the magnifying glass. (Tailwind equivalent: orange-500 / \#f97316 or custom \#f39c12).  
  * **Background:** Off-white or very light gray (slate-50) to maintain a clean, academic appearance while reducing eye strain compared to pure white.

### **🤖 DIRECTIVE FOR THE IMPLEMENTING AI AGENT: Animation, Interaction & Visual Style**

**Context:** The goal is to build a top-tier, "flashy," yet highly professional academic landing page. We must strictly avoid heavy libraries like GSAP or React-Spring. All animations must be built using **Vanilla JavaScript (Intersection Observer)** combined with **Tailwind CSS transition and transform utilities**.  
To satisfy the requirement of algorithmic predictability, follow this step-by-step procedure when generating the frontend code:  
**Step 1: The Vanilla JS Intersection Observer Setup (main.js)**  
You must implement a scalable Intersection Observer script that detects when elements enter the viewport and applies an active class. Do not write inline JavaScript in the HTML.  
document.addEventListener("DOMContentLoaded", () \=\> {  
    const observerOptions \= {  
        root: null,  
        rootMargin: '0px',  
        threshold: 0.15 // Triggers when 15% of the element is visible  
    };

    const observer \= new IntersectionObserver((entries, observer) \=\> {  
        entries.forEach(entry \=\> {  
            if (entry.isIntersecting) {  
                // Add the class that triggers the Tailwind transition  
                entry.target.classList.add('is-visible');  
                // Optional: Unobserve if you want the animation to happen only once  
                // observer.unobserve(entry.target);   
            } else {  
                // Remove to allow the animation to replay when scrolling back up  
                entry.target.classList.remove('is-visible');  
            }  
        });  
    }, observerOptions);

    const animatedElements \= document.querySelectorAll('.animate-on-scroll');  
    animatedElements.forEach(el \=\> observer.observe(el));  
});

**Step 2: Base Animation Utility Classes (index.html)**  
For every element that requires animation, apply the base .animate-on-scroll class alongside Tailwind's transition properties. The base state should hide or displace the element.

* *Standard Fade-Up:* opacity-0 translate-y-10 transition-all duration-700 ease-out  
* *Slide-In from Left:* opacity-0 \-translate-x-12 transition-all duration-700 ease-out  
* *Slide-In from Right:* opacity-0 translate-x-12 transition-all duration-700 ease-out

**Step 3: Custom Tailwind Configuration (tailwind.config.js)**  
You must extend the Tailwind theme to include the trigger state. Because we use JavaScript to add the .is-visible class, the easiest way to handle this in standard Tailwind is through a custom variant or just writing the active state in a custom CSS block. Alternatively, use arbitrary variants directly in HTML: \[&.is-visible\]:opacity-100 \[&.is-visible\]:translate-y-0.  
**Step 4: Premium UI Elements (Glassmorphism & Micro-interactions)**

* **Cards (e.g., Layer descriptions):** Apply bg-white/70 backdrop-blur-md shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300.  
* **Buttons:** Apply bg-teal-600 text-white hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg.

**Methodological Note (Devil's Advocate):** \> *Argument:* A reviewer evaluating an ECML PKDD Demo Track submission might view heavy scroll-jacking or bouncy, highly kinetic animations as a smokescreen intended to hide a lack of scientific substance. Academic tools should prioritize dense information over "flashy" marketing.  
*Defense:* This is precisely why the animations must be strictly **semantic**. We do not animate elements merely to make them move. We use staggered fade-ins to deliberately guide the reviewer's cognitive processing sequentially through the architecture (Data Layer $\\rightarrow$ Model Layer $\\rightarrow$ Explanation Layer). The "flashiness" stems not from chaotic motion, but from the 60fps smoothness and the glassmorphic depth of the UI, emphasizing that STRIDE is a modern, highly optimized software engineering product, not just a theoretical script.

## **1\. The Hero Block (First Impression)**

*This section sits above the fold to immediately capture attention.*  
**🤖 AI Animation Directive:** The main headline and text must fade in immediately on page load (do not wait for scroll). The main visual asset (Dashboard Demo) should have a slow, infinite floating animation applied to it via Tailwind (e.g., a custom animate-float keyframe spanning 4 seconds).  
**Visual Asset (Logo):**  
*(Insert stride\_logo.jpg here)*  
**Title:** STRIDE: STReam Insight and Drift Explanation  
**Elevator Pitch:** A comprehensive Python toolkit for concept drift detection and explanation. STRIDE provides a simultaneous, real-time analysis of streaming data across statistical, model performance, and explainability layers to reveal not just *when* drift occurs, but *how* and *where* it affects your models.  
**Call-to-Action Links:**

* [GitHub](https://github.com/KubaCzech/DriftDetectionWithExplainableAI) Repository  
* **\[PLACEHOLDER: Link to PDF of the final ECML paper\]**  
* **\[PLACEHOLDER: Link to Live Streamlit Dashboard (if hosted, e.g., on Streamlit Community Cloud)\]**

**Visual Asset (Demo):**

* **\[PLACEHOLDER: High-resolution looping GIF or MP4 showing the interactive Streamlit dashboard. Ideally, show the moment the decision boundary rotates in the Hyperplane case study, or a SHAP feature importance chart updating in real-time.\]**

## **2\. The ECML Compliance Block**

*This section explicitly answers the Demo Track evaluation criteria using bullet points for high readability.*  
**🤖 AI Animation Directive:** The three main sub-sections (Why STRIDE?, Target Audience, Comparative Advantage) must be structured as a 3-column grid on desktop. They must trigger a staggered fade-in-up animation as the user scrolls them into view (using delay-100, delay-200, delay-300 utility classes).  
**Why STRIDE? (Novelty & State-of-the-Art)**

* **Synchronous Multi-Layer Processing:** Unlike traditional tools that trigger explanations *only* after a drift is detected, STRIDE concurrently processes data batches across three layers (Data, Model, Explanation). This allows users to observe the gradual evolution of model behavior before a formal alert is issued.  
* **Beyond Detection:** Standard detectors (like DDM) fail to indicate which specific regions of the feature space transformed. STRIDE bridges this gap using localized decision boundary analysis and prototype-based explanations.

**Target Audience:**

* Designed to assist both scientific researchers evaluating new drift dynamics and data analysts/MLOps engineers monitoring production ML systems.  
* By bringing these three analytical levels together in one dashboard, users are empowered to do more than just detect drift—they can pinpoint *exactly* where it is happening in the feature space and fully understand its impact.

**Comparative Advantage:**

* **\[PLACEHOLDER:** Add a brief 2-3 sentence comparison to existing software. For example: "While libraries like River \[2\] excel at streaming metrics and DDM-based detection, STRIDE wraps these detectors in an integrated explanation environment, automatically correlating DDM triggers with Wasserstein distance shifts and SHAP value inversions without writing custom synchronization logic."\]

## **3\. The Video Demonstration**

*Crucial for the ECML Demo Track submission.*  
**🤖 AI Animation Directive:** Apply a deep glassmorphism wrapper around the video iframe. When the user hovers over the video container, apply hover:scale-\[1.02\] hover:shadow-2xl transition-all duration-500 to emphasize interactivity. The list of timestamps should slide in from the left (-translate-x-10) when scrolled into view.  
**Video Player:**

* **\[PLACEHOLDER: YouTube/Vimeo iframe embed of the max 5-minute promo video.\]**

**Video Timestamps / Table of Contents:**

* **0:00 \- Introduction & The "Where" of Concept Drift:** Why traditional detection methods are insufficient without spatial explanations.  
* **0:45 \- Dashboard Configuration:** Setting block sizes, selecting the Hyperplane dataset, and initializing the base neural network model.  
* **1:30 \- Drift Detection (Model Layer):** Utilizing DDM to identify error rate spikes (e.g., 10000th sample) and using prototype clustering to isolate the concept change between windows 9 and 10\.  
* **2:15 \- Data Layer Diagnostics:** Inspecting class distribution shifts, analyzing Violin plots for feature distribution, and mapping X-means clusters pre- and post-drift using the Hungarian algorithm.  
* **3:00 \- Explanation Layer (Decision Boundaries):** Visualizing the Supervised Decision Boundary Maps to observe the physical rotation of the boundary and point overlap.  
* **3:45 \- Explanation Layer (Feature Importance):** Comparing two critical metrics: the importance of features for model prediction vs. their importance as indicators of the underlying drift distribution.  
* **4:30 \- Conclusion:** Summary of the multi-level analysis and an invitation to explore the open-source toolkit.

## **4\. System Architecture & Methodology**

*The technical core of the system, breaking down the three layers.*  
**🤖 AI Animation Directive:** This section must utilize opposite-directional sliding to create a "closing in" effect. The pipeline.png image must slide in from the left (-translate-x-16), while the textual descriptions of the three layers slide in from the right (translate-x-16). As the user scrolls down, they meet in the center.  
**Visual Asset (Architecture):**  
*(Insert pipeline.png here)*  
**The Three-Layer Architecture:**  
STRIDE orchestrates a diverse set of analytical methods across three functional layers:

1. **The Data Layer (Statistical Analysis & Clustering):** Monitors the input distribution independent of the model. Employs descriptive statistics, unsupervised tests (Kolmogorov-Smirnov, Anderson-Darling), probability divergences (Wasserstein distance), and visualizations like Violin plots. It also utilizes X-means clustering, employing the Hungarian algorithm to map corresponding clusters between pre- and post-drift data blocks.  
2. **The Model Layer (Performance Triggers):** Tracks predictive performance using standard drift detectors, including the Drift Detection Method (DDM) and its extensions (available via the River library backend).  
3. **The Explanation Layer (xAI):** Bridges detection and understanding. It performs localized decision boundary analysis via Supervised Decision Boundary Maps, utilizes HDBSCAN for prototype-based recurring concept analysis, and executes a dual feature importance analysis (tracking both a feature's predictive value and its value as an indicator of the drift itself).

**Built-In Synthetic Generators:**  
To facilitate research, STRIDE includes native generators for complex drift scenarios:

* **SEA Drift:** Abrupt concept drift via changing decision thresholds.  
* **Hyperplane Drift:** Gradual drift via a rotating decision hyperplane in $d$-dimensional space.  
* **RBF Drift:** Non-linear drift via shifting centroids of class-specific clusters.  
* **Linear Weight Inversion (LWI):** Inverts the correlation of specific features with the target class to test feature attribution monitoring.

## **5\. Technical Quickstart**

*Proves the software is accessible and easily implementable.*  
**🤖 AI Animation Directive:** Code blocks must be styled elegantly (e.g., dark slate background with syntax highlighting colors). Add a small, interactive "copy" icon in the top right of each code block that triggers a quick checkmark animation and a color pulse when clicked, utilizing vanilla JS.  
**Installation:**  
git clone \[https://github.com/KubaCzech/DriftDetectionWithExplainableAI.git\](https://github.com/KubaCzech/DriftDetectionWithExplainableAI.git)  
cd DriftDetectionWithExplainableAI  
pip install \-r requirements.txt

**Running the Interactive Dashboard:**  
streamlit run dashboard/app.py

**Python API Quickstart:**  
\# \[PLACEHOLDER: Write the shortest possible Python script (5-10 lines) that   
\# imports STRIDE, initializes a synthetic generator (e.g., SEA),   
\# runs a basic detector, and prints an explanation metric.\]

## **6\. Academic Metadata & Team**

*For citation and networking.*  
**Authors & Affiliations:**

* Deniz Aksoy, Kuba Czech, Wojciech Nagórka, Michał Redmer, Jerzy Stefanowski  
* *Poznań University of Technology, Institute of Computing Sciences*

**Citation (BibTeX):**  
% \[PLACEHOLDER: Provide the full BibTeX entry here. Currently, you only have the   
% abstract/draft. Update this once the ECML PKDD 2026 proceedings are finalized.\]  
@inproceedings{stride2026,  
  title={STReam Insight and Drift Explanation (STRIDE): a Python Toolkit for Concept Drift Detection and Explanation},  
  author={Aksoy, Deniz and Czech, Kuba and Nag{\\'o}rka, Wojciech and Redmer, Micha{\\l} and Stefanowski, Jerzy},  
  booktitle={ECML PKDD \[PLACEHOLDER\]},  
  year={2026}  
}

