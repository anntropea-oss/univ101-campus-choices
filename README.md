# Campus Choices: UNIV 101

Play online: https://anntropea-oss.github.io/univ101-campus-choices/

Repository: https://github.com/anntropea-oss/univ101-campus-choices

The game teaches the material as students play. It replaces a preliminary slide presentation: each tile introduces a concept, asks students to use it in a fictional campus scenario, and explains the choices before a practice or discussion activity.

Double-click **UNIV 101 Quiz.html** to play offline in a regular browser. This single file can be moved anywhere. **Launch Quiz.command** is an optional Mac launcher. No installation, account, server, or internet connection is needed. Optional reference links open only when clicked and require internet.

## Facilitate a session

1. Choose 2–6 teams. The default is no timer and no point deductions, so students have room to learn. Both are optional.
2. Teams select a 100–500 point tile on the Jeopardy-style board. Any tile can be played first: it contains its own teaching material.
3. **Learn:** Read the short field guide together. No prior vocabulary knowledge or presentation is assumed.
4. **Decide:** Open the scenario. Teams discuss A, B, or C and explain their reasoning. The host can mark a shared choice on screen; this is optional and does not automatically assign scores. Start the timer only when ready.
5. **Discuss:** Explore the outcome. Read why each choice works or falls short, then use “Try it together” to practice or apply the concept. The host awards points for a sound choice and explanation. Equivalent reasoning is welcome; no question phrasing required.
6. Finish the mission. Its practical takeaway joins **Your class toolkit**, which the class can revisit on the main board.

Plan roughly 2–3 minutes per mission, adjusting for discussion; a selected set can fit a shorter class. For breadth, choose across categories and include both relationship and sexual-health activities. The whole board is optional.

All situations are fictional. Teams may pass or observe. Do not ask students to disclose personal sexual, medical, financial, or relationship experiences. Include students who are not sexually active. These are teaching scenarios, not individual diagnoses or treatment plans.

## What students learn

- **The whole you:** health, wellness, well-being, mental health, capacity, prescription safety, and the conditions that make healthy choices possible.
- **Stress & reset:** eustress, distress, mindfulness, manageable commitments, and seeking support for persistent worry.
- **Rest, fuel & move:** sleep’s functions, wind-down routines, balanced nutrition, activity intensity, and strengthening.
- **Consent & connection:** enthusiastic ongoing consent, withdrawal of consent, boundaries, trust and control, and inclusive sexual well-being.
- **Sexual health choices:** an expandable contraception-method explorer, choosing methods, pregnancy versus STI prevention, fertility awareness and app privacy, emergency contraception, testing, and care pathways.
- **Build your support:** counseling, academic planning, OHP/Mind Spa, nutrition support, financial resources, activity options, and a combined support plan.

## Game controls and saved progress

One correct award is available per mission. Each team can receive one incorrect ruling per mission. Deductions apply only when enabled. A wrong shared choice does not automatically penalize anyone: the host judges team responses and reasoning separately.

Finish retires the tile; Skip retires it without a scoring ruling or toolkit takeaway. Back without playing leaves the tile available. After scoring, finish the mission before leaving it. Undo last mission restores its tile and all previous team scores and removes its toolkit card.

Saved progress includes the active phase, shared choice, scoring rulings, and toolkit. It is local to the browser and file location when local storage is available. Private browsing, moving the file, or clearing browser data can affect persistence. If saving is unavailable, the footer says so. New game replaces the current game only after Start game is pressed. This teaching edition uses a separate save slot from the earlier review-quiz edition.

Use Full screen or the browser’s full-screen controls for projection. On small screens the category board scrolls horizontally. Tab and Enter operate controls. Escape closes an unscored mission; after scoring use Finish mission.

## Content and sources

The primary source is the supplied **AY 26-27 UNIV 101 Updates.pptx**, Health & Well-Being. The original is unchanged and is not needed to play. Student-facing scenarios do not ask what a slide says. A collapsed facilitator reference section cites source slide numbers and selected external clarifications after each outcome.

Sexual-health clarifications were checked against CDC contraception and emergency-contraception information, NHS fertility information, Bedsider, Own the Awk, and current UMBC RIH service pages. Links are embedded in the relevant missions. Exact product durations, eligibility, fees, contact details, and campus policies are not made into universal rules. Method-specific guidance and individual care come from qualified providers. The game includes selected core concepts, not a claim to reproduce every slide.

## Editing and rebuilding

Edit **questions.js**. Each mission has a title, a teaching paragraph, a scenario, three choices with explanations, the zero-based best-choice index, a takeaway, a practice prompt, slide references, and optional links. Keep six categories and five missions per category. Then run `node build-standalone.cjs` to update **UNIV 101 Quiz.html**; Node is needed only for rebuilding. Start a new game after changing the content.

The separate **index.html**, **styles.css**, **questions.js**, and **app.js** source version also works offline when kept together. The game has no external scripts, fonts, trackers, or automatic network requests.

Development checks: install jsdom in a development-only location and run `NODE_PATH=/path/to/node_modules node tests/game.test.cjs`. The public GitHub Pages site was checked in a real browser: setup, the board, and a sexual-health mission’s Learn/Decide/Discuss flow loaded and worked. Local file preview was previously blocked by the in-app browser; the offline build also passed DOM checks.

## Hosting

GitHub Pages serves the main branch from the repository root. Updating index.html, styles.css, questions.js, or app.js and pushing to main updates the public game. Run `node build-standalone.cjs` as well when you want the downloadable offline file to match. No server-side services or paid dependencies are required.
