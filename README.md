# br23aay.github.io

Personal portfolio site — [live at br23aay.github.io](https://br23aay.github.io).

## What's here

A single-page portfolio (`index.html`) covering about / research / projects / skills / contact, plus a set of standalone live results pages generated from real project runs rather than mockups:

| Page | Shows |
|---|---|
| [`results-dashboard.html`](https://br23aay.github.io/results-dashboard.html) | Combined results hub — Shadow Hand PPO, LLM Evaluation, and SLM Document Intelligence in one place |
| [`reward_hacking_visualiser.html`](https://br23aay.github.io/reward_hacking_visualiser.html) | Interactive visualisation of the reward-hacking behaviour discovered in the Shadow Hand PPO research |
| [`llm_eval_report.html`](https://br23aay.github.io/llm_eval_report.html) | Live report from `llm-evaluation-workflows` — hallucination/safety/alignment scores across 100+ outputs |
| [`slm-results-dashboard.html`](https://br23aay.github.io/slm-results-dashboard.html) | Live evaluation results from `slm-document-intelligence` (groundedness, hallucination rate, safety) |
| [`vision-results-dashboard.html`](https://br23aay.github.io/vision-results-dashboard.html) | Live training/validation results from `vision-defect-inspection-api` |

## Why static HTML, no framework

This is a single-author, content-driven site with no dynamic data fetching, no build step, and no state beyond a few UI animations. A React/Next.js build would add a toolchain and deployment step for no functional benefit here — plain HTML/CSS/JS deploys directly to GitHub Pages on every push, which is exactly the right amount of engineering for what this site needs to do.

## Deployment

Every push to `main` triggers a GitHub Pages deployment automatically — see the [Deployments](https://github.com/br23aay/br23aay.github.io/deployments) tab for the history (25+ real deployments at time of writing, reflecting iterative content updates rather than a single bulk upload).

## Structure

```
br23aay.github.io/
├── index.html                       # main portfolio site
├── results-dashboard.html            # combined live results hub
├── reward_hacking_visualiser.html    # Shadow Hand reward-hacking demo
├── llm_eval_report.html              # LLM evaluation live report
├── slm-results-dashboard.html        # SLM document intelligence results
├── vision-results-dashboard.html     # Vision defect inspection results
├── Photo.jpg
└── Bharadwaj_Rachuri_CV.pdf
```

## Author

**Bharadwaj Rachuri**
[GitHub](https://github.com/br23aay)
